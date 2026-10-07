import { FileInfoSchema } from '../file-info';
import { registerCollection } from '../../default-schema';
import { ControlType, DataType } from '../../types';
import { FromSchema } from 'json-schema-to-ts';

/**
 * Signable document — generic e-signature primitive.
 *
 * One signed_document record represents an envelope with one or more files
 * (PDFs) and one or more signature spots, sent to one or more participants.
 *
 * Reusable: offer letters, contracts, NDAs, ACH mandates, vendor agreements,
 * loan documents, lease agreements, policy attestations, etc. Use the
 * `context` field to link the envelope back to its parent record (employee,
 * customer, vendor, loan, lease, etc.).
 */
export const SignedDocumentSchema = () => {
  return {
    title: 'Signable Document',
    description: 'A document envelope sent to one or more participants for signature.',
    type: 'object',
    properties: {
      name: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        unique: true,
        transform: 'uri',
        group: 'name',
      },
      title: {
        type: 'string',
        inputRequired: true,
        group: 'name',
      },
      description: {
        type: 'string',
        'x-control-variant': 'textarea',
      },
      // Tokenized envelope-level link (operator-shareable).
      // Per-participant tokens live on participant.accessToken below.
      accessToken: {
        type: 'string',
        description: 'Random token used in /portal/sign/:token public URL when sending to one viewer.',
        group: 'access',
      },
      // Lifecycle
      status: {
        type: 'string',
        enum: ['draft', 'sent', 'in_progress', 'completed', 'declined', 'cancelled', 'expired', 'voided'],
        default: 'draft',
        group: 'status',
      },
      sentAt: { type: 'string', format: 'date-time', group: 'status' },
      completedAt: { type: 'string', format: 'date-time', group: 'status' },
      expiresAt: { type: 'string', format: 'date-time', group: 'status' },
      lastReminderAt: { type: 'string', format: 'date-time', group: 'status' },
      reminderCount: { type: 'number', default: 0, group: 'status' },
      reminderDays: { type: 'number', description: 'Days between automatic reminders (0 = none).', group: 'status' },
      allSignedAt: { type: 'string', format: 'date-time', readOnly: true, group: 'status' },
      closedAt: { type: 'string', format: 'date-time', readOnly: true, group: 'status' },
      closeReason: { type: 'string', readOnly: true, description: 'Why it was cancelled, voided or declined.', group: 'status' },
      // Forms e-signing: the form this envelope was sent from.
      source: { type: 'string', enum: ['form', 'api'], readOnly: true },
      formId: { type: 'string', readOnly: true, description: 'sk of the crm_form it was sent from.' },
      formName: { type: 'string', readOnly: true },
      formTitle: { type: 'string', readOnly: true },
      ownerEmail: { type: 'string', format: 'email', description: 'Who is told about declines, failures and completion.' },
      consentText: { type: 'string', 'x-control-variant': 'textarea', description: 'The e-sign consent the signer agrees to.' },
      roles: {
        type: 'array',
        readOnly: true,
        items: { type: 'object', properties: { id: { type: 'string' }, label: { type: 'string' }, order: { type: 'number' } } },
      },
      submissions: {
        type: 'array',
        readOnly: true,
        description: 'The form submission each signer sent with their signature.',
        items: { type: 'object', properties: { participantId: { type: 'string' }, id: { type: 'string' }, datatype: { type: 'string' } } },
      },
      signedSha256: { type: 'string', readOnly: true, description: 'SHA-256 of the signed pages, before the certificate of completion was added.' },
      certificate: {
        type: 'object',
        readOnly: true,
        properties: { pages: { type: 'number' }, signedPages: { type: 'number' } },
      },
      merge: {
        type: 'object',
        readOnly: true,
        description: 'Building the signed PDF. A failure leaves the envelope open and is retried by the upkeep job.',
        properties: {
          status: { type: 'string', enum: ['done', 'failed'] },
          attempts: { type: 'number' },
          lastError: { type: 'string' },
          lastAttemptAt: { type: 'string', format: 'date-time' },
          warnedAt: { type: 'string', format: 'date-time' },
          completedAt: { type: 'string', format: 'date-time' },
        },
      },
      // Where the envelope came from (link back to parent record)
      context: {
        type: 'object',
        collapsible: true,
        properties: {
          datatype: { type: 'string' },
          id: { type: 'string' },
          label: { type: 'string' },
        },
      },
      // Source files (one or more PDFs). The signed merged copy is written
      // back to `signedFile` after completion.
      files: {
        type: 'array',
        collapsible: true,
        allowDelete: true,
        'x-control': ControlType.file,
        items: {
          type: 'object',
          properties: {
            ...FileInfoSchema().properties,
            remark: { type: 'string', 'x-control-variant': 'textarea' },
            sha256: { type: 'string', description: 'Fingerprint of the copy that was sent (stored privately at send).' },
            pages: {
              type: 'array',
              description: 'Page sizes in PDF points as shown (after rotation).',
              items: { type: 'object', properties: { width: { type: 'number' }, height: { type: 'number' } } },
            },
          },
        },
      },
      signedFile: {
        ...FileInfoSchema(),
        description:
          'The signed PDF with its certificate of completion, written once everyone has signed. Stored privately: served only to staff or through a participant\'s own token.',
      },
      // Where signatures must be placed
      signatureFields: {
        type: 'array',
        collapsible: true,
        showIndex: true,
        description: 'List of places in the document where signatures are required',
        items: {
          type: 'object',
          collapsible: true,
          properties: {
            signatureId: { type: 'string', group: 'status' },
            // Which file in `files[]` this spot is on (defaults to 0 if single-file)
            fileIndex: { type: 'number', default: 0, group: 'status' },
            status: {
              type: 'string',
              enum: ['pending', 'completed', 'declined'],
              default: 'pending',
              group: 'status',
            },
            // PDF points (1/72 in) from the BOTTOM-LEFT of the page as shown, the spot's
            // bottom-left corner — the same at any zoom.
            page: { type: 'number', group: 'sign-spot', description: '1-based page number.' },
            x: { type: 'number', group: 'sign-spot' },
            y: { type: 'number', group: 'sign-spot' },
            width: { type: 'number', group: 'sign-spot' },
            height: { type: 'number', group: 'sign-spot' },
            type: {
              type: 'string',
              // `full` and `initial` are the older names of `signature` and `initials`.
              enum: ['signature', 'initials', 'date', 'name', 'text', 'full', 'initial'],
              default: 'signature',
              group: 'type',
            },
            role: { type: 'string', group: 'type', description: 'The signer role that fills it.' },
            field: { type: 'string', group: 'type', description: 'A form field this spot shows.' },
            required: { type: 'boolean', default: true, group: 'type' },
            label: { type: 'string', group: 'type' },
            assignedTo: {
              type: 'string',
              description: 'participantId of who must sign here',
              group: 'type',
            },
            value: {
              type: 'object',
              readOnly: true,
              description: 'What was put here: an image (private file), a typed signature, or text.',
              properties: {
                kind: { type: 'string', enum: ['image', 'script', 'text'] },
                method: { type: 'string', enum: ['drawn', 'typed'] },
                text: { type: 'string' },
                file: { type: 'object', properties: { path: { type: 'string' }, mimeType: { type: 'string' }, sha256: { type: 'string' } } },
              },
            },
            instructions: {
              type: 'string',
              'x-control-variant': 'textarea',
              rows: 2,
            },
            // Captured at sign-time
            signatureImageUrl: { type: 'string' },
            signedAt: { type: 'string', format: 'date-time' },
            signedByEmail: { type: 'string' },
            signedByIp: { type: 'string' },
            signedByUserAgent: { type: 'string' },
            signatureHash: {
              type: 'string',
              description: 'SHA-256 of (signatureImage + email + timestamp) for tamper-evident audit.',
            },
          },
          required: ['signatureId', 'page', 'x', 'y', 'type', 'assignedTo', 'status'],
        },
      },
      // Recipients
      participants: {
        type: 'array',
        collapsible: true,
        showIndex: true,
        'x-control': ControlType.table,
        operations: ['pick', 'add', 'remove'],
        items: {
          type: 'object',
          showIndex: true,
          properties: {
            participantId: {
              type: 'string',
              description: 'Stable id (uuid). signatureField.assignedTo references this.',
            },
            name: { type: 'string' },
            email: { type: 'string', format: 'email' },
            phone: { type: 'string' },
            role: {
              type: 'string',
              description: 'The signing role (from the form), or `cc` for someone who only gets the signed copy.',
            },
            roleLabel: { type: 'string' },
            // Per-participant tokenized link
            accessToken: { type: 'string', hidden: true },
            order: {
              type: 'number',
              default: 0,
              description: 'For sequential signing — lower numbers sign first.',
            },
            status: {
              type: 'string',
              enum: ['pending', 'sent', 'viewed', 'signed', 'declined', 'cc'],
              default: 'pending',
            },
            sentAt: { type: 'string', format: 'date-time' },
            viewedAt: { type: 'string', format: 'date-time' },
            signedAt: { type: 'string', format: 'date-time' },
            declinedAt: { type: 'string', format: 'date-time' },
            declineReason: { type: 'string' },
            submissionId: { type: 'string', description: 'The form submission sent with this signature.' },
            signature: {
              type: 'object',
              readOnly: true,
              description: 'The signature adopted: drawn (private file) or typed, with consent, IP and user agent.',
              properties: {
                method: { type: 'string', enum: ['drawn', 'typed'] },
                typedName: { type: 'string' },
                file: { type: 'object', properties: { path: { type: 'string' }, mimeType: { type: 'string' }, sha256: { type: 'string' } } },
                consent: { type: 'boolean' },
                ip: { type: 'string' },
                userAgent: { type: 'string' },
                signedAt: { type: 'string', format: 'date-time' },
              },
            },
            expiry: { type: 'string', format: 'date-time' },
          },
          required: ['participantId', 'email', 'role'],
        },
      },
      // Audit trail — every meaningful event lands here for compliance
      auditEvents: {
        type: 'array',
        readOnly: true,
        collapsible: true,
        items: {
          type: 'object',
          properties: {
            event: {
              type: 'string',
              enum: ['created', 'sent', 'viewed', 'consented', 'signed', 'declined', 'completed', 'reminded', 'cancelled', 'voided', 'expired', 'merge_failed', 'downloaded'],
            },
            participantId: { type: 'string' },
            email: { type: 'string' },
            timestamp: { type: 'string', format: 'date-time' },
            ip: { type: 'string' },
            userAgent: { type: 'string' },
            details: { type: 'object' },
          },
        },
      },
      // Notification overrides (optional)
      emailTemplate: {
        type: 'string',
        'x-control': ControlType.richtext,
        collapsible: true,
        description: 'Override email body. Variables: {{title}}, {{signUrl}}, {{participantName}}',
      },
      smsTemplate: {
        type: 'string',
        'x-control-variant': 'textarea',
        max: 160,
        collapsible: true,
      },
      // Sequential vs parallel signing
      signingOrder: {
        type: 'string',
        enum: ['parallel', 'sequential'],
        default: 'parallel',
      },
    },
    required: ['title', 'participants', 'signatureFields'],
  } as const;
};

const dd = SignedDocumentSchema();
export type SignedDocumentModel = FromSchema<typeof dd>;

registerCollection('Signed Document', DataType.signed_document, SignedDocumentSchema());

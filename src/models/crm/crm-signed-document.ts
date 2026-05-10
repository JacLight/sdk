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
        enum: ['draft', 'sent', 'in_progress', 'completed', 'cancelled', 'expired', 'voided'],
        default: 'draft',
        group: 'status',
      },
      sentAt: { type: 'string', format: 'date-time', group: 'status' },
      completedAt: { type: 'string', format: 'date-time', group: 'status' },
      expiresAt: { type: 'string', format: 'date-time', group: 'status' },
      lastReminderAt: { type: 'string', format: 'date-time', group: 'status' },
      reminderCount: { type: 'number', default: 0, group: 'status' },
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
          },
        },
      },
      signedFile: {
        ...FileInfoSchema(),
        description: 'The merged signed PDF (written by service after all participants sign).',
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
            page: { type: 'number', group: 'sign-spot' },
            x: { type: 'number', group: 'sign-spot' },
            y: { type: 'number', group: 'sign-spot' },
            width: { type: 'number', group: 'sign-spot' },
            height: { type: 'number', group: 'sign-spot' },
            type: {
              type: 'string',
              enum: ['initial', 'full', 'date', 'text'],
              default: 'full',
              group: 'type',
            },
            assignedTo: {
              type: 'string',
              description: 'participantId of who must sign here',
              group: 'type',
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
              description: 'signer, witness, cc, approver',
            },
            // Per-participant tokenized link
            accessToken: { type: 'string' },
            order: {
              type: 'number',
              default: 0,
              description: 'For sequential signing — lower numbers sign first.',
            },
            status: {
              type: 'string',
              enum: ['pending', 'sent', 'viewed', 'signed', 'declined'],
              default: 'pending',
            },
            sentAt: { type: 'string', format: 'date-time' },
            viewedAt: { type: 'string', format: 'date-time' },
            signedAt: { type: 'string', format: 'date-time' },
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
              enum: ['created', 'sent', 'viewed', 'signed', 'declined', 'completed', 'reminded', 'cancelled', 'expired'],
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

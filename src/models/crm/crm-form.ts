import { registerCollection } from '../../default-schema';
import { ControlType, DataType } from '../../types';
import { FromSchema } from 'json-schema-to-ts';
import { FileInfoSchema } from '../file-info';

export const FormSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        transform: ['lowercase'],
        inputRequired: true,
        unique: true,
        description:
          'Unique name that identifies the form, can only contain letters, numbers, underscores and dashes',
        group: 'name',
      },
      accessCode: {
        type: 'string',
        description: 'The shared code people type when `authenticationType` is `code`.',
        group: 'name',
        rules: [{ operation: 'notEqual', valueA: '{{authenticationType}}', valueB: 'code', action: 'hide' }],
      },
      status: {
        type: 'string',
        enum: [
          'new',
          'sent',
          'open',
          'closed',
          'cancelled',
          'expired',
          'failed',
        ],
        group: 'name',
      },
      startDate: {
        type: 'string',
        format: 'date-time',
        group: 'date',
      },
      endDate: {
        type: 'string',
        format: 'date-time',
        group: 'date',
      },
      title: {
        type: 'string',
      },
      submitMessage: {
        type: 'string',
        'x-control': ControlType.richtext,
        description: 'Shown in place of the form once it has been submitted.',
      },
      collection: {
        type: 'string',
        description:
          'Bind this form to a collection: its schema becomes the form, and answers are saved as records of that ' +
          'collection instead of `form_submission` rows. Leave empty to ask the fields held in `schema`.',
        'x-control': ControlType.selectMany,
        maxItems: 1,
        group: 'source',
        dataSource: {
          source: 'collection',
          collection: DataType.collection,
          label: 'name',
          value: 'name',
        },
      },
      schema: {
        type: 'object',
        hidden: true,
        description:
          'Inline JSON-schema describing the form fields, used when no `collection` is bound. Submissions land in ' +
          '`form_submission` keyed off this form. Edited with the schema builder, not by hand.',
      },
      invitationTemplate: {
        type: 'string',
        description: 'Message template used to invite participants. Empty uses the built-in `form-invitation`.',
        'x-control': ControlType.selectMany,
        maxItems: 1,
        group: 'notification',
        dataSource: {
          source: 'collection',
          collection: DataType.messagetemplate,
          label: 'name',
          value: 'name',
        },
      },
      authenticationType: {
        type: 'string',
        enum: ['none', 'magic-link', 'code', 'password', 'email'],
        // Asking for an address is the floor: a submission nobody can be
        // written back to is worth much less, and `none` made that the default.
        default: 'email',
        description:
          'Who must do what before the form opens — the one access setting, enforced by the server on both reading and submitting. `none` asks nothing; ' +
          '`magic-link` emails a link (or one-time code) to prove the address; `code` asks for the access code — the shared ' +
          '`accessCode`, or a participant\'s own code, which their invitation link carries; `password` signs in; ' +
          '`email` only asks for an address and does not verify it.',
        group: 'access',
      },
      workflow: {
        type: 'string',
        description: 'Send every submission to this workflow. Leave empty and submissions are simply recorded.',
        'x-control': ControlType.selectMany,
        maxItems: 1,
        group: 'access',
        dataSource: {
          source: 'collection',
          collection: DataType.workflow_definition,
          label: 'name',
          value: 'name',
        },
      },
      email: {
        type: 'string',
        format: 'email',
        description: 'Where a submission notification is sent when the submitter did not supply an address.',
        group: 'notification',
      },
      participants: {
        type: 'array',
        collapsible: true,
        description: 'The people this form is sent to. Each opens it with their own access code.',
        items: {
          type: 'object',
          layout: 'horizontal',
          properties: {
            email: {
              type: 'string',
              format: 'email',
            },
            name: {
              type: 'string',
            },
            accessCode: {
              type: 'string',
              styleClass: 'w-20',
            },
            role: {
              type: 'string',
              styleClass: 'w-20',
            },
            invitedAt: { type: 'string', format: 'date-time', readOnly: true, description: 'When the last invitation went out.' },
            inviteCount: { type: 'number', readOnly: true, description: 'How many invitations have been sent.' },
            submittedAt: { type: 'string', format: 'date-time', readOnly: true, description: 'When they last submitted.' },
          },
        },
      },
      signing: {
        type: 'object',
        hidden: true,
        description:
          'A document the participants sign through this form. Inviting the participants opens a `signed_document` ' +
          'envelope per send: each participant whose `role` matches a signing role gets their own link ' +
          '(`/form?form=<name>&sign=<token>`), fills their part of the form and signs their spots. Edited on the ' +
          "form's Document tab, not by hand.",
        properties: {
          enabled: { type: 'boolean', default: true },
          documents: {
            type: 'array',
            description: 'The PDFs to sign. A spot names one by `fileIndex`.',
            items: {
              type: 'object',
              properties: {
                file: FileInfoSchema(),
                pages: {
                  type: 'array',
                  description: 'Page sizes in PDF points as shown (after rotation).',
                  items: { type: 'object', properties: { width: { type: 'number' }, height: { type: 'number' } } },
                },
              },
            },
          },
          roles: {
            type: 'array',
            description: 'Who signs, in signing order. A participant signs as the role named in their `role`.',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                label: { type: 'string' },
                order: { type: 'number' },
              },
            },
          },
          spots: {
            type: 'array',
            description:
              'Where each role signs. Positions are PDF points from the bottom-left of the page as shown, so placement ' +
              'is exact at any zoom. `field` links a spot to a form field (a signature field, or any answer for a text spot).',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                fileIndex: { type: 'number', default: 0 },
                page: { type: 'number', description: '1-based page number.' },
                x: { type: 'number' },
                y: { type: 'number' },
                width: { type: 'number' },
                height: { type: 'number' },
                type: { type: 'string', enum: ['signature', 'initials', 'date', 'name', 'text'] },
                role: { type: 'string' },
                field: { type: 'string' },
                required: { type: 'boolean', default: true },
                label: { type: 'string' },
              },
            },
          },
          signingOrder: { type: 'string', enum: ['sequential', 'parallel'], default: 'parallel' },
          expiresInDays: { type: 'number', default: 30 },
          reminderDays: { type: 'number', description: 'Days between automatic reminders; 0 or empty for none.' },
          consentText: { type: 'string', description: 'What the signer agrees to. Empty uses the standard e-sign consent.' },
        },
      },
      seo: {
        type: 'object',
        collapsible: 'close', // open, close, true
        properties: {
          title: {
            type: 'string',
          },
          description: {
            type: 'string',
          },
          keywords: {
            type: 'string',
          },
          image: FileInfoSchema(),
        },
      },
      templates: {
        type: 'array',
        'x-control': ControlType.selectMany,
        'x-control-variant': 'chip',
        group: 'notification',
        dataSource: {
          source: 'collection',
          collection: DataType.messagetemplate,
          label: 'name',
          value: 'name',
        },
        items: {
          type: 'string',
        },
      },
      emailTemplate: {
        collapsible: true,
        type: 'string',
        'x-control': ControlType.richtext,
        description:
          'You can add template variables like {{data.$collection.$name}}, replace $collection with the collection name and $name with the field name',
      },
      smsTemplate: {
        collapsible: true,
        type: 'string',
        'x-control-variant': 'textarea',
        max: 160,
        description:
          'You can add template variables like {{data.$collection.$name}}, replace $collection with the collection name and $name with the field name',
      },
    },
  } as const;
};

const dd = FormSchema();
export type FormModel = FromSchema<typeof dd>;

registerCollection('CRM Form', DataType.crm_form, FormSchema());


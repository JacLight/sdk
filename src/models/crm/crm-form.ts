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
        group: 'name',
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
      accessMode: {
        type: 'string',
        enum: ['open', 'code', 'participants'],
        default: 'open',
        description:
          'Who may open the form. `open`: anyone who can reach it. `code`: anyone holding the form\'s `accessCode`. ' +
          '`participants`: only the people listed in `participants`, each opening it with their own code. The server ' +
          'enforces this on both reading the form and submitting it.',
        group: 'access',
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
          'How the person filling the form proves who they are before it opens. `none` asks nothing; `magic-link` emails ' +
          'a link to click; `code` emails a one-time code to type; `password` signs in with username and password; ' +
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


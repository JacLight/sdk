import { registerCollection } from '../../default-schema';
import { DataType } from '../../types';
import { FromSchema } from 'json-schema-to-ts';

/**
 * Generic landing collection for `crm_form` submissions when the form
 * has no typed `collection` binding (i.e., schema is inline on the form).
 *
 * Field names in `values` mirror the form's schema — no renaming, no
 * extraction. To inspect a submission, read the parent `crm_form` (via
 * the BaseModel `owner` link) and use its schema to render `values`.
 *
 * Audit (author / createdate / modifydate) and client info (ip, userAgent,
 * host) are handled at BaseModel level — not duplicated here.
 */
export const FormSubmissionSchema = () => {
  return {
    title: 'Form Submission',
    type: 'object',
    properties: {
      formId: {
        type: 'string',
        description: 'sk of the parent crm_form — used to fetch its schema for rendering values.',
      },
      values: {
        type: 'object',
        description: 'Submitted field values. Keys match the form\'s schema.',
      },
      status: {
        type: 'string',
        enum: ['new', 'incomplete', 'completed', 'approved', 'rejected', 'archived'],
        default: 'new',
      },
      reviewerNotes: { type: 'string', 'x-control-variant': 'textarea' },
    },
    required: ['formId', 'values'],
  } as const;
};

const dd = FormSubmissionSchema();
export type FormSubmissionModel = FromSchema<typeof dd>;

registerCollection('Form Submission', DataType.form_submission, FormSubmissionSchema());

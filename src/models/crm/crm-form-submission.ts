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
 * A row is created BEFORE the answers exist when the form authenticates its
 * filler: asking for a link opens a `pending` submission carrying the address
 * and the token that was emailed, and coming back with that token turns the
 * same row into an authenticated one and then a submitted one. One row for the
 * whole episode, so what was proved and what was answered can never drift
 * apart — and a submission can be disowned later by the authentication that
 * stands on it.
 *
 * Audit (author / createdate / modifydate), client info (ip, userAgent, host),
 * reviewer commentary (`notes`), access (`requiredRole`), workflow position
 * (`state` / `workflow`) and the link back to the form (`owner`) are all on the
 * BaseModel root — none of them is duplicated here.
 */
export const FormSubmissionSchema = () => {
  return {
    title: 'Form Submission',
    type: 'object',
    properties: {
      formId: {
        type: 'string',
        description:
          'sk of the parent crm_form — used to fetch its schema for rendering values.',
      },
      source: {
        type: 'object',
        readOnly: true,
        description:
          'What asked for this submission, when something did (a journey pulse survey: datatype bm_journey, id, key = the task key, checkpoint, respondent). Written by the server.',
        properties: {
          datatype: { type: 'string' },
          id: { type: 'string' },
          key: { type: 'string' },
          taskId: { type: 'string' },
          checkpoint: { type: 'string' },
          respondent: { type: 'string' },
        },
      },
      values: {
        type: 'object',
        description:
          "Submitted field values. Keys match the form's schema. Empty while the row is still `pending`.",
      },
      status: {
        type: 'string',
        enum: [
          'pending',
          'new',
          'incomplete',
          'completed',
          'approved',
          'rejected',
          'archived',
        ],
        default: 'new',
        description:
          '`pending` is a session opened by asking for a link, with no answers yet; it becomes `new` when the form is sent in. The rest are the reviewer\'s.',
      },
      authentication: {
        type: 'object',
        description:
          'How the person filling this form proved who they are. Written by the server on every step and never accepted from the client.',
        properties: {
          method: {
            type: 'string',
            enum: ['none', 'email', 'code', 'magic-link', 'password'],
            default: 'none',
            description:
              "The form's `authenticationType` at the time. `email` is taken on trust; `code` and `magic-link` are proved by a token only that address could receive; `password` by a signed-in account.",
          },
          status: {
            type: 'string',
            enum: ['pending', 'authenticated', 'used', 'expired', 'failed'],
            default: 'pending',
            description:
              '`pending`: the token is out but unused. `authenticated`: it came back and opened this row. `used`: the answers have been sent in under it. `expired`/`failed`: it will not open anything again.',
          },
          email: {
            type: 'string',
            format: 'email',
            description:
              'The address the token was sent to. The submitter is read from HERE, never from the request, which is what makes it unspoofable.',
          },
          verified: {
            type: 'boolean',
            default: false,
            description:
              'Whether the address was proved (a token only its owner could receive, or a signed-in account) rather than merely typed in.',
          },
          token: {
            type: 'string',
            hidden: true,
            description:
              'Server-minted, emailed to `email`, and the only thing that reopens this row. Hidden: it is a credential, not a field to show.',
          },
          requestedAt: {
            type: 'string',
            format: 'date-time',
            description: 'When the link or code was asked for and this row opened.',
          },
          authenticatedAt: {
            type: 'string',
            format: 'date-time',
            description: 'When the token came back and opened the form.',
          },
          submittedAt: {
            type: 'string',
            format: 'date-time',
            description: 'When the answers were sent in under this authentication.',
          },
          expiresAt: {
            type: 'string',
            format: 'date-time',
            description:
              'After this, the token opens nothing; asking again simply issues a new one.',
          },
          admittedBy: {
            type: 'string',
            enum: ['open', 'form-code', 'participant-code', 'link-session', 'signed-in'],
            description:
              'Which door was used. `method` says what the form asked for; this says what actually let them in — the form\'s shared code, their own invitation code, a link sent to their address, an account, or nothing.',
          },
          client: {
            type: 'object',
            hidden: true,
            description:
              'Where it was opened and sent from (ip, user agent, host) — the evidence behind an invalidation.',
          },
        },
      },
    },
    required: ['formId', 'values'],
  } as const;
};

const dd = FormSubmissionSchema();
export type FormSubmissionModel = FromSchema<typeof dd>;

registerCollection(
  'Form Submission',
  DataType.form_submission,
  FormSubmissionSchema()
);

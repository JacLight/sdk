import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../default-schema';
import { DataType } from '../types';

/**
 * One record per person per course (a `post` with contentType course).
 * The person is the record's BaseModel `owner`.
 * `progress` holds what the person has done, keyed by page id.
 */
export const ProgramEnrollmentSchema = () =>
  ({
    type: 'object',
    properties: {
      programId: { type: 'string', description: 'sk of the course post' },
      status: { type: 'string', enum: ['active', 'completed', 'withdrawn'], default: 'active' },
      enrolledAt: { type: 'string', format: 'date-time' },
      dueAt: { type: 'string', format: 'date-time' },
      completedAt: { type: 'string', format: 'date-time' },
      progress: {
        type: 'object',
        description: 'Keyed by toc node id.',
        additionalProperties: {
          type: 'object',
          properties: {
            done: { type: 'boolean' },
            at: { type: 'string', format: 'date-time' },
            score: { type: 'number' },
            percent: { type: 'number', description: 'Watched % for video content.' },
            answerRef: { type: 'string', description: 'datatype/sk of the record the page saved (form answer, upload).' },
            review: {
              type: 'object',
              description: 'Set when the item needs approval: the decision is recorded here, no workflow.',
              properties: {
                status: { type: 'string', enum: ['pending', 'approved', 'changes'] },
                by: { type: 'string' },
                at: { type: 'string', format: 'date-time' },
                note: { type: 'string' },
              },
            },
          },
        },
      },
    },
    required: ['programId'],
  }) as const;

const pe = ProgramEnrollmentSchema();
export type ProgramEnrollmentModel = FromSchema<typeof pe>;

registerCollection('Program Enrollment', DataType.program_enrollment, ProgramEnrollmentSchema());

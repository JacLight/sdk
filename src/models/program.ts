import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../default-schema';
import { DataType } from '../types';

/**
 * Per-person runtime of a program (a `post` with `program` set — see
 * program-structure.ts). The server owns every field: clients read the player
 * view and call the stage endpoints; nothing here is written by a UI directly.
 */

export const PROGRAM_ENROLLMENT_STATUSES = ['invited', 'enrolled', 'in-progress', 'waiting-review', 'completed', 'rejected', 'withdrawn', 'expired'] as const;
export const PROGRAM_STAGE_STATUSES = ['locked', 'open', 'in-progress', 'submitted', 'changes-requested', 'approved', 'complete', 'failed', 'skipped'] as const;
export const PROGRAM_EVENT_TYPES = [
  'enrolled',
  'opened',
  'progress',
  'submitted',
  'completed',
  'reviewed',
  'overridden',
  'revoked',
  'withdrawn',
  'reminded',
  'expired',
  'external-completed',
  'program-completed',
] as const;

export const ProgramSubjectSchema = () =>
  ({
    type: 'object',
    description:
      'Who is enrolled. Normally the platform user every other feature shares (type user). A person without a login — a kiosk learner identified by badge, say — is type external, keyed by the host feature.',
    properties: {
      type: { type: 'string', enum: ['user', 'external'], default: 'user' },
      id: { type: 'string', description: 'user sk, or the host\'s id for an external subject' },
      email: { type: 'string' },
      name: { type: 'string' },
      host: { type: 'string', description: 'For external subjects: which feature owns the id (e.g. bm_employee).' },
    },
    required: ['type', 'id'],
  }) as const;

export const ProgramStageProgressSchema = () =>
  ({
    type: 'object',
    properties: {
      status: { type: 'string', enum: [...PROGRAM_STAGE_STATUSES] },
      lockReason: { type: 'string' },
      startedAt: { type: 'string', format: 'date-time' },
      completedAt: { type: 'string', format: 'date-time' },
      attempts: { type: 'number' },
      score: { type: 'number' },
      watchedPercent: { type: 'number' },
      timeSpentSec: { type: 'number' },
      parts: {
        type: 'object',
        additionalProperties: true,
        description:
          'Keyed by part id: { done, value (form answers / signature / confirmation), files [{url, name, size, type}], ref {datatype, sk} (a typed record), attempts [{at, score, passed, answers}], watchedPercent }.',
      },
      review: {
        type: 'object',
        properties: {
          decision: { type: 'string', enum: ['approved', 'changes-requested', 'rejected'] },
          by: { type: 'string' },
          at: { type: 'string', format: 'date-time' },
          note: { type: 'string' },
        },
      },
      override: {
        type: 'object',
        description: 'Set when staff completed or revoked the stage by hand.',
        properties: { action: { type: 'string', enum: ['complete', 'revoke'] }, by: { type: 'string' }, at: { type: 'string' }, note: { type: 'string' } },
      },
    },
  }) as const;

export const ProgramEnrollmentSchema = () =>
  ({
    type: 'object',
    properties: {
      programId: { type: 'string', description: 'sk of the program post' },
      programSlug: { type: 'string' },
      programTitle: { type: 'string' },
      programVersion: { type: 'number', description: 'The published version this person runs on (program_version snapshot).' },
      subject: ProgramSubjectSchema(),
      subjectKey: { type: 'string', description: 'type:id — one active enrollment per subject, program and cycle.', hidden: true },
      source: { type: 'string', enum: ['self', 'invited', 'assigned', 'purchased', 'imported'], default: 'self' },
      externalRef: {
        type: 'string',
        description: 'Set by the feature that assigned it (e.g. requirementId:cycle). Enrolling again with the same ref returns the same enrollment.',
      },
      host: {
        type: 'object',
        description: 'The feature that owns this enrollment\'s lifecycle, if any.',
        properties: { app: { type: 'string' }, ref: { type: 'string' } },
      },
      status: { type: 'string', enum: [...PROGRAM_ENROLLMENT_STATUSES], default: 'enrolled' },
      cycle: { type: 'string', description: 'The period a renewal covers (e.g. 2026).' },
      supersedesEnrollmentId: { type: 'string' },
      enrolledAt: { type: 'string', format: 'date-time' },
      startedAt: { type: 'string', format: 'date-time' },
      dueAt: { type: 'string', format: 'date-time' },
      completedAt: { type: 'string', format: 'date-time' },
      expiresAt: { type: 'string', format: 'date-time' },
      lastActiveAt: { type: 'string', format: 'date-time' },
      percent: { type: 'number', minimum: 0, maximum: 100 },
      currentPageId: { type: 'string' },
      timeSpentSec: { type: 'number' },
      points: { type: 'number' },
      locale: { type: 'string' },
      notifications: { type: 'string', enum: ['program', 'host', 'off'] },
      certificateRef: { type: 'string' },
      credits: { type: 'array', items: { type: 'object', properties: { type: { type: 'string' }, amount: { type: 'number' } } } },
      stages: {
        type: 'object',
        additionalProperties: ProgramStageProgressSchema(),
        description: 'Keyed by page id.',
      },
    },
    required: ['programId', 'subject'],
  }) as const;

export const ProgramEventSchema = () =>
  ({
    type: 'object',
    description: 'Append-only log of everything that happened in an enrollment — the audit trail and the source for reports.',
    properties: {
      enrollmentId: { type: 'string' },
      programId: { type: 'string' },
      subjectKey: { type: 'string' },
      type: { type: 'string', enum: [...PROGRAM_EVENT_TYPES] },
      pageId: { type: 'string' },
      partId: { type: 'string' },
      by: { type: 'string' },
      at: { type: 'string', format: 'date-time' },
      data: { type: 'object', additionalProperties: true },
    },
    required: ['enrollmentId', 'type'],
  }) as const;

export const ProgramVersionSchema = () =>
  ({
    type: 'object',
    description: 'Frozen copy of a program\'s structure at publish, so people part-way through are not broken by later edits.',
    properties: {
      programId: { type: 'string' },
      version: { type: 'number' },
      publishedAt: { type: 'string', format: 'date-time' },
      publishedBy: { type: 'string' },
      snapshot: { type: 'object', additionalProperties: true, description: 'title, program, toc, pages — as published.' },
    },
    required: ['programId', 'version'],
  }) as const;

const pe = ProgramEnrollmentSchema();
export type ProgramEnrollmentModel = FromSchema<typeof pe>;
const pev = ProgramEventSchema();
export type ProgramEventModel = FromSchema<typeof pev>;
const pv = ProgramVersionSchema();
export type ProgramVersionModel = FromSchema<typeof pv>;

registerCollection('Program Enrollment', DataType.program_enrollment, ProgramEnrollmentSchema());
registerCollection('Program Event', DataType.program_event, ProgramEventSchema());
registerCollection('Program Version', DataType.program_version, ProgramVersionSchema());

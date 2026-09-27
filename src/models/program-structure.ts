/**
 * Program structure — the content contract that Content Studio writes and the
 * player engine reads. It lives inside a `post` (see post.ts): `program` at the
 * root, `stage` and `parts` on each page, `gate` on each toc chapter.
 *
 * A post without `program` is ordinary published content (a blog, a series,
 * multi-page docs). Setting `program` makes it interactive: people enroll, and
 * the server tracks their progress in `program_enrollment`.
 */

/** Every kind of part a page can hold. Open list — each type is registered with
 *  a settings schema, a renderer (client) and a completion signal (server). */
export const PROGRAM_PART_TYPES = [
  'html',
  'video',
  'audio',
  'pdf',
  'image',
  'gallery',
  'link',
  'embed',
  'form',
  'upload',
  'quiz',
  'signature',
  'verify',
  'external',
  'program',
] as const;
export type ProgramPartType = (typeof PROGRAM_PART_TYPES)[number];

/** Parts that record something the participant did (an answer, a file, a score). */
export const PROGRAM_INPUT_PART_TYPES: ProgramPartType[] = ['form', 'upload', 'quiz', 'signature', 'verify', 'external', 'program'];

/** What finishes a stage. */
export const PROGRAM_COMPLETE_RULES = ['view', 'watch', 'submit', 'pass', 'approve', 'verify', 'external'] as const;
export type ProgramCompleteRule = (typeof PROGRAM_COMPLETE_RULES)[number];

export const ProgramConditionSchema = () =>
  ({
    type: 'object',
    description: 'An earlier answer decides whether this page applies. Unmet → the page is skipped, not locked.',
    properties: {
      pageId: { type: 'string' },
      partId: { type: 'string' },
      field: { type: 'string', description: 'Field path in that part\'s answer (form parts); blank for the part\'s whole value.' },
      op: { type: 'string', enum: ['eq', 'neq', 'in', 'nin', 'exists', 'gt', 'gte', 'lt', 'lte'], default: 'eq' },
      value: {},
    },
  }) as const;

export const ProgramGateSchema = () =>
  ({
    type: 'object',
    description: 'When this page or chapter unlocks. All set rules must pass; the server checks them on every open and submit.',
    properties: {
      after: {
        type: 'string',
        enum: ['none', 'previous'],
        description: '`previous` = the required page before this one (in toc order) must be complete. Defaults to the program `order`.',
      },
      prerequisites: {
        type: 'array',
        items: { type: 'string' },
        description: 'Page ids or chapter (toc node) ids that must be complete first.',
      },
      dripDays: { type: 'number', minimum: 0, description: 'Opens this many days after the person enrolled.' },
      opensAt: { type: 'string', format: 'date-time', description: 'Opens on this date for everyone.' },
      condition: ProgramConditionSchema(),
    },
  }) as const;

export const ProgramQuizQuestionSchema = () =>
  ({
    type: 'object',
    properties: {
      id: { type: 'string' },
      prompt: { type: 'string' },
      kind: { type: 'string', enum: ['single', 'multiple', 'boolean'], default: 'single' },
      options: { type: 'array', items: { type: 'string' } },
      correct: {
        type: 'array',
        items: { type: 'number' },
        description: 'Indexes of the right options. Never sent to the participant — the server scores.',
      },
      explanation: { type: 'string', description: 'Shown after an attempt is scored.' },
      points: { type: 'number', default: 1 },
    },
    required: ['id', 'prompt'],
  }) as const;

export const ProgramPartSchema = () =>
  ({
    type: 'object',
    additionalProperties: true,
    properties: {
      id: { type: 'string', description: 'Stable within the page; answers are keyed by it.' },
      type: { type: 'string', enum: [...PROGRAM_PART_TYPES] },
      title: { type: 'string' },
      required: {
        type: 'boolean',
        description: 'The page completes only when every required part is done. Content parts (html, image…) are never required unless the page completes on `view`.',
      },
      html: { type: 'string', description: 'Body of an `html` part. Authored by people or AI; rendered by any client.' },
      settings: {
        type: 'object',
        additionalProperties: true,
        description:
          'Per type. video/audio: {source: file|youtube|vimeo|url, url, fileId, durationSec, captionsUrl}. pdf/image: {url, fileId}. gallery: {images:[{url, caption}]}. link/embed: {url, html, height}. form: {collection | crmForm, fields[], submitLabel}. upload: {accept[], maxMb, maxFiles}. quiz: {questions[], passScore(%), maxAttempts, timeLimitSec, cooldownMin, shuffle}. signature: {statement}. verify: {attribute} — a user attribute the server must see set. external: {url, launchUrlFrom: static|host, selfConfirm}. program: {programId} — a nested program (learning paths).',
      },
      translations: {
        type: 'object',
        additionalProperties: true,
        description: 'Per locale overrides of title / html / settings text: { es: { title, html } }.',
      },
    },
    required: ['id', 'type'],
  }) as const;

export const ProgramStageSchema = () =>
  ({
    type: 'object',
    description: 'Makes a page a stage of the program. Absent on a page of a program = a free content page (never gates, counts as viewed).',
    properties: {
      required: { type: 'boolean', default: true },
      complete: { type: 'string', enum: [...PROGRAM_COMPLETE_RULES], default: 'view' },
      watchPercent: { type: 'number', minimum: 1, maximum: 100, default: 90, description: 'For `watch`.' },
      passScore: { type: 'number', minimum: 0, maximum: 100, description: 'For `pass`; overrides the quiz part\'s own passScore.' },
      gate: ProgramGateSchema(),
      reviewers: { type: 'array', items: { type: 'string' }, description: 'Emails or group names who may review this stage; falls back to the program reviewers.' },
      durationMin: { type: 'number', minimum: 0 },
      points: { type: 'number', minimum: 0 },
      preview: { type: 'boolean', description: 'Readable without enrolling (landing-page samples).' },
    },
  }) as const;

export const ProgramSettingsSchema = () =>
  ({
    type: 'object',
    description: 'Setting this turns the post into a program people enroll in.',
    collapsible: true,
    properties: {
      enabled: { type: 'boolean', default: true },
      access: {
        type: 'object',
        properties: {
          mode: {
            type: 'string',
            enum: ['open', 'link', 'invite', 'assigned'],
            default: 'invite',
            description: 'open = anyone signed in can self-enroll; link = anyone with the link; invite = staff invites; assigned = only another feature assigns (e.g. HR requirements).',
          },
          groups: { type: 'array', items: { type: 'string' }, description: 'Only these user groups may self-enroll (open / link).' },
        },
      },
      enrollment: {
        type: 'object',
        properties: {
          opensAt: { type: 'string', format: 'date-time' },
          closesAt: { type: 'string', format: 'date-time' },
          capacity: { type: 'number', minimum: 1 },
        },
      },
      order: { type: 'string', enum: ['sequential', 'free'], default: 'sequential', description: 'Default gate for pages without their own `gate.after`.' },
      dueInDays: { type: 'number', minimum: 0 },
      reviewers: { type: 'array', items: { type: 'string' } },
      notifications: { type: 'string', enum: ['program', 'host', 'off'], default: 'program', description: 'host = the feature that assigned the person sends reminders (Programs stays silent).' },
      certificate: {
        type: 'object',
        properties: {
          enabled: { type: 'boolean' },
          template: { type: 'string', description: 'Print template name.' },
        },
      },
      credits: {
        type: 'array',
        items: { type: 'object', properties: { type: { type: 'string' }, amount: { type: 'number' } } },
      },
      version: { type: 'number', readOnly: true, description: 'Stamped by the server on publish; enrollments keep the version they started on.' },
      lineageId: { type: 'string', readOnly: true },
      supersededBy: { type: 'string', readOnly: true },
    },
  }) as const;

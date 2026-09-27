import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../default-schema';
import { ControlType, DataType } from '../types';

/**
 * An AI Employee — a member of staff that is an AI.
 *
 * It has a real `user` record of its own (`userId`), so it is given groups and
 * roles in User Management exactly like a person and the server enforces them
 * on everything it does; it has no password and cannot be logged into.
 *
 * This record is how it is managed: its job, its hours, its budget, which
 * actions need a person's OK. The work itself is
 * done by a runtime outside the platform, through the worker API; `runtime`
 * says which. Pausing it sets `status: 'paused'` and locks its user, so no
 * token it holds works.
 */
export const AIEmployeeSchema = () => {
  return {
    type: 'object',
    required: ['name', 'title'],
    properties: {
      name: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        unique: true,
        transform: 'uri',
        description: 'Handle, used in its login identity and links.',
      },
      title: { type: 'string', description: 'What people call it, e.g. "Ava".' },
      kind: {
        type: 'string',
        enum: ['employee', 'template'],
        default: 'employee',
        description: 'employee: a real one, with its own user. template: a ready-made one to hire from — no user, never switched on, takes no work. The platform\'s templates are the shared org\'s; an org\'s own template of the same name replaces it for that org.',
      },
      category: { type: 'string', enum: ['front-desk', 'sales', 'support', 'finance', 'marketing', 'operations', 'other'], description: 'Templates: where it is listed.' },
      icon: { type: 'string', description: 'Templates: its icon.' },
      summary: { type: 'string', description: 'Templates: one line on what it does.' },
      suggestedGroups: { type: 'array', items: { type: 'string' }, description: 'Templates: the access it usually needs — a hint when it is given access.' },
      budgetToday: { type: 'object', readOnly: true, description: 'Today only (its timezone): credit added on top of the daily budget, and when spend was last reset.', properties: { date: { type: 'string' }, creditUsd: { type: 'number' }, resetAt: { type: 'string', format: 'date-time' }, alerted: { type: 'object', properties: { low: { type: 'string' }, out: { type: 'string' } } } } },
      listensTo: {
        type: 'array',
        items: { type: 'string', enum: ['chat_queue', 'email', 'sms', 'social', 'ticket', 'order', 'form'], enumNames: ['Customer chat queue', 'Email', 'SMS', 'Social media', 'Support tickets', 'Orders', 'Forms'] },
        description: 'Where it is alerted from, like a person keeping an eye on the desk, the inbox or the orders. Always on: direct messages, mentions, and work assigned to it. Chat queue: a customer is waiting for a person (whoever picks first gets them). Email / SMS: a customer message comes in. Social: a DM, comment or mention on the connected pages. Ticket: a new support ticket. Order: a new order. Form: a form is submitted.',
      },
      jobTitle: { type: 'string', description: 'Its role, e.g. "Accounts receivable".' },
      avatar: { type: 'string' },
      status: {
        type: 'string',
        enum: ['draft', 'active', 'paused'],
        default: 'draft',
        description: 'draft: being set up, takes no work. active: works. paused: stopped — its user is locked.',
      },
      jobDescription: {
        type: 'string',
        'x-control': ControlType.richtext,
        description: 'What it is responsible for and how it should work — its standing instructions.',
      },
      userId: { type: 'string', readOnly: true, description: 'sk of its own user record. Set by the server.' },
      userEmail: { type: 'string', readOnly: true, description: 'Its login identity (no password). Set by the server.' },
      supervisor: { type: 'string', description: 'Email of the person it reports to — its approvals and reports go there.' },
      runtime: {
        type: 'object',
        properties: {
          provider: {
            type: 'string',
            enum: ['stub', 'session-manager', 'external'],
            default: 'stub',
            description: 'stub: the built-in placeholder (records what it would do, does no work). session-manager: provisioned on the session manager, which runs the agent. external: run somewhere we cannot ask; known only from its own sign-ins.',
          },
          model: { type: 'string', description: 'Model the runtime should use, when it lets you choose.' },
        },
      },
      workingHours: {
        type: 'object',
        properties: {
          alwaysOn: { type: 'boolean', default: true },
          timezone: { type: 'string', default: 'UTC' },
          days: {
            type: 'array',
            items: { type: 'string', enum: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] },
            default: ['mon', 'tue', 'wed', 'thu', 'fri'],
          },
          start: { type: 'string', default: '09:00', description: 'HH:mm, in its timezone' },
          end: { type: 'string', default: '17:00', description: 'HH:mm, in its timezone' },
        },
      },

      limits: {
        type: 'object',
        properties: {
          budgetEnabled: { type: 'boolean', default: true, description: 'Hold it to a daily budget. Off: no daily limit — it is never stopped for spend and no budget alerts are sent.' },
          dailyBudgetUsd: { type: 'number', default: 5, minimum: 0, description: 'It stops taking work for the day once its runs have cost this much (when the daily budget is on).' },
          maxConcurrentJobs: { type: 'number', default: 1, minimum: 1, maximum: 20 },
          maxAttempts: { type: 'number', default: 2, minimum: 1, maximum: 10, description: 'A failed job is retried up to this many times in total.' },
        },
      },

      approvals: {
        type: 'object',
        description: 'Which actions wait for a person before it may take them.',
        properties: {
          delete: { type: 'string', enum: ['require', 'allow'], default: 'require' },
          bulkSend: { type: 'string', enum: ['require', 'allow'], default: 'require', description: 'Messages to more than a few people at once.' },
          calls: { type: 'string', enum: ['require', 'allow'], default: 'require', description: 'Placing a phone call (outbound, from its number).' },
          money: { type: 'string', enum: ['require', 'allow'], default: 'require', description: 'Refunds, payments, charges, credits.' },
          moneyThresholdUsd: { type: 'number', default: 0, minimum: 0, description: 'With money on "allow", amounts above this still need an OK.' },
          usersAndPermissions: { type: 'string', enum: ['require', 'allow'], default: 'require' },
        },
      },

      template: { type: 'string', readOnly: true, description: 'The template it was created from, if any.' },

      voice: {
        type: 'object',
        description: 'How it sounds on the phone. Calls to a number assigned to it are answered by it, and calls it places go out from that number — in this voice, from its own instructions.',
        properties: {
          enabled: { type: 'boolean', default: true, description: 'Takes phone calls. Off: calls to its numbers are not answered by it, it places no calls, and its voice agent is removed; the chosen voice is kept for when it is turned back on.' },
          voice: { type: 'string', description: 'The voice: an ElevenLabs voice_id or an OpenAI voice name — whichever the voice list offered.' },
          platform: { type: 'string', enum: ['elevenlabs', 'openai-realtime'], description: 'The engine the chosen voice belongs to. Set with the voice; not a separate choice.' },
          voiceName: { type: 'string', description: 'What people call the voice (an ElevenLabs voice_id means nothing to a person). Set with the voice.' },
          language: { type: 'string', default: 'en', description: 'The language it speaks on calls.' },
          greeting: { type: 'string', description: 'What it says when it answers, e.g. "Hi, this is Ava from Appmint — how can I help?". Blank: it greets in its own words.' },
          eagerness: { type: 'string', enum: ['low', 'medium', 'high'], enumNames: ['Patient — waits for long pauses', 'Balanced', 'Quick — answers at short pauses'], default: 'medium', description: 'How quickly it answers once the caller stops talking.' },
          tools: {
            type: 'array',
            items: { type: 'string' },
            default: ['search_customers', 'create_lead', 'take_message', 'query_knowledge', 'check_availability', 'get_reservation_types', 'create_reservation', 'confirm_reservation', 'modify_reservation', 'cancel_reservation', 'create_ticket', 'confirm_order_status', 'check_transfer_target'],
            description: 'What it can do during a call. Fewer tools answer faster — every tool is read on every turn.',
          },
        },
      },
      voiceAgent: {
        type: 'object',
        readOnly: true,
        description: 'Set by the server: the agent its voice runs on at the provider (ElevenLabs keeps one per voiced employee, named appmint-<org>-<record id>). Kept in step with this record on every save.',
        properties: {
          platform: { type: 'string' },
          remoteId: { type: 'string', description: 'The provider\'s own agent id.' },
          hash: { type: 'string', description: 'Fingerprint of what was last pushed; a mismatch means it is re-pushed.' },
          syncedAt: { type: 'string', format: 'date-time' },
          error: { type: 'string', description: 'Why the last push failed, if it did.' },
        },
      },
    },
  } as const;
};

const es = AIEmployeeSchema();
export type AIEmployeeModel = FromSchema<typeof es>;

registerCollection('AI Employee', DataType.ai_employee, AIEmployeeSchema());

/**
 * One piece of work in an AI Employee's queue — assigned to it, a check-in
 * from the platform, or asked of it directly — and everything that happened to it.
 */
export const AIEmployeeWorkSchema = () => {
  return {
    type: 'object',
    required: ['employee', 'title'],
    properties: {
      employee: { type: 'string', description: 'The ai_employee name.' },
      title: { type: 'string' },
      instructions: { type: 'string', 'x-control': ControlType.richtext },
      source: {
        type: 'string',
        enum: ['assigned', 'ping', 'direct', 'message', 'call', 'config'],
        description: 'assigned: a record was assigned to it. ping: the platform checked in with it, so it carries on with its role on its own. direct: someone asked. message: someone wrote to it in Workspace. call: a phone call it took or made has ended — the transcript is attached, to log and follow up. config: its own setup changed (a number given or taken, its voice, instructions, access) — the facts, so it knows.',
      },
      approvalItem: { type: 'string', readOnly: true, description: 'The approval card posted in the AI team workspace for its current request.' },
      didWork: { type: 'boolean', readOnly: true, description: 'A ping on which it did something (an action step) rather than only checking in.' },
      ref: {
        type: 'object',
        description: 'The record the work is about.',
        properties: {
          datatype: { type: 'string' },
          id: { type: 'string' },
          label: { type: 'string' },
          thread: { type: 'string', description: 'The conversation it belongs to (one customer on one channel), so later messages join the same work.' },
        },
      },
      attachments: {
        type: 'array',
        description: 'Records and documents given with the work, each with a note on what it is for.',
        items: {
          type: 'object',
          properties: {
            kind: { type: 'string', enum: ['record', 'file'] },
            datatype: { type: 'string', description: 'For a record: its collection.' },
            id: { type: 'string', description: 'For a record: its id.' },
            label: { type: 'string', description: 'What it is called.' },
            path: { type: 'string', description: 'For a document: where it is stored.' },
            url: { type: 'string' },
            mime: { type: 'string' },
            comment: { type: 'string', description: 'What it is for.' },
          },
        },
      },
      requestedBy: { type: 'string' },
      priority: { type: 'string', enum: ['low', 'normal', 'high'], default: 'normal' },
      status: {
        type: 'string',
        enum: ['queued', 'in_progress', 'waiting_approval', 'done', 'failed', 'cancelled'],
        default: 'queued',
      },
      lease: {
        type: 'object',
        readOnly: true,
        properties: { worker: { type: 'string' }, until: { type: 'string', format: 'date-time' } },
      },
      attempts: { type: 'number', default: 0, readOnly: true },
      steps: {
        type: 'array',
        readOnly: true,
        description: 'The timeline: what the runtime reported, in order.',
        items: {
          type: 'object',
          properties: {
            at: { type: 'string', format: 'date-time' },
            kind: { type: 'string', enum: ['note', 'action', 'check', 'error', 'approval', 'decision', 'status'] },
            text: { type: 'string' },
            detail: { type: 'object' },
          },
        },
      },
      pendingApproval: {
        type: 'object',
        readOnly: true,
        properties: {
          action: { type: 'string', enum: ['delete', 'bulkSend', 'money', 'usersAndPermissions', 'other'] },
          summary: { type: 'string' },
          detail: { type: 'object' },
          amountUsd: { type: 'number' },
          requestedAt: { type: 'string', format: 'date-time' },
        },
      },
      decisions: {
        type: 'array',
        readOnly: true,
        items: {
          type: 'object',
          properties: {
            action: { type: 'string' },
            summary: { type: 'string' },
            decision: { type: 'string', enum: ['approved', 'rejected'] },
            by: { type: 'string' },
            note: { type: 'string' },
            at: { type: 'string', format: 'date-time' },
          },
        },
      },
      result: { type: 'string', 'x-control': ControlType.richtext, readOnly: true },
      error: { type: 'string', readOnly: true },
      costUsd: { type: 'number', default: 0, readOnly: true },
      startedAt: { type: 'string', format: 'date-time', readOnly: true },
      finishedAt: { type: 'string', format: 'date-time', readOnly: true },
    },
  } as const;
};

const ws = AIEmployeeWorkSchema();
export type AIEmployeeWorkModel = FromSchema<typeof ws>;

registerCollection('AI Employee Work', DataType.ai_employee_work, AIEmployeeWorkSchema());

/** A knowledge source — the same shape an AI Assistant uses for its own. */
const KnowledgeSource = {
  type: 'object',
  properties: {
    sourceType: { type: 'string', enum: ['collection', 'document', 'url', 'custom'] },
    reference: { type: 'string', description: 'Collection name, document id, URL, or free text for custom.' },
    title: { type: 'string' },
    note: { type: 'string', description: 'When to use it.' },
  },
} as const;

/**
 * How an organization's AI Employees work — one record per org
 * (`name: 'default'`).
 *
 * Each section is optional: a section the org has not set comes from the
 * shared (platform) org's record, and failing that from built-in defaults.
 * The server resolves it and says, per section, where the answer came from.
 */
export const AIEmployeeConfigSchema = () => {
  return {
    type: 'object',
    required: ['name'],
    properties: {
      name: { type: 'string', default: 'default' },
      instructions: {
        type: 'array',
        description: 'What the organization tells every one of its AI employees, in plain words — its strategy, rhythm, rules. In the shared org: the platform\'s system instructions, given to every organization\'s AI employees. Instructions for one employee go in its job description.',
        items: {
          type: 'object',
          required: ['title', 'content'],
          properties: {
            id: { type: 'string' },
            title: { type: 'string' },
            content: { type: 'string', 'x-control': ControlType.richtext },
            order: { type: 'number', default: 100, description: 'Lower comes first.' },
            enabled: { type: 'boolean', default: true },
            who: { type: 'string', enum: ['all', 'only', 'except'], default: 'all', description: 'all: every AI employee. only: just the employees listed. except: every one but those listed.' },
            employees: { type: 'array', items: { type: 'string' }, description: 'AI employee handles, for "only" and "except".' },
          },
        },
      },
      company: {
        type: 'object',
        description: 'What every employee knows about the business and must follow.',
        properties: {
          about: { type: 'string', 'x-control': ControlType.richtext, description: 'What the business does, for whom, how.' },
          tone: { type: 'string', description: 'How it writes and speaks, e.g. "warm, brief, no jargon".' },
          rules: { type: 'array', items: { type: 'string' }, description: 'Rules it must always follow.' },
          neverDo: { type: 'array', items: { type: 'string' }, description: 'Things it must never do.' },
        },
      },
      knowledge: {
        type: 'object',
        description: 'Where it looks things up.',
        properties: {
          sources: { type: 'array', items: KnowledgeSource },
          entries: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                title: { type: 'string' },
                content: { type: 'string', 'x-control': ControlType.richtext },
                tags: { type: 'array', items: { type: 'string' } },
              },
            },
          },
        },
      },
      defaults: {
        type: 'object',
        description: 'What a new AI employee starts with.',
        properties: {
          runtime: { type: 'object', properties: { provider: { type: 'string', enum: ['stub', 'session-manager', 'external'] }, model: { type: 'string' } } },
          workingHours: {
            type: 'object',
            properties: {
              alwaysOn: { type: 'boolean' },
              timezone: { type: 'string' },
              days: { type: 'array', items: { type: 'string', enum: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] } },
              start: { type: 'string' },
              end: { type: 'string' },
            },
          },
          limits: { type: 'object', properties: { budgetEnabled: { type: 'boolean' }, dailyBudgetUsd: { type: 'number' }, maxConcurrentJobs: { type: 'number' }, maxAttempts: { type: 'number' } } },
          approvals: {
            type: 'object',
            properties: {
              delete: { type: 'string', enum: ['require', 'allow'] },
              bulkSend: { type: 'string', enum: ['require', 'allow'] },
              money: { type: 'string', enum: ['require', 'allow'] },
              moneyThresholdUsd: { type: 'number' },
              usersAndPermissions: { type: 'string', enum: ['require', 'allow'] },
            },
          },
        },
      },
      escalation: {
        type: 'object',
        description: 'Who it turns to when stuck, and what it does meanwhile.',
        properties: {
          contact: { type: 'string', description: 'Email of the person it escalates to when its own supervisor is not set.' },
          whenStuck: { type: 'string', enum: ['ask', 'fail', 'pause'], description: 'ask: ask the contact and wait. fail: give up the job with a note. pause: stop working until someone resumes it.' },
        },
      },
      teamWorkspace: { type: 'string', readOnly: true, description: 'The org\'s AI team workspace (its own; never inherited). Set through ai-employees/team.' },
      system: {
        type: 'object',
        description: 'The platform\'s own settings, read from the shared organization only.',
        properties: {
          pingMinutes: { type: 'number', minimum: 1, default: 15, description: 'How often the platform checks in with every switched-on AI employee.' },
          unclaimedMinutes: { type: 'number', minimum: 1, default: 30, description: 'Something that came in and nobody has taken after this long is raised in the AI team workspace.' },
          handlingMinutes: { type: 'number', minimum: 5, default: 120, description: 'Something taken but not finished after this long is opened again for anyone to take.' },
          voiceAgentSweepHour: { type: 'number', minimum: 0, maximum: 23, default: 4, description: 'Hour of the day (server time) each organization\'s voice agents at the provider are checked: ones whose employee or assistant is gone, or no longer on that provider, are removed; out-of-date ones are re-pushed.' },
        },
      },
    },
  } as const;
};

const cs = AIEmployeeConfigSchema();
export type AIEmployeeConfigModel = FromSchema<typeof cs>;

registerCollection('AI Employee Settings', DataType.ai_employee_config, AIEmployeeConfigSchema());

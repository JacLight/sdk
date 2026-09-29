import { FromSchema } from 'json-schema-to-ts';

import { DataType, ControlType } from '../types';
import { registerCollection } from '../default-schema';
import { FileInfoSchema } from './file-info';

export const PostSchema = () => {
  return {
    type: 'object',
    properties: {
      contentType: {
        type: 'string',
        enum: ['post', 'documentation', 'ebook', 'course', 'blog-series'],
        default: 'post',
        'x-control': ControlType.selectMany,
        group: 'template',
        groupLayout: 'flat',
        description: 'The type of content this represents',
        hidden: true,
      },
      template: {
        type: 'string',
        'x-control': ControlType.selectMany,
        groupLayout: 'flat',
        group: 'template',
        dataSource: {
          source: 'collection',
          collection: DataType.flexdata,
          value: 'name',
          label: 'name',
          filter: { 'data.application': 'ViewComponent' },
        },
      },
      title: {
        type: 'string',
      },
      slug: {
        type: 'string',
        title: 'Slug',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        minLength: 3,
        maxLength: 100,
        unique: true,
        default: '{{title}}',
        groupLayout: 'flat',
        transform: ['uri', 'lowercase'],
      },
      summary: {
        type: 'string',
        'x-control-variant': 'textarea',
      },
      coverImage: {
        type: 'string',
        'x-control': ControlType.file,
        collapsible: true,
      },
      content: {
        type: 'string',
        'x-control': ControlType.richtext,
        hideIn: ['table'],
        description:
          'Single-page body. For multi-page documents use `pages` instead.',
      },
      /**
       * Multi-page documents (ebooks, courses, magazines, documentation, video courses)
       * hold every page inside this single post record. The `toc` below references pages by id.
       *
       * Mode is decided by the POST's root-level `subschema` (BaseModel.subschema):
       *   - No subschema  → BlockNote pages. CS owns the page shape: id + title + content.
       *   - Has subschema → Form pages. The user's schema defines the entire page shape;
       *                     CS just hands the page to AppmintForm and gets out of the way.
       *                     The user may not even have a `content` field — that's their call.
       *
       * Pages are intentionally open-ended (`additionalProperties: true`) so user-schema fields
       * coexist with the few standard fields CS knows about. The only required field is `id`
       * because TOC nodes reference it.
       */
      pages: {
        type: 'array',
        hidden: true,
        items: {
          type: 'object',
          additionalProperties: true,
          properties: {
            title: {
              type: 'string',
              description: 'Optional. Used for TOC display when present.',
            },
            id: {
              type: 'string',
              description: 'Stable page id — required, referenced by `toc`',
              title: 'Slug',
              pattern: '^[a-zA-Z_\\-0-9]*$',
              minLength: 3,
              maxLength: 100,
              unique: true,
              default: '{{title}}',
              groupLayout: 'flat',
              transform: ['uri', 'lowercase'],
            },
            summary: {
              type: 'string',
              description: 'Optional. Short summary / excerpt of the page used in listings / previews.',
            },
            content: {
              type: 'string',
              description:
                'The page body: HTML (powered by appmint.js for forms, uploads and anything interactive). ' +
                'A collection\'s form goes in as a placeholder the site renders: `<wm-form data-collection="<collection name>" data-program-answer></wm-form>`. ' +
                'What the page reports back is marked on elements: every question input on a page (radio, checkbox, text) goes INSIDE one ' +
                '`<form data-program-answer> … <button type="submit">Submit</button></form>` — inputs outside a form are never sent; ' +
                'on submit its values are the answer, marked against `answerKey`; ' +
                '`<video|audio|iframe data-program-progress="watched">` reports how much was played; ' +
                '`<button data-program-progress="done">` marks the page done. Multiple-choice options use plain values ' +
                '(a, b, c…) — never put which one is correct in the HTML.',
            },
            type: {
              type: 'string',
              enum: ['text', 'video', 'audio', 'pdf', 'quiz', 'form', 'assignment', 'download'],
              description: 'Course posts: what the item is — the player shows its icon.',
            },
            duration: { type: 'string', description: 'Course posts: how long it takes, as shown (e.g. "5 min").' },
            reviewers: { type: 'array', items: { type: 'string' }, description: 'Course posts: who marks this content when it needs a human (emails or groups).' },
            answerKey: {
              type: 'object',
              description:
                'Correct answers for the questions in `content`, by input name: { [name]: { correct: [values] } } — e.g. ' +
                'a radio group name="capital" with the right option value="b" → { capital: { correct: ["b"] } }; for select-all, every right value. ' +
                'Never sent to readers; the server marks submitted answers against it and records the score (0–100).',
              additionalProperties: {
                type: 'object',
                properties: { correct: { type: 'array', items: { type: 'string' } } },
              },
            },
            conditions: {
              type: 'array',
              description: 'Course posts: this opens only when every condition holds. Put them exactly where progress should wait.',
              items: {
                type: 'object',
                properties: {
                  item: { type: 'string', description: 'An earlier toc item id (a page or a whole chapter).' },
                  check: {
                    type: 'string',
                    enum: ['done', 'approved', 'score', 'watched', 'percent'],
                    description: 'done = completed; approved = a reviewer approved it; score = its score ≥ min; watched = video watched ≥ min %; percent = chapter ≥ min % complete.',
                  },
                  min: { type: 'number', minimum: 0, maximum: 100 },
                },
              },
            },
          },
        },
      },
      /**
       * Table of contents — author-managed page-level structure that points to entries in
       * `pages` by id. Replaces the previous separate `DataType.navigation` document.
       *
       * Each TocNode may also carry an `anchor` (a heading id within the linked page) so
       * sub-headings inside a page can act as navigation targets without being separate pages.
       */
      toc: {
        type: 'array',
        hidden: true,
        items: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            title: { type: 'string' },
            pageId: {
              type: 'string',
              description: 'Which page this node points to',
            },
            anchor: {
              type: 'string',
              description: 'Optional heading id inside the page',
            },
            children: {
              type: 'array',
              items: { type: 'object', additionalProperties: true },
            },
            conditions: {
              type: 'array',
              description: 'Course posts: this opens only when every condition holds. Put them exactly where progress should wait.',
              items: {
                type: 'object',
                properties: {
                  item: { type: 'string', description: 'An earlier toc item id (a page or a whole chapter).' },
                  check: {
                    type: 'string',
                    enum: ['done', 'approved', 'score', 'watched', 'percent'],
                    description: 'done = completed; approved = a reviewer approved it; score = its score ≥ min; watched = video watched ≥ min %; percent = chapter ≥ min % complete.',
                  },
                  min: { type: 'number', minimum: 0, maximum: 100 },
                },
              },
            },
          },
        },
      },
      // Access — same rules as crm_form; the server enforces them on reading the post (and enrolling, for a course).
      accessMode: {
        type: 'string',
        enum: ['open', 'code', 'participants'],
        default: 'open',
        description:
          'Who may open it. `open`: anyone who can reach it. `code`: anyone holding `accessCode`. ' +
          '`participants`: only the people listed in `participants`, each with their own code.',
        group: 'access',
      },
      accessCode: {
        type: 'string',
        group: 'access',
      },
      authenticationType: {
        type: 'string',
        enum: ['none', 'magic-link', 'code', 'password', 'email'],
        default: 'none',
        description:
          'How the person proves who they are before it opens. `none` asks nothing; `magic-link` emails a link; ' +
          '`code` emails a one-time code; `password` signs in; `email` only asks for an address.',
        group: 'access',
      },
      startDate: {
        type: 'string',
        format: 'date-time',
        description: 'Not available before this.',
        group: 'access',
      },
      endDate: {
        type: 'string',
        format: 'date-time',
        description: 'Not available after this.',
        group: 'access',
      },
      invitationTemplate: {
        type: 'string',
        description: 'Message template used to invite participants.',
        'x-control': ControlType.selectMany,
        maxItems: 1,
        group: 'access',
        dataSource: {
          source: 'collection',
          collection: DataType.messagetemplate,
          label: 'name',
          value: 'name',
        },
      },
      participants: {
        type: 'array',
        collapsible: true,
        description: 'The people it is sent to. Each opens it with their own access code.',
        items: {
          type: 'object',
          layout: 'horizontal',
          properties: {
            email: { type: 'string', format: 'email' },
            name: { type: 'string' },
            accessCode: { type: 'string', styleClass: 'w-20' },
            role: { type: 'string', styleClass: 'w-20' },
            invitedAt: { type: 'string', format: 'date-time', readOnly: true },
            inviteCount: { type: 'number', readOnly: true },
          },
        },
      },
      course: {
        type: 'object',
        description: 'Set to make this post a course people enroll in. Progress lives in post_progress.',
        collapsible: true,
        properties: {
          dueInDays: { type: 'number', minimum: 0 },
          layout: {
            type: 'string',
            enum: ['sidebar', 'steps'],
            default: 'sidebar',
            description: 'How the player shows it: `sidebar` lists the outline beside the content (courses, training); `steps` shows one step at a time (applications, multi-stage forms).',
          },
          navigation: {
            type: 'string',
            enum: ['sidebar', 'top', 'none'],
            description: 'Where the steps sit: `sidebar` beside the page (sections collapsible), `top` a numbered stepper, `none` progress only. Defaults to `top` for steps, `sidebar` otherwise.',
          },
        },
      },
      media: {
        type: 'array',
        'x-control': ControlType.file,
        items: FileInfoSchema(),
        collapsible: true,
      },
      author: {
        type: 'object',
        collapsible: true,
        properties: {
          name: {
            type: 'string',
            minLength: 3,
            maxLength: 150,
          },
          bio: {
            type: 'string',
            'x-control': ControlType.richtext,
          },
          email: {
            type: 'string',
            format: 'email',
            minLength: 3,
            maxLength: 150,
          },
          website: {
            type: 'string',
          },
        },
      },
    },
  } as const;
};

const rt = PostSchema();
export type PostModel = FromSchema<typeof rt>;

registerCollection('Post', DataType.post, PostSchema());

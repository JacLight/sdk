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
                'BlockNote-mode body. Ignored / absent in Form mode.',
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

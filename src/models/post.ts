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
      },
      writingMode:{
        type: 'string',
        enum: ['markdown', 'richtext', 'editor'],
        'x-control': ControlType.selectMany,
        default: 'editor',
        group: 'template',
        groupLayout: 'flat',
        description: 'The writing mode for the content field',
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
          filter: {
            value: 'ViewComponent',
            property: 'application',
            operator: 'equal',
          },
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
        hideIn: ['table']
      },
      contentJSON: {
        type: 'object',
        hidden: true,
      },
      markdown: {
        type: 'string',
        'x-control': ControlType.code,
        hidden: true,
      },
      parent: {
        type: 'string',
        'x-control': ControlType.selectMany,
        groupLayout: 'flat',
        group: 'parent',
        dataSource: {
          source: 'collection',
          collection: DataType.post,
          valueField: 'name',
          labelField: 'name',
          filter: {
            'data.contentType': {
              $in: ['documentation', 'ebook', 'course', 'blog-series'],
            },
          },
        },
      },
      navigation: {
        type: 'string',
        'x-control': ControlType.selectMany,
        groupLayout: 'flat',
        group: 'parent',
        dataSource: {
          source: 'collection',
          collection: DataType.navigation,
          value: 'sk',
          label: 'name',
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

registerCollection(
  'Post',
  DataType.post,
  PostSchema(),
);


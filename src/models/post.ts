import { FromSchema } from 'json-schema-to-ts';

export const PostSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        pattern: '^[a-zA-Z_$][a-zA-Z_$0-9]*$',
        minLength: 3,
        maxLength: 50,
        unique: true,
      },
      title: {
        type: 'string',
      },
      slug: {
        type: 'string',
        pattern: '^[a-zA-Z_$][a-zA-Z_$0-9]*$',
      },
      content: {
        type: 'string',
        fieldType: 'Rich Text Editor',
        displayStyle: 'full',
      },
      image: {
        type: 'string',
        fieldType: 'Upload',
      },
    },
  } as const;
};

const ps = PostSchema();
export type PostModel = FromSchema<typeof ps>;

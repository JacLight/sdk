import { FromSchema } from 'json-schema-to-ts';

export const CommentSchema = () => {
  return {
    type: 'object',
    properties: {
      comment: {
        type: 'string',
        default: true,
      },
      user: {
        type: 'string',
        default: true,
      },
      rating: {
        type: 'number',
      },
      voteup: {
        type: 'number',
      },
      votedown: {
        type: 'number',
      },
      date: {
        type: 'number',
      },
      comments: {
        type: 'array',
        items: { type: 'object' },
        hidden: true,
      },
    },
  } as const;
};

const cos = CommentSchema();
export type CommentModel = FromSchema<typeof cos>;

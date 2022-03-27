import { FromSchema } from 'json-schema-to-ts';

export const CommentSchema = () => {
  return {
    type: 'object',
    properties: {
      comment: {
        type: 'string',
      },
      user: {
        type: 'string',
      },
      rating: {
        type: 'number',
        maximum: 5,
        minimum: 1
      },
      voteup: {
        type: 'number',
      },
      votedown: {
        type: 'number',
      },
      date: {
        type: 'string',
        format: 'date-time'
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

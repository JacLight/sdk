import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../default-schema';
import { DataType } from '../types';



export const CommentSchema = () => {
  return {
    type: 'object',
    properties: {
      title: {
        type: 'string',
        hidden: true,
        displayStyle: 'outlined',
      },
      message: {
        type: 'string',
        'x-control-variant': 'textarea',
        displayStyle: 'outlined',
        rows: 3,
      },
      rating: { //this is the rating the commenter gave to the owning object
        type: 'number',
        'x-control-variant': 'rating',
        max: 5,
        min: 1,
      },
    },
  } as const;
};



const cos = CommentSchema();
export type CommentModel = FromSchema<typeof cos>;

registerCollection(
  'Comment',
  DataType.comment,
  CommentSchema(),
);

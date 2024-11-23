// this is just a sample schema, it is not used in the code
const BaseSchema = () => {
  return {
    type: 'object',
    properties: {
      pk: { type: 'string' },
      sk: { type: 'string' },  // this is the id field, it refereed to as id or uid in the code
      name: { type: 'string' }, // this is unique name for per datatype
      data: { type: 'object' }, // this actually stores the unique data for the model - fields here are usually specify in the attributes query param
      datatype: { type: 'string' }, // this is mapped to a collection in mongodb, items with the sample datatype are stored in the same collection
      workflow: { type: 'object' },
      post: {
        type: 'object',
        properties: {
          title: {
            type: 'string',
            hidden: true,
          },
          summary: {
            type: 'string',
            hidden: true,
            'x-control-variant': 'textarea',
          },
          allowShare: {
            type: 'boolean',
            default: true,
          },
          allowComment: {
            type: 'boolean',
            default: true,
          },
          allowRating: {
            type: 'boolean',
            default: true,
          },
          showRelated: {
            type: 'boolean',
            default: true,
          },
          publishStart: {
            type: 'string',
            format: 'date-time',
          },
          publishEnd: {
            type: 'string',
            format: 'date-time',
          },
          categories: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
          tags: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
        },
      },
      style: { type: 'object' },
      version: { type: 'number' },
      createdate: { type: 'string', format: 'date-time' },
      modifydate: { type: 'string', format: 'date-time' },
      author: { type: 'string' },
      subschema: { type: 'string' },
      requiredRole: { type: 'object' },
      comments: { type: 'array' },
      shares: { type: 'number' },
      likes: { type: 'number' },
      dislikes: { type: 'number' },
      averageRating: { type: 'number' },
      ratingCount: { type: 'number' },
    },
  } as const
}

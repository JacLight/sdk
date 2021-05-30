// types = object | array | string | number | integer | boolean | null
// object -> properties | key value pair - type |minProperties |maxProperties| patternProperties | propertyNames -> pattern
// object -> properties -> key value pair - type
// array -> items -> values | items | 'minItems','maxItems', uniqueItems,
// array -> items -> type
// string | number | integer --> property -- type, description, enum [list of predefined values can be object], pattern, maximum, 'minLength', 'maxLength', 'minimum',  'multipleOf (10 -> 0, 10, 20, ...', 'minItems',  'maxItems', 'exclusiveMaximum', 'exclusiveMinimum', 'not',
//string | number | integer --> property- format ->  uuid, regex, 'email','hostname','phone', 'ipv4', 'ipv6','date-time','time','date',
// addDisplayType  -- Password | TextArea, Slider, Toggle, CheckBox, Radio, Combo  etc
// string - > "contentMediaType": "text/html | "image/png" |  "contentEncoding": "base64",
// validatiaon -> 'dependencies',  'allOf',  'anyOf',  'oneOf', 'ifthen', 'ifelsethen',

export const JSONHeader = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  $schemas: 'http://json-schema.org/schema#',
  $id: 'http://websitemint.com/collection_name.schema.json',
  title: 'collection_name',
  description: 'A collectionname in the catalog',
  type: 'object',
  properties: {
    productId: {
      description: 'The unique identifier for a product',
      type: 'integer',
    },
    warehouseLocation: {
      description: 'Coordinates of the warehouse where the product is located.',
      $ref: 'https://example.com/geographical-location.schema.json',
    },
    friendlist: {
      type: 'array',
      items: { $ref: '#/definitions/person' }, //"$ref": "#myperson"
      default: ['James', 'John'],
    },
    credit_card: { type: 'number' },
    billing_address: { type: 'string' },
    residential: {
      $ref: '#/definitions/address', //"$ref": "#myaddress"
    },
    business: {
      $ref: '#/definitions/address',
    },
    oldyoung: {
      type: 'number',
      oneOf: [{ multipleOf: 5 }, { multipleOf: 3 }],
    },
    anythingbutstring: {
      not: { type: 'string' },
    },
    country: {
      enum: ['United States of America', 'Canada'],
    },
    if: {
      properties: { country: { const: 'United States of America' } },
    },
    then: {
      properties: { postal_code: { pattern: '[0-9]{5}(-[0-9]{4})?' } },
    },
    else: {
      properties: {
        postal_code: { pattern: '[A-Z][0-9][A-Z] [0-9][A-Z][0-9]' },
      },
    },
  },
  required: ['productId'],
  dependencies: {
    credit_card: ['billing_address'],
    billing_address: ['credit_card'],
  },
  dependencies2: {
    credit_card: {
      properties: {
        billing_address: { type: 'string' },
      },
      required: ['billing_address'],
    },
  },
  definitions: {
    address: {
      $id: '#myaddress',
      type: 'object',
      properties: {
        street_address: { type: 'string' },
        city: { type: 'string' },
        state: { type: 'string' },
      },
      required: ['street_address', 'city', 'state'],
    },
    person: {
      $id: '#myperson',
      type: 'object',
      properties: {
        firstname: 'string',
        lastname: 'string',
        status: 'string',
      },
    },
  },
  allOf: [
    { $ref: '#/definitions/address' },
    {
      properties: {
        type: { enum: ['residential', 'business'] },
      },
    },
  ],
  anyOf: [{ type: 'string' }, { type: 'number' }],
  oneOf: [
    { type: 'number', multipleOf: 5 },
    { type: 'number', multipleOf: 3 },
  ],
};

//format date, date-time, uri, email, hostname, ipv4, ipv6, regex.
//formatMaximum / formatMinimum and formatExclusiveMaximum / formatExclusiveMinimum
//arrays maxItems / minItems
//objects maxProperties / minProperties
export const schema_master = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      pattern: '^[a-zA-Z_$][a-zA-Z_$0-9]*$',
      minLength: 3,
      maxLength: 100,
    },
    title: {
      type: 'string',
      //errorMessage: 'Some mesage',
    },
    description: {
      type: 'string',
    },
    format: {
      type: 'string',
      value: '',
    },
    displayStyle: {
      type: 'string',
      value: '',
    },
    value: {
      type: 'string',
      //hidden: true,
    },
    options: {
      type: 'string',
      //hidden: true,
    },
    repeatable: {
      type: 'boolean',
    },
    placeholder: {
      type: 'string',
    },
    css: {
      type: 'string',
    },
    styleClass: {
      type: 'string',
    },
    unique: {
      type: 'boolean',
    },
    indexable: {
      type: 'boolean',
    },
    required: {
      type: 'boolean',
    },
    localize: {
      type: 'boolean',
    },
    selectMultiple: {
      type: 'boolean',
      //hidden: true,
    },
    datasource: {
      type: 'object',
      description:
        'collection name to use to prepopulate the Enum Fields or AutoComplete Field',
      properties: {
        target: {
          type: 'string',
          enum: ['', 'enum', 'placeholder', 'autocomplete'],
        },
        field: {
          type: 'string',
        },
      },
    },
    validations: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            enum: [
              'minLength',
              'maxLength',
              'pattern',
              'maximum',
              'minimum',
              'multipleOf',
              'minItems',
              'maxItems',
              'exclusiveMaximum',
              'exclusiveMinimum',
              'not',
            ],
          },
          value: {
            type: 'string',
          },
        },
      },
    },
    rules: {
      type: 'array',
      description: 'Set up linked fields here',
      items: {
        type: 'object',
        properties: {
          source: {
            type: 'string',
            enum: ['Title', 'Description', 'Age'],
          },
          Action: {
            type: 'string',
            enum: [
              'minItems',
              'maxItems',
              'dependencies',
              'allOf',
              'anyOf',
              'oneOf',
              'ifthen',
              'ifelsethen',
            ],
          },
          target: {
            type: 'string',
            enum: ['Title', 'Description', 'Age'],
          },
        },
      },
    },
  },
  required: ['name'],
};

export const person_master = {
  type: 'object',
  title: 'Personal Information',
  properties: {
    firstName: {
      type: 'string',
      default: 'Imole',
    },
    lastName: {
      type: 'string',
    },
    email: {
      type: 'number',
      format: 'email',
    },
    age: {
      type: 'number',
    },
    credit_card: { type: 'number' },
    billing_address: { type: 'string' },
    dependencies: {
      credit_card: ['billing_address'],
    },
    files: {
      type: 'string',
      contentMediaType: 'text/html',
      contentEncoding: 'base64',
      contentMediaTypex: 'image/png',
    },
    dependenciesSchema: {
      credit_card: {
        properties: {
          billing_address: { type: 'string' },
        },
        required: ['billing_address'],
      },
    },
    otherNames: {
      type: 'array',
      uniqueItems: true,
      items: {
        type: 'string',
      },
      contains: {
        type: 'number',
      },
      minItems: 2,
      maxItems: 3,
      additionalItems: { type: 'number' },
    },
    colleges: {
      type: 'array',
      items: [
        {
          type: 'string',
        },
        {
          type: 'number',
        },
      ],
      additionalItems: false,
    },
    cars: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          make: {
            type: 'string',
            enum: ['BMW', 'Toyota', 'Benz'],
          },
          year: {
            type: 'string',
          },
        },
      },
    },
  },
  required: ['name'],
};
export const uischema_master = {
  type: 'VerticalLayout',
  elements: [
    {
      type: 'HorizontalLayout',
      elements: [
        {
          type: 'Control',
          label: 'Type',
          scope: '#/properties/type',
        },
        {
          type: 'Control',
          label: 'Name',
          className: 'sdf',
          scope: '#/properties/name',
        },
      ],
    },
    {
      type: 'HorizontalLayout',
      elements: [
        {
          type: 'Control',
          label: 'Title',
          scope: '#/properties/title',
        },
      ],
    },
    {
      type: 'HorizontalLayout',
      elements: [
        {
          type: 'Control',
          label: 'Place Holder',
          scope: '#/properties/placeholder',
        },
        {
          type: 'Control',
          scope: '#/properties/tip',
        },
      ],
    },
    {
      type: 'HorizontalLayout',
      elements: [
        {
          type: 'Control',
          label: 'Predifined Values',
          scope: '#/properties/values',
        },
        {
          type: 'Control',
          scope: '#/properties/options',
        },
      ],
    },
    {
      type: 'HorizontalLayout',
      elements: [
        {
          type: 'Control',
          scope: '#/properties/displayStyle',
        },
        {
          type: 'Control',
          scope: '#/properties/styleClass',
        },
      ],
    },
    {
      type: 'HorizontalLayout',
      elements: [
        {
          type: 'Control',
          scope: '#/properties/css',
        },
      ],
    },
    {
      type: 'HorizontalLayout',
      elements: [
        {
          type: 'Control',
          scope: '#/properties/required',
        },
        {
          type: 'Control',
          scope: '#/properties/showTitle',
        },
      ],
    },
    {
      type: 'HorizontalLayout',
      elements: [
        {
          type: 'Control',
          scope: '#/properties/localize',
        },
        {
          type: 'Control',
          scope: '#/properties/allowMultiple',
        },
      ],
    },
    {
      type: 'HorizontalLayout',
      elements: [
        {
          type: 'Control',
          scope: '#/properties/indexable',
        },
        {
          type: 'Control',
          scope: '#/properties/repeatable',
        },
      ],
    },
    {
      type: 'VerticalLayout',
      elements: [
        {
          type: 'Control',
          scope: '#/properties/validation',
          options: {
            showSortButtons: false,
          },
        },
      ],
    },
    {
      type: 'VerticalLayout',
      elements: [
        {
          type: 'Control',
          scope: '#/properties/rule',
          options: {
            showSortButtons: false,
          },
        },
      ],
    },
  ],
};

export const oneOf = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  type: 'object',
  title: 'My schema',
  additionalProperties: true,
  properties: {
    AddressLine1: { type: 'string' },
    AddressLine2: { type: 'string' },
    City: { type: 'string' },
  },
  required: ['AddressLine1'],
  oneOf: [
    {
      type: 'object',
      properties: {
        State: { type: 'string' },
        ZipCode: { type: 'string' },
      },
      required: ['ZipCode'],
    },
    {
      type: 'object',
      properties: {
        County: { type: 'string' },
        PostCode: { type: 'string' },
      },
      required: ['PostCode'],
    },
  ],
};

import { FileInfoSchema } from '../file-info';
import { registerCollection } from '../../default-schema';
import { ControlType, DataType } from '../../types';
import { FromSchema } from 'json-schema-to-ts';

export const SignedDocumentSchema = () => {
  return {
    title: "Signable Document",
    description: "Information about a document that needs to be signed",
    type: "object",
    properties: {
      name: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        unique: true,
        transform: 'uri',
        group: 'name'
      },
      accessCode: {
        type: 'string',
        group: 'name'
      },
      title: {
        type: 'string',
      },
      description: {
        type: "string",
        'x-control-variant': 'textarea',
      },
      files: {
        type: 'array',
        collapsible: true,
        allowDelete: true,
        'x-control': ControlType.file,
        items: {
          type: 'object',
          properties: {
            ...FileInfoSchema().properties,
            remark: { type: 'string', 'x-control-variant': 'textarea' },
          },
        }
      },
      signatureFields: {
        type: "array",
        collapsible: true,
        showIndex: true,
        description: "List of places in the document where signatures are required",
        items: {
          type: "object",
          collapsible: true,
          properties: {
            signatureId: {
              type: "string",
              group: 'status',
            },
            status: {
              type: "string",
              enum: ["pending", "completed"],
              group: 'status',
            },
            page: {
              type: "number",
              group: 'sign-spot',
            },
            x: {
              type: "number",
              group: 'sign-spot',
            },
            y: {
              type: "number",
              group: 'sign-spot',
            },
            type: {
              type: "string",
              enum: ["initial", "full"],
              group: 'type'
            },
            assignedTo: {
              type: "string",
              group: 'type'
            },
            instructions: {
              type: "string",
              'x-control-variant': 'textarea',
              rows: 2,
              displayStyle: 'outlined',
            },
          },
          required: ["signatureId", "page", 'x', 'y', "type", "assignedTo", "instructions", "status"]
        }
      },
      participants: {
        type: 'array',
        collapsible: true,
        showIndex: true,
        dataSource: {
          source: 'collection',
          collection: DataType.sf_product,
        },
        'x-control': ControlType.table,
        operations: ['pick', 'add', 'remove'],
        items: {
          type: 'object',
          showIndex: true,
          properties: {
            sk: { type: 'string', hideIn: ['table'] },
            name: { type: 'string' },
            email: { type: 'string' },
            expiry: { type: 'string', styleClass: 'w-20' },
            accessCode: { type: 'string', styleClass: 'w-20' },
            role: { type: 'string', styleClass: 'w-20' },
          },
          required: ["participantId", "email", "role"]
        },
      },

    },
    required: ["documentId", "documentUrl", "participants", "signatureFields"]
  } as const;
};

const dd = SignedDocumentSchema();
export type SignedDocumentModel = FromSchema<typeof dd>;

registerCollection(
  'CrmForm',
  DataType.signed_document,
  SignedDocumentSchema(),
);

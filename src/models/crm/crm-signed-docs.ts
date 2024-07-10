import { FileInfoSchema } from '@models/fileinfo';
import { registerCollection } from '../../defaultschema';
import { DataType } from '../../types';
import { FromSchema } from 'json-schema-to-ts';

export const SignedDocumentSchema = () => {
  return {
    title: "Signable Document",
    description: "Schema for storing information about a document that needs to be signed",
    type: "object",
    properties: {
      name: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        description: "Unique identifier for the document",
        unique: true,
        transform: 'uri',
        group: 'name'
      },
      title: {
        type: 'string',
        group: 'name',
      },
      description: {
        type: "string",
        description: "URL where the document is stored"
      },
      file: FileInfoSchema(),
      participants: {
        type: 'array',
        collapsible: true,
        showIndex: true,
        description: "List of participants who need to sign the document",
        dataSource: {
          source: 'collection',
          collection: DataType.sf_product,
        },
        'x-control-variant': 'picker',
        displayStyle: 'table',
        items: {
          type: 'object',
          showIndex: true,
          properties: {
            sk: { type: 'string', hideInTable: true },
            name: { type: 'string' },
            role: { type: 'string', },
            email: { type: 'string', readOnly: true },
          },
          required: ["participantId", "email", "role"]
        },
      },
      signatureFields: {
        type: "array",
        collapsible: true,
        showIndex: true,
        description: "List of places in the document where signatures are required",
        items: {
          type: "object",
          properties: {
            signatureId: {
              type: "string",
              description: "Unique identifier for the signature field"
            },
            page: {
              type: "integer",
              description: "Page number where the signature is required"
            },
            coordinates: {
              type: "object",
              properties: {
                x: {
                  type: "integer",
                  description: "X coordinate on the page for the signature"
                },
                y: {
                  type: "integer",
                  description: "Y coordinate on the page for the signature"
                }
              },
              required: ["x", "y"]
            },
            type: {
              type: "string",
              enum: ["initial", "full"],
              description: "Type of signature required (initial or full)"
            },
            assignedTo: {
              type: "string",
              description: "Participant ID of the person who needs to sign"
            },
            instructions: {
              type: "string",
              description: "Instructions for signing"
            },
            status: {
              type: "string",
              enum: ["pending", "completed"],
              description: "Current status of the signature"
            }
          },
          required: ["signatureId", "page", "coordinates", "type", "assignedTo", "instructions", "status"]
        }
      }
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
  null,
  null,
  false,
  false
);

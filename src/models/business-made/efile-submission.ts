import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType } from '../../types';

/**
 * One transmission to a government e-file system: an IRIS 1099 batch, a TIN
 * Matching request, an SSA EFW2 W-2 file or a MeF 94x return. The record is the
 * status ledger for that transmission — what was sent (payload file), what came
 * back (acknowledgement file, receipt id, errors) and every status change.
 *
 * `sourceIds` point back at the records the payload was built from (e.g. the
 * bm_tax_form sks of the 1099-NECs in the batch).
 */
export const EfileSubmissionSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        transform: ['prefix::ef-', 'random-string::6', 'uppercase'],
        group: 'name',
      },
      agency: {
        type: 'string',
        enum: ['irs', 'ssa'],
        title: 'Agency',
        group: 'filing',
      },
      program: {
        type: 'string',
        enum: ['iris', 'mef', 'tinm', 'efw2'],
        title: 'Program',
        description: 'iris = IRS Information Returns Intake System (1099s); mef = Modernized e-File (94x); tinm = TIN Matching; efw2 = SSA W-2 file.',
        group: 'filing',
      },
      formType: {
        type: 'string',
        title: 'Form',
        description: "e.g. '1099-NEC', 'W-2', '941'",
        group: 'filing',
      },
      taxYear: {
        type: 'number',
        title: 'Tax year',
        group: 'filing',
      },
      env: {
        type: 'string',
        enum: ['test', 'prod', 'file'],
        title: 'Environment',
        description: 'test = the agency test system (ATS/AATS); prod = live filing; file = a file produced for manual upload.',
        group: 'filing',
      },
      status: {
        type: 'string',
        enum: ['draft', 'ready', 'submitted', 'accepted', 'partially_accepted', 'rejected', 'error'],
        default: 'draft',
        title: 'Status',
        group: 'status',
      },
      receiptId: {
        type: 'string',
        title: 'Receipt ID',
        description: 'The agency receipt id returned on intake.',
        group: 'agency-ids',
      },
      utid: {
        type: 'string',
        title: 'UTID',
        description: 'Unique Transmission Identifier sent in the transmission manifest.',
        group: 'agency-ids',
      },
      submissionId: {
        type: 'string',
        title: 'Submission ID',
        group: 'agency-ids',
      },
      payloadFileUrl: {
        type: 'string',
        title: 'Payload file',
        description: 'Authenticated download route for the payload (the file itself is private: it carries full TINs).',
        group: 'files',
      },
      payloadFilePath: {
        type: 'string',
        description: 'Private storage key of the payload. Server-only.',
        hidden: true,
        group: 'files',
      },
      ackFileUrl: {
        type: 'string',
        title: 'Acknowledgement file',
        description: 'Authenticated download route for the acknowledgement.',
        group: 'files',
      },
      ackFilePath: {
        type: 'string',
        description: 'Private storage key of the acknowledgement. Server-only.',
        hidden: true,
        group: 'files',
      },
      recordCount: {
        type: 'number',
        title: 'Records',
        group: 'files',
      },
      errors: {
        type: 'array',
        collapsible: true,
        items: {
          type: 'object',
          properties: {
            code: { type: 'string' },
            message: { type: 'string' },
            recordRef: { type: 'string', description: 'Record the error is about (e.g. RecordId or a source sk).' },
          },
        },
      },
      sourceIds: {
        type: 'array',
        items: { type: 'string' },
        description: 'Source record sks the payload was built from (e.g. bm_tax_form).',
      },
      submittedAt: {
        type: 'string',
        format: 'date-time',
        group: 'status',
      },
      lastCheckedAt: {
        type: 'string',
        format: 'date-time',
        group: 'status',
      },
      statusHistory: {
        type: 'array',
        collapsible: true,
        items: {
          type: 'object',
          properties: {
            status: { type: 'string' },
            at: { type: 'string', format: 'date-time' },
            note: { type: 'string' },
          },
        },
      },
    },
    required: ['agency', 'program', 'formType', 'taxYear', 'env'],
  } as const;
};

const es = EfileSubmissionSchema();
export type EfileSubmissionModel = FromSchema<typeof es>;

registerCollection('E-file Submission', DataType.bm_efile_submission, EfileSubmissionSchema());

/**
 * The IRS API connection settings for one program, as the settings screen edits
 * them. Not a collection: the record is an integration config (DataType.config,
 * provider IrsEfileProvider), so it lives with the org's other integration
 * credentials. The private key is write-only — reads return `hasPrivateKey` and
 * the public key thumbprint instead.
 */
export const EfileConnectionSchema = () => {
  return {
    type: 'object',
    properties: {
      program: {
        type: 'string',
        enum: ['iris', 'tinm', 'eservices'],
        title: 'Program',
      },
      env: {
        type: 'string',
        enum: ['test', 'prod'],
        default: 'test',
        title: 'Environment',
        description: 'test = the IRS test system (api.alt.www4.irs.gov); prod = live. prod needs Allow production.',
      },
      allowProduction: {
        type: 'boolean',
        default: false,
        title: 'Allow production',
        description: 'Off until the owner deliberately turns on live filing for this connection. While off, production requests are refused.',
      },
      clientId: { type: 'string', title: 'API Client ID', description: 'From the IRS API Client ID Application summary.' },
      userId: { type: 'string', title: 'User ID', description: 'Your full e-Services User ID from the A2A Setup Complete page, e.g. dasmith-345870.' },
      kid: { type: 'string', title: 'Key ID (kid)', description: 'The kid in the JWK file registered on the API client. Case sensitive.' },
      tcc: { type: 'string', title: 'TCC', description: 'Transmitter Control Code for this program.' },
      privateKeyPem: { type: 'string', format: 'password', title: 'Private key (PEM)', description: 'Write-only.' },
      softwareId: { type: 'string', title: 'IRIS Software ID', description: 'Assigned by the IRS per software package and tax year on the IRIS TCC application (Software Developer role). IRIS only.' },
      transmitter: {
        type: 'object',
        title: 'Transmitter',
        description: 'The TCC holder, exactly as on the IRIS TCC application. Blank = the payer transmits its own returns. IRIS only.',
        properties: {
          name: { type: 'string', title: 'Legal name' },
          ein: { type: 'string', title: 'EIN', description: '##-#######' },
          address: {
            type: 'object',
            title: 'Address',
            properties: {
              street1: { type: 'string', title: 'Street' },
              street2: { type: 'string', title: 'Suite' },
              city: { type: 'string', title: 'City' },
              state: { type: 'string', title: 'State' },
              zip: { type: 'string', title: 'ZIP' },
            },
          },
          contactName: { type: 'string', title: 'Contact name' },
          contactPhone: { type: 'string', title: 'Contact phone' },
          contactEmail: { type: 'string', title: 'Contact email' },
        },
      },
    },
  } as const;
};

const ec = EfileConnectionSchema();
export type EfileConnectionModel = FromSchema<typeof ec>;

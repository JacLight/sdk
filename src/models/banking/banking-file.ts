import { FromSchema } from 'json-schema-to-ts';
import { registerBankingCollection as registerCollection } from './_banking-register';
import { DataType } from '../../types';
import { bankingRef, cents } from './_banking-fields';

/**
 * A file of payments for the sponsor bank — today an ACH (NACHA) file cut at an ACH cutoff.
 * Kept exactly as it was handed over: it is the record of what the bank was asked to do, and
 * its trace numbers are how returns find their way back to a transaction.
 */
export const BankingFileSchema = () => {
  return {
    type: 'object',
    properties: {
      rail: { type: 'string', enum: ['ach'], default: 'ach' },
      batchNumber: { type: 'integer', readOnly: true, description: 'Counts up per bank; the sponsor uses it with the traces to spot a duplicate.' },
      secCode: { type: 'string', enum: ['PPD', 'CCD', 'WEB', 'TEL'] },
      effectiveDate: { type: 'string', format: 'date' },
      status: {
        type: 'string',
        enum: ['built', 'sent', 'accepted', 'rejected'],
        default: 'built',
        description: 'built: the file exists; nobody has handed it to the sponsor bank yet. sent: it is with the bank.',
      },
      transactions: { type: 'array', items: bankingRef(DataType.banking_transaction, 'reference') },
      entryCount: { type: 'integer' },
      credits: cents('Total sent.'),
      debits: cents('Total pulled.'),
      lastTrace: { type: 'integer', readOnly: true, description: 'The highest trace sequence used; the next file numbers on from here.' },
      content: { type: 'string', readOnly: true, description: 'The file exactly as generated.' },
      checksum: { type: 'string', readOnly: true },
      sentAt: { type: 'string', format: 'date-time' },
      sentBy: { type: 'string' },
      note: { type: 'string' },
    },
  } as const;
};

const s = BankingFileSchema();
export type BankingFileModel = FromSchema<typeof s>;

registerCollection('Banking File', DataType.banking_file, BankingFileSchema());

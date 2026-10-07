import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType } from '../../types';

/** Where a piece of a person's data came from. */
export const RAW_CONTACT_SOURCES = ['pdl', 'diffbot', 'maps', 'linkedin', 'spider', 'import', 'form', 'facebook', 'manual', 'lead'] as const;

/**
 * Where a person's data came from, kept on the raw contact and on the contact
 * (customer) it merges into: every arrival in `sources`, every value of a
 * field in `values`. The top-level fields hold the most trusted value.
 */
export const ContactSourcesFields = () =>
  ({
    sources: {
      type: 'array',
      title: 'Sources',
      description: 'Every time data about this person arrived, newest last.',
      readOnly: true,
      group: 'sources',
      items: {
        type: 'object',
        properties: {
          source: { type: 'string', enum: [...RAW_CONTACT_SOURCES] },
          sourceId: { type: 'string', description: 'The id at the source (PDL id, place id, lead sk…)' },
          ref: { type: 'string', description: 'What brought it: datatype/sk of the import job, form, search run or lead' },
          at: { type: 'string', format: 'date-time' },
          by: { type: 'string' },
          fields: { type: 'array', items: { type: 'string' }, description: 'The fields this arrival supplied' },
        },
      },
    },
    values: {
      type: 'object',
      title: 'All values',
      description: 'Every value seen for a field, with its source. The top-level field holds the most trusted one.',
      readOnly: true,
      hidden: true,
      additionalProperties: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            value: {},
            source: { type: 'string' },
            ref: { type: 'string' },
            at: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
  }) as const;

/**
 * A person (or business) found by prospecting — People Data Labs, Diffbot,
 * Google Maps, LinkedIn (captured by the Lead Search Chrome plugin) — waiting to be enriched and quality-checked. Staging only: a
 * repeat find merges into the same record (matched on `sourceIds`, email,
 * company domain + name). One that passes is merged into the org's contacts
 * (customer: enrich and merge if the person is known, else created) and gets
 * leads there; `contactId` then points at that contact. Nothing is thrown away
 * on merge: `sources` lists every arrival and `values` every value of a field.
 */
export const RawContactSchema = () => {
  return {
    type: 'object',
    properties: {
      kind: { type: 'string', enum: ['person', 'business'], default: 'person', group: 'identity' },
      name: { type: 'string', title: 'Name', group: 'identity' },
      firstName: { type: 'string', title: 'First name', group: 'identity' },
      lastName: { type: 'string', title: 'Last name', group: 'identity' },
      email: { type: 'string', title: 'Email', group: 'identity' },
      phone: { type: 'string', title: 'Phone', group: 'identity' },
      title: { type: 'string', title: 'Job title', group: 'identity' },
      seniority: { type: 'string', title: 'Seniority', group: 'identity' },
      linkedinUrl: { type: 'string', title: 'LinkedIn', group: 'identity' },
      location: {
        type: 'object',
        group: 'identity',
        properties: { city: { type: 'string' }, region: { type: 'string' }, country: { type: 'string' } },
      },
      company: {
        type: 'object',
        title: 'Company',
        group: 'company',
        properties: {
          name: { type: 'string' },
          domain: { type: 'string' },
          website: { type: 'string' },
          industry: { type: 'string' },
          size: { type: 'string', description: 'Employee range, e.g. 11-50' },
          phone: { type: 'string' },
          address: { type: 'string' },
          location: { type: 'object', properties: { city: { type: 'string' }, region: { type: 'string' }, country: { type: 'string' } } },
          placeId: { type: 'string', description: 'Google Maps place' },
        },
      },
      contactId: { type: 'string', title: 'Contact', readOnly: true, description: 'The contact (customer) this merged into once qualified.', group: 'status' },
      status: {
        type: 'string',
        enum: ['new', 'qualified', 'review', 'rejected', 'promoted'],
        default: 'new',
        group: 'status',
      },
      tags: { type: 'array', items: { type: 'string' }, group: 'status' },
      /** Ids at the engines and places it was found (`pdl:…`, `maps:<placeId>`): how a repeat find is recognised. */
      sourceIds: { type: 'array', items: { type: 'string' }, readOnly: true, hidden: true },
      ...ContactSourcesFields(),
      enrichment: {
        type: 'object',
        description: 'What each source returned, by source (pdl, diffbot, maps, website…).',
        readOnly: true,
        hidden: true,
        additionalProperties: { type: 'object' },
      },
      classifications: {
        type: 'object',
        description: 'Answers to each criteria set, by criteria set name.',
        readOnly: true,
        hidden: true,
        additionalProperties: {
          type: 'object',
          properties: {
            status: { type: 'string', enum: ['qualified', 'review', 'rejected'] },
            answers: { type: 'object' },
            at: { type: 'string', format: 'date-time' },
            cost: { type: 'number' },
          },
        },
      },
    },
  } as const;
};

const rc = RawContactSchema();
export type RawContactModel = FromSchema<typeof rc>;

registerCollection('Raw contact', DataType.raw_contact, RawContactSchema());

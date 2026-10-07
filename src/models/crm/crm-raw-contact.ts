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
        description: 'The AI Classifier\'s answers to each rule set, by the rule set\'s id.',
        readOnly: true,
        hidden: true,
        additionalProperties: {
          type: 'object',
          properties: {
            name: { type: 'string', description: 'The rule set\'s name when it ran' },
            status: { type: 'string', enum: ['qualified', 'review', 'rejected'] },
            score: { type: 'number' },
            answers: { type: 'object' },
            at: { type: 'string', format: 'date-time' },
            cost: { type: 'number' },
          },
        },
      },
      score: { type: 'number', title: 'AI score', readOnly: true, description: 'The latest ranking\'s score (0–100).', group: 'status' },
      lists: { type: 'array', items: { type: 'string' }, title: 'Lists', readOnly: true, description: 'The saved lists (prospect_list ids) this contact is in.', group: 'status' },
      listAdded: { type: 'object', readOnly: true, hidden: true, description: 'When it was added to each list (list id → date) — "new since the last run".', additionalProperties: { type: 'string' } },
      needs: {
        type: 'object',
        title: 'Found for you',
        readOnly: true,
        description: 'What the person asked to have filled, in their words, with the value and where it came from.',
        additionalProperties: { type: 'object', properties: { label: { type: 'string', description: 'In the person\'s words' }, value: {}, source: { type: 'string' }, ref: { type: 'string' }, at: { type: 'string', format: 'date-time' } } },
      },
      missing: { type: 'array', items: { type: 'string' }, title: 'Still missing', readOnly: true, description: 'What was asked for and not found yet.' },
      lookups: {
        type: 'array',
        title: 'Lookups',
        readOnly: true,
        hidden: true,
        description: 'Every look-up tried, newest last: the tool, what it looked up by, and how it came out.',
        items: {
          type: 'object',
          properties: {
            tool: { type: 'string' },
            by: { type: 'array', items: { type: 'string' } },
            outcome: { type: 'string', enum: ['matched', 'candidate', 'not_found', 'failed', 'skipped'] },
            reason: { type: 'string' },
            filled: { type: 'array', items: { type: 'string' } },
            ref: { type: 'string' },
            at: { type: 'string', format: 'date-time' },
          },
        },
      },
      candidates: {
        type: 'array',
        readOnly: true,
        hidden: true,
        description: 'Answers a look-up found that did not pass its match rule — kept, not merged.',
        items: { type: 'object', properties: { tool: { type: 'string' }, values: { type: 'object' }, at: { type: 'string', format: 'date-time' } } },
      },
    },
  } as const;
};

const rc = RawContactSchema();
export type RawContactModel = FromSchema<typeof rc>;

registerCollection('Raw contact', DataType.raw_contact, RawContactSchema());

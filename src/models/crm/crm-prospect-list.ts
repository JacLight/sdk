import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType } from '../../types';

/** The Lead Finder's building blocks. Each is one server action with parameters, run on a selection of found contacts. */
export const PROSPECT_BLOCKS = ['bring_in', 'look_up', 'find_people', 'rank', 'move', 'reach_out'] as const;

/**
 * A saved Lead Finder list: its members (found contacts carry the list's id in
 * `lists`) and the steps that built it, so it can be opened again later and run
 * again — what was found before is recognised, new matches are added and marked
 * as new since the last run.
 *
 * A step is a block with its parameters, e.g.
 *   { block: 'bring_in', params: { from: 'people', filters: { titles: ['owner'] }, limit: 25 } }
 *   { block: 'look_up', params: { tool: 'map', by: ['company.name', 'location.city'], fill: ['phone', 'address', 'website'], match: ['name'] } }
 *   { block: 'find_people', params: { titles: ['cto', 'procurement'], perCompany: 2 } }
 *   { block: 'rank', params: { criteriaId: '<prospect_criteria sk>' } }
 * Each step runs on what the step before it touched, unless it names its own selection.
 */
export const ProspectListSchema = () => {
  return {
    type: 'object',
    properties: {
      name: { type: 'string', title: 'Name', minLength: 1 },
      description: { type: 'string', title: 'What this list is for', 'x-control-variant': 'textarea' },
      steps: {
        type: 'array',
        title: 'Steps',
        items: {
          type: 'object',
          properties: {
            block: { type: 'string', title: 'Block', enum: [...PROSPECT_BLOCKS] },
            label: { type: 'string', title: 'Label' },
            params: { type: 'object', title: 'Parameters', additionalProperties: true },
            selection: { type: 'object', title: 'Run on', description: 'Optional: ids, refs, status, missing, listId — otherwise what the step before touched.', additionalProperties: true },
          },
          required: ['block'],
        },
      },
      runs: {
        type: 'array',
        title: 'Runs',
        readOnly: true,
        description: 'Newest first; the last 20 are kept.',
        items: {
          type: 'object',
          properties: {
            at: { type: 'string', format: 'date-time' },
            by: { type: 'string' },
            jobId: { type: 'string', description: 'The background job that ran it' },
            status: { type: 'string', description: 'done, failed or cancelled' },
            added: { type: 'number', description: 'New to the list in this run' },
            total: { type: 'number', description: 'Members after the run' },
            cost: { type: 'number' },
            steps: { type: 'array', items: { type: 'object', additionalProperties: true } },
            error: { type: 'string' },
          },
        },
      },
      lastRunAt: { type: 'string', format: 'date-time', readOnly: true },
      lastJobId: { type: 'string', readOnly: true, description: 'The latest run (a job) — running until it shows in runs.' },
      count: { type: 'number', title: 'Members', readOnly: true },
      status: { type: 'string', enum: ['active', 'archived'], default: 'active' },
    },
    required: ['name'],
  } as const;
};

const pl = ProspectListSchema();
export type ProspectListModel = FromSchema<typeof pl>;

registerCollection('Prospect list', DataType.prospect_list, ProspectListSchema());

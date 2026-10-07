import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType } from '../../types';

/** What a Blueprint maps: the sales, support or engagement journey. */
export const BLUEPRINT_JOURNEYS = ['sales', 'support', 'engagement'] as const;
/** Where a block (or wire) stands: still a design, built (a real record), changed since it was built, or failed to build. */
export const BLUEPRINT_STATES = ['design', 'built', 'changed', 'failed'] as const;

/**
 * A CRM Blueprint: one canvas of a customer journey. Each block is a part of the
 * business (a form, a pipeline, a follow-up, a broadcast…) delivered by the app
 * that already does it; while it is a design nothing in the business changes.
 * Building it — the AI carrying out each block with that app's own actions —
 * creates the real records and links each block to the record it became
 * (`resource`), so the canvas then shows the live system and its numbers.
 *
 * The block types (what each is, its app, its record, its ports) are the
 * server's catalogue (`GET crm/blueprints/catalogue`).
 */
export const BlueprintSchema = () => {
  return {
    type: 'object',
    properties: {
      name: { type: 'string', title: 'Name', minLength: 1 },
      description: { type: 'string', title: 'What this blueprint is for', 'x-control-variant': 'textarea' },
      journey: { type: 'string', title: 'Journey', enum: [...BLUEPRINT_JOURNEYS], default: 'sales' },
      template: { type: 'boolean', title: 'A starter others can begin from', default: false },
      blocks: {
        type: 'array',
        title: 'Blocks',
        items: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            type: { type: 'string', description: 'A catalogue block type, or "blank" (an instruction the AI turns into a block)' },
            label: { type: 'string' },
            instruction: { type: 'string', description: 'What this block should do, in the person\'s words — what the AI builds from' },
            settings: { type: 'object', additionalProperties: true, description: 'The design: what the block will be, before it is built' },
            position: { type: 'object', properties: { x: { type: 'number' }, y: { type: 'number' } } },
            resource: { type: 'object', properties: { datatype: { type: 'string' }, id: { type: 'string' } }, description: 'The real record it became' },
            state: { type: 'string', enum: [...BLUEPRINT_STATES], default: 'design' },
            note: { type: 'string', description: 'Why it failed, or what a person must do (e.g. connect the Facebook page)' },
          },
          required: ['id', 'type'],
        },
      },
      wires: {
        type: 'array',
        title: 'Wires',
        items: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            from: { type: 'object', properties: { block: { type: 'string' }, port: { type: 'string' } } },
            to: { type: 'object', properties: { block: { type: 'string' }, port: { type: 'string' } } },
            label: { type: 'string' },
            resource: { type: 'object', properties: { datatype: { type: 'string' }, id: { type: 'string' } }, description: 'The real record that makes the link, when it takes one (e.g. the automation that turns form answers into leads)' },
            state: { type: 'string', enum: [...BLUEPRINT_STATES], default: 'design' },
            note: { type: 'string' },
          },
          required: ['id', 'from', 'to'],
        },
      },
      builtAt: { type: 'string', format: 'date-time', readOnly: true },
    },
    required: ['name'],
  } as const;
};

const bp = BlueprintSchema();
export type BlueprintModel = FromSchema<typeof bp>;

registerCollection('Blueprint', DataType.blueprint, BlueprintSchema());

import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType } from '../../types';

/**
 * The questions a found contact is checked against, written by the org — "is
 * this really a marketing agency?", "does the job title fit?", "how good a
 * fit?" — and the bar each must clear. A classifier (Jev) answers each with a
 * probability; all clear the qualify bar → qualified, any under the review bar
 * → rejected, otherwise review.
 */
export const ProspectCriteriaSchema = () => {
  return {
    type: 'object',
    properties: {
      name: { type: 'string', title: 'Name', description: 'e.g. Marketing agencies, US, 11–50' },
      description: { type: 'string', title: 'Who this is for', 'x-control-variant': 'textarea' },
      readWebsite: { type: 'boolean', title: 'Read the company website first', default: true, description: 'The website text is what most questions about the business are answered from.' },
      questions: {
        type: 'array',
        title: 'Questions',
        items: {
          type: 'object',
          properties: {
            key: { type: 'string', title: 'Short name', description: 'e.g. is_agency' },
            type: { type: 'string', title: 'Kind', enum: ['yes_no', 'pick_one', 'score'], default: 'yes_no' },
            question: { type: 'string', title: 'Question', description: 'e.g. Is this company a marketing agency (SEO, paid ads, social, web design)?' },
            yesMeans: { type: 'string', title: 'Yes means', description: 'Yes/no only' },
            noMeans: { type: 'string', title: 'No means', description: 'Yes/no only' },
            options: {
              type: 'array',
              title: 'Options',
              description: 'Pick-one: each option and what it means. Score: the levels, lowest first.',
              items: { type: 'object', properties: { value: { type: 'string', title: 'Option' }, meaning: { type: 'string', title: 'Means' } } },
            },
            accept: { type: 'array', items: { type: 'string' }, title: 'Accepted options', description: 'Pick-one: the options that pass' },
            qualifyAt: { type: 'number', title: 'Qualify at', default: 0.8, description: 'Yes/no and pick-one: probability (0–1). Score: the level index.' },
            reviewAt: { type: 'number', title: 'Review at', default: 0.5, description: 'Below this it is rejected.' },
          },
        },
      },
      status: { type: 'string', enum: ['active', 'archived'], default: 'active' },
    },
    required: ['name'],
  } as const;
};

const pc = ProspectCriteriaSchema();
export type ProspectCriteriaModel = FromSchema<typeof pc>;

registerCollection('Prospect criteria', DataType.prospect_criteria, ProspectCriteriaSchema());

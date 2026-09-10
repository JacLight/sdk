import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType } from '../../types';

/**
 * One entry on the company calendar: a public holiday the org observes, a day
 * the business is closed, or a special day with reduced hours. Org-wide when
 * `location` is empty, otherwise for that location only (slug = location name).
 *
 * A holiday never closes a site — it is observed for leave and pay accounting
 * and the site stays open. Only `closure` days grey the rota.
 */
export const CalendarDaySchema = () => {
  return {
    type: 'object',
    properties: {
      name: { type: 'string', pattern: '^[a-zA-Z_\\-0-9]*$', transform: ['prefix::cd-', 'random-string::6', 'uppercase'], group: 'name' },
      title: { type: 'string', minLength: 1, maxLength: 120, group: 'name' },
      kind: { type: 'string', enum: ['holiday', 'closure', 'special'], default: 'holiday', group: 'name' },
      date: { type: 'string', format: 'date', description: 'First (or only) day.' },
      endDate: { type: 'string', format: 'date', description: 'Last day for a multi-day closure. Empty = one day.' },
      year: { type: 'number' },
      location: { type: 'string', description: 'Location slug. Empty = every location.' },
      observed: { type: 'boolean', default: true, description: 'Holidays only: counts as a non-working day for leave and pay.' },
      paid: { type: 'boolean', default: true, description: 'Holidays only: staff are paid for it.' },
      hours: {
        type: 'object',
        description: 'Special days only: the reduced opening hours.',
        properties: { open: { type: 'string' }, close: { type: 'string' } },
      },
      source: { type: 'string', enum: ['suggested', 'manual'], default: 'manual', description: 'suggested = proposed from the location\'s country; re-suggesting never touches manual edits.' },
      sourceId: { type: 'string', description: 'Stable id from the suggestion source so a re-run can tell what it already proposed.' },
      note: { type: 'string' },
    },
    required: ['title', 'kind', 'date'],
  } as const;
};

const cd = CalendarDaySchema();
export type CalendarDayModel = FromSchema<typeof cd>;

registerCollection('Calendar Day', DataType.bm_calendar_day, CalendarDaySchema());

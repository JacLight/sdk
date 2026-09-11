import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType } from '../../types';

/**
 * One clock in or clock out, and how it was known.
 *
 * The timesheet says how long somebody worked. This says where they were when
 * they clocked, what they clocked from, and whether that matched the rules the
 * business set. Without it `requireGeofence` and `requirePhoto` are settings an
 * operator can switch on and nothing can check.
 *
 * It records what happened, not a second copy of the hours — the timesheet
 * entry is still the thing that gets approved and paid. This points back at
 * that entry so a disputed hour can be traced to the moment it started.
 *
 * Every way of clocking writes the same record: the web app, a shared tablet,
 * a phone, a card tapped on a reader. Nothing here assumes a browser.
 */
export const ClockEventSchema = () => {
  return {
    type: 'object',
    properties: {
      employeeId: {
        type: 'string',
        description: 'sk of the bm_employee this punch belongs to.',
        group: 'who',
      },
      employeeName: {
        type: 'string',
        readOnly: true,
        description: 'Denormalised for the review queue, so listing punches does not fan out to the roster.',
        group: 'who',
      },

      direction: {
        type: 'string',
        enum: ['in', 'out', 'break_start', 'break_end'],
        description: 'Clocking in, clocking out, or starting/ending a break.',
        notes: 'Breaks are clock events too — a break you can see start and end is the only way to show a legally required meal break was taken, rather than just claim it.',
        group: 'what',
      },
      at: {
        type: 'string',
        format: 'date-time',
        description: 'When it happened, as recorded by the server.',
        group: 'what',
      },
      method: {
        type: 'string',
        enum: ['web', 'mobile', 'kiosk', 'nfc', 'biometric', 'desktop', 'api', 'manual'],
        default: 'web',
        description: 'What they clocked from.',
        notes: '`manual` means a manager typed it in afterwards — nobody actually clocked, so it should read differently on screen.',
        group: 'what',
      },

      businessLocationId: {
        type: 'string',
        description: 'Which site they clocked at — the one the allowed area is measured from.',
        group: 'where',
      },

      latitude: { type: 'number', minimum: -90, maximum: 90, group: 'where' },
      longitude: { type: 'number', minimum: -180, maximum: 180, group: 'where' },
      accuracy: {
        type: 'number',
        description: 'Metres of uncertainty the device reported.',
        notes: 'A reading 200m out that admits to 300m of error has not placed anyone anywhere; the check reads this before deciding.',
        group: 'where',
      },
      distanceMeters: {
        type: 'number',
        readOnly: true,
        description: 'How far from the site they were, worked out at the time.',
        group: 'where',
      },

      deviceId: { type: 'string', description: 'Which device or reader it came from.', group: 'device' },
      deviceName: { type: 'string', group: 'device' },
      ipAddress: { type: 'string', group: 'device' },
      userAgent: { type: 'string', group: 'device' },
      cardUid: {
        type: 'string',
        description: 'The card that was tapped, when a reader was used.',
        group: 'device',
      },

      photo: {
        type: 'object',
        description: 'Taken at the moment of clocking, when the rules ask for one.',
        properties: {
          url: { type: 'string' },
          path: { type: 'string' },
          contentType: { type: 'string' },
        },
        group: 'evidence',
      },

      // Whether it matched the rules. It is always recorded either way —
      // turning someone away is how a worked shift goes unpaid.
      verified: {
        type: 'boolean',
        default: false,
        readOnly: true,
        description: 'True when it matched the rules the business set.',
        group: 'checks',
      },
      issue: {
        type: 'string',
        enum: ['out_of_area', 'no_location', 'no_photo', 'no_area_set'],
        readOnly: true,
        description: 'What did not match, when something did not.',
        group: 'checks',
      },
      reason: {
        type: 'string',
        readOnly: true,
        description: 'Said in plain words, e.g. "340m from Dallas Store — allowed area is 150m".',
        group: 'checks',
      },
      needsReview: {
        type: 'boolean',
        default: false,
        readOnly: true,
        description: 'Waiting for a manager to look at it.',
        group: 'checks',
      },
      reviewedBy: { type: 'string', group: 'checks' },
      reviewedAt: { type: 'string', format: 'date-time', group: 'checks' },
      reviewNote: { type: 'string', 'x-control-variant': 'textarea', group: 'checks' },

      timesheetId: {
        type: 'string',
        description: 'The timesheet these hours went onto.',
        group: 'link',
      },
      entryId: {
        type: 'string',
        description: 'The entry within that timesheet.',
        group: 'link',
      },
      scheduleShiftId: {
        type: 'string',
        description: 'The rostered shift this was against, when there was one.',
        notes: 'What lets "late" and "missed clock-out" mean anything — without a rota there is nothing to be late for.',
        group: 'link',
      },

      notes: { type: 'string', 'x-control-variant': 'textarea' },
    },
    required: ['employeeId', 'direction', 'at'],
  } as const;
};

const ps = ClockEventSchema();
export type ClockEventModel = FromSchema<typeof ps>;

registerCollection('Clock Event', DataType.bm_clock_event, ClockEventSchema());

import { ControlType } from '../../types';

/**
 * When the host is offering the space.
 *
 * Until now the only statement a listing could make about time was `blackouts`
 * — a list of when it is NOT available — which means the default is "every hour
 * of every day, forever". That is true of an unattended driveway and false of
 * almost everything else: a shop takes bags while it is open, a driveway may
 * only be free at weekends, an event lot exists for three days in June.
 *
 * So the host declares when they have it. The customer picks inside that.
 *
 * The windows govern **the handoff, not the stay**. A bag left at a shop that
 * closes at six is still there at midnight — what has to happen in opening
 * hours is dropping it off and collecting it. So a stay is allowed when its
 * START and its END each fall inside a window; the time between them is not
 * checked, because nobody is being asked to be present for it. The same rule
 * gives the right answer for a gated lot, where entry and exit are the only
 * moments that need the gate open.
 *
 * No windows means any time, which keeps unattended lots and self-service
 * lockers working exactly as they do now.
 */
export const AvailabilitySchema = () =>
  ({
    type: 'object',
    properties: {
      /** The listing is not offered at all outside these dates. Empty = always. */
      from: { type: 'string', format: 'date-time', title: 'Offered from' },
      to: { type: 'string', format: 'date-time', title: 'Offered until' },

      windows: {
        type: 'array',
        title: 'Access windows',
        description: 'When a stay can start or end. Leave empty for any time, day or night.',
        items: {
          type: 'object',
          properties: {
            days: {
              type: 'array',
              'x-control': ControlType.selectMany,
              'x-control-variant': 'chips',
              dataSource: {
                source: 'json',
                json: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
              },
              items: { type: 'string' },
            },
            /** Local time, 24h, "09:00". */
            opens: { type: 'string', title: 'Opens' },
            closes: { type: 'string', title: 'Closes' },
            label: { type: 'string' },
          },
        },
      },

      /**
       * What the booking picker offers, in minutes. A car park works in 30s, a
       * bag counter in 15s, a storage unit in whole days (1440). Empty means no
       * grid — any start and end the customer likes.
       */
      slotMinutes: { type: 'number', default: 0, title: 'Booking slots (minutes)' },

      /**
       * Gap required between one stay ending and the next starting, for a space
       * someone has to physically vacate. Empty means back-to-back is fine.
       */
      bufferMinutes: { type: 'number', default: 0, title: 'Turnaround gap (minutes)' },
    },
  } as const);

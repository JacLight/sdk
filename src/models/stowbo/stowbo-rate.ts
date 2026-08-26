import { ControlType } from '../../types';

/**
 * A rate schedule — what the host says a stay costs.
 *
 * Real tariffs are not a menu of mutually exclusive "pricing models"; they are
 * a set of duration bands, and the things people name separately are all the
 * same shape:
 *
 *   free            one open-ended band charging nothing
 *   fixed           one open-ended band charging a flat amount
 *   hourly / daily  one open-ended band charging a rate per period
 *   free period     a first band charging nothing, then whatever follows
 *   graduated       several bands
 *
 * Which is why a signboard reading "First 30 min free · Up to 2h $3 · $3/hr
 * thereafter · Max $18/day" is one schedule, not three features bolted together.
 *
 * The host authors the bands. We compute and honour them.
 */
export const RateScheduleSchema = () =>
  ({
    type: 'object',
    properties: {
      /**
       * How the bands are read.
       *
       *   posted      — the band the WHOLE stay falls into gives the whole
       *                 price. This is how a car park sign works: "up to 2
       *                 hours — $3" means 90 minutes costs $3, full stop.
       *   progressive — each band charges only the time inside it and they sum,
       *                 like tax brackets: "$2 first hour, $1 each hour after"
       *                 makes 3 hours $4.
       *
       * Both exist in the wild and they give different numbers for the same
       * bands, so the host says which they meant.
       */
      mode: {
        type: 'string',
        'x-control': ControlType.selectSingle,
        dataSource: { source: 'json', json: ['posted', 'progressive'] },
        default: 'posted',
        title: 'Band reading',
      },

      bands: {
        type: 'array',
        title: 'Rate bands',
        description: 'Cheapest/shortest first. Leave the last one open-ended to cover any longer stay.',
        items: {
          type: 'object',
          properties: {
            /** End of this band, in minutes from the start. Empty = open-ended. */
            upToMinutes: { type: 'number', title: 'Up to (minutes)' },
            charge: {
              type: 'string',
              'x-control': ControlType.selectSingle,
              // free       — this stretch of time costs nothing
              // fixed      — one amount for this band, however much of it is used
              // per_period — an amount for each period of time in this band
              dataSource: { source: 'json', json: ['free', 'fixed', 'per_period'] },
              default: 'per_period',
            },
            amount: { type: 'number', default: 0 },
            per: {
              type: 'string',
              'x-control': ControlType.selectSingle,
              dataSource: { source: 'json', json: ['minute', 'hour', 'day', 'week', 'month'] },
              default: 'hour',
              rules: [{ operation: 'notEqual', valueA: '{{charge}}', valueB: 'per_period', action: 'hide' }],
            },
            /** What the guest sees on the line: "First 30 minutes", "Overnight". */
            label: { type: 'string' },
          },
        },
      },

      /**
       * Bill time in blocks of this many minutes rather than whole periods — a
       * lot that quotes an hourly rate but meters every 15 minutes sets 15.
       * Empty means the block is the band's own period.
       */
      increment: { type: 'number', default: 0, title: 'Bill in blocks of (minutes)' },
      rounding: {
        type: 'string',
        'x-control': ControlType.selectSingle,
        // up    — a part block costs a whole block
        // exact — charge only the fraction used
        dataSource: { source: 'json', json: ['up', 'exact'] },
        default: 'up',
      },

      /**
       * How long a stay this schedule is willing to take.
       *
       * A hybrid marketplace puts a four-hour event bag drop and a three-week
       * travel box through the same search, so a schedule quoted per month can
       * be handed a four-hour window. Without a floor it prices it — a whole
       * month's rate, because four hours rounds up to one month — and shows
       * that as the price in search results.
       *
       * Empty means no limit.
       */
      minMinutes: { type: 'number', default: 0, title: 'Shortest stay (minutes)' },
      maxMinutes: { type: 'number', default: 0, title: 'Longest stay (minutes)' },

      minCharge: { type: 'number', default: 0, title: 'Minimum charge' },

      cap: {
        type: 'object',
        title: 'Maximum charge',
        properties: {
          amount: { type: 'number', default: 0, description: 'Empty or 0 = uncapped.' },
          /**
           * What the cap resets on. These disagree for an overnight stay — 8pm
           * to 9am is one rolling day but two calendar ones — so it is the
           * host's to state, not ours to assume.
           */
          per: {
            type: 'string',
            'x-control': ControlType.selectSingle,
            dataSource: { source: 'json', json: ['calendar_day', 'rolling_24h', 'stay'] },
            default: 'calendar_day',
          },
        },
      },
    },
  } as const);

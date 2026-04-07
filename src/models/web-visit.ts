import { FromSchema } from 'json-schema-to-ts';
import { DataType } from '../types';
import { registerCollection } from '../default-schema';

export const WebVisitSchema = () => {
  return {
    type: 'object',
    timeseries: true,
    properties: {
      // ── Identity ───────────────────────────────────────────────
      // visitorId: server-generated hash of (orgId + email) or (orgId + ip + ua).
      // Deterministic — same inputs always produce the same id.
      // When a visitor identifies (email becomes known), prior anonymous rows
      // are back-filled via CustomerActivityService.identifyVisitor.
      visitorId: { type: 'string' },
      sessionId: { type: 'string' },
      customerEmail: { type: 'string' },
      customerSk: { type: 'string' },

      // ── Event classification ───────────────────────────────────
      // type: what happened. source: which channel it came from.
      type: {
        type: 'string',
        description:
          'pageview | click | scroll | form_start | form_submit | search | error | unload ' +
          '| chat | call | email | sms | order | payment | refund | subscription ' +
          '| ticket | note | task | meeting | signup | login | logout ' +
          '| stage_change | tag_change | custom',
      },
      source: {
        type: 'string',
        description: 'web | chat | phone | email | sms | commerce | crm | api | automation | system',
      },
      direction: {
        type: 'string',
        description: 'inbound | outbound | internal',
      },

      // ── Human-readable summary for timeline UI ─────────────────
      summary: { type: 'string' },
      importance: { type: 'number', description: '1 (low noise) to 5 (critical). Default 3.' },
      icon: { type: 'string', description: 'Icon hint for timeline UI (e.g., "Phone", "ShoppingCart")' },
      tags: { type: 'array', items: { type: 'string' } },

      // ── Page / interaction details ─────────────────────────────
      url: { type: 'string' },
      pageTitle: { type: 'string' },
      referrer: { type: 'string' },
      exitUrl: { type: 'string' },
      duration: { type: 'number', description: 'ms spent on page / call / session' },
      scrollDepth: { type: 'number', description: '0-100 max scroll %' },
      loadTime: { type: 'number', description: 'Page load time in ms' },
      target: { type: 'string', description: 'Click target (CSS selector / element id)' },
      searchQuery: { type: 'string', description: 'Site search query text' },
      formName: { type: 'string', description: 'Form name (not field values) for form events' },

      // ── Geo / device (server-resolved from IP via MaxMind) ─────
      continent: { type: 'string' },
      country: { type: 'string' },
      city: { type: 'string' },
      realIp: { type: 'string' },
      subdivisionIso: { type: 'string' },
      subdivisions: { type: 'string' },
      latitude: { type: 'number' },
      longitude: { type: 'number' },
      forwardIp: { type: 'string' },
      timezone: { type: 'string' },
      traits: { type: 'string' },
      clientIp: { type: 'string' },
      browserInfo: { type: 'string' },
      deviceType: { type: 'string' },

      // ── Site context ───────────────────────────────────────────
      host: { type: 'string' },
      protocol: { type: 'string' },
      siteName: { type: 'string' },
      domain: { type: 'string' },

      // ── Attribution ────────────────────────────────────────────
      utm: {
        type: 'object',
        properties: {
          source: { type: 'string' },
          medium: { type: 'string' },
          campaign: { type: 'string' },
          term: { type: 'string' },
          content: { type: 'string' },
        },
      },

      // ── Type-specific structured payload ───────────────────────
      // For non-pageview types: order details, call metadata, chat info, etc.
      payload: { type: 'object' },

      // ── Linked records (e.g., orderId, chatId, ticketId) ───────
      relatedEntities: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            datatype: { type: 'string' },
            sk: { type: 'string' },
            label: { type: 'string' },
          },
        },
      },

      // ── Metadata ───────────────────────────────────────────────
      timestamp: { type: 'string' },
      author: { type: 'string', description: 'Who triggered this event (email | system | ai-assistant)' },
    },
  } as const;
};

const rt = WebVisitSchema();
export type WebVisitModel = FromSchema<typeof rt>;

registerCollection(
  'Web visit',
  DataType.web_visit,
  WebVisitSchema(),
);

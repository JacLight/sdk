import { FromSchema } from 'json-schema-to-ts';
import { DataType } from '../types';
import { registerCollection } from '../default-schema';

export const WebVisitSchema = () => {
  return {
    type: 'object',
    timeseries: true,
    properties: {
      // Identity
      visitorId: { type: 'string' },
      sessionId: { type: 'string' },
      email: { type: 'string' },
      username: { type: 'string' },
      firstName: { type: 'string' },
      lastName: { type: 'string' },
      phone: { type: 'string' },
      sk: { type: 'string' },

      // Event classification
      type: { type: 'string', description: 'pageview | click | scroll | form_start | form_submit | search | error | unload | chat | call | email | sms | order | payment | refund | subscription | ticket | note | task | meeting | signup | login | logout | stage_change | tag_change | custom' },
      source: { type: 'string', description: 'web | chat | phone | email | sms | commerce | crm | api | automation | system | user-activity' },
      direction: { type: 'string', description: 'inbound | outbound | internal' },
      method: { type: 'string', description: 'HTTP method for API activity' },

      // Summary / timeline
      summary: { type: 'string' },
      importance: { type: 'number', description: '1 (low noise) to 5 (critical). Default 3.' },
      icon: { type: 'string', description: 'Icon hint for timeline UI (e.g., "Phone", "ShoppingCart")' },
      tags: { type: 'array', items: { type: 'string' } },

      // Page / interaction
      url: { type: 'string' },
      pageTitle: { type: 'string' },
      referrer: { type: 'string' },
      exitUrl: { type: 'string' },
      duration: { type: 'number', description: 'ms spent on page / call / session' },
      scrollDepth: { type: 'number', description: '0-100 max scroll %' },
      loadTime: { type: 'number', description: 'Page load time in ms' },
      target: { type: 'string', description: 'Click target (CSS selector / element id)' },
      searchQuery: { type: 'string' },
      formName: { type: 'string' },

      // Network / IPs
      realIp: { type: 'string' },
      forwardIp: { type: 'string' },
      clientIp: { type: 'string' },
      socketIp: { type: 'string' },
      connectionIp: { type: 'string' },

      // Geo (server-resolved via ipwho.is / freeipapi.com)
      continent: { type: 'string' },
      continentCode: { type: 'string', description: 'ISO two-letter (e.g., NA)' },
      country: { type: 'string' },
      countryCode: { type: 'string', description: 'ISO two-letter (e.g., US)' },
      region: { type: 'string', description: 'Region/state name' },
      regionCode: { type: 'string', description: 'Region ISO code (e.g., TX)' },
      city: { type: 'string' },
      zipCode: { type: 'string' },
      latitude: { type: 'number' },
      longitude: { type: 'number' },
      timeZone: { type: 'string', description: 'IANA tz (e.g., America/Chicago)' },
      timeZoneAbbr: { type: 'string' },
      utcOffset: { type: 'string' },
      callingCode: { type: 'string' },
      flag: { type: 'string', description: 'Country flag emoji' },
      isEu: { type: 'boolean' },
      languages: { type: 'array', items: { type: 'string' } },
      currencies: { type: 'array', items: { type: 'string' } },

      // ISP / Network
      asn: { type: 'string' },
      isp: { type: 'string' },
      org: { type: 'string' },
      ispDomain: { type: 'string' },
      isProxy: { type: 'boolean', description: 'True if IP is a known proxy/VPN/Tor' },

      // Device / browser
      userAgent: { type: 'string', description: 'Raw User-Agent header' },
      browser: { type: 'string' },
      browserVersion: { type: 'string' },
      os: { type: 'string' },
      osVersion: { type: 'string' },
      deviceType: { type: 'string', description: 'desktop | mobile | tablet | bot' },
      deviceVendor: { type: 'string' },
      deviceModel: { type: 'string' },

      // Site context
      host: { type: 'string' },
      protocol: { type: 'string' },
      siteName: { type: 'string' },
      domain: { type: 'string' },
      configSite: { type: 'string' },
      configOrg: { type: 'string' },
      configId: { type: 'string' },
      deviceId: { type: 'string' },
      sharedHost: { type: 'string' },
      orgId: { type: 'string' },
      multipart: { type: 'boolean' },

      // Attribution (UTM)
      utmSource: { type: 'string' },
      utmMedium: { type: 'string' },
      utmCampaign: { type: 'string' },
      utmTerm: { type: 'string' },
      utmContent: { type: 'string' },

      // Type-specific payload (only nested field — unavoidable for freeform event data)
      payload: { type: 'object' },

      // Linked records
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

      // Metadata
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

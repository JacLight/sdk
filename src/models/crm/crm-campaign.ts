import { registerCollection } from '../../default-schema';
import { ControlType, DataType, NotificationChannels } from '../../types';
import { FromSchema } from 'json-schema-to-ts';
import { FileInfoSchema } from '../file-info';
import { toTitleCase } from '../../utils';

export const CampaignSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        transform: ['random-string::10'],
        group: 'name',
      },
      status: {
        type: 'string',
        enum: ['new', 'active', 'inactive', 'completed'],
        default: 'new',
        group: 'name',
      },
      budget: {
        type: 'number',
        group: 'name',
      },
      title: {
        type: 'string',
      },
      channel: {
        type: 'string',
        'x-control': ControlType.selectMany,
        'x-control-variant': 'chip',
        dataSource: {
          source: 'json',
          json: Object.values(NotificationChannels).map(key => ({
            value: key,
            label: toTitleCase(key),
          })),
        },
        group: 'channel',
      },
      adAccount: {
        type: 'string',
        title: "AD Account",
        'x-control': ControlType.selectMany,
        'x-control-variant': 'chip',
        group: 'channel',
      },
      description: {
        type: 'string',
        'x-control-variant': 'textarea',
      },
      audience: {
        type: 'array',
        'x-control': ControlType.selectMany,
        'x-control-variant': 'chip',
        dataSource: {
          source: 'collection',
          collection: DataType.audience,
          value: 'name',
          label: 'title',
        },
      },
      post: {
        type: 'string',
        collapsible: true,
        title: "Post",
        'x-control': ControlType.richtext,
      },
      files: {
        collapsible: true,
        type: 'array',
        items: FileInfoSchema(),
      },
      report: CampaignReportSchema(),
    },
  } as const;
};

export const CampaignReportSchema = () => {
  return {
    type: 'object',
    collapsible: true,
    properties: {
      spent:
      {
        type: 'number',
        group: 'spent',
      },
      impressions: {
        type: 'number',
        group: 'spent',
      },
      reach: {
        type: 'number',
        group: 'spent',
      },
      sales: {
        type: 'number',
        group: 'sales',
      },
      leads: {
        type: 'number',
        group: 'sales',
      },
      contacts: {
        type: 'number',
        group: 'sales',
      },
      likes: {
        type: 'number',
        group: 'shares',
      },
      followers: {
        type: 'number',
        group: 'shares',
      },
      shares: {
        type: 'number',
        group: 'shares',
      },
      sent: {
        type: 'number',
        group: 'sent',
      },
      bounced: {
        type: 'number',
        group: 'sent',
      },
      complaints: {
        type: 'number',
        group: 'sent',
      },
      delivered: {
        type: 'number',
        group: 'delivered',
      },
      opened: {
        type: 'number',
        group: 'delivered',
      },
      clicked: {
        type: 'number',
        group: 'delivered',
      },
      subscribed: {
        type: 'number',
        group: 'subscribed',
      },
      unsubscribed: {
        type: 'number',
        group: 'subscribed',
      },
    },
  } as const;
}

const dd = CampaignSchema();
export type CampaignModel = FromSchema<typeof dd>;

registerCollection(
  'CrmForm',
  DataType.campaign,
  CampaignSchema(),
  null,
  null,
  false,
  false
);
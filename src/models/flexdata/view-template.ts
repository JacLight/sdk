import { ControlType, } from '../../types';
import { FileInfoSchema } from '../file-info';
import { FromSchema } from 'json-schema-to-ts';

export const FDViewTemplateSchema = () => {
  return {
    type: 'object',
    properties: {
      usage: {
        type: 'array',
        items: {
          type: 'string',
        },
        'x-control-variant': 'chip',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'json',
          json: ['web', 'email', 'mobile', 'button', 'link', 'container', 'image', 'caption', 'svg', 'video', 'paragraph', 'heading', 'navigation', 'title', 'divider', 'table', 'list', 'menu', 'input', 'select', 'upload', 'form', 'modal', 'drawer', 'dialog', 'tooltip', 'popover', 'notification', 'alert', 'icon', 'buttonGroup', 'chip', 'tag', 'breadcrumb', 'slider', 'file', 'form', 'card', 'progress', 'spinner', 'badge', 'avatar', 'pagination', 'tabs', 'accordion', 'carousel', 'timeline', 'calendar', 'map', 'chart'],
        },
      },
      code: {
        type: 'string',
        collapsible: true,
        'x-control-variant': 'html',
        'x-control': ControlType.code,
        css: { height: '600px' },
        rules: [
          { operation: 'equal', valueA: 'widget', valueB: '{{type}}', action: 'set-property', property: [{ key: 'x-control-variant', value: 'json' }] },
          { operation: 'notEqual', valueA: 'widget', valueB: '{{type}}', action: 'set-property', property: [{ key: 'x-control-variant', value: 'html' }] }
        ]
      },
      component: {
        type: 'string',
        hidden: true,
      },
      config: {
        type: 'object',
        hidden: true,
      },
      description: {
        type: 'string',
        'x-control-variant': 'textarea',
      },
      source: {
        type: 'string',
        hidden: true,
      },
      image: {
        collapsible: true,
        ...FileInfoSchema(),
      },
    },
  } as const;
};

const rt = FDViewTemplateSchema();
export type FDViewTemplateModel = FromSchema<typeof rt>;
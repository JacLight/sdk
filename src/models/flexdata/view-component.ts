import { ControlType, } from '../../types';
import { FileInfoSchema } from '../fileinfo';
import { FromSchema } from 'json-schema-to-ts';

export const FDViewComponentSchema = () => {
  return {
    type: 'object',
    properties: {
      html: {
        type: 'string',
        collapsible: true,
        'x-control-variant': 'html',
        'x-control': ControlType.code,
        default: demoHtml,
        css: { height: '800px' },
      },
      schema: {
        type: 'string',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'json',
          json: []
        },
        group: 'icon',
      },
      icon: {
        type: 'string',
        group: 'icon',
        'x-control': ControlType.icon,
      },
      description: {
        type: 'string',
        'x-control-variant': 'textarea',
      },
      image: {
        collapsible: true,
        ...FileInfoSchema(),
      }
    },
  } as const;
};

const demoHtml = `<div>
    <div>{{data.title}}</div>
    <div>{{data.description}}</div>
    <div>
        <ul>
            {{#each courses}}
            <li>{{this.name}} {{this.point}}</li>
            {{/each}}
        </ul>
    </div>
</div>`

const rt = FDViewComponentSchema();
export type FDViewComponentModel = FromSchema<typeof rt>;
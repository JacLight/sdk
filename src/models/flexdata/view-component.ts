import { ControlType, } from '../../types';
import { FileInfoSchema } from '../file-info';
import { FromSchema } from 'json-schema-to-ts';

export const FDViewComponentSchema = () => {
  return {
    type: 'object',
    properties: {
      schema: {
        type: 'string',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'json',
          json: []
        },
      },
      description: {
        type: 'string',
        'x-control-variant': 'textarea',
      },
      html: {
        type: 'string',
        collapsible: true,
        'x-control-variant': 'html',
        'x-control': ControlType.code,
        default: demoHtml,
        css: { height: '800px' },
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
import { CollectionUI } from '../collection-ui';
import { ControlType, FormViewSectionType, } from '../../types';
import { FileInfoSchema } from '../fileinfo';
import { FromSchema } from 'json-schema-to-ts';

//TODO: add custom schema
//TODO: add InitData

export const FDViewComponentSchema = () => {
  return {
    type: 'object',
    properties: {
      html: {
        type: 'string',
        'x-control-variant': 'html',
        hideLabel: true,
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
      },
      icon: {
        type: 'string',
        'x-control': ControlType.icon,
      },
      description: {
        type: 'string',
        'x-control-variant': 'textarea',
      },
      image: FileInfoSchema(),
    },
  } as const;
};

export const FDViewComponentUI = (): CollectionUI[] => {
  return [
    {
      type: FormViewSectionType.sectiontab,
      tab: [
        {
          title: 'Info',
          items: [
            {
              '0': '/properties/name',
              '1': '/properties/type',
            },
            {
              '0': '/properties/content/properties/description',
            },
            {
              '0': '/properties/content/properties/schema',
            },
            {
              '0': '/properties/content/properties/image',
              '1': '/properties/content/properties/icon',

            },
          ],
        },
        {
          title: 'HTML',
          items: [
            {
              '0': '/properties/content/properties/html',
            },
          ],
        },
      ],
    },
  ];
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
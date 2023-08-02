import { CollectionUI } from '../collection-ui';
import { DataType, FieldType, FormViewSectionType, } from '../../types';
import { FileInfoSchema } from '../fileinfo';
import { FromSchema } from 'json-schema-to-ts';

export const FDViewComponentSchema = () => {
  return {
    type: 'object',
    properties: {
      html: {
        type: 'string',
        inputStyle: 'html',
        hideLabel: true,
        fieldType: FieldType.code,
        default: demoHtml,
        css: { height: '800px' },
      },
      schema: {
        type: 'string',
        fieldType: FieldType.selectionmultiple,
        dataSource: {
          source: 'collection',
          collection: DataType.subschema,
          value: 'name',
          label: 'name',
          filter: {
            property: 'parent',
            operation: 'equal',
            value: 'post',
          }
        },
      },
      icon: {
        type: 'string',
        fieldType: FieldType.icon,
      },
      description: {
        type: 'string',
        inputStyle: 'textarea',
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
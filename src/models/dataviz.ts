import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../default-schema';
import { DataType, ControlType } from '../types';
import { CollectionRule } from './collection-rule';
import { CollectionUI } from './collection-ui';

export const DataVizSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        minLength: 3,
        maxLength: 50,
        unique: true,
        transform: 'uri'
      },
      title: {
        type: 'string',
      },
      description: {
        type: 'string',
        'x-control-variant': 'textarea',
      },
      type: {
        type: 'string',
        enum: ['dashboard', 'table'],
      },
      sections: {
        hidden: true,
        type: 'array',
        items: {
          type: 'array',
          items: DataVizColumnSchema()
        },
      },
      table: {
        hidden: true,
        ...DataVizTableConfigSchema()
      },
      chart: {
        hidden: true,
        ...DataVizChartConfigSchema()
      },
      classes: {
        type: 'string',
        hidden: true,
      },
      style: {
        type: ['string', 'object'],
        hidden: true,
      }
    },
    required: ['name'],
  } as const;
};

export const DataVizColumnSchema = () => {
  return {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        hidden: true,
      },
      type: {
        type: 'string',
        hidden: true,
      },
      title: {
        type: 'string',
      },
      description: {
        type: 'string',
        'x-control-variant': 'textarea',
      },
      tableConfig: {
        type: 'string',
        'x-control': ControlType.selectMany,
        'x-control-variant': 'chip',
        dataSource: {
          source: 'collection',
          collection: DataType.dataviz,
          value: 'sk',
          label: 'name',
          filter: {
            property: 'type',
            operation: 'equal',
            value: 'table',
          },
        },
      },
      chartConfig: {
        type: 'string',
        'x-control': ControlType.selectMany,
        'x-control-variant': 'chip',
        dataSource: {
          source: 'collection',
          collection: DataType.dataviz,
          value: 'sk',
          label: 'name',
          filter: {
            property: 'type',
            operation: 'equal',
            value: 'table',
          },
        },
      },
      showToolbar: {
        type: 'boolean',
        default: false
      },
      valuesOnly: {
        type: 'string',
        description: 'comma separated, keys',
      },
      chartSettings: {
        type: 'string',
        'x-control': ControlType.code,
        'x-control-variant': 'json',
        collapsible: true,
      },
      hideTitle: {
        type: 'boolean',
        default: false,
        group: 'display'
      },
      showTable: {
        type: 'boolean',
        default: true,
        group: 'display'
      },
      showChart: {
        type: 'boolean',
        default: true,
        group: 'display'
      },
      classes: {
        type: 'string',
      },
      style: {
        type: 'string',
        'x-control': 'Code',
        'x-control-variant': 'css',
        collapsible: true,
        popup: {
          inline: true,
          style: { width: '800px' },
        },
        hidden: true,
      },
      views: {
        hidden: true,
        type: 'array',
        items: {
          type: 'object',
        }
      }

    },
  } as const;
};

export const DataVizTableConfigSchema = () => {
  return {
    type: 'object',
    properties: {
      collection: {
        type: 'string',
        showIndex: true,
        'x-control-variant': 'chip',
        'x-control': ControlType.selectMany,
        items: {
          hideLabel: true,
          type: 'string'
        },
        dataSource: {
          source: 'json',
          json: []
        },
      },
      exportMode: {
        type: 'boolean',
        groupLayout: 'flat',
        styleClass: 'w-48',
      },
      code: {
        type: 'string',
        'x-control-variant': 'json',
        'x-control': ControlType.code,
        rules: [
          { operation: 'isFalsy', valueA: '{{exportMode}}', action: 'hide' },
        ]
      },
      match: {
        type: 'string',
        inputType: 'textarea',
        displayStyle: 'outlined',
        displaySize: 'small',
        rules: [{ "operation": "isTruthy", "valueA": "{{exportMode}}", "action": "hide" }]
        // rules: [{ "operation": "isNotEmpty", "valueA": "{{contentType}}", "action": "set-property", "property":[{"key": "x-control", "property": "{{contentType}}"},{"key": "x-control-variant", "property": "{{language}}"}] }]
      },
      group: {
        type: 'string',
        inputType: 'textarea',
        displayStyle: 'outlined',
        displaySize: 'small',
        rules: [{ operation: 'isTruthy', valueA: '{{exportMode}}', action: 'hide' }]

      },
      sort: {
        type: 'string',
        inputType: 'textarea',
        displayStyle: 'outlined',
        displaySize: 'small',
        rules: [{ operation: 'isTruthy', valueA: '{{exportMode}}', action: 'hide' }]
      },
      excludes: {
        type: 'array',
        'x-control': ControlType.selectMany,
        'x-control-variant': 'chip',
        items: {
          type: 'string',
        }
      },
      includes: {
        type: 'array',
        'x-control': ControlType.selectMany,
        'x-control-variant': 'chip',
        items: {
          type: 'string',
        }
      }
    },
  } as const;
};


export const DataVizChartConfigSchema = () => {
  return {
    type: 'object',
    properties: {
      title: {
        type: 'string',
        hidden: true,
      },
      chartType: {
        type: 'string',
        enum: ['line', 'bar', 'pie', 'doughnut', 'gauge', 'area', 'radar', 'map', 'funnel', 'heatmap', 'scatter', 'treemap', 'sunburst']
      },
      config: {
        type: 'string',
        'x-control': 'Code',
        'x-control-variant': 'json',
        collapsible: true,
        popup: {
          inline: true,
          style: { width: '800px' },
        }
      },
      dataTemplate: {
        type: 'string',
        'x-control': 'Code',
        'x-control-variant': 'json',
        collapsible: true,
        popup: {
          inline: true,
          style: { width: '800px' },
        }
      },
    }
  } as const;
};

const dd = DataVizSchema();
export type DataVizModel = FromSchema<typeof dd>;

const ddx = DataVizColumnSchema();
export type DataVizColumnModel = FromSchema<typeof ddx>;

const ddxx = DataVizTableConfigSchema();
export type DataVizTableConfigModel = FromSchema<typeof ddxx>;

const ddxxy = DataVizChartConfigSchema();
export type DataVizChartConfigModel = FromSchema<typeof ddxxy>;


export const DataVizUI = (): CollectionUI[] => {
  return null;
};
export const DataVizRules = (): CollectionRule[] => {
  return null;
};

registerCollection(
  'DataViz',
  DataType.dataviz,
  DataVizSchema(),
  DataVizUI(),
  DataVizRules()
);

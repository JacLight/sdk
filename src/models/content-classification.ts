import { ControlType, designEmotions, designStyles, siteCategories, siteSectionTypes } from '../types';

export const ContentClassificationSchema = () => {
  return {
    type: 'object',
    collapsible: 'close', // open, close, true
    'ai-buttons': true,
    hidden: true,
    properties: {
      useCase: {
        type: 'array',
        'layout': 'horizontal',
        collapsible: 'close',
        items: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              'x-control-variant': 'chip',
              'x-control': ControlType.selectMany,
              group: 'rating',
              hideLabel: true,
              dataSource: {
                source: 'json',
                json: siteSectionTypes.map((type) => ({ label: type.name, value: type.name }))
              },
            },
            rating: {
              type: 'number',
              'x-control': 'rating',
              hideLabel: true,
              scale: 10,
              max: 10,
              min: 0,
              group: 'rating',
              'x-ui': {
                control: {
                  classes: ['flex', 'items-center']
                },
              },
            },
          }
        }
      },
      category: {
        type: 'array',
        'layout': 'horizontal',
        collapsible: 'close',
        items: {
          type: 'object',
          properties: {
            name: {
              'x-control-variant': 'chip',
              'x-control': ControlType.selectMany,
              type: 'string',
              hideLabel: true,
              group: 'rating',
              dataSource: {
                source: 'json',
                json: siteCategories
              },
            },
            rating: {
              type: 'number',
              'x-control': 'rating',
              scale: 10,
              max: 10,
              min: 0,
              hideLabel: true,
              group: 'rating',
              'x-ui': {
                control: {
                  classes: ['flex', 'items-center']
                },
              },
            },
          }
        }
      },
      emotion: {
        type: 'array',
        'layout': 'horizontal',
        collapsible: 'close',
        items: {
          type: 'object',
          properties: {
            name: {
              hideLabel: true,
              type: 'string',
              group: 'rating',
              'x-control-variant': 'chip',
              'x-control': ControlType.selectMany,
              dataSource: {
                source: 'json',
                json: designEmotions
              },
            },
            rating: {
              type: 'number',
              'x-control': 'rating',
              hideLabel: true,
              scale: 10,
              max: 10,
              min: 0,
              group: 'rating',
              'x-ui': {
                control: {
                  classes: ['flex', 'items-center']
                },
              },
            },
          }
        }
      },
      style: {
        type: 'array',
        'layout': 'horizontal',
        collapsible: 'close',
        items: {
          type: 'object',
          properties: {
            name: {
              'x-control': ControlType.selectMany,
              'x-control-variant': 'chip',
              hideLabel: true,
              type: 'string',
              group: 'rating',
              dataSource: {
                source: 'json',
                json: designStyles
              },
            },
            rating: {
              type: 'number',
              'x-control': 'rating',
              hideLabel: true,
              scale: 10,
              max: 10,
              min: 0,
              group: 'rating',
              'x-ui': {
                control: {
                  classes: ['flex', 'items-center']
                },
              },
            },
          }
        }
      },
      layouts: {
        type: 'array',
        'x-control': ControlType.selectMany,
        'x-control-variant': 'chip',
        items: {
          type: 'string',
        }
      },
      remarks: {
        type: 'string',
        'x-control-variant': 'textarea',
      },
    },
  } as const;
};
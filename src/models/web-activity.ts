import { FromSchema } from 'json-schema-to-ts';
import { DataType } from '../types';
import { registerCollection } from '../default-schema';

export const WebActivitySchema = () => {
  return {
    type: 'object',
    timeseries: true,
    properties: {
      sessionId: { type: 'string' },
      url: { type: 'string' },
      screenWidth: { type: 'number' },
      screenHeight: { type: 'number' },
      viewportWidth: { type: 'number' },
      viewportHeight: { type: 'number' },
      mouseX: { type: 'number' },
      mouseY: { type: 'number' },
      scrollPosition: { type: 'number' },
      clickX: { type: 'number' },
      clickY: { type: 'number' },
      clickTarget: { type: 'string' },
      actionType: {
        type: 'string',
        enum: ['mouseMove', 'click', 'scroll', 'inputChange'],
      },
      actionData: {
        type: 'object',
        properties: {
          mouseX: { type: 'number' },
          mouseY: { type: 'number' },
          scrollPosition: { type: 'number' },
          inputValue: { type: 'string' },  // For capturing form input
        }
      },
      screenShot: { type: 'string' },
      timestamp: { type: 'string', description: 'ISO 8601 timestamp' },
    }
  } as const;
};

const rt = WebActivitySchema();
export type WebActivityModel = FromSchema<typeof rt>;

registerCollection(
  'Web Activity',
  DataType.web_activity,
  WebActivitySchema(),
);

import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../default-schema';
import { DataType } from '../types';
import { FileInfoSchema } from './file-info';

export const CreativeStudioSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        unique: true,
        transform: 'uri',
        description: 'Unique identifier for the creative',
      },
      title: {
        type: 'string',
        description: 'Display name of the creative',
      },
      description: {
        type: 'string',
        controlType: 'richtext',
        description: 'Description or notes about this creative',
      },
      status: {
        type: 'string',
        enum: ['draft', 'published', 'archived'],
        default: 'draft',
      },
      type: {
        type: 'string',
        enum: ['design', 'image', 'video', 'template', 'ad', 'social_post'],
        default: 'design',
        description: 'Type of creative asset',
      },

      // Canvas data — the Fabric.js JSON
      content: {
        type: 'object',
        description: 'Fabric.js canvas JSON data',
        hideIn: ['generator'],
      },

      // Thumbnail for the library grid
      thumbnail: FileInfoSchema(),

      // Dimensions
      width: {
        type: 'number',
        default: 1200,
        description: 'Canvas width in pixels',
      },
      height: {
        type: 'number',
        default: 800,
        description: 'Canvas height in pixels',
      },

      // Platform / format targeting
      platform: {
        type: 'string',
        enum: ['instagram', 'facebook', 'twitter', 'linkedin', 'tiktok', 'youtube', 'pinterest', 'website', 'email', 'print', 'other'],
        description: 'Target platform for this creative',
      },
      format: {
        type: 'string',
        enum: ['post', 'story', 'reel', 'carousel', 'banner', 'cover', 'ad', 'thumbnail', 'custom'],
        description: 'Content format',
      },

      // Tags for organization
      tags: {
        type: 'array',
        items: { type: 'string' },
        description: 'Tags for organizing creatives',
      },

      // Design system — brand kit with full typography scale
      designSystem: {
        type: 'object',
        properties: {
          name: { type: 'string', description: 'Design system / brand kit name' },
          mode: { type: 'string', enum: ['light', 'dark'], default: 'light' },
          colors: {
            type: 'object',
            properties: {
              primary: { type: 'object', properties: { hex: { type: 'string' }, label: { type: 'string' } } },
              secondary: { type: 'object', properties: { hex: { type: 'string' }, label: { type: 'string' } } },
              tertiary: { type: 'object', properties: { hex: { type: 'string' }, label: { type: 'string' } } },
              neutral: { type: 'object', properties: { hex: { type: 'string' }, label: { type: 'string' } } },
              background: { type: 'object', properties: { hex: { type: 'string' }, label: { type: 'string' } } },
              surface: { type: 'object', properties: { hex: { type: 'string' }, label: { type: 'string' } } },
              error: { type: 'object', properties: { hex: { type: 'string' }, label: { type: 'string' } } },
              success: { type: 'object', properties: { hex: { type: 'string' }, label: { type: 'string' } } },
            },
          },
          typography: {
            type: 'object',
            description: 'Typography scale — 6 levels: display, headline, title, body, label, caption',
            properties: {
              display: { type: 'object', properties: { family: { type: 'string' }, size: { type: 'number' }, weight: { type: 'number' }, lineHeight: { type: 'number' }, letterSpacing: { type: 'number' } } },
              headline: { type: 'object', properties: { family: { type: 'string' }, size: { type: 'number' }, weight: { type: 'number' }, lineHeight: { type: 'number' }, letterSpacing: { type: 'number' } } },
              title: { type: 'object', properties: { family: { type: 'string' }, size: { type: 'number' }, weight: { type: 'number' }, lineHeight: { type: 'number' }, letterSpacing: { type: 'number' } } },
              body: { type: 'object', properties: { family: { type: 'string' }, size: { type: 'number' }, weight: { type: 'number' }, lineHeight: { type: 'number' }, letterSpacing: { type: 'number' } } },
              label: { type: 'object', properties: { family: { type: 'string' }, size: { type: 'number' }, weight: { type: 'number' }, lineHeight: { type: 'number' }, letterSpacing: { type: 'number' } } },
              caption: { type: 'object', properties: { family: { type: 'string' }, size: { type: 'number' }, weight: { type: 'number' }, lineHeight: { type: 'number' }, letterSpacing: { type: 'number' } } },
            },
          },
          cornerRadius: {
            type: 'object',
            properties: {
              none: { type: 'number', default: 0 },
              small: { type: 'number', default: 4 },
              medium: { type: 'number', default: 8 },
              large: { type: 'number', default: 16 },
              full: { type: 'number', default: 9999 },
            },
          },
          spacing: {
            type: 'object',
            properties: {
              xs: { type: 'number', default: 4 },
              sm: { type: 'number', default: 8 },
              md: { type: 'number', default: 16 },
              lg: { type: 'number', default: 24 },
              xl: { type: 'number', default: 32 },
              xxl: { type: 'number', default: 48 },
            },
          },
          elevation: {
            type: 'object',
            properties: {
              none: { type: 'string', default: 'none' },
              low: { type: 'string', default: '0 1px 3px rgba(0,0,0,0.12)' },
              medium: { type: 'string', default: '0 4px 6px rgba(0,0,0,0.1)' },
              high: { type: 'string', default: '0 10px 25px rgba(0,0,0,0.15)' },
            },
          },
        },
        description: 'Full design system — Material Design 3 inspired typography scale, color tokens, spacing, elevation',
      },

      // Export history
      exports: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            format: { type: 'string', enum: ['png', 'jpeg', 'svg', 'pdf'] },
            url: { type: 'string', format: 'uri' },
            exportedAt: { type: 'string', format: 'date-time' },
            width: { type: 'number' },
            height: { type: 'number' },
            multiplier: { type: 'number' },
          },
        },
        hideIn: ['generator'],
      },
    },
    required: ['name'],
  } as const;
};

const cs = CreativeStudioSchema();
export type CreativeStudioModel = FromSchema<typeof cs>;

registerCollection('Creative Studio', DataType.creative_studio, CreativeStudioSchema());

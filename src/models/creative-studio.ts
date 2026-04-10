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

      // Work areas (Figma-style frames inside the infinite canvas)
      workAreas: {
        type: 'array',
        description: 'Frames inside the infinite canvas — each is an export region',
        items: {
          type: 'object',
          properties: {
            id: { type: 'string', description: 'Unique frame ID' },
            name: { type: 'string', description: 'Frame display name' },
            left: { type: 'number', description: 'X position on canvas' },
            top: { type: 'number', description: 'Y position on canvas' },
            width: { type: 'number', description: 'Frame width' },
            height: { type: 'number', description: 'Frame height' },
            thumbnail: { type: 'string', description: 'Exported PNG URL for this frame' },
            platform: { type: 'string', description: 'Optional platform tag' },
            background: { type: 'string', description: 'Background color hex' },
            backgroundOpacity: { type: 'number', minimum: 0, maximum: 1, description: 'Background fill alpha (0..1)' },
          },
        },
        hideIn: ['generator'],
      },

      // Which frame is currently active (for UI state restoration)
      activeWorkAreaId: {
        type: 'string',
        description: 'ID of the currently active work area',
        hideIn: ['generator'],
      },

      // Viewport — zoom + pan at time of last save (restored on reload)
      viewport: {
        type: 'object',
        description: 'Canvas zoom and pan state at last save',
        properties: {
          zoom: { type: 'number', description: 'Canvas zoom level (1 = 100%)' },
          panX: { type: 'number', description: 'Horizontal viewport translation' },
          panY: { type: 'number', description: 'Vertical viewport translation' },
        },
        hideIn: ['generator'],
      },

      // External context link — what this design was created for
      externalContext: {
        type: 'object',
        description: 'Link to the external item this design was created for (campaign, product, blog post, book, etc.)',
        properties: {
          type: {
            type: 'string',
            enum: ['marketing-campaign', 'product', 'blog-post', 'book', 'email', 'custom'],
            description: 'Type of external item',
          },
          id: { type: 'string', description: 'External item ID' },
          name: { type: 'string', description: 'External item display name' },
          description: { type: 'string', description: 'Short description of the external item' },
          snapshotData: {
            type: 'object',
            description: 'Snapshot of key fields from the external item at time of creation',
          },
          assets: {
            type: 'array',
            description: 'Media assets from the external item (product images, etc.)',
            items: {
              type: 'object',
              properties: {
                url: { type: 'string' },
                name: { type: 'string' },
                type: { type: 'string' },
              },
            },
          },
          copySnippets: {
            type: 'array',
            description: 'Text snippets from the external item (headlines, body, CTA, etc.)',
            items: {
              type: 'object',
              properties: {
                label: { type: 'string' },
                text: { type: 'string' },
              },
            },
          },
          platforms: {
            type: 'array',
            description: 'Target platforms from the external item — used to auto-create frames',
            items: { type: 'string' },
          },
          brand: {
            type: 'object',
            description: 'Brand overrides from the external item (voice, colors, typography)',
            properties: {
              voice: { type: 'string' },
              colors: { type: 'object' },
              typography: { type: 'object' },
            },
          },
          linkedAt: { type: 'string', format: 'date-time', description: 'When this design was linked to the external item' },
        },
        hideIn: ['generator'],
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
            workAreaId: { type: 'string', description: 'Source work area if exported from a frame' },
          },
        },
        hideIn: ['generator'],
      },

      // Indicates whether this design has been finalized for its external context
      // (i.e. user clicked "Use These Designs" — false means it's still a draft)
      isFinalized: {
        type: 'boolean',
        default: false,
        description: 'True after the user commits the design to its external item',
        hideIn: ['generator'],
      },
    },
    required: ['name'],
  } as const;
};

const cs = CreativeStudioSchema();
export type CreativeStudioModel = FromSchema<typeof cs>;

registerCollection('Creative Studio', DataType.creative_studio, CreativeStudioSchema());

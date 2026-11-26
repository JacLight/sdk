import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../default-schema';
import { DataType } from '../types';

/**
 * A direct action link: one link that does one thing — approve this, decline that — sent to
 * someone by email, text, WhatsApp, in-app notice or chat. The server's action registry says what
 * each `action` does with its `params`; the link only carries which one, for whom, and until when.
 *
 * Only a hash of the link's token is kept; the token itself is in the link and nowhere else.
 * Opening the link shows what it will do; it acts only when the person presses the button.
 */
export const ActionLinkSchema = () => {
  return {
    type: 'object',
    properties: {
      action: { type: 'string', notes: 'The registered action this link runs, e.g. approval.decide.' },
      params: { type: 'object', notes: 'What the action runs with, fixed when the link was made (e.g. { taskId, decision }).' },
      actAs: {
        type: 'object',
        notes: 'Whose authority the action runs with: the person the link was made for. Empty for an action anyone may take.',
        properties: {
          kind: { type: 'string', enum: ['user', 'customer', 'anyone'], default: 'user' },
          email: { type: 'string' },
          phone: { type: 'string' },
          id: { type: 'string', notes: 'The user or customer record.' },
          name: { type: 'string' },
        },
      },
      target: {
        type: 'object',
        notes: 'The record the action is about, so its links can be listed and withdrawn from it.',
        properties: {
          datatype: { type: 'string' },
          id: { type: 'string' },
        },
      },
      sentTo: {
        type: 'array',
        notes: 'Where the link was sent.',
        items: {
          type: 'object',
          properties: {
            channel: { type: 'string', enum: ['email', 'sms', 'whatsapp', 'notification', 'chat'] },
            address: { type: 'string' },
            at: { type: 'string', format: 'date-time' },
          },
        },
      },
      tokenHash: { type: 'string', hidden: true, notes: 'sha256 of the token in the link. Never returned.' },
      expiresAt: { type: 'string', format: 'date-time' },
      maxUses: { type: 'number', default: 1 },
      uses: { type: 'number', default: 0 },
      status: { type: 'string', enum: ['active', 'used', 'expired', 'revoked'], default: 'active' },
      usedAt: { type: 'string', format: 'date-time' },
      revokedAt: { type: 'string', format: 'date-time' },
      revokedBy: { type: 'string' },
      result: {
        type: 'object',
        notes: 'What the last use answered.',
        properties: {
          ok: { type: 'boolean' },
          message: { type: 'string' },
        },
      },
      events: {
        type: 'array',
        notes: 'Opened, used and failed — newest last, kept to the last 50.',
        items: {
          type: 'object',
          properties: {
            at: { type: 'string', format: 'date-time' },
            kind: { type: 'string', enum: ['opened', 'used', 'failed'] },
            ip: { type: 'string' },
            userAgent: { type: 'string' },
            message: { type: 'string' },
          },
        },
      },
    },
    required: ['action'],
  } as const;
};

const al = ActionLinkSchema();
export type ActionLinkModel = FromSchema<typeof al>;
registerCollection('ActionLink', DataType.action_link, ActionLinkSchema());

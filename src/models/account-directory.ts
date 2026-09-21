import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../default-schema';
import { DataType } from '../types';

/**
 * One record per SIGN-IN IDENTIFIER in the shared org: the orgs where that
 * identifier belongs to a user. Each org keeps its own database, so this is the
 * only way to answer "which workspaces can I sign into" without walking every
 * org. Written on sign-up, invitation completion and every sign-in; read only
 * by the server, never on screen.
 *
 * The identifier is an email OR a username — sign-in accepts either, and an
 * account routinely has both (`root@localhost.com` with the username
 * `admin@fundu`). A user therefore has a record per identifier, all pointing at
 * the same orgs. The field is `identifier`, not `email`: it was called email
 * and carried `format: 'email'`, which is wrong twice over — `admin@fundu` is a
 * username, and it would fail that check.
 */
export const AccountDirectorySchema = () => {
  return {
    type: 'object',
    properties: {
      // What the person types to sign in: their email or their username.
      identifier: {
        type: 'string',
        title: 'Sign-in identifier',
        unique: true,
      },
      orgs: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            orgId: { type: 'string' },
            displayName: { type: 'string' },
            lastSeen: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
    required: ['identifier'],
  } as const;
};

const dd = AccountDirectorySchema();
export type AccountDirectoryModel = FromSchema<typeof dd>;

registerCollection('Account Directory', DataType.account_directory, AccountDirectorySchema());

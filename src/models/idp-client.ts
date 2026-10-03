import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../default-schema';
import { DataType } from '../types';

/**
 * An application that signs people in through AppMint — AppMint acting as the
 * identity provider (/idp). One record per application, platform-wide (kept in
 * the shared org). `protocol` says how it talks to AppMint; only that
 * protocol's block applies.
 *
 * The OAuth client secret is never stored: it is derived on the server from
 * `clientId` and `secretVersion`, shown once when created or rotated, and
 * rotating bumps the version.
 */
export const IdpClientSchema = () =>
  ({
    type: 'object',
    properties: {
      name: { type: 'string', title: 'Application', description: 'What people see when signing in, e.g. "SpinForge Mail".' },
      protocol: { type: 'string', enum: ['oidc', 'saml'], default: 'oidc', title: 'Protocol' },
      status: { type: 'string', enum: ['active', 'disabled'], default: 'active' },
      emailClaim: {
        type: 'string',
        enum: ['login', 'mailbox'],
        default: 'login',
        title: 'Email the app receives',
        description:
          "'login' — the person's AppMint sign-in email. 'mailbox' — a mailbox assigned to them (an email account): they pick one when they have several, and the token's email is that mailbox — for a webmail that opens the mailbox.",
      },
      mailboxHostedBy: {
        type: 'string',
        title: 'Mailboxes from',
        description: "With emailClaim 'mailbox': only email accounts hosted here (e.g. spinforge). Empty = any assigned mailbox.",
      },
      access: {
        type: 'object',
        title: 'Who may sign in',
        properties: {
          orgs: { type: 'array', items: { type: 'string' }, description: 'Org ids whose people may sign in. Empty = every org.' },
          userTypes: { type: 'array', items: { type: 'string', enum: ['user', 'customer'] }, default: ['user'] },
        },
      },
      oidc: {
        type: 'object',
        title: 'OAuth 2 / OpenID Connect',
        properties: {
          clientId: { type: 'string', readOnly: true },
          secretVersion: { type: 'number', readOnly: true, description: 'Bumped to rotate the derived client secret.' },
          redirectUris: { type: 'array', items: { type: 'string', format: 'uri' }, description: 'Exact match — no wildcards.' },
          postLogoutRedirectUris: { type: 'array', items: { type: 'string', format: 'uri' } },
          scopes: { type: 'array', items: { type: 'string' }, default: ['openid', 'email', 'profile'] },
          refreshTokens: { type: 'boolean', default: true, description: 'Allow offline_access / refresh_token.' },
          publicClient: { type: 'boolean', default: false, description: 'A browser or native app with no secret (PKCE only).' },
        },
      },
      saml: {
        type: 'object',
        title: 'SAML 2.0',
        properties: {
          entityId: { type: 'string', description: 'The service provider entity ID.' },
          acsUrl: { type: 'string', format: 'uri', description: 'Assertion Consumer Service URL (HTTP-POST).' },
          sloUrl: { type: 'string', format: 'uri' },
          nameIdFormat: { type: 'string', enum: ['email', 'persistent'], default: 'email' },
          signingCert: { type: 'string', description: 'SP certificate (PEM) when it signs its AuthnRequests.' },
        },
      },
    },
    required: ['name', 'protocol'],
  }) as const;

const ic = IdpClientSchema();
export type IdpClientModel = FromSchema<typeof ic>;

registerCollection('Identity Provider Client', DataType.idp_client, IdpClientSchema());

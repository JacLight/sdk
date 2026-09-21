import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType, ControlType } from '../../types';

/**
 * An invitation for someone to join a shared account as a customer.
 *
 * Deliberately separate from `user_invitation`, which grants a staff seat:
 * that flow creates a `user` and hands out roles, permissions and workspaces,
 * none of which apply here. An invitee joins as a `customer` and gets a single
 * grant — a `customer_association` to the account named below.
 *
 * Only new emails reach this collection. Someone who already shops here is
 * associated straight away instead, since they can already sign in and there is
 * nothing for them to accept.
 */
export const CustomerInvitationSchema = () => {
  return {
    type: 'object',
    properties: {
      email: {
        type: 'string',
        format: 'email',
        minLength: 3,
        maxLength: 150,
        group: 'invitee',
      },
      firstName: {
        type: 'string',
        group: 'invitee',
      },
      lastName: {
        type: 'string',
        group: 'invitee',
      },
      // The account they join on accepting, and how. Held here rather than
      // applied up front so a pending invitation grants nothing until taken up.
      sharedAccountId: {
        type: 'string',
        description: 'Shared account the invitee joins on accepting',
        'x-control': ControlType.selectMany,
        maxItems: 1,
        dataSource: {
          source: 'collection',
          collection: DataType.customer,
          value: 'sk',
          label: 'name',
        },
        group: 'grant',
      },
      sharedAccountRole: {
        type: 'string',
        enum: ['manager', 'buyer'],
        default: 'buyer',
        group: 'grant',
      },
      invitationToken: {
        type: 'string',
        readOnly: true,
        group: 'status',
      },
      status: {
        type: 'string',
        enum: ['pending', 'accepted', 'expired', 'cancelled'],
        default: 'pending',
        'x-control': ControlType.label,
        group: 'status',
      },
      expiryDate: {
        type: 'string',
        format: 'date-time',
        group: 'status',
      },
      acceptedAt: {
        type: 'string',
        format: 'date-time',
        readOnly: true,
        group: 'status',
      },
      invitedBy: {
        type: 'string',
        readOnly: true,
        group: 'inviter',
      },
      // The inviter as a person, for the email: "Ava Owner invited you to…".
      invitedByName: {
        type: 'string',
        group: 'inviter',
      },
      message: {
        type: 'string',
        group: 'inviter',
      },
    },
    required: ['email', 'sharedAccountId'],
  } as const;
};

const schema = CustomerInvitationSchema();
export type CustomerInvitationModel = FromSchema<typeof schema>;

registerCollection(
  'Customer Invitation',
  DataType.customer_invitation,
  CustomerInvitationSchema()
);

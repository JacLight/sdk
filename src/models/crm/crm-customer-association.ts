import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType, ControlType } from '../../types';

/**
 * Links a customer to another customer they may buy for.
 *
 * The account side is an ordinary `customer` record — an agency, department or
 * wholesale account. Nothing marks it as special: being the `sharedAccountId` of
 * an association is what makes it one, and the relationship is many-to-many, so a
 * customer can buy for several accounts and an account can have many members.
 *
 * Members always sign in as themselves; the account is only ever referenced, so
 * this row carries no credentials and grants no benefits of its own.
 *
 * Benefits follow the account, not this row: its own `groups` already drive
 * pricing through `applyGroupBenefits`, `sf_price_list`, product tiers and
 * `sf_discount.customerGroups`. A member of several accounts therefore gets
 * whatever each one's groups grant, with no benefit logic here.
 *
 * Approval, agreements and expiry are deliberately absent — `benefit_enrollment`
 * already models that lifecycle and can point at the account when joining needs
 * to be applied for rather than simply granted.
 */
export const CustomerAssociationSchema = () => {
  return {
    type: 'object',
    properties: {
      customerId: {
        type: 'string',
        description: 'The member who signs in',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'collection',
          collection: DataType.customer,
          value: 'email',
          label: ['email', 'firstName', 'lastName'],
        },
        group: 'association',
      },
      sharedAccountId: {
        type: 'string',
        description: 'The shared account they may order on',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'collection',
          collection: DataType.customer,
          value: 'sk',
          label: 'name',
        },
        group: 'association',
      },
      role: {
        type: 'string',
        enum: ['manager', 'buyer'],
        default: 'buyer',
        description:
          'Managers see every order placed on the account; buyers see only their own',
        group: 'association',
      },
      status: {
        type: 'string',
        enum: ['active', 'suspended'],
        default: 'active',
        'x-control': ControlType.label,
        group: 'association',
      },
    },
    required: ['customerId', 'sharedAccountId'],
  } as const;
};

const schema = CustomerAssociationSchema();
export type CustomerAssociationModel = FromSchema<typeof schema>;

registerCollection(
  'Customer Association',
  DataType.customer_association,
  CustomerAssociationSchema()
);

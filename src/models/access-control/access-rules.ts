import { DataType, ControlType } from '../../types';

// Who may pass, held on the thing itself — the same shape on access_zone,
// access_point and access_device: access groups, and people by name. Roles do
// not open doors. Deciding a read walks input device → access point → zone →
// ancestors: a deny anywhere wins; otherwise an allow anywhere lets them in (an
// allow on a door adds access to that door only); otherwise refused.

export const AccessGroupList = () => ({
  type: 'array',
  items: { type: 'string' },
  'x-control': ControlType.selectMany,
  dataSource: { source: 'collection', collection: DataType.access_group, value: 'name', label: ['title', 'name'] },
} as const);

export const AccessUserList = () => ({
  type: 'array',
  items: { type: 'string' },
  'x-control': ControlType.selectMany,
  dataSource: { source: 'collection', collection: DataType.user, value: 'sk', label: ['email', 'firstName', 'lastName'] },
} as const);

export const AccessEmployeeList = () => ({
  type: 'array',
  items: { type: 'string' },
  'x-control': ControlType.selectMany,
  dataSource: { source: 'collection', collection: DataType.bm_employee, value: 'sk', label: ['employeeId', 'personalInfo.firstName', 'personalInfo.lastName'] },
} as const);

const ruleProperties = () => ({ groups: AccessGroupList(), employees: AccessEmployeeList(), users: AccessUserList() });

export const AccessAllowSchema = () => ({
  type: 'object',
  properties: ruleProperties(),
} as const);

export const AccessDenySchema = () => ({
  type: 'object',
  properties: ruleProperties(),
  notes: 'Always wins over allow — here, on the access point, the zone or any zone above.',
} as const);

/** The access policy (PIN rules) in force here; empty = the one from the level above. */
export const AccessPolicyRef = () => ({
  type: 'string',
  description: 'Access policy here. Empty = from the access point / zone above.',
  'x-control': ControlType.selectMany,
  maxItems: 1,
  dataSource: { source: 'collection', collection: DataType.access_policy, value: 'name', label: ['title', 'name'] },
} as const);

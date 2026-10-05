import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType, ControlType } from '../../types';

// Who goes together through doors: "Office A — Admin", "Texas — Regional
// managers", "Night cleaners". Its own record in access control — not the
// platform's user groups, and not roles. Members are people: employees
// (bm_employee) and users. A person can be in many access groups.
// Zones, access points and input devices name the groups they allow or deny
// (allow.groups / deny.groups); the group itself never lists places.
export const AccessGroupSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        unique: true,
        transform: 'uri',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        group: 'name',
      },
      title: { type: 'string', group: 'name' },
      description: { type: 'string', 'x-control-variant': 'textarea' },
      employees: {
        type: 'array',
        items: { type: 'string' },
        description: 'Employees in this group (bm_employee).',
        'x-control': ControlType.selectMany,
        dataSource: { source: 'collection', collection: DataType.bm_employee, value: 'sk', label: ['employeeId', 'personalInfo.firstName', 'personalInfo.lastName'] },
      },
      users: {
        type: 'array',
        items: { type: 'string' },
        description: 'Users in this group (people with a login and no employee record).',
        'x-control': ControlType.selectMany,
        dataSource: { source: 'collection', collection: DataType.user, value: 'sk', label: ['email', 'firstName', 'lastName'] },
      },
    },
    required: ['name'],
  } as const;
};

const ags = AccessGroupSchema();
export type AccessGroupModel = FromSchema<typeof ags>;

registerCollection('Access Group', DataType.access_group, AccessGroupSchema());

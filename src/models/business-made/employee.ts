import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType, ControlType } from '../../types';
import { BusinessLocationField } from '../_location-fields';

export const EmployeeSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        transform: ['uri', 'lowercase', 'random-string::8'],
        group: 'name',
      },
      employeeId: {
        type: 'string',
        unique: true,
        group: 'name',
      },
      ...BusinessLocationField(),
      personalInfo: {
        type: 'object',
        collapsible: true,
        properties: {
          firstName: { type: 'string', group: 'name' },
          lastName: { type: 'string', group: 'name' },
          middleName: { type: 'string', group: 'name' },
          preferredName: { type: 'string', group: 'name' },
          dateOfBirth: { type: 'string', format: 'date' },
          gender: {
            type: 'string',
            enum: ['male', 'female', 'other', 'prefer-not-to-say'],
          },
          maritalStatus: {
            type: 'string',
            enum: ['single', 'married', 'divorced', 'widowed', 'other'],
          },
          nationality: { type: 'string' },
          socialSecurityNumber: { type: 'string' },
          driversLicense: { type: 'string' },
        },
        required: ['firstName', 'lastName'],
      },
      contactInfo: {
        type: 'object',
        collapsible: true,
        properties: {
          email: { type: 'string', format: 'email', group: 'contact' },
          phone: { type: 'string', group: 'contact' },
          alternatePhone: { type: 'string', group: 'contact' },
          address: {
            type: 'object',
            properties: {
              street: { type: 'string' },
              city: { type: 'string' },
              state: { type: 'string' },
              zipCode: { type: 'string' },
              country: { type: 'string' },
            },
          },
          emergencyContact: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              relationship: { type: 'string' },
              phone: { type: 'string' },
              email: { type: 'string' },
            },
          },
        },
        required: ['email', 'phone'],
      },
      employment: {
        type: 'object',
        collapsible: true,
        properties: {
          hireDate: { type: 'string', format: 'date', group: 'dates' },
          startDate: { type: 'string', format: 'date', group: 'dates' },
          endDate: { type: 'string', format: 'date', group: 'dates' },
          status: {
            type: 'string',
            enum: ['active', 'inactive', 'terminated', 'on-leave', 'suspended'],
            default: 'active',
            group: 'status',
          },
          employmentType: {
            type: 'string',
            enum: ['full-time', 'part-time', 'contract', 'temporary', 'intern'],
            group: 'status',
          },
          jobTitle: { type: 'string', group: 'role' },
          department: { type: 'string', group: 'role' },
          /** Rung on the org's job-level ladder (leave setup maps titles to levels). */
          jobLevel: { type: 'string', group: 'role' },
          location: {
            type: 'string',
            'x-control': ControlType.selectMany,
            dataSource: {
              source: 'collection',
              collection: DataType.location,
              value: 'name',
              label: 'name',
            },
            group: 'role',
          },
          supervisor: { type: 'string' },
          directReports: {
            type: 'array',
            items: { type: 'string' },
          },
          workSchedule: {
            type: 'object',
            properties: {
              hoursPerWeek: { type: 'number' },
              workDays: {
                type: 'array',
                items: {
                  type: 'string',
                  enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
                },
              },
              startTime: { type: 'string' },
              endTime: { type: 'string' },
              timeZone: { type: 'string' },
            },
          },
        },
        required: ['hireDate', 'status', 'employmentType', 'jobTitle', 'department'],
      },
      compensation: {
        type: 'object',
        collapsible: true,
        properties: {
          payType: {
            type: 'string',
            enum: ['salary', 'hourly', 'commission', 'contract'],
            group: 'pay',
          },
          baseSalary: { type: 'number', group: 'pay' },
          hourlyRate: { type: 'number', group: 'pay' },
          currency: { type: 'string', default: 'USD', group: 'pay' },
          payFrequency: {
            type: 'string',
            enum: ['weekly', 'bi-weekly', 'monthly', 'quarterly', 'annually'],
          },
          overtimeEligible: { type: 'boolean', group: 'overtime' },
          overtimeRate: { type: 'number', group: 'overtime' },
          commissionRate: { type: 'number' },
          bonusEligible: { type: 'boolean' },
        },
      },
      benefits: {
        type: 'object',
        collapsible: true,
        properties: {
          healthInsurance: { type: 'boolean', group: 'insurance' },
          dentalInsurance: { type: 'boolean', group: 'insurance' },
          visionInsurance: { type: 'boolean', group: 'insurance' },
          lifeInsurance: { type: 'boolean', group: 'insurance' },
          retirement401k: { type: 'boolean' },
          paidTimeOff: {
            type: 'object',
            properties: {
              vacationDays: { type: 'number' },
              sickDays: { type: 'number' },
              personalDays: { type: 'number' },
              holidayDays: { type: 'number' },
              accrualRate: { type: 'number' },
            },
          },
          otherBenefits: {
            type: 'array',
            items: { type: 'string' },
          },
        },
      },
      skills: {
        type: 'array',
        collapsible: true,
        items: {
          type: 'object',
          properties: {
            skillName: { type: 'string' },
            proficiencyLevel: {
              type: 'string',
              enum: ['beginner', 'intermediate', 'advanced', 'expert'],
            },
            certificationRequired: { type: 'boolean' },
            certificationDate: { type: 'string', format: 'date' },
            expirationDate: { type: 'string', format: 'date' },
          },
        },
      },
      training: {
        type: 'array',
        collapsible: true,
        items: {
          type: 'object',
          properties: {
            trainingName: { type: 'string' },
            trainingType: {
              type: 'string',
              enum: ['safety', 'technical', 'compliance', 'leadership', 'other'],
            },
            completionDate: { type: 'string', format: 'date' },
            expirationDate: { type: 'string', format: 'date' },
            instructor: { type: 'string' },
            certificateNumber: { type: 'string' },
            score: { type: 'number' },
            notes: { type: 'string' },
          },
        },
      },
      externalAccounts: {
        type: 'object',
        collapsible: true,
        readOnly: true,
        description:
          'Accounts provisioned for this person in other apps, keyed by integration ("google", "microsoft", "slack", "scim:<app>", "manual:<app>"). ' +
          'Written by journeys; offboarding revokes every one of them.',
        additionalProperties: {
          type: 'object',
          properties: {
            provider: { type: 'string', enum: ['google', 'microsoft', 'slack', 'scim', 'manual'] },
            app: { type: 'string' },
            configId: { type: 'string' },
            externalId: { type: 'string' },
            email: { type: 'string' },
            groups: { type: 'array', items: { type: 'string' } },
            status: { type: 'string', enum: ['active', 'suspended', 'deleted', 'pending'] },
            note: { type: 'string' },
            by: { type: 'string' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
      },
      issuedEquipment: {
        type: 'array',
        collapsible: true,
        readOnly: true,
        description: 'What the person holds: laptop, phone, uniform, keys, access card. Issued and collected by journey equipment tasks.',
        items: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            item: { type: 'string' },
            kind: { type: 'string', enum: ['laptop', 'phone', 'tablet', 'uniform', 'keys', 'access_card', 'badge', 'tools', 'vehicle', 'other'] },
            sku: { type: 'string' },
            locationId: { type: 'string' },
            quantity: { type: 'number' },
            assetTag: { type: 'string' },
            serialNumber: { type: 'string' },
            accessCardId: { type: 'string' },
            requiresReturn: { type: 'boolean' },
            status: { type: 'string', enum: ['issued', 'returned', 'lost', 'damaged', 'written_off'] },
            issuedAt: { type: 'string', format: 'date-time' },
            issuedBy: { type: 'string' },
            returnedAt: { type: 'string', format: 'date-time' },
            receivedBy: { type: 'string' },
            condition: { type: 'string', enum: ['good', 'fair', 'poor', 'damaged'] },
            journeyId: { type: 'string' },
            notes: { type: 'string' },
          },
        },
      },
      employmentHistory: {
        type: 'array',
        collapsible: true,
        readOnly: true,
        description: 'Earlier stints and transfers — a rehire or transfer appends here, nothing is overwritten.',
        items: {
          type: 'object',
          properties: {
            kind: { type: 'string', enum: ['stint', 'transfer', 'role_change'] },
            from: { type: 'string', format: 'date' },
            to: { type: 'string', format: 'date' },
            jobTitle: { type: 'string' },
            department: { type: 'string' },
            location: { type: 'string' },
            supervisor: { type: 'string' },
            employmentType: { type: 'string' },
            endReason: { type: 'string' },
            journeyId: { type: 'string' },
            recordedAt: { type: 'string', format: 'date-time' },
            recordedBy: { type: 'string' },
          },
        },
      },
      tinMatch: {
        type: 'object',
        collapsible: true,
        readOnly: true,
        title: 'IRS TIN match',
        description: 'Latest IRS TIN Matching result for this payee (Pub 2108A code 0-8). Written by the server; tinLast4 shows which TIN it was for.',
        properties: {
          code: { type: 'string', enum: ['0', '1', '2', '3', '4', '5', '6', '7', '8'] },
          meaning: { type: 'string' },
          checkedAt: { type: 'string', format: 'date-time' },
          method: { type: 'string', enum: ['interactive', 'bulk'] },
          submissionId: { type: 'string' },
          tinLast4: { type: 'string' },
        },
      },
      notes: {
        type: 'string',
        'x-control-variant': 'textarea',
      },
    },
    required: ['employeeId', 'personalInfo', 'contactInfo', 'employment'],
  } as const;
};

const emp = EmployeeSchema();
export type EmployeeModel = FromSchema<typeof emp>;

registerCollection('Employee', DataType.bm_employee, EmployeeSchema());

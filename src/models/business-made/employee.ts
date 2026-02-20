import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType, ControlType } from '../../types';

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

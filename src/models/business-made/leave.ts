import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType, ControlType } from '../../types';

// ========== Leave Type ==========

export const LeaveTypeSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        transform: ['prefix::lt-', 'random-string::6', 'uppercase'],
        group: 'name',
      },
      title: {
        type: 'string',
        minLength: 1,
        maxLength: 100,
        group: 'name',
      },
      code: {
        type: 'string',
        pattern: '^[A-Z_]+$',
        unique: true,
        group: 'name',
      },
      description: {
        type: 'string',
        'x-control-variant': 'textarea',
      },
      category: {
        type: 'string',
        enum: ['paid', 'unpaid', 'statutory', 'company'],
        group: 'type',
      },
      type: {
        type: 'string',
        enum: [
          'vacation',
          'sick',
          'personal',
          'bereavement',
          'jury-duty',
          'military',
          'maternity',
          'paternity',
          'parental',
          'fmla',
          'medical',
          'sabbatical',
          'volunteer',
          'holiday',
          'comp-time',
          'other',
        ],
        group: 'type',
      },
      accrual: {
        type: 'object',
        collapsible: true,
        properties: {
          method: {
            type: 'string',
            enum: ['none', 'annual', 'monthly', 'per-pay-period', 'hourly', 'tenure-based'],
          },
          rate: { type: 'number', description: 'Hours accrued per period' },
          maxAccrual: { type: 'number', description: 'Maximum hours that can be accrued' },
          maxCarryover: { type: 'number', description: 'Maximum hours that can carry over' },
          carryoverExpiration: { type: 'number', description: 'Months until carryover expires' },
          startAfterDays: { type: 'number', description: 'Days after hire before accrual starts' },
          prorateFirsstYear: { type: 'boolean', default: true },
        },
      },
      tenureBasedAccrual: {
        type: 'array',
        collapsible: true,
        items: {
          type: 'object',
          properties: {
            minYears: { type: 'number' },
            maxYears: { type: 'number' },
            annualHours: { type: 'number' },
          },
        },
      },
      allowance: {
        type: 'object',
        collapsible: true,
        properties: {
          type: { type: 'string', enum: ['unlimited', 'fixed', 'accrued'] },
          annualHours: { type: 'number' },
          canGoNegative: { type: 'boolean', default: false },
          maxNegativeHours: { type: 'number' },
        },
      },
      requestSettings: {
        type: 'object',
        collapsible: true,
        properties: {
          requiresApproval: { type: 'boolean', default: true },
          minAdvanceNoticeDays: { type: 'number', default: 0 },
          maxConsecutiveDays: { type: 'number' },
          minRequestHours: { type: 'number' },
          maxRequestHours: { type: 'number' },
          allowHalfDays: { type: 'boolean', default: true },
          allowHourlyRequests: { type: 'boolean', default: true },
          requiresDocumentation: { type: 'boolean', default: false },
          documentationAfterDays: { type: 'number' },
          blackoutDates: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                startDate: { type: 'string', format: 'date' },
                endDate: { type: 'string', format: 'date' },
                reason: { type: 'string' },
              },
            },
          },
        },
      },
      eligibility: {
        type: 'object',
        collapsible: true,
        properties: {
          employmentTypes: {
            type: 'array',
            items: {
              type: 'string',
              enum: ['full-time', 'part-time', 'contract', 'temporary'],
            },
          },
          minTenureDays: { type: 'number', default: 0 },
          departments: { type: 'array', items: { type: 'string' } },
          locations: { type: 'array', items: { type: 'string' } },
        },
      },
      paySettings: {
        type: 'object',
        collapsible: true,
        properties: {
          isPaid: { type: 'boolean', default: true },
          payPercentage: { type: 'number', default: 100 },
          paidByCompany: { type: 'boolean', default: true },
          paidByInsurance: { type: 'boolean', default: false },
        },
      },
      color: {
        type: 'string',
        'x-control': ControlType.color,
      },
      icon: { type: 'string' },
      sortOrder: { type: 'number', default: 0 },
      isActive: { type: 'boolean', default: true },
      isDefault: { type: 'boolean', default: false },
    },
    required: ['title', 'code', 'category', 'type'],
  } as const;
};

// ========== Leave Balance ==========

export const LeaveBalanceSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        transform: ['prefix::lb-', 'random-string::6', 'uppercase'],
        group: 'name',
      },
      employeeId: { type: 'string', group: 'employee' },
      employeeName: { type: 'string', group: 'employee' },
      leaveTypeId: { type: 'string', group: 'leave' },
      leaveTypeName: { type: 'string', group: 'leave' },
      leaveTypeCode: { type: 'string', group: 'leave' },
      year: { type: 'number', group: 'period' },
      balance: {
        type: 'object',
        properties: {
          entitled: { type: 'number', description: 'Total hours entitled' },
          accrued: { type: 'number', description: 'Hours accrued to date' },
          used: { type: 'number', description: 'Hours already used' },
          pending: { type: 'number', description: 'Hours in pending requests' },
          available: { type: 'number', description: 'Hours available to request' },
          carryover: { type: 'number', description: 'Hours carried over from previous year' },
          adjustment: { type: 'number', description: 'Manual adjustments' },
        },
      },
      transactions: {
        type: 'array',
        collapsible: true,
        items: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            date: { type: 'string', format: 'date-time' },
            type: {
              type: 'string',
              enum: ['accrual', 'used', 'adjustment', 'carryover', 'forfeited', 'payout'],
            },
            hours: { type: 'number' },
            balance: { type: 'number', description: 'Balance after transaction' },
            leaveRequestId: { type: 'string' },
            note: { type: 'string' },
            createdBy: { type: 'string' },
          },
        },
      },
      lastAccrualDate: { type: 'string', format: 'date' },
      nextAccrualDate: { type: 'string', format: 'date' },
      asOfDate: { type: 'string', format: 'date-time' },
    },
    required: ['employeeId', 'leaveTypeId', 'year'],
  } as const;
};

// ========== Leave Request ==========

export const LeaveRequestSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        transform: ['prefix::lr-', 'random-string::6', 'uppercase'],
        group: 'name',
      },
      employeeId: { type: 'string', group: 'employee' },
      employeeName: { type: 'string', group: 'employee' },
      employeeDepartment: { type: 'string', group: 'employee' },
      leaveTypeId: { type: 'string', group: 'leave' },
      leaveTypeName: { type: 'string', group: 'leave' },
      leaveTypeCode: { type: 'string', group: 'leave' },
      startDate: { type: 'string', format: 'date', group: 'dates' },
      endDate: { type: 'string', format: 'date', group: 'dates' },
      startTime: { type: 'string', description: 'For partial day requests' },
      endTime: { type: 'string', description: 'For partial day requests' },
      totalHours: { type: 'number', group: 'hours' },
      totalDays: { type: 'number', group: 'hours' },
      isPartialDay: { type: 'boolean', default: false },
      partialDayType: {
        type: 'string',
        enum: ['morning', 'afternoon', 'custom'],
      },
      reason: {
        type: 'string',
        'x-control-variant': 'textarea',
      },
      status: {
        type: 'string',
        enum: ['draft', 'pending', 'approved', 'rejected', 'cancelled', 'taken'],
        default: 'draft',
        group: 'status',
      },
      submittedAt: { type: 'string', format: 'date-time' },
      approvalChain: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            level: { type: 'number' },
            approverId: { type: 'string' },
            approverName: { type: 'string' },
            status: { type: 'string', enum: ['pending', 'approved', 'rejected', 'skipped'] },
            decidedAt: { type: 'string', format: 'date-time' },
            comments: { type: 'string' },
          },
        },
      },
      approvedBy: { type: 'string' },
      approvedAt: { type: 'string', format: 'date-time' },
      rejectedBy: { type: 'string' },
      rejectedAt: { type: 'string', format: 'date-time' },
      rejectionReason: { type: 'string' },
      cancelledBy: { type: 'string' },
      cancelledAt: { type: 'string', format: 'date-time' },
      cancellationReason: { type: 'string' },
      documentation: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            fileId: { type: 'string' },
            fileName: { type: 'string' },
            type: { type: 'string' },
            uploadedAt: { type: 'string', format: 'date-time' },
          },
        },
      },
      balanceAtRequest: { type: 'number' },
      balanceAfterRequest: { type: 'number' },
      delegateTo: { type: 'string' },
      emergencyContact: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          phone: { type: 'string' },
          email: { type: 'string' },
        },
      },
      notes: { type: 'string', 'x-control-variant': 'textarea' },
    },
    required: ['employeeId', 'leaveTypeId', 'startDate', 'endDate', 'totalHours'],
  } as const;
};

// ========== Leave Policy ==========

export const LeavePolicySchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        transform: ['prefix::lp-', 'random-string::6', 'uppercase'],
        group: 'name',
      },
      title: {
        type: 'string',
        minLength: 1,
        maxLength: 200,
        group: 'name',
      },
      description: {
        type: 'string',
        'x-control-variant': 'textarea',
      },
      leaveTypes: {
        type: 'array',
        description: 'Leave types included in this policy',
        items: { type: 'string' },
      },
      applicableTo: {
        type: 'object',
        collapsible: true,
        properties: {
          employmentTypes: {
            type: 'array',
            items: {
              type: 'string',
              enum: ['full-time', 'part-time', 'contract', 'temporary'],
            },
          },
          departments: { type: 'array', items: { type: 'string' } },
          locations: { type: 'array', items: { type: 'string' } },
          jobLevels: { type: 'array', items: { type: 'string' } },
        },
      },
      accrualSettings: {
        type: 'object',
        collapsible: true,
        properties: {
          accrualStartDate: {
            type: 'string',
            enum: ['hire-date', 'first-of-month', 'calendar-year-start', 'custom'],
          },
          resetDate: {
            type: 'string',
            enum: ['hire-anniversary', 'calendar-year', 'fiscal-year'],
          },
          prorationMethod: {
            type: 'string',
            enum: ['none', 'daily', 'monthly'],
          },
        },
      },
      carryoverRules: {
        type: 'object',
        collapsible: true,
        properties: {
          allowCarryover: { type: 'boolean', default: true },
          maxCarryoverHours: { type: 'number' },
          carryoverExpirationDays: { type: 'number' },
          useItOrLoseIt: { type: 'boolean', default: false },
        },
      },
      approvalRules: {
        type: 'object',
        collapsible: true,
        properties: {
          requireApproval: { type: 'boolean', default: true },
          approvalLevels: { type: 'number', default: 1 },
          autoApproveUnderHours: { type: 'number' },
          escalateAfterDays: { type: 'number' },
          skipLevelIfUnavailable: { type: 'boolean', default: false },
        },
      },
      restrictions: {
        type: 'object',
        collapsible: true,
        properties: {
          minConsecutiveDays: { type: 'number' },
          maxConsecutiveDays: { type: 'number' },
          minAdvanceNoticeDays: { type: 'number' },
          maxRequestsPerMonth: { type: 'number' },
          blackoutPeriods: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                startDate: { type: 'string', format: 'date' },
                endDate: { type: 'string', format: 'date' },
                reason: { type: 'string' },
                hardBlock: { type: 'boolean' },
              },
            },
          },
        },
      },
      payoutRules: {
        type: 'object',
        collapsible: true,
        properties: {
          allowPayout: { type: 'boolean', default: false },
          payoutOnTermination: { type: 'boolean', default: true },
          maxPayoutHours: { type: 'number' },
          payoutRate: { type: 'number', description: 'Percentage of regular rate' },
        },
      },
      holidayIntegration: {
        type: 'object',
        collapsible: true,
        properties: {
          excludeHolidays: { type: 'boolean', default: true },
          holidayCalendarId: { type: 'string' },
        },
      },
      effectiveDate: { type: 'string', format: 'date' },
      expirationDate: { type: 'string', format: 'date' },
      status: {
        type: 'string',
        enum: ['draft', 'active', 'inactive', 'archived'],
        default: 'draft',
      },
      version: { type: 'number', default: 1 },
      previousVersionId: { type: 'string' },
    },
    required: ['title', 'leaveTypes'],
  } as const;
};

// Type exports
const lt = LeaveTypeSchema();
export type LeaveTypeModel = FromSchema<typeof lt>;

const lb = LeaveBalanceSchema();
export type LeaveBalanceModel = FromSchema<typeof lb>;

const lr = LeaveRequestSchema();
export type LeaveRequestModel = FromSchema<typeof lr>;

const lp = LeavePolicySchema();
export type LeavePolicyModel = FromSchema<typeof lp>;

// Register collections
registerCollection('Leave Type', DataType.bm_leave_type, LeaveTypeSchema());
registerCollection('Leave Balance', DataType.bm_leave_balance, LeaveBalanceSchema());
registerCollection('Leave Request', DataType.bm_leave_request, LeaveRequestSchema());
registerCollection('Leave Policy', DataType.bm_leave_policy, LeavePolicySchema());

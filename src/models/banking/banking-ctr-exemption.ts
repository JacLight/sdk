import { FromSchema } from 'json-schema-to-ts';
import { registerBankingCollection as registerCollection } from './_banking-register';
import { DataType } from '../../types';
import { bankingRef } from './_banking-fields';

/**
 * A customer exempt from CTRs (31 CFR 1020.315): a bank, a government body, a listed company or
 * its subsidiary (Phase I), or a non-listed business or payroll customer that qualifies
 * (Phase II). The exemption covers only the named accounts — a payroll exemption only payroll
 * withdrawals — and starts when the DOEP (FinCEN 110) is filed, within 30 days of the first
 * reportable transaction. Phase II and listed exemptions are reviewed every year. An exemption
 * never covers SARs; exempt accounts are still monitored.
 */
export const BankingCtrExemptionSchema = () => {
  return {
    type: 'object',
    properties: {
      customer: bankingRef(DataType.customer, 'email', 'The exempt customer (the business).'),
      name: { type: 'string', description: 'Legal name of the exempt person.' },
      category: {
        type: 'string',
        enum: ['bank', 'government', 'governmental_authority', 'listed_company', 'listed_subsidiary', 'non_listed_business', 'payroll_customer'],
        description: '1020.315(b)(1)–(7). non_listed_business and payroll_customer are Phase II.',
      },
      accounts: { type: 'array', items: bankingRef(DataType.banking_account, 'accountNumber'), description: 'Only these accounts are exempt.' },
      payrollOnly: { type: 'boolean', default: false, description: 'Only cash withdrawals to pay US employees are exempt.' },
      status: {
        type: 'string',
        enum: ['pending', 'active', 'lapsed', 'revoked'],
        default: 'pending',
        description: 'pending: CTRs are still filed until the DOEP is. lapsed: the annual review is overdue or it no longer qualifies.',
      },
      firstReportableAt: { type: 'string', format: 'date' },
      doepDueBy: { type: 'string', format: 'date', readOnly: true, description: 'First reportable transaction + 30 days.' },
      doepFiledAt: { type: 'string', format: 'date' },
      doepBsaId: { type: 'string' },
      effectiveFrom: { type: 'string', format: 'date', readOnly: true },
      eligibility: {
        type: 'object',
        title: 'Phase II eligibility',
        collapsible: true,
        properties: {
          accountOpenedAt: { type: 'string', format: 'date' },
          reportableLast12Months: { type: 'integer', minimum: 0, description: 'Reportable cash transactions in the last 12 months (5 or more is “frequent”).' },
          ineligibleRevenuePercent: { type: 'number', minimum: 0, maximum: 100, description: 'Share of gross revenue from ineligible businesses (must be 50 or less).' },
          usOrganized: { type: 'boolean', description: 'Organized or registered in the US.' },
          riskAssessment: { type: 'string', description: 'The documented assessment when the 2-month wait is skipped.' },
        },
      },
      nextReviewBy: { type: 'string', format: 'date' },
      lastReviewedAt: { type: 'string', format: 'date-time', readOnly: true },
      reviewedBy: { type: 'string', readOnly: true },
      revokedAt: { type: 'string', format: 'date-time', readOnly: true },
      revokeReason: { type: 'string' },
    },
    required: ['category'],
  } as const;
};

const s = BankingCtrExemptionSchema();
export type BankingCtrExemptionModel = FromSchema<typeof s>;

registerCollection('Banking CTR Exemption', DataType.banking_ctr_exemption, BankingCtrExemptionSchema());

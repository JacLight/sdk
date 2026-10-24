import { FileInfoSchema } from '../file-info';
import { FromSchema } from 'json-schema-to-ts';
import { registerBankingCollection as registerCollection } from './_banking-register';
import { DataType } from '../../types';
import { bankingRef, cents } from './_banking-fields';

/** The principal reasons for an adverse action (Reg B sample form C-1). At most four go on a notice. */
export const BANKING_ADVERSE_REASONS = [
  'credit_application_incomplete',
  'insufficient_credit_references',
  'unable_to_verify_credit_references',
  'temporary_or_irregular_employment',
  'unable_to_verify_employment',
  'length_of_employment',
  'income_insufficient',
  'excessive_obligations',
  'unable_to_verify_income',
  'inadequate_collateral',
  'value_or_type_of_collateral',
  'too_short_residence',
  'temporary_residence',
  'unable_to_verify_residence',
  'no_credit_file',
  'limited_credit_experience',
  'poor_credit_performance',
  'delinquent_credit_obligations',
  'garnishment_or_judgment',
  'bankruptcy',
  'credit_score',
  'other',
] as const;

/**
 * An application for a loan, from intake to booking. Completing it (`completedAt`) starts the
 * Reg B clock: a decision — or a notice of incompleteness — is due within 30 days (`regBDueBy`).
 * The server works out the ratios (DTI, PTI, LTV, DSCR) and the TILA figures; credit data is
 * entered by hand until a bureau is connected. A decline or a counteroffer not taken gets an
 * adverse-action notice with up to four reasons. Booking it creates the `banking_loan`.
 */
export const BankingLoanApplicationSchema = () => {
  return {
    type: 'object',
    properties: {
      supportingDocuments: {
        type: 'array', title: 'Supporting documents',
        items: { ...FileInfoSchema(), properties: { ...FileInfoSchema().properties,
          kind: { type: 'string' }, customer: { type: 'string', readOnly: true },
          submittedAt: { type: 'string', format: 'date-time', readOnly: true },
          conditionIndex: { type: 'integer', minimum: 0 }, note: { type: 'string' },
        } },
      },
      number: { type: 'string', unique: true, readOnly: true, transform: ['random-string::8', 'uppercase'] },
      product: bankingRef(DataType.banking_loan_product, 'title'),
      status: {
        type: 'string',
        enum: ['draft', 'complete', 'verification', 'underwriting', 'approved', 'countered', 'declined', 'closing', 'booked', 'withdrawn', 'incomplete'],
        default: 'draft',
        description: 'complete: everything needed is in and the Reg B clock runs. verification: credit, identity, OFAC, MLA, income and collateral checks. incomplete: a notice of incompleteness was sent.',
      },
      channel: { type: 'string', enum: ['branch', 'phone', 'online'], default: 'branch' },
      officer: { type: 'string', description: 'Email of the loan officer.' },
      location: bankingRef(DataType.location, 'name'),
      request: {
        type: 'object',
        title: 'Request',
        properties: {
          amount: cents('Amount asked for.', { minimum: 1 }),
          termMonths: { type: 'integer', minimum: 1 },
          purpose: { type: 'string' },
          firstPaymentDate: { type: 'string', format: 'date', description: 'Empty: one payment period after booking.' },
        },
      },
      business: {
        type: 'object',
        title: 'Business',
        collapsible: true,
        description: 'Business credit: what DSCR and the Reg B notice rules ($1M revenue) are worked out from.',
        properties: {
          company: bankingRef(DataType.company, 'name'),
          legalName: { type: 'string' },
          annualRevenue: cents('Gross annual revenue.', { minimum: 0 }),
          netOperatingIncome: cents('Annual net operating income.', { minimum: 0 }),
          existingDebtService: cents('Annual payments on debts it already has.', { minimum: 0 }),
          yearsInBusiness: { type: 'number', minimum: 0 },
          naics: { type: 'string' },
        },
      },
      linkedAccount: bankingRef(DataType.banking_account, 'accountNumber', 'The deposit account the loan pays out to and takes payments from.'),
      disbursement: {
        type: 'object',
        title: 'Disbursement',
        properties: {
          method: { type: 'string', enum: ['deposit', 'payee'], default: 'deposit', description: 'deposit: to the linked account. payee: to the linked account, then on to an outside payee (a dealer, a lender being paid off).' },
          counterparty: bankingRef(DataType.banking_counterparty, 'holderName', 'The payee, when paid on.'),
          rail: { type: 'string', enum: ['ach', 'wire'] },
        },
      },
      parties: {
        type: 'array',
        title: 'Applicants',
        items: {
          type: 'object',
          properties: {
            customer: bankingRef(DataType.customer, 'email'),
            role: { type: 'string', enum: ['borrower', 'co_borrower', 'guarantor', 'cosigner'] },
            income: {
              type: 'object',
              properties: {
                grossMonthly: cents('Stated gross monthly income.', { minimum: 0 }),
                verifiedMonthly: cents('Verified gross monthly income.', { minimum: 0 }),
                source: { type: 'string' },
              },
            },
            employment: {
              type: 'object',
              properties: {
                employer: { type: 'string' },
                title: { type: 'string' },
                since: { type: 'string', format: 'date' },
                verified: { type: 'boolean' },
              },
            },
            housingPayment: cents('Monthly rent or mortgage.', { minimum: 0 }),
            liabilities: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  kind: { type: 'string', enum: ['mortgage', 'auto', 'student', 'card', 'personal', 'other'] },
                  creditor: { type: 'string' },
                  balance: cents('Owed.', { minimum: 0 }),
                  monthlyPayment: cents('Monthly payment.', { minimum: 0 }),
                  payingOff: { type: 'boolean', description: 'Paid off by this loan, so left out of DTI.' },
                },
              },
            },
            credit: {
              type: 'object',
              title: 'Credit',
              description: 'Entered by hand from the bureau report until a bureau is connected.',
              properties: {
                bureau: { type: 'string', enum: ['equifax', 'experian', 'transunion'] },
                pullType: { type: 'string', enum: ['hard', 'soft'] },
                score: { type: 'integer', minimum: 300, maximum: 900 },
                scoreModel: { type: 'string' },
                scoreRange: { type: 'string', description: 'e.g. 300–850, for the notice.' },
                keyFactors: { type: 'array', items: { type: 'string' }, maxItems: 5 },
                pulledAt: { type: 'string', format: 'date-time' },
                permissiblePurpose: { type: 'string', default: 'credit_application' },
                enteredBy: { type: 'string', readOnly: true },
              },
            },
            consents: {
              type: 'object',
              properties: {
                creditPull: { type: 'string', format: 'date-time' },
                esign: { type: 'string', format: 'date-time' },
                tcpa: { type: 'string', format: 'date-time' },
              },
            },
            mla: {
              type: 'object',
              description: 'Military Lending Act covered-borrower check (consumer credit).',
              properties: {
                covered: { type: 'boolean' },
                checkedAt: { type: 'string', format: 'date-time' },
                source: { type: 'string', enum: ['dod_mla_database', 'credit_report', 'self_declared'] },
              },
            },
          },
          required: ['customer', 'role'],
        },
      },
      collateral: {
        type: 'array',
        title: 'Collateral',
        items: {
          type: 'object',
          properties: {
            type: { type: 'string', enum: ['deposit', 'vehicle', 'real_estate', 'equipment', 'other'] },
            description: { type: 'string' },
            account: bankingRef(DataType.banking_account, 'accountNumber', 'Deposit-secured: the pledged account.'),
            hold: bankingRef(DataType.banking_hold, 'reason', 'Deposit-secured: the hold that pledges it.'),
            vin: { type: 'string' },
            year: { type: 'integer' },
            make: { type: 'string' },
            model: { type: 'string' },
            mileage: { type: 'integer', minimum: 0 },
            value: cents('Value.', { minimum: 0 }),
            valueSource: { type: 'string' },
            valuedAt: { type: 'string', format: 'date' },
            lienPosition: { type: 'integer', minimum: 1, default: 1 },
            titleStatus: { type: 'string', enum: ['not_applicable', 'applied', 'received', 'released'] },
            insurance: {
              type: 'object',
              properties: { carrier: { type: 'string' }, policy: { type: 'string' }, expiresAt: { type: 'string', format: 'date' } },
            },
          },
          required: ['type'],
        },
      },
      ratios: {
        type: 'object',
        readOnly: true,
        description: 'Worked out by the server from the parties, collateral and terms.',
        properties: {
          dtiBps: { type: 'integer', description: 'Debt-to-income with the new payment, in basis points.' },
          ptiBps: { type: 'integer', description: 'New payment to income, in basis points.' },
          ltvBps: { type: 'integer', description: 'Loan to collateral value, in basis points.' },
          dscrX100: { type: 'integer', description: 'Debt service coverage ×100 (business).' },
          computedAt: { type: 'string', format: 'date-time' },
        },
      },
      decision: {
        type: 'object',
        title: 'Decision',
        properties: {
          outcome: { type: 'string', enum: ['approved', 'approved_with_conditions', 'countered', 'declined'] },
          amount: cents('Approved amount.', { minimum: 0 }),
          termMonths: { type: 'integer', minimum: 1 },
          rateBps: { type: 'integer', minimum: 0 },
          riskGrade: { type: 'string' },
          exceptions: { type: 'array', items: { type: 'object', properties: { rule: { type: 'string' }, approvedBy: { type: 'string' } } } },
          authority: { type: 'string', description: 'The role whose lending authority covered it.' },
          decidedBy: { type: 'string', readOnly: true },
          decidedAt: { type: 'string', format: 'date-time', readOnly: true },
          note: { type: 'string' },
        },
      },
      reasonCodes: {
        type: 'array',
        maxItems: 4,
        items: { type: 'string', enum: [...BANKING_ADVERSE_REASONS] },
        description: 'Principal reasons for a decline or counteroffer, most important first.',
      },
      conditions: {
        type: 'array',
        title: 'Conditions',
        items: {
          type: 'object',
          properties: {
            text: { type: 'string' },
            status: { type: 'string', enum: ['open', 'cleared', 'waived'], default: 'open' },
            clearedBy: { type: 'string' },
            clearedAt: { type: 'string', format: 'date-time' },
            document: { type: 'string', description: 'The file that clears it.' },
          },
          required: ['text'],
        },
      },
      adverseAction: {
        type: 'object',
        title: 'Adverse action',
        properties: {
          required: { type: 'boolean', readOnly: true },
          dueBy: { type: 'string', format: 'date', readOnly: true, description: '30 days from completion (90 for a counteroffer not taken).' },
          sentAt: { type: 'string', format: 'date-time' },
          channel: { type: 'string', enum: ['mail', 'email', 'in_person'] },
          creditScore: { type: 'integer' },
          keyFactors: { type: 'array', items: { type: 'string' }, maxItems: 5 },
          bureau: { type: 'string' },
          notice: { type: 'string', readOnly: true, description: 'The notice as sent (Reg B and FCRA content).' },
          sentBy: { type: 'string', readOnly: true },
        },
      },
      tila: {
        type: 'object',
        readOnly: true,
        title: 'Truth in Lending',
        description: 'Computed by the server from the approved terms (12 CFR 1026.18).',
        properties: {
          aprBps: { type: 'integer' },
          financeCharge: cents('Finance charge.'),
          amountFinanced: cents('Amount financed.'),
          totalOfPayments: cents('Total of payments.'),
          paymentAmount: cents('Each regular payment.'),
          paymentCount: { type: 'integer' },
          firstPaymentDate: { type: 'string', format: 'date' },
          computedAt: { type: 'string', format: 'date-time' },
        },
      },
      verification: {
        type: 'object',
        title: 'Verification',
        properties: {
          identity: { type: 'string', enum: ['pending', 'verified', 'failed', 'not_required'], description: 'CIP for each party (customer_kyc).' },
          ofac: { type: 'string', enum: ['pending', 'clear', 'hit'] },
          income: { type: 'string', enum: ['pending', 'verified', 'not_required'] },
          collateral: { type: 'string', enum: ['pending', 'verified', 'not_required'] },
          note: { type: 'string' },
        },
      },
      insider: {
        type: 'object',
        readOnly: true,
        title: 'Reg O',
        description: 'Worked out by the server from Banking Config lending.insiders and the bank’s capital.',
        properties: {
          isInsider: { type: 'boolean' },
          parties: { type: 'array', items: { type: 'object', properties: { customer: { type: 'string' }, kind: { type: 'string' }, relatedTo: { type: 'string' } } } },
          aggregate: cents('Credit to the insider with this loan.'),
          threshold: cents('Above this the board approves first.'),
          boardApprovalRequired: { type: 'boolean' },
          computedAt: { type: 'string', format: 'date-time' },
        },
      },
      boardApproval: {
        type: 'object',
        title: 'Board approval (Reg O)',
        properties: {
          approvedAt: { type: 'string', format: 'date' },
          reference: { type: 'string', description: 'Board minutes reference.' },
          abstained: { type: 'string', description: 'The interested insider, who abstained.' },
          comparableTerms: { type: 'boolean', description: 'Terms are substantially the same as for comparable loans to non-insiders (215.4(a)).' },
          recordedBy: { type: 'string', readOnly: true },
        },
      },
      mlaCheck: {
        type: 'object',
        readOnly: true,
        properties: {
          covered: { type: 'boolean' },
          maprBps: { type: 'integer' },
          capBps: { type: 'integer' },
          ok: { type: 'boolean' },
        },
      },
      counteroffer: {
        type: 'object',
        properties: {
          acceptedAt: { type: 'string', format: 'date-time' },
          declinedAt: { type: 'string', format: 'date-time' },
        },
      },
      completedAt: { type: 'string', format: 'date-time', readOnly: true, description: 'When the application became complete — starts the Reg B clock.' },
      regBDueBy: { type: 'string', format: 'date', readOnly: true },
      withdrawnReason: { type: 'string' },
      approval: bankingRef(DataType.banking_approval, 'summary', 'The booking’s maker-checker request.'),
      loan: bankingRef(DataType.banking_loan, 'number', 'The loan booked from it.'),
    },
  } as const;
};

const s = BankingLoanApplicationSchema();
export type BankingLoanApplicationModel = FromSchema<typeof s>;

registerCollection('Banking Loan Application', DataType.banking_loan_application, BankingLoanApplicationSchema());

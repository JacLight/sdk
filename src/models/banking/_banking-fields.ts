import { ControlType, DataType } from '../../types';

/**
 * Shared pieces of the banking records.
 *
 * Money is in minor units (cents for USD) as whole numbers everywhere in banking, so no
 * balance ever carries a float remainder. Rates are basis points (100 = 1%).
 */

/** A link to another record by its sk. */
export const bankingRef = <C extends DataType>(collection: C, label: string = 'name', description?: string) =>
  ({
    type: 'string',
    'x-control': ControlType.selectMany,
    dataSource: { source: 'collection', collection, value: 'sk', label },
    ...(description ? { description } : {}),
  } as const);

/** An amount in minor units (cents). */
export const cents = (description: string, extra: { minimum?: number; readOnly?: boolean; group?: string } = {}) =>
  ({ type: 'integer', description: `${description} In cents.`, ...extra } as const);

/** The rails money moves on. `book` is between two accounts at this bank; `cash` is currency over a teller's counter or between tills and the vault. */
export const BANKING_RAILS = ['book', 'ach', 'wire', 'rtp', 'fednow', 'card', 'check', 'cash'] as const;

/**
 * A limit on moving money: how much (and how many) on a rail, in a direction, per period.
 * Products carry the defaults; an account can carry its own, which win.
 */
export const BankingLimitsField = () =>
  ({
    type: 'array',
    title: 'Limits',
    collapsible: true,
    items: {
      type: 'object',
      properties: {
        rail: { type: 'string', enum: [...BANKING_RAILS, 'atm'] },
        direction: { type: 'string', enum: ['out', 'in'], default: 'out' },
        period: { type: 'string', enum: ['transaction', 'day', 'month'], default: 'day' },
        amount: cents('Most that can move in the period.', { minimum: 0 }),
        count: { type: 'integer', minimum: 0, description: 'Most transactions in the period.' },
      },
      required: ['rail', 'period'],
    },
  } as const);

/**
 * Cash by denomination: how many notes of each, and loose coin as an amount. A till or vault
 * position, an opening or closing count, a buy or sell between till and vault.
 */
export const BANKING_DENOMINATIONS = { n100: 10000, n50: 5000, n20: 2000, n10: 1000, n5: 500, n2: 200, n1: 100 } as const;
export const BankingDenominationsField = (description = 'Notes counted by denomination, and loose coin.') =>
  ({
    type: 'object',
    description,
    properties: {
      n100: { type: 'integer', minimum: 0, title: '$100 notes' },
      n50: { type: 'integer', minimum: 0, title: '$50 notes' },
      n20: { type: 'integer', minimum: 0, title: '$20 notes' },
      n10: { type: 'integer', minimum: 0, title: '$10 notes' },
      n5: { type: 'integer', minimum: 0, title: '$5 notes' },
      n2: { type: 'integer', minimum: 0, title: '$2 notes' },
      n1: { type: 'integer', minimum: 0, title: '$1 notes' },
      coin: cents('Coin, by value.', { minimum: 0 }),
    },
  } as const);

/** A postal address, as BSA forms and notices need it. */
const bankingAddress = () =>
  ({
    type: 'object',
    properties: {
      street: { type: 'string' },
      city: { type: 'string' },
      state: { type: 'string' },
      zip: { type: 'string' },
      country: { type: 'string', default: 'US' },
    },
  } as const);

/**
 * A person (or entity) as a BSA record identifies them — a CTR's subject or the individual who
 * presented the cash, a monetary instrument's buyer. ID data is the document actually examined:
 * "known customer" is not identification (31 CFR 1010.312). An unknown TIN or date of birth is
 * said so, with why.
 */
export const BankingIdentifiedPersonField = (description: string) =>
  ({
    type: 'object',
    description,
    properties: {
      customer: bankingRef(DataType.customer, 'email', 'The CRM customer, when they are one.'),
      kind: { type: 'string', enum: ['individual', 'entity'], default: 'individual' },
      firstName: { type: 'string' },
      middleName: { type: 'string' },
      lastName: { type: 'string' },
      entityName: { type: 'string' },
      dba: { type: 'string' },
      occupation: { type: 'string', description: 'Occupation or type of business.' },
      naics: { type: 'string' },
      address: bankingAddress(),
      tin: { type: 'string', description: 'SSN, EIN or ITIN. Stored encrypted; responses show the last 4.' },
      tinType: { type: 'string', enum: ['ssn', 'ein', 'itin', 'foreign'] },
      tinUnknownReason: { type: 'string', description: 'Why the TIN could not be had, when it is missing.' },
      dob: { type: 'string', format: 'date' },
      dobUnknownReason: { type: 'string' },
      phone: { type: 'string' },
      email: { type: 'string' },
      idType: { type: 'string', enum: ['drivers_license', 'state_id', 'passport', 'alien_registration', 'military_id', 'other'] },
      idNumber: { type: 'string' },
      idIssuer: { type: 'string', description: 'Issuing state or country.' },
    },
  } as const);

/** What a record is about, for lists and the Customer 360: a datatype and its sk. */
export const BankingAboutField = () =>
  ({
    type: 'object',
    properties: {
      datatype: { type: 'string' },
      id: { type: 'string' },
      label: { type: 'string', description: 'How a list names it (an account’s last 4, a loan number).' },
    },
  } as const);

/**
 * Actions that wait for a second person (maker-checker). Each is Banking Config data:
 * `required` turns the check on, `roles` are who may approve (the maker never), and `over`
 * lets amounts at or under it run at once.
 */
export const BANKING_APPROVAL_ACTIONS = [
  'adjustment',
  'fee_waiver',
  'holder_change',
  'wire_release',
  'limit_change',
  'product_change',
  'journal_entry',
  'rule_change',
  'sar_decision',
  'risk_rating',
  'check_stop',
  'customer_authenticator',
  'loan_autopay',
  'ctr_exemption',
  'teller_override',
  'loan_decision',
  'loan_booking',
  'loan_disbursement',
  'loan_fee_waiver',
  'loan_modification',
  'charge_off',
  'dormancy_reset',
  'hold_waiver',
] as const;
export type BankingApprovalAction = (typeof BANKING_APPROVAL_ACTIONS)[number];

export interface BankingApprovalRule {
  required: boolean;
  roles: string[];
  over?: number;
}

/** The bank's approval rules out of the box (research §2 role catalogue). Owner can always approve; the maker never can. */
export const BANKING_APPROVAL_DEFAULTS: Record<BankingApprovalAction, BankingApprovalRule> = {
  adjustment: { required: true, roles: ['DepositOps', 'BranchManager', 'Controller', 'Owner'] },
  fee_waiver: { required: true, roles: ['BranchManager', 'DepositOps', 'Owner'], over: 2500 },
  holder_change: { required: true, roles: ['BranchManager', 'DepositOps', 'Owner'] },
  wire_release: { required: true, roles: ['PaymentsOps', 'BranchManager', 'Owner'] },
  limit_change: { required: true, roles: ['BranchManager', 'DepositOps', 'CardOps', 'Owner'] },
  product_change: { required: true, roles: ['ComplianceOfficer', 'Controller', 'Owner'] },
  journal_entry: { required: true, roles: ['Controller', 'Owner'] },
  rule_change: { required: true, roles: ['BSAOfficer', 'Owner'] },
  sar_decision: { required: true, roles: ['BSAOfficer', 'Owner'] },
  risk_rating: { required: true, roles: ['BSAOfficer', 'ComplianceOfficer', 'Owner'] },
  check_stop: { required: true, roles: ['HeadTeller', 'BranchManager', 'Owner'] },
  customer_authenticator: { required: true, roles: ['Owner', 'BSAOfficer'] },
  loan_autopay: { required: true, roles: ['Owner', 'BranchManager'] },
  ctr_exemption: { required: true, roles: ['BSAOfficer', 'Owner'] },
  teller_override: { required: true, roles: ['HeadTeller', 'BranchManager', 'Owner'] },
  loan_decision: { required: true, roles: ['Underwriter', 'BranchManager', 'Owner'] },
  loan_booking: { required: true, roles: ['LoanProcessor', 'Underwriter', 'BranchManager', 'Owner'] },
  loan_disbursement: { required: true, roles: ['LoanProcessor', 'BranchManager', 'Owner'], over: 2500000 },
  loan_fee_waiver: { required: true, roles: ['LoanServicer', 'BranchManager', 'Owner'], over: 2500 },
  loan_modification: { required: true, roles: ['Underwriter', 'BranchManager', 'Owner'] },
  charge_off: { required: true, roles: ['Controller', 'BranchManager', 'Owner'] },
  dormancy_reset: { required: true, roles: ['DepositOps', 'BranchManager', 'Owner'] },
  hold_waiver: { required: true, roles: ['HeadTeller', 'BranchManager', 'DepositOps', 'Owner'], over: 2500 },
};

/** Cash, Reg CC, lending and collections figures out of the box. All are dated or bank policy, never code. */
export const BANKING_CASH_DEFAULTS = {
  ctrThreshold: 1000000,
  milMin: 300000,
  milMax: 1000000,
  drawerMinimum: 100000,
  drawerMaximum: 1000000,
  overShortTolerance: 500,
  cashOutLimit: 500000,
  checkCashingFee: 0,
  officialCheckFee: 0,
  moneyOrderFee: 0,
};
export const BANKING_REGCC_DEFAULTS = {
  effectiveFrom: '2025-07-01',
  nextDayAmount: 27500,
  largeDeposit: 672500,
  cashWithdrawal: 55000,
  newAccountDays: 30,
  depositCutoff: '17:00',
  newAccountHoldDays: 9,
  exceptionExtraDays: 5,
  onUsExtraDays: 1,
  overdraftDays: 6,
  overdraftLargeDays: 2,
  overdraftLookbackMonths: 6,
};
/** Someone the bank lends to under Reg O (12 CFR 215): an executive officer, director or principal shareholder, or a company they control. */
export interface BankingInsider {
  customer: string;
  kind: 'executive_officer' | 'director' | 'principal_shareholder' | 'related_interest';
  /** A related interest: the insider (customer sk) who controls it. */
  relatedTo?: string;
  note?: string;
}
export const BANKING_LENDING_DEFAULTS = {
  lateFeeGraceDays: 15,
  nonaccrualDays: 90,
  chargeOffDaysClosedEnd: 120,
  chargeOffDaysOpenEnd: 180,
  /** Reg B: days from a complete application to the notice of action; and after a counteroffer not taken. */
  regBNoticeDays: 30,
  counterofferNoticeDays: 90,
  /** Capital and unimpaired surplus (cents) as of `capitalAsOf` — Reg O thresholds are worked out from it. */
  capitalAndSurplus: 0,
  capitalAsOf: '',
  /** Reg O 215.4(b): board approval above the greater of this and `insiderBoardPercentBps` of capital, and always above `insiderBoardAlways`. */
  insiderBoardMinimum: 2500000,
  insiderBoardPercentBps: 500,
  insiderBoardAlways: 50000000,
  insiders: [] as BankingInsider[],
  /** MLA (32 CFR 232): most MAPR to a covered borrower. SCRA: most rate on pre-service debt. */
  mlaMaprCapBps: 3600,
  scraRateCapBps: 600,
  /** On the adverse-action notice (Reg B 1002.9(b)(1)): the creditor's address, and its federal regulator. */
  creditorAddress: '',
  regulatorName: '',
  regulatorAddress: '',
};
export const BANKING_COLLECTIONS_DEFAULTS = { callsPer7Days: 7, windowStart: '08:00', windowEnd: '21:00', conversationCooldownDays: 7 };

const approvalRule = (action: BankingApprovalAction) =>
  ({
    type: 'object',
    title: action.replace(/_/g, ' '),
    properties: {
      required: { type: 'boolean', default: BANKING_APPROVAL_DEFAULTS[action].required, description: 'A second person must approve it.' },
      roles: { type: 'array', items: { type: 'string' }, default: BANKING_APPROVAL_DEFAULTS[action].roles, description: 'Roles whose holders may approve (never the person who asked).' },
      over: cents('Amounts at or under this run without approval. Empty: every amount needs it.', { minimum: 0 }),
    },
  } as const);

/** Banking Config › approvals: one rule per maker-checker action. */
export const BankingApprovalsField = () =>
  ({
    type: 'object',
    title: 'Approvals (maker-checker)',
    collapsible: true,
    description: 'Which actions wait for a second person, who may approve them, and the amount under which they run at once.',
    properties: Object.fromEntries(BANKING_APPROVAL_ACTIONS.map(a => [a, approvalRule(a)])) as Record<BankingApprovalAction, ReturnType<typeof approvalRule>>,
  } as const);

/** Bank-maintained, explicitly reviewed jurisdiction policies. No legal periods are supplied by the SDK. */
export const BankingEscheatPoliciesField = () => ({
  type: 'object', title: 'Reviewed escheat policies', collapsible: true,
  properties: { rules: { type: 'array', default: [], items: { type: 'object', properties: {
    jurisdiction: { type: 'string', pattern: '^US-[A-Z]{2}$' },
    propertyType: { type: 'string', enum: ['deposit', 'official_check'] },
    dormancyYears: { type: 'integer', minimum: 1, maximum: 50 },
    dueDiligenceDays: { type: 'integer', minimum: 0, maximum: 730 },
    authority: { type: 'string', description: 'Reviewed legal/policy authority reference, supplied by the bank.' },
    effectiveFrom: { type: 'string', format: 'date' },
    reviewed: { type: 'boolean', description: 'Attest the new/changed policy has been reviewed. Server stamps the reviewer.' },
    reviewedBy: { type: 'string', readOnly: true }, reviewedAt: { type: 'string', format: 'date-time', readOnly: true },
  }, required: ['jurisdiction', 'propertyType', 'dormancyYears', 'dueDiligenceDays', 'authority', 'effectiveFrom'] } } },
} as const);

/** Explicit staff assignment; no jurisdiction is inferred from an address. */
export const BankingEscheatAssignmentField = () => ({
  type: 'object', title: 'Reviewed escheat jurisdiction', readOnly: true,
  properties: { jurisdiction: { type: 'string' }, authorityNote: { type: 'string' }, assignedBy: { type: 'string' }, assignedAt: { type: 'string', format: 'date-time' } },
} as const);

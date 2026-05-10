import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType } from '../../types';

/**
 * Configurable tax rules. Federal/state/local/FICA/Medicare/FUTA/SUTA all
 * live here as data so each year's rates, brackets, and wage bases can be
 * updated by an admin without code changes.
 *
 * Calculation modes:
 *   - flat:           rate × wage (no cap)
 *   - wage_base_capped: rate × min(wage, wageBase) — used for SS, FUTA, SUTA
 *   - bracket:        progressive — for federal/state income tax with brackets
 *   - additional_threshold: extra rate above a threshold (e.g. additional 0.9% Medicare > $200k)
 *
 * `effectiveYear` lets you keep last-year's rule alongside this-year's. Run
 * engine picks the most recent rule whose effectiveYear <= run year.
 *
 * For state/local, attach `state` (and optionally `locality`) so the engine
 * applies only to employees living/working there.
 *
 * For per-filing-status brackets (federal income), create one rule per
 * filingStatus or use the `brackets` array's `filingStatus` discriminator.
 */
export const TaxBracketSchema = {
  type: 'object',
  properties: {
    filingStatus: {
      type: 'string',
      enum: ['single', 'married_filing_jointly', 'married_filing_separately', 'head_of_household', 'any'],
      default: 'any',
    },
    over: {
      type: 'number',
      description: 'Income threshold this bracket starts at',
    },
    upTo: {
      type: 'number',
      description: 'Income threshold this bracket ends at (omit for "no upper bound")',
    },
    rate: {
      type: 'number',
      description: 'Marginal rate (0–1, e.g. 0.22 = 22%)',
    },
    flatBase: {
      type: 'number',
      description: 'Tax owed at the bottom of this bracket (federal-style: 17,168.50 + 22% over $89,450)',
    },
  },
  required: ['over', 'rate'],
} as const;

export const TaxRuleSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        description: 'Display name (e.g. "Federal Income 2026", "California SDI 2026", "FICA SS")',
        group: 'name',
      },
      jurisdiction: {
        type: 'string',
        enum: [
          'federal_income',
          'fica_ss',
          'fica_medicare',
          'additional_medicare',
          'futa',
          'state_income',
          'state_disability',
          'suta',
          'local_income',
          'other',
        ],
        group: 'name',
      },
      state: {
        type: 'string',
        description: 'Two-letter state code (for state/local rules). Empty for federal.',
        group: 'name',
      },
      locality: {
        type: 'string',
        description: 'City/county for local taxes',
        group: 'name',
      },
      effectiveYear: {
        type: 'number',
        description: 'Tax year this rule applies to (rule with greatest year <= run year wins)',
        group: 'name',
      },
      calculationType: {
        type: 'string',
        enum: ['flat', 'wage_base_capped', 'bracket', 'additional_threshold'],
        group: 'calc',
      },
      // For flat / wage_base_capped / additional_threshold
      employeeRate: {
        type: 'number',
        description: 'Employee-paid rate 0–1 (e.g. 0.062 for SS 6.2%)',
        group: 'calc',
      },
      employerRate: {
        type: 'number',
        description: 'Employer-paid rate 0–1 (FICA SS 6.2% employer match; FUTA 0.6%; SUTA varies)',
        group: 'calc',
      },
      wageBase: {
        type: 'number',
        description:
          'For wage_base_capped: cap on taxable wages (e.g. SS wage base $168,600). ' +
          'For additional_threshold: threshold above which the extra rate applies.',
        group: 'calc',
      },
      // For bracket
      brackets: {
        type: 'array',
        description: 'Progressive bracket table (calculationType=bracket)',
        items: TaxBracketSchema,
        group: 'calc',
      },
      // Per-pay vs annual
      annualized: {
        type: 'boolean',
        default: true,
        description:
          'When true, brackets are applied to annualized wages (per-pay × periodsPerYear) ' +
          'and the result is divided back. Standard for federal income tax.',
        group: 'calc',
      },
      // What earnings/deductions feed into the wage base for this tax
      reducedByPretax: {
        type: 'boolean',
        default: true,
        description:
          'Whether pretax deductions that flag matching reduce* fields reduce the wage base ' +
          'for this tax. Federal income: yes. FICA: depends on the deduction (HSA yes, 401k no).',
        group: 'calc',
      },
      // For state/local — applies only to employees in this state/locality
      active: {
        type: 'boolean',
        default: true,
      },
    },
    required: ['name', 'jurisdiction', 'calculationType', 'effectiveYear'],
  } as const;
};

const tr = TaxRuleSchema();
export type TaxRuleModel = FromSchema<typeof tr>;

registerCollection('Tax Rule', DataType.bm_tax_rule, TaxRuleSchema());

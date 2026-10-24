import { FromSchema } from 'json-schema-to-ts';
import { registerBankingCollection as registerCollection } from './_banking-register';
import { DataType } from '../../types';
import { BANKING_APPROVAL_ACTIONS, BankingAboutField, cents } from './_banking-fields';

/**
 * Maker-checker: an action one person asked for that a second person must approve before it
 * happens — an adjustment, a wire release, a holder change, a SAR decision, a teller override.
 * The action and everything it needs (`params`) are kept here; nothing changes until a checker
 * who is not the maker approves it, then the bank runs it and keeps the outcome. It waits in
 * the approvers' tray as a task on the `banking-approval` workflow.
 */
export const BankingApprovalSchema = () => {
  return {
    type: 'object',
    properties: {
      action: { type: 'string', enum: [...BANKING_APPROVAL_ACTIONS], readOnly: true },
      params: { type: 'object', readOnly: true, description: 'What the action runs with, exactly as asked.' },
      summary: { type: 'string', readOnly: true, description: 'What the approver reads: the action in words.' },
      amount: { ...cents('The amount at stake, when there is one.'), readOnly: true },
      about: BankingAboutField(),
      maker: { type: 'string', readOnly: true, description: 'Email of the person who asked.' },
      makerName: { type: 'string', readOnly: true },
      approvers: { type: 'array', items: { type: 'string' }, readOnly: true, description: 'Emails it was sent to (never the maker).' },
      excluded: { type: 'array', items: { type: 'string' }, readOnly: true, description: 'Emails who may not approve it besides the maker (a wire’s initiator).' },
      task: { type: 'string', readOnly: true, description: 'The approval task (workflow banking-approval).' },
      status: {
        type: 'string',
        enum: ['pending', 'running', 'done', 'failed', 'rejected', 'cancelled'],
        default: 'pending',
        readOnly: true,
        description: 'running: approved and the action is being carried out. failed: approved, but the action could not be done (error says why).',
      },
      decidedBy: { type: 'string', readOnly: true },
      decidedAt: { type: 'string', format: 'date-time', readOnly: true },
      note: { type: 'string', readOnly: true, description: 'The checker’s note.' },
      result: { type: 'object', readOnly: true, description: 'What the action returned.' },
      error: { type: 'string', readOnly: true },
      completedAt: { type: 'string', format: 'date-time', readOnly: true },
    },
    required: ['action'],
  } as const;
};

const s = BankingApprovalSchema();
export type BankingApprovalModel = FromSchema<typeof s>;

registerCollection('Banking Approval', DataType.banking_approval, BankingApprovalSchema());

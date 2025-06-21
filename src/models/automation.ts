import { registerCollection } from '../default-schema';
import { ControlType, DataType } from '../types';
import { FromSchema } from 'json-schema-to-ts';

export const AutomationSchema = () => {
  return {
    type: 'object',
    required: ['name', 'status'],
    properties: {
      name: {
        type: 'string',
        minLength: 1,
        maxLength: 200,
        group: 'basic',
        description: 'Automation workflow name',
      },
      description: {
        type: 'string',
        maxLength: 1000,
        'x-control-variant': 'textarea',
        group: 'basic',
        description: 'Automation workflow description',
      },
      category: {
        type: 'string',
        enum: ['lead_generation', 'nurturing', 'sales', 'customer_service', 'marketing', 'onboarding', 'retention'],
        'x-control': ControlType.selectMany,
        maxItems: 1,
        group: 'basic',
        description: 'Automation category',
      },
      status: {
        type: 'string',
        enum: ['active', 'inactive', 'draft', 'testing'],
        default: 'draft',
        'x-control': ControlType.selectMany,
        maxItems: 1,
        group: 'basic',
        description: 'Automation status',
      },
      steps: {
        type: 'array',
        items: AutomationStepSchema(),
        group: 'workflow',
        description: 'Automation workflow steps',
      },
      connections: {
        type: 'array',
        items: WorkflowConnectionSchema(),
        group: 'workflow',
        description: 'Step connections and flow control',
      },
      subFlows: {
        type: 'array',
        items: SubFlowSchema(),
        group: 'advanced',
        description: 'Sub-workflows for better organization',
      },
      flowControls: {
        type: 'array',
        items: FlowControlSchema(),
        group: 'advanced',
        description: 'Flow control elements (jump, loop, etc.)',
      },
      aiOptimization: AIOptimizationSchema(),
      abTesting: ABTestingSchema(),
      analytics: AutomationAnalyticsSchema(),
      tags: {
        type: 'array',
        items: {
          type: 'string',
        },
        default: [],
        'x-control': ControlType.selectMany,
        'x-control-variant': 'chip',
        group: 'metadata',
        description: 'Automation tags',
      },
      timeBasedLogic: {
        type: 'array',
        items: TimeBasedLogicSchema(),
        group: 'advanced',
        description: 'GoHighLevel-style time-based logic',
      },
      createdBy: {
        type: 'string',
        group: 'metadata',
        description: 'Creator user ID',
      },
    },
  } as const;
};

export const AutomationStepSchema = () => {
  return {
    type: 'object',
    required: ['id', 'type', 'name', 'order'],
    properties: {
      id: {
        type: 'string',
        description: 'Step unique identifier',
      },
      type: {
        type: 'string',
        enum: ['trigger', 'action', 'condition', 'wait'],
        'x-control': ControlType.selectMany,
        maxItems: 1,
        description: 'Step type',
      },
      subtype: {
        type: 'string',
        description: 'Specific step subtype for different implementations',
      },
      name: {
        type: 'string',
        minLength: 1,
        maxLength: 100,
        description: 'Step display name',
      },
      config: {
        type: 'object',
        description: 'Step configuration (flexible object)',
      },
      conditions: {
        type: 'array',
        items: TriggerConditionSchema(),
        description: 'Trigger conditions for this step',
      },
      position: PositionSchema(),
      delay: DelayConfigSchema(),
      retryLogic: RetryLogicSchema(),
      order: {
        type: 'number',
        minimum: 1,
        description: 'Step execution order',
      },
    },
  } as const;
};

export const TriggerConditionSchema = () => {
  return {
    type: 'object',
    required: ['field', 'operator', 'value'],
    properties: {
      field: {
        type: 'string',
        description: 'Field to check condition against',
      },
      operator: {
        type: 'string',
        enum: ['equals', 'not_equals', 'contains', 'not_contains', 'greater_than', 'less_than', 'exists', 'not_exists', 'in_last', 'after_date', 'before_date', 'between', 'regex_match'],
        description: 'Comparison operator',
      },
      value: {
        description: 'Value to compare against (can be any type)',
      },
      timeframe: TimeframeSchema(),
    },
  } as const;
};

export const WorkflowConnectionSchema = () => {
  return {
    type: 'object',
    required: ['id', 'from', 'to'],
    properties: {
      id: {
        type: 'string',
        description: 'Connection unique identifier',
      },
      from: {
        type: 'string',
        description: 'Source step ID',
      },
      to: {
        type: 'string',
        description: 'Target step ID',
      },
      fromPort: {
        type: 'string',
        description: 'Source port/output',
      },
      toPort: {
        type: 'string',
        description: 'Target port/input',
      },
      condition: {
        type: 'string',
        description: 'Condition for this connection',
      },
      delay: DelayConfigSchema(),
    },
  } as const;
};

export const SubFlowSchema = () => {
  return {
    type: 'object',
    required: ['id', 'name', 'steps'],
    properties: {
      id: {
        type: 'string',
        description: 'Sub-flow unique identifier',
      },
      name: {
        type: 'string',
        description: 'Sub-flow name',
      },
      description: {
        type: 'string',
        description: 'Sub-flow description',
      },
      steps: {
        type: 'array',
        items: {
          type: 'string',
        },
        description: 'Array of step IDs in this sub-flow',
      },
      entryPoints: {
        type: 'array',
        items: {
          type: 'string',
        },
        description: 'Steps that can jump to this sub-flow',
      },
      exitPoints: {
        type: 'array',
        items: {
          type: 'string',
        },
        description: 'Steps this sub-flow can jump to',
      },
    },
  } as const;
};

export const FlowControlSchema = () => {
  return {
    type: 'object',
    required: ['id', 'type'],
    properties: {
      id: {
        type: 'string',
        description: 'Flow control unique identifier',
      },
      type: {
        type: 'string',
        enum: ['jump', 'call', 'return', 'loop', 'break', 'continue'],
        description: 'Flow control type',
      },
      targetFlowId: {
        type: 'string',
        description: 'Target flow/workflow ID',
      },
      targetStepId: {
        type: 'string',
        description: 'Target step ID',
      },
      condition: {
        type: 'string',
        description: 'Condition for flow control execution',
      },
      loopConfig: LoopConfigSchema(),
    },
  } as const;
};

export const TimeBasedLogicSchema = () => {
  return {
    type: 'object',
    required: ['id', 'type', 'config'],
    properties: {
      id: {
        type: 'string',
        description: 'Time-based logic unique identifier',
      },
      type: {
        type: 'string',
        enum: ['reply_tracking', 'engagement_tracking', 'behavior_tracking', 'deadline_tracking'],
        description: 'Type of time-based logic',
      },
      config: {
        type: 'object',
        properties: {
          replyTracking: ReplyTrackingConfigSchema(),
          engagementTracking: EngagementTrackingConfigSchema(),
          behaviorTracking: BehaviorTrackingConfigSchema(),
        },
        description: 'Time-based logic configuration',
      },
    },
  } as const;
};

export const ReplyTrackingConfigSchema = () => {
  return {
    type: 'object',
    properties: {
      triggerAction: {
        type: 'string',
        description: 'Action that triggers reply tracking',
      },
      timeThreshold: TimeframeSchema(),
      quickReplyAction: {
        type: 'string',
        description: 'Action for quick replies',
      },
      delayedReplyAction: {
        type: 'string',
        description: 'Action for delayed replies',
      },
      noReplyAction: {
        type: 'string',
        description: 'Action when no reply received',
      },
      noReplyDelay: TimeframeSchema(),
    },
  } as const;
};

export const EngagementTrackingConfigSchema = () => {
  return {
    type: 'object',
    properties: {
      actions: {
        type: 'array',
        items: {
          type: 'string',
        },
        description: 'Actions to track for engagement',
      },
      engagementWindow: TimeframeSchema(),
      engagedAction: {
        type: 'string',
        description: 'Action for engaged contacts',
      },
      notEngagedAction: {
        type: 'string',
        description: 'Action for non-engaged contacts',
      },
    },
  } as const;
};

export const BehaviorTrackingConfigSchema = () => {
  return {
    type: 'object',
    properties: {
      behaviors: {
        type: 'array',
        items: BehaviorSchema(),
        description: 'Behaviors to track and score',
      },
      scoreThreshold: {
        type: 'number',
        minimum: 0,
        description: 'Score threshold for actions',
      },
      highScoreAction: {
        type: 'string',
        description: 'Action for high behavior scores',
      },
      lowScoreAction: {
        type: 'string',
        description: 'Action for low behavior scores',
      },
    },
  } as const;
};

export const BehaviorSchema = () => {
  return {
    type: 'object',
    required: ['type', 'weight'],
    properties: {
      type: {
        type: 'string',
        description: 'Behavior type',
      },
      weight: {
        type: 'number',
        description: 'Weight/score for this behavior',
      },
      timeframe: TimeframeSchema(),
    },
  } as const;
};

export const AIOptimizationSchema = () => {
  return {
    type: 'object',
    properties: {
      enabled: {
        type: 'boolean',
        default: false,
        description: 'Whether AI optimization is enabled',
      },
      optimizationType: {
        type: 'string',
        enum: ['send_time', 'content', 'sequence', 'audience'],
        description: 'Type of AI optimization',
      },
      learningData: {
        type: 'object',
        description: 'AI learning data and models',
      },
    },
    group: 'ai',
    description: 'AI optimization settings',
  } as const;
};

export const ABTestingSchema = () => {
  return {
    type: 'object',
    properties: {
      enabled: {
        type: 'boolean',
        default: false,
        description: 'Whether A/B testing is enabled',
      },
      variants: {
        type: 'array',
        items: ABTestVariantSchema(),
        description: 'A/B test variants',
      },
    },
    group: 'testing',
    description: 'A/B testing configuration',
  } as const;
};

export const ABTestVariantSchema = () => {
  return {
    type: 'object',
    required: ['id', 'name', 'percentage'],
    properties: {
      id: {
        type: 'string',
        description: 'Variant unique identifier',
      },
      name: {
        type: 'string',
        description: 'Variant name',
      },
      percentage: {
        type: 'number',
        minimum: 0,
        maximum: 100,
        description: 'Traffic percentage for this variant',
      },
      config: {
        type: 'object',
        description: 'Variant-specific configuration',
      },
    },
  } as const;
};

export const AutomationAnalyticsSchema = () => {
  return {
    type: 'object',
    collapsible: true,
    properties: {
      triggered: {
        type: 'number',
        minimum: 0,
        default: 0,
        group: 'execution',
        description: 'Times workflow triggered',
      },
      completed: {
        type: 'number',
        minimum: 0,
        default: 0,
        group: 'execution',
        description: 'Times workflow completed',
      },
      active: {
        type: 'number',
        minimum: 0,
        default: 0,
        group: 'execution',
        description: 'Currently active instances',
      },
      conversionRate: {
        type: 'number',
        minimum: 0,
        maximum: 100,
        default: 0,
        group: 'performance',
        description: 'Conversion rate percentage',
      },
      avgCompletionTime: {
        type: 'number',
        minimum: 0,
        default: 0,
        group: 'performance',
        description: 'Average completion time in seconds',
      },
      revenue: {
        type: 'number',
        minimum: 0,
        default: 0,
        group: 'financial',
        description: 'Revenue generated by automation',
      },
      costPerLead: {
        type: 'number',
        minimum: 0,
        default: 0,
        group: 'financial',
        description: 'Cost per lead generated',
      },
    },
  } as const;
};

// Helper schemas
export const PositionSchema = () => {
  return {
    type: 'object',
    properties: {
      x: {
        type: 'number',
        description: 'X coordinate',
      },
      y: {
        type: 'number',
        description: 'Y coordinate',
      },
    },
    description: 'Position in workflow canvas',
  } as const;
};

export const DelayConfigSchema = () => {
  return {
    type: 'object',
    properties: {
      value: {
        type: 'number',
        minimum: 0,
        description: 'Delay value',
      },
      unit: {
        type: 'string',
        enum: ['minutes', 'hours', 'days', 'weeks'],
        description: 'Delay time unit',
      },
    },
    description: 'Delay configuration',
  } as const;
};

export const TimeframeSchema = () => {
  return {
    type: 'object',
    properties: {
      value: {
        type: 'number',
        minimum: 0,
        description: 'Time value',
      },
      unit: {
        type: 'string',
        enum: ['minutes', 'hours', 'days', 'weeks', 'months'],
        description: 'Time unit',
      },
    },
    description: 'Timeframe specification',
  } as const;
};

export const RetryLogicSchema = () => {
  return {
    type: 'object',
    properties: {
      maxRetries: {
        type: 'number',
        minimum: 0,
        maximum: 10,
        default: 3,
        description: 'Maximum retry attempts',
      },
      retryDelay: {
        type: 'number',
        minimum: 0,
        description: 'Delay between retries in minutes',
      },
      retryConditions: {
        type: 'array',
        items: {
          type: 'string',
        },
        description: 'Conditions that trigger retries',
      },
    },
    description: 'Step retry logic configuration',
  } as const;
};

export const LoopConfigSchema = () => {
  return {
    type: 'object',
    properties: {
      maxIterations: {
        type: 'number',
        minimum: 1,
        maximum: 1000,
        description: 'Maximum loop iterations',
      },
      breakCondition: {
        type: 'string',
        description: 'Condition to break out of loop',
      },
      iteratorField: {
        type: 'string',
        description: 'Field to iterate over',
      },
    },
    description: 'Loop configuration',
  } as const;
};

export namespace AutomationModels {
  export type AutomationModel = FromSchema<ReturnType<typeof AutomationSchema>>;
  export type AutomationStepModel = FromSchema<ReturnType<typeof AutomationStepSchema>>;
  export type TriggerConditionModel = FromSchema<ReturnType<typeof TriggerConditionSchema>>;
  export type WorkflowConnectionModel = FromSchema<ReturnType<typeof WorkflowConnectionSchema>>;
  export type SubFlowModel = FromSchema<ReturnType<typeof SubFlowSchema>>;
  export type FlowControlModel = FromSchema<ReturnType<typeof FlowControlSchema>>;
  export type TimeBasedLogicModel = FromSchema<ReturnType<typeof TimeBasedLogicSchema>>;
  export type ReplyTrackingConfigModel = FromSchema<ReturnType<typeof ReplyTrackingConfigSchema>>;
  export type EngagementTrackingConfigModel = FromSchema<ReturnType<typeof EngagementTrackingConfigSchema>>;
  export type BehaviorTrackingConfigModel = FromSchema<ReturnType<typeof BehaviorTrackingConfigSchema>>;
  export type BehaviorModel = FromSchema<ReturnType<typeof BehaviorSchema>>;
  export type AIOptimizationModel = FromSchema<ReturnType<typeof AIOptimizationSchema>>;
  export type ABTestingModel = FromSchema<ReturnType<typeof ABTestingSchema>>;
  export type ABTestVariantModel = FromSchema<ReturnType<typeof ABTestVariantSchema>>;
  export type AutomationAnalyticsModel = FromSchema<ReturnType<typeof AutomationAnalyticsSchema>>;
  export type PositionModel = FromSchema<ReturnType<typeof PositionSchema>>;
  export type DelayConfigModel = FromSchema<ReturnType<typeof DelayConfigSchema>>;
  export type TimeframeModel = FromSchema<ReturnType<typeof TimeframeSchema>>;
  export type RetryLogicModel = FromSchema<ReturnType<typeof RetryLogicSchema>>;
  export type LoopConfigModel = FromSchema<ReturnType<typeof LoopConfigSchema>>;
  export type ScheduleModel = FromSchema<ReturnType<typeof AutomationSchema>>;
}

registerCollection(
  'Automation',
  DataType.automation,
  AutomationSchema(),
);
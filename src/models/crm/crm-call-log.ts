import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';

import { DataType } from '../../types';

/**
 * Call Log Schema
 *
 * Comprehensive call logging for tracking all voice calls.
 * Automatically populated by TwilioConnect on call status updates.
 */
export const CallLogSchema = () => {
  return {
    type: 'object',
    properties: {
      // Call identifiers
      callSid: {
        type: 'string',
        description: 'Twilio Call SID (unique identifier)',
        group: 'identity',
      },
      parentCallSid: {
        type: 'string',
        description: 'Parent Call SID for child calls (transfers, conference)',
        group: 'identity',
      },

      // Call parties
      from: {
        type: 'string',
        description: 'Caller phone number (E.164 format)',
        group: 'parties',
      },
      to: {
        type: 'string',
        description: 'Called phone number (E.164 format)',
        group: 'parties',
      },
      fromFormatted: {
        type: 'string',
        description: 'Formatted caller number for display',
        group: 'parties',
      },
      toFormatted: {
        type: 'string',
        description: 'Formatted called number for display',
        group: 'parties',
      },
      callerName: {
        type: 'string',
        description: 'Caller ID name if available',
        group: 'parties',
      },

      // Call details
      direction: {
        type: 'string',
        enum: ['inbound', 'outbound', 'outbound-api', 'outbound-dial'],
        description: 'Call direction',
        group: 'details',
      },
      status: {
        type: 'string',
        enum: [
          'queued',
          'ringing',
          'in-progress',
          'completed',
          'busy',
          'failed',
          'no-answer',
          'canceled',
        ],
        description: 'Final call status',
        group: 'details',
      },
      answeredBy: {
        type: 'string',
        enum: ['human', 'machine', 'unknown'],
        description: 'Who answered the call (if AMD enabled)',
        group: 'details',
      },

      // Timestamps
      startTime: {
        type: 'string',
        format: 'date-time',
        description: 'When the call was initiated',
        group: 'timing',
      },
      endTime: {
        type: 'string',
        format: 'date-time',
        description: 'When the call ended',
        group: 'timing',
      },
      duration: {
        type: 'integer',
        description: 'Call duration in seconds',
        group: 'timing',
      },
      ringDuration: {
        type: 'integer',
        description: 'How long the phone rang before answer',
        group: 'timing',
      },

      // Recording
      recordingUrl: {
        type: 'string',
        description: 'URL to the call recording',
        group: 'recording',
      },
      recordingSid: {
        type: 'string',
        description: 'Twilio Recording SID',
        group: 'recording',
      },
      recordingDuration: {
        type: 'integer',
        description: 'Recording duration in seconds',
        group: 'recording',
      },
      transcript: {
        type: 'string',
        description: 'Call transcript if available',
        'x-control-variant': 'textarea',
        group: 'recording',
      },
      transcriptSid: {
        type: 'string',
        description: 'Twilio Transcription SID',
        group: 'recording',
      },

      // IVR/Routing
      ivrRoutingId: {
        type: 'string',
        description: 'IVR routing configuration used',
        group: 'routing',
      },
      menuPath: {
        type: 'array',
        items: { type: 'string' },
        description: 'IVR menu path taken (e.g., ["main-menu", "1", "sales-menu"])',
        group: 'routing',
      },
      forwardedTo: {
        type: 'string',
        description: 'Number/agent the call was forwarded to',
        group: 'routing',
      },
      queueName: {
        type: 'string',
        description: 'Queue name if call was queued',
        group: 'routing',
      },
      waitTime: {
        type: 'integer',
        description: 'Time spent waiting in queue (seconds)',
        group: 'routing',
      },

      // Business context
      leadId: {
        type: 'string',
        description: 'Associated lead ID',
        group: 'context',
      },
      contactId: {
        type: 'string',
        description: 'Associated contact ID',
        group: 'context',
      },
      agentId: {
        type: 'string',
        description: 'Agent who handled the call',
        group: 'context',
      },
      tags: {
        type: 'array',
        items: { type: 'string' },
        description: 'Tags for categorization',
        group: 'context',
      },

      // Notes and follow-up
      note: {
        type: 'string',
        description: 'Notes about the call',
        'x-control-variant': 'textarea',
        group: 'notes',
      },
      outcome: {
        type: 'string',
        enum: [
          'connected',
          'voicemail',
          'no-answer',
          'busy',
          'wrong-number',
          'callback-requested',
          'sale',
          'appointment',
          'not-interested',
          'other',
        ],
        description: 'Call outcome',
        group: 'notes',
      },
      followUpRequired: {
        type: 'boolean',
        description: 'Follow-up action needed',
        group: 'notes',
      },
      followUpDate: {
        type: 'string',
        format: 'date-time',
        description: 'Scheduled follow-up date',
        group: 'notes',
      },

      // Cost tracking
      price: {
        type: 'number',
        description: 'Call cost',
        group: 'billing',
      },
      priceUnit: {
        type: 'string',
        description: 'Currency (e.g., USD)',
        group: 'billing',
      },

      // Flags
      isMissedCall: {
        type: 'boolean',
        description: 'Was this a missed call',
        group: 'flags',
      },
      isVoicemail: {
        type: 'boolean',
        description: 'Did the call go to voicemail',
        group: 'flags',
      },
      hasRecording: {
        type: 'boolean',
        description: 'Does this call have a recording',
        group: 'flags',
      },
      hasTranscript: {
        type: 'boolean',
        description: 'Does this call have a transcript',
        group: 'flags',
      },
    },
  } as const;
};

const cs = CallLogSchema();
export type CallModel = FromSchema<typeof cs>;

registerCollection(
  'Call Log',
  DataType.calllog,
  CallLogSchema,
);

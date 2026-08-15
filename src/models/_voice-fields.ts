import { ControlType } from '../types';

/**
 * Shared schema fragments for AI voice (speech-to-speech) configuration.
 *
 * The same voice settings appear in three places that all feed the one voice
 * gateway — the phone record (`voiceConfig.ai`, for a number that answers with
 * AI directly), the IVR routing record (`aiAssistantConfig`), and the assistant
 * record itself. Declaring the provider list separately in each would guarantee
 * they drift the first time a provider is added, and the UI would offer
 * different options depending on which screen you opened.
 */

/**
 * Engines the server can actually run a call on. Must stay in step with the
 * adapters registered in the app's realtime-voice factory: a value here that
 * has no adapter falls back to the default at call time, which looks like the
 * setting being ignored.
 */
export const VOICE_PROVIDERS = ['openai-realtime', 'elevenlabs'] as const;

/**
 * Per-number / per-assistant engine choice.
 *
 * Intentionally has NO default. Blank means "inherit", and the resolution order
 * is number/IVR → assistant → system default, matching how `voice` and
 * `eagerness` already behave. Giving this a default would pin every existing
 * record to one engine and remove the ability to inherit at all.
 */
/** Default voice. Matches the gateway's fallback, so an unset record and a fresh one sound alike. */
export const DEFAULT_AI_VOICE = 'ballad';

/**
 * The assistant's speaking voice, shared by the assistant, phone and IVR
 * schemas. Previously declared three times and three different ways — 8 voices
 * on the assistant, 10 on the IVR, and a bare free-text box on the phone — so
 * which voices you could choose depended on which screen you opened.
 *
 * Options come from the server (`aiVoices` → `GET phone/voice/voices`), not a
 * static enum, because ElevenLabs voices are per-account and per-plan: a list
 * hardcoded here would be wrong for most tenants and would go stale the moment
 * anyone added a voice to their library. The server returns every engine's
 * voices in one call as `{ name, info, platform }`.
 *
 * `filter` narrows them to the engine chosen in the sibling `voiceProvider`
 * field, so the picker only ever offers voices that will actually work on the
 * call being configured.
 */
export const VoiceField = () => ({
  voice: {
    type: 'string',
    'x-control': ControlType.selectMany,
    dataSource: {
      source: 'function',
      value: 'aiVoices',
      label: 'info',
      filter: { platform: '{{voiceProvider}}' },
    },
    default: DEFAULT_AI_VOICE,
    title: 'AI Voice',
    description: 'Voice character. Mapped to the closest equivalent when the call runs on a different engine.',
  },
} as const);

/**
 * Send the call transcript after every call on this number / IVR.
 *
 * NOT an AI feature: every call produces a call_log, so this applies however the
 * call was answered — AI, forwarded, rung through to a softphone, or voicemail.
 * It therefore sits beside the AI config, never inside it.
 *
 * Flat rather than a nested object so the toggle and its recipients are one
 * group of fields on the form, and `sendTranscript` can drive the required-ness
 * of the rest directly. The `transcript*` prefix keeps them together.
 *
 * Off by default and silent when off — nobody should start receiving mail
 * because a field defaulted to true. This is the AUTOMATIC path only: the
 * assistant can always send on request mid-call via send_call_notes, whether or
 * not this is enabled, so "can you email me that" works on any number.
 */
export const CallTranscriptFields = () => ({
  // One field, three states, rather than a boolean plus a second flag for how
  // much to include — that pair had an unreachable combination ("don't send, but
  // include everything") and read as two decisions when it is only ever one.
  sendTranscript: {
    type: 'string',
    enum: ['none', 'summary', 'full'],
    default: 'none',
    title: 'Send after each call',
    description:
      'none — send nothing. summary — the call summary and the details captured. full — the same plus the word-for-word conversation.',
  },
  // Flat, and named for what they are. Bare `email` / `sms` at this level would
  // read as the phone or IVR record's own contact details, which is a dangerous
  // thing to misread on exactly these records.
  transcriptToEmail: {
    type: 'array',
    items: { type: 'string' },
    title: 'Send transcript to (email)',
    description: 'Required once "Send after each call" is not none.',
  },
  transcriptToSms: {
    type: 'array',
    items: { type: 'string' },
    title: 'Send transcript to (SMS)',
    description: 'E.164 numbers. These always get the short summary — the conversation is never sent by SMS.',
  },
} as const);

export const VoiceProviderField = () => ({
  voiceProvider: {
    type: 'string',
    enum: [...VOICE_PROVIDERS],
    title: 'Voice engine',
    description: 'Speech-to-speech provider for this call. Leave blank to inherit from the assistant, then the system default.',
  },
}) as const;

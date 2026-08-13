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
});

export const VoiceProviderField = () => ({
  voiceProvider: {
    type: 'string',
    enum: [...VOICE_PROVIDERS],
    title: 'Voice engine',
    description: 'Speech-to-speech provider for this call. Leave blank to inherit from the assistant, then the system default.',
  },
});

/**
 * Application-wide constants – timeouts, polling intervals, storage keys,
 * UI limits, and other magic numbers that were previously scattered
 * throughout the codebase.
 */

// ─── Polling & Timeouts (ms) ─────────────────────────────────────────────────

export const NETWORK_POLL_INTERVAL   = 5_000;   // stellar.ts network-change polling
export const BALANCE_POLL_INTERVAL   = 30_000;  // useWalletBalance refresh
export const FILTER_DEBOUNCE_DELAY   = 300;     // usePolicyFilters search debounce
export const COPY_FEEDBACK_TIMEOUT   = 2_000;   // "Copied!" tooltip display duration
export const FORM_SUBMIT_TIMEOUT     = 3_000;   // multi-step / claim form redirect delay

// ─── Storage Keys ────────────────────────────────────────────────────────────

export const SESSION_STORAGE_KEY     = 'stellar_insured_session';
export const WALLET_STORE_KEY        = 'wallet-store';

// ─── Pagination & Filtering Defaults ─────────────────────────────────────────

export const DEFAULT_PREMIUM_MIN     = 0;
export const DEFAULT_PREMIUM_MAX     = 1_000;
export const DEFAULT_DEDUCTIBLE_MIN  = 0;
export const DEFAULT_DEDUCTIBLE_MAX  = 10_000;

// ─── Misc ────────────────────────────────────────────────────────────────────

export const FREIGHTER_CHUNK_SIZE    = 0x8000;   // 32 768 bytes – message signing chunk
export const FIXED_PROCESSING_FEE   = 50;        // policyService fee constant

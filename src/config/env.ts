/**
 * Environment variable validation and access layer.
 *
 * Call `validateEnv()` at app startup (e.g. in root layout) to assert
 * that every required variable is present. Individual getters provide
 * typed, defaulted access everywhere else.
 */

// ─── Schema ──────────────────────────────────────────────────────────────────

interface EnvVarDef {
  /** The NEXT_PUBLIC_ or server-only key name. */
  key: string;
  /** If true the app will refuse to boot without it. */
  required: boolean;
  /** Fallback used when the value is not set and not required. */
  defaultValue?: string;
  /** Human-readable description for docs / error messages. */
  description: string;
}

const ENV_SCHEMA: EnvVarDef[] = [
  // ── Public (available in browser) ─────────────────────────────────────
  {
    key: 'NEXT_PUBLIC_API_BASE_URL',
    required: false,
    defaultValue: 'http://localhost:4000',
    description: 'Base URL for the backend REST API',
  },
  {
    key: 'NEXT_PUBLIC_STELLAR_NETWORK',
    required: false,
    defaultValue: 'testnet',
    description: 'Stellar network to connect to (testnet | mainnet)',
  },
  {
    key: 'NEXT_PUBLIC_HORIZON_URL',
    required: false,
    defaultValue: '',                       // resolved per-network in stellar config
    description: 'Custom Stellar Horizon server URL (overrides network default)',
  },
  {
    key: 'NEXT_PUBLIC_EXPLORER_URL',
    required: false,
    defaultValue: '',                       // resolved per-network in stellar config
    description: 'Custom Stellar block-explorer base URL',
  },
  {
    key: 'NEXT_PUBLIC_APP_NAME',
    required: false,
    defaultValue: 'Stellar Insured',
    description: 'Application display name',
  },
  {
    key: 'NEXT_PUBLIC_APP_ENV',
    required: false,
    defaultValue: 'development',
    description: 'Application environment (development | staging | production)',
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function readEnv(key: string): string | undefined {
  if (typeof process !== 'undefined' && process.env) {
    return process.env[key];
  }
  return undefined;
}

// ─── Public API ──────────────────────────────────────────────────────────────

export interface EnvValidationError {
  key: string;
  description: string;
}

export interface EnvValidationResult {
  valid: boolean;
  errors: EnvValidationError[];
}

/**
 * Validate that all required environment variables are present.
 * Returns a result object — does **not** throw so callers can decide
 * how to surface errors.
 */
export function validateEnv(): EnvValidationResult {
  const errors: EnvValidationError[] = [];

  for (const def of ENV_SCHEMA) {
    if (def.required && !readEnv(def.key)) {
      errors.push({ key: def.key, description: def.description });
    }
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Get a typed env value with its default already applied.
 */
export function getEnv(key: string): string {
  const def = ENV_SCHEMA.find((d) => d.key === key);
  return readEnv(key) ?? def?.defaultValue ?? '';
}

/**
 * Return the full schema (useful for docs / dev tooling).
 */
export function getEnvSchema(): readonly EnvVarDef[] {
  return ENV_SCHEMA;
}

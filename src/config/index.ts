/**
 * Centralized configuration management for Stellar Insured.
 *
 * Import from `@/config` everywhere instead of reaching for
 * `process.env` or hard-coding values.
 *
 * @example
 *   import { config } from '@/config';
 *
 *   const server = new Horizon.Server(config.stellar.horizonUrl);
 *   const timeout = config.app.env === 'production' ? 60_000 : 30_000;
 */

import { getEnv, validateEnv, getEnvSchema } from './env';
import { stellarConfig } from './stellar';
import { apiConfig } from './api';
import * as constants from './constants';

// Re-export individual modules for granular imports
export { validateEnv, getEnv, getEnvSchema } from './env';
export { stellarConfig } from './stellar';
export { apiConfig } from './api';
export * from './constants';

// Re-export types
export type { EnvValidationResult, EnvValidationError } from './env';
export type { StellarNetworkId, StellarNetworkConfig } from './stellar';
export type { ApiConfig } from './api';

// ─── Unified config object ──────────────────────────────────────────────────

export interface AppConfig {
  /** Application metadata. */
  app: {
    name: string;
    env: string;
    isDev: boolean;
    isProd: boolean;
  };
  /** Stellar blockchain settings. */
  stellar: typeof stellarConfig;
  /** Backend API settings. */
  api: typeof apiConfig;
  /** Application-wide constants. */
  constants: typeof constants;
}

export const config: AppConfig = {
  app: {
    name: getEnv('NEXT_PUBLIC_APP_NAME'),
    env: getEnv('NEXT_PUBLIC_APP_ENV'),
    isDev: getEnv('NEXT_PUBLIC_APP_ENV') === 'development',
    isProd: getEnv('NEXT_PUBLIC_APP_ENV') === 'production',
  },
  stellar: stellarConfig,
  api: apiConfig,
  constants,
};

export default config;

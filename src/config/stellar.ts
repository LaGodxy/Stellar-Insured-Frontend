/**
 * Stellar network configuration.
 *
 * Centralises Horizon endpoints, explorer URLs, network passphrases,
 * and asset-issuer addresses so that switching between testnet and
 * mainnet requires only one env-var change.
 */

import { getEnv } from './env';

// ─── Types ───────────────────────────────────────────────────────────────────

export type StellarNetworkId = 'testnet' | 'mainnet';

export interface StellarNetworkConfig {
  /** "testnet" or "mainnet". */
  networkId: StellarNetworkId;
  /** Stellar network passphrase used for signing. */
  networkPassphrase: string;
  /** Horizon API endpoint. */
  horizonUrl: string;
  /** Block-explorer base URL (no trailing slash). */
  explorerUrl: string;
  /** Stellar-expert explorer for transaction links. */
  explorerTxPath: string;
  /** Stellar-expert explorer for account links. */
  explorerAccountPath: string;
}

// ─── Per-network defaults ────────────────────────────────────────────────────

const NETWORK_PRESETS: Record<StellarNetworkId, StellarNetworkConfig> = {
  testnet: {
    networkId: 'testnet',
    networkPassphrase: 'Test SDF Network ; September 2015',
    horizonUrl: 'https://horizon-testnet.stellar.org',
    explorerUrl: 'https://stellar.expert/explorer/testnet',
    explorerTxPath: 'https://stellar.expert/explorer/testnet/tx',
    explorerAccountPath: 'https://stellar.expert/explorer/testnet/account',
  },
  mainnet: {
    networkId: 'mainnet',
    networkPassphrase: 'Public Global Stellar Network ; September 2015',
    horizonUrl: 'https://horizon.stellar.org',
    explorerUrl: 'https://stellar.expert/explorer/public',
    explorerTxPath: 'https://stellar.expert/explorer/public/tx',
    explorerAccountPath: 'https://stellar.expert/explorer/public/account',
  },
};

// ─── Resolved config ─────────────────────────────────────────────────────────

function resolveStellarConfig(): StellarNetworkConfig {
  const network = getEnv('NEXT_PUBLIC_STELLAR_NETWORK') as StellarNetworkId;
  const preset = NETWORK_PRESETS[network] ?? NETWORK_PRESETS.testnet;

  // Allow env-var overrides for custom deployments
  const horizonOverride = getEnv('NEXT_PUBLIC_HORIZON_URL');
  const explorerOverride = getEnv('NEXT_PUBLIC_EXPLORER_URL');

  return {
    ...preset,
    horizonUrl: horizonOverride || preset.horizonUrl,
    explorerUrl: explorerOverride || preset.explorerUrl,
    explorerTxPath: explorerOverride
      ? `${explorerOverride}/tx`
      : preset.explorerTxPath,
    explorerAccountPath: explorerOverride
      ? `${explorerOverride}/account`
      : preset.explorerAccountPath,
  };
}

/** Resolved Stellar network settings (read once, cached). */
export const stellarConfig: StellarNetworkConfig = resolveStellarConfig();

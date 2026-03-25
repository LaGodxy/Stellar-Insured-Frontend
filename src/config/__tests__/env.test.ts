/**
 * Tests for environment variable validation and access.
 */

describe('env', () => {
  const ORIGINAL_ENV = { ...process.env };

  beforeEach(() => {
    jest.resetModules();
    // Clear all NEXT_PUBLIC_ vars so each test starts clean
    Object.keys(process.env).forEach((key) => {
      if (key.startsWith('NEXT_PUBLIC_')) {
        delete process.env[key];
      }
    });
  });

  afterAll(() => {
    process.env = ORIGINAL_ENV;
  });

  function loadEnv() {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require('@/config/env') as typeof import('@/config/env');
  }

  // ─── validateEnv ────────────────────────────────────────────────────────

  describe('validateEnv', () => {
    it('returns valid when no required vars are missing', () => {
      const { validateEnv } = loadEnv();
      const result = validateEnv();
      // By default all vars in schema are optional
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  // ─── getEnv ─────────────────────────────────────────────────────────────

  describe('getEnv', () => {
    it('returns default for NEXT_PUBLIC_API_BASE_URL when not set', () => {
      const { getEnv } = loadEnv();
      expect(getEnv('NEXT_PUBLIC_API_BASE_URL')).toBe('http://localhost:4000');
    });

    it('returns env var value when set', () => {
      process.env.NEXT_PUBLIC_API_BASE_URL = 'https://api.prod.example.com';
      const { getEnv } = loadEnv();
      expect(getEnv('NEXT_PUBLIC_API_BASE_URL')).toBe('https://api.prod.example.com');
    });

    it('returns default for NEXT_PUBLIC_STELLAR_NETWORK when not set', () => {
      const { getEnv } = loadEnv();
      expect(getEnv('NEXT_PUBLIC_STELLAR_NETWORK')).toBe('testnet');
    });

    it('returns mainnet when NEXT_PUBLIC_STELLAR_NETWORK is set', () => {
      process.env.NEXT_PUBLIC_STELLAR_NETWORK = 'mainnet';
      const { getEnv } = loadEnv();
      expect(getEnv('NEXT_PUBLIC_STELLAR_NETWORK')).toBe('mainnet');
    });

    it('returns default for NEXT_PUBLIC_APP_NAME when not set', () => {
      const { getEnv } = loadEnv();
      expect(getEnv('NEXT_PUBLIC_APP_NAME')).toBe('Stellar Insured');
    });

    it('returns default for NEXT_PUBLIC_APP_ENV when not set', () => {
      const { getEnv } = loadEnv();
      expect(getEnv('NEXT_PUBLIC_APP_ENV')).toBe('development');
    });

    it('returns empty string for unknown keys', () => {
      const { getEnv } = loadEnv();
      expect(getEnv('TOTALLY_UNKNOWN_KEY')).toBe('');
    });
  });

  // ─── getEnvSchema ───────────────────────────────────────────────────────

  describe('getEnvSchema', () => {
    it('returns the full schema array', () => {
      const { getEnvSchema } = loadEnv();
      const schema = getEnvSchema();
      expect(Array.isArray(schema)).toBe(true);
      expect(schema.length).toBeGreaterThanOrEqual(6);
      expect(schema[0]).toHaveProperty('key');
      expect(schema[0]).toHaveProperty('required');
      expect(schema[0]).toHaveProperty('description');
    });

    it('every entry has a description', () => {
      const { getEnvSchema } = loadEnv();
      for (const entry of getEnvSchema()) {
        expect(entry.description.length).toBeGreaterThan(0);
      }
    });
  });
});

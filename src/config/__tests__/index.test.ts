/**
 * Tests for the unified config barrel export.
 */

describe('config', () => {
  const ORIGINAL_ENV = { ...process.env };

  beforeEach(() => {
    jest.resetModules();
    Object.keys(process.env).forEach((key) => {
      if (key.startsWith('NEXT_PUBLIC_')) {
        delete process.env[key];
      }
    });
  });

  afterAll(() => {
    process.env = ORIGINAL_ENV;
  });

  function loadConfig() {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require('@/config') as typeof import('@/config');
  }

  it('exports a unified config object', () => {
    const { config } = loadConfig();
    expect(config).toHaveProperty('app');
    expect(config).toHaveProperty('stellar');
    expect(config).toHaveProperty('api');
    expect(config).toHaveProperty('constants');
  });

  it('config.app has correct defaults', () => {
    const { config } = loadConfig();
    expect(config.app.name).toBe('Stellar Insured');
    expect(config.app.env).toBe('development');
    expect(config.app.isDev).toBe(true);
    expect(config.app.isProd).toBe(false);
  });

  it('config.app.isProd is true in production', () => {
    process.env.NEXT_PUBLIC_APP_ENV = 'production';
    const { config } = loadConfig();
    expect(config.app.isProd).toBe(true);
    expect(config.app.isDev).toBe(false);
  });

  it('config.stellar matches stellarConfig', () => {
    const { config, stellarConfig } = loadConfig();
    expect(config.stellar).toEqual(stellarConfig);
  });

  it('config.api matches apiConfig', () => {
    const { config, apiConfig } = loadConfig();
    expect(config.api).toEqual(apiConfig);
  });

  it('exports validateEnv function', () => {
    const { validateEnv } = loadConfig();
    expect(typeof validateEnv).toBe('function');
    const result = validateEnv();
    expect(result).toHaveProperty('valid');
    expect(result).toHaveProperty('errors');
  });

  it('exports getEnv function', () => {
    const { getEnv } = loadConfig();
    expect(typeof getEnv).toBe('function');
    expect(getEnv('NEXT_PUBLIC_APP_NAME')).toBe('Stellar Insured');
  });

  it('exports constants', () => {
    const mod = loadConfig();
    expect(mod.NETWORK_POLL_INTERVAL).toBe(5_000);
    expect(mod.SESSION_STORAGE_KEY).toBe('stellar_insured_session');
  });
});

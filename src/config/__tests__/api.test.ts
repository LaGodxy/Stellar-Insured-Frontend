/**
 * Tests for API configuration.
 */

describe('api config', () => {
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

  function loadApiConfig() {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require('@/config/api') as typeof import('@/config/api');
  }

  it('uses default baseUrl when env var not set', () => {
    const { apiConfig } = loadApiConfig();
    expect(apiConfig.baseUrl).toBe('http://localhost:4000');
  });

  it('uses env var when NEXT_PUBLIC_API_BASE_URL is set', () => {
    process.env.NEXT_PUBLIC_API_BASE_URL = 'https://api.example.com';
    const { apiConfig } = loadApiConfig();
    expect(apiConfig.baseUrl).toBe('https://api.example.com');
  });

  it('has a default timeout of 30 seconds', () => {
    const { apiConfig } = loadApiConfig();
    expect(apiConfig.timeout).toBe(30_000);
  });

  it('has default retries of 0', () => {
    const { apiConfig } = loadApiConfig();
    expect(apiConfig.retries).toBe(0);
  });

  it('has the correct wallet store key', () => {
    const { apiConfig } = loadApiConfig();
    expect(apiConfig.walletStoreKey).toBe('wallet-store');
  });
});

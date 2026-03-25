/**
 * Tests for application constants.
 */

import {
  NETWORK_POLL_INTERVAL,
  BALANCE_POLL_INTERVAL,
  FILTER_DEBOUNCE_DELAY,
  COPY_FEEDBACK_TIMEOUT,
  FORM_SUBMIT_TIMEOUT,
  SESSION_STORAGE_KEY,
  WALLET_STORE_KEY,
  DEFAULT_PREMIUM_MIN,
  DEFAULT_PREMIUM_MAX,
  DEFAULT_DEDUCTIBLE_MIN,
  DEFAULT_DEDUCTIBLE_MAX,
  FREIGHTER_CHUNK_SIZE,
  FIXED_PROCESSING_FEE,
} from '@/config/constants';

describe('constants', () => {
  describe('polling & timeouts', () => {
    it('NETWORK_POLL_INTERVAL is 5 seconds', () => {
      expect(NETWORK_POLL_INTERVAL).toBe(5_000);
    });

    it('BALANCE_POLL_INTERVAL is 30 seconds', () => {
      expect(BALANCE_POLL_INTERVAL).toBe(30_000);
    });

    it('FILTER_DEBOUNCE_DELAY is 300ms', () => {
      expect(FILTER_DEBOUNCE_DELAY).toBe(300);
    });

    it('COPY_FEEDBACK_TIMEOUT is 2 seconds', () => {
      expect(COPY_FEEDBACK_TIMEOUT).toBe(2_000);
    });

    it('FORM_SUBMIT_TIMEOUT is 3 seconds', () => {
      expect(FORM_SUBMIT_TIMEOUT).toBe(3_000);
    });
  });

  describe('storage keys', () => {
    it('SESSION_STORAGE_KEY matches expected value', () => {
      expect(SESSION_STORAGE_KEY).toBe('stellar_insured_session');
    });

    it('WALLET_STORE_KEY matches expected value', () => {
      expect(WALLET_STORE_KEY).toBe('wallet-store');
    });
  });

  describe('filter defaults', () => {
    it('premium range defaults are correct', () => {
      expect(DEFAULT_PREMIUM_MIN).toBe(0);
      expect(DEFAULT_PREMIUM_MAX).toBe(1_000);
    });

    it('deductible range defaults are correct', () => {
      expect(DEFAULT_DEDUCTIBLE_MIN).toBe(0);
      expect(DEFAULT_DEDUCTIBLE_MAX).toBe(10_000);
    });
  });

  describe('misc', () => {
    it('FREIGHTER_CHUNK_SIZE is 32768 bytes', () => {
      expect(FREIGHTER_CHUNK_SIZE).toBe(32768);
    });

    it('FIXED_PROCESSING_FEE is 50', () => {
      expect(FIXED_PROCESSING_FEE).toBe(50);
    });
  });
});

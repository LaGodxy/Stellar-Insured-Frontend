/**
 * @jest-environment jsdom
 */

import { renderHook, waitFor, act } from '@testing-library/react';
import { useWalletBalance } from '../useWalletBalance';
import { useWallet } from '../useWallet';
import { useNotifications } from '../useNotifications';

// Mock dependencies
jest.mock('../useWallet', () => ({
  useWallet: jest.fn(),
}));

jest.mock('../useNotifications', () => ({
  useNotifications: jest.fn(),
}));

// Mock Stellar SDK
jest.mock('@stellar/stellar-sdk', () => {
  return {
    Horizon: {
      Server: jest.fn().mockImplementation(() => ({
        loadAccount: jest.fn(),
      })),
    },
  };
});

// Mock stellar lib
jest.mock('@/lib/stellar', () => ({
  subscribeToNetworkChanges: jest.fn(() => () => {}),
}));

describe('useWalletBalance', () => {
  const mockShowBalanceUpdated = jest.fn();
  const mockShowNetworkChanged = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();

    // Mock notifications
    (useNotifications as jest.Mock).mockReturnValue({
      showBalanceUpdated: mockShowBalanceUpdated,
      showNetworkChanged: mockShowNetworkChanged,
    });

    // Mock wallet connected
    (useWallet as jest.Mock).mockReturnValue({
      address: 'GABC123DEF456GHI789JKL012MNO345PQR678STU901VWX234YZ',
      isConnected: true,
    });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should fetch balance on mount when connected', async () => {
    const mockServer = require('@stellar/stellar-sdk').Horizon.Server.mock.results[0].value;
    mockServer.loadAccount.mockResolvedValueOnce({
      balances: [
        { asset_type: 'native', balance: '100.5000' },
        { asset_type: 'credit_alphanum4', asset_code: 'USDC', asset_issuer: 'ISSUER123', balance: '50.0000' },
      ],
    });

    const { result } = renderHook(() => useWalletBalance());

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.xlm).toBe(100.5);
    });

    expect(result.current.assets).toHaveLength(1);
    expect(result.current.assets[0].code).toBe('USDC');
  });

  it('should handle disconnection gracefully', async () => {
    (useWallet as jest.Mock).mockReturnValue({
      address: null,
      isConnected: false,
    });

    const { result } = renderHook(() => useWalletBalance());

    await waitFor(() => {
      expect(result.current.error).toBe('No wallet connected');
    });

    expect(result.current.xlm).toBe(0);
    expect(result.current.loading).toBe(false);
  });

  it('should poll for balance updates every 30 seconds', async () => {
    const mockServer = require('@stellar/stellar-sdk').Horizon.Server.mock.results[0].value;
    mockServer.loadAccount
      .mockResolvedValueOnce({
        balances: [{ asset_type: 'native', balance: '100.0000' }],
      })
      .mockResolvedValueOnce({
        balances: [{ asset_type: 'native', balance: '150.0000' }],
      });

    renderHook(() => useWalletBalance());

    // Wait for initial fetch
    await waitFor(() => {
      expect(mockServer.loadAccount).toHaveBeenCalledTimes(1);
    });

    // Fast-forward 30 seconds
    await act(async () => {
      jest.advanceTimersByTime(30000);
    });

    // Should have fetched again
    expect(mockServer.loadAccount).toHaveBeenCalledTimes(2);
  });

  it('should show notification only for significant balance changes', async () => {
    const mockServer = require('@stellar/stellar-sdk').Horizon.Server.mock.results[0].value;
    
    // Initial balance
    mockServer.loadAccount.mockResolvedValueOnce({
      balances: [{ asset_type: 'native', balance: '100.0000' }],
    });

    const { rerender } = renderHook(() => useWalletBalance());

    await waitFor(() => {
      expect(mockServer.loadAccount).toHaveBeenCalledTimes(1);
    });

    // Small change (less than 0.01) - should not notify
    mockServer.loadAccount.mockResolvedValueOnce({
      balances: [{ asset_type: 'native', balance: '100.0050' }],
    });

    await act(async () => {
      jest.advanceTimersByTime(30000);
    });

    expect(mockShowBalanceUpdated).not.toHaveBeenCalled();

    // Significant change - should notify
    mockServer.loadAccount.mockResolvedValueOnce({
      balances: [{ asset_type: 'native', balance: '150.0000' }],
    });

    await act(async () => {
      jest.advanceTimersByTime(30000);
    });

    expect(mockShowBalanceUpdated).toHaveBeenCalledWith(150, 'XLM');
  });

  it('should provide manual refresh function', async () => {
    const mockServer = require('@stellar/stellar-sdk').Horizon.Server.mock.results[0].value;
    mockServer.loadAccount
      .mockResolvedValueOnce({
        balances: [{ asset_type: 'native', balance: '100.0000' }],
      })
      .mockResolvedValueOnce({
        balances: [{ asset_type: 'native', balance: '200.0000' }],
      });

    const { result } = renderHook(() => useWalletBalance());

    await waitFor(() => {
      expect(result.current.xlm).toBe(100);
    });

    // Manual refresh
    await act(async () => {
      await result.current.refetch();
    });

    expect(result.current.xlm).toBe(200);
    expect(result.current.refreshing).toBe(false);
  });

  it('should track refreshing state during manual refresh', async () => {
    const mockServer = require('@stellar/stellar-sdk').Horizon.Server.mock.results[0].value;
    
    let resolveFetch: any;
    mockServer.loadAccount.mockImplementation(
      () => new Promise(resolve => {
        resolveFetch = resolve;
      })
    );

    const { result } = renderHook(() => useWalletBalance());

    // Trigger manual refresh
    act(async () => {
      result.current.refetch();
      // Don't await yet
    });

    // Should be in refreshing state
    await waitFor(() => {
      expect(result.current.refreshing).toBe(true);
    });

    // Resolve the fetch
    resolveFetch({
      balances: [{ asset_type: 'native', balance: '150.0000' }],
    });

    // Should exit refreshing state
    await waitFor(() => {
      expect(result.current.refreshing).toBe(false);
    });
  });

  it('should provide last updated timestamp', async () => {
    const mockServer = require('@stellar/stellar-sdk').Horizon.Server.mock.results[0].value;
    mockServer.loadAccount.mockResolvedValueOnce({
      balances: [{ asset_type: 'native', balance: '100.0000' }],
    });

    const beforeFetch = Date.now();
    const { result } = renderHook(() => useWalletBalance());

    await waitFor(() => {
      expect(result.current.lastUpdated).toBeTruthy();
    });

    expect(result.current.lastUpdated!).toBeGreaterThanOrEqual(beforeFetch);
    expect(result.current.lastUpdated!).toBeLessThanOrEqual(Date.now());
  });

  it('should expose polling status and interval', async () => {
    const mockServer = require('@stellar/stellar-sdk').Horizon.Server.mock.results[0].value;
    mockServer.loadAccount.mockResolvedValueOnce({
      balances: [{ asset_type: 'native', balance: '100.0000' }],
    });

    const { result } = renderHook(() => useWalletBalance());

    await waitFor(() => {
      expect(result.current.isPollingActive).toBe(true);
    });

    expect(result.current.pollingInterval).toBe(30000); // Default interval
  });

  it('should handle fetch errors gracefully', async () => {
    const mockServer = require('@stellar/stellar-sdk').Horizon.Server.mock.results[0].value;
    mockServer.loadAccount.mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useWalletBalance());

    await waitFor(() => {
      expect(result.current.error).toBe('Network error');
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.xlm).toBe(0);
  });

  it('should clean up intervals on unmount', async () => {
    const mockServer = require('@stellar/stellar-sdk').Horizon.Server.mock.results[0].value;
    mockServer.loadAccount.mockResolvedValueOnce({
      balances: [{ asset_type: 'native', balance: '100.0000' }],
    });

    const { unmount } = renderHook(() => useWalletBalance());

    // Wait for initial fetch
    await waitFor(() => {
      expect(mockServer.loadAccount).toHaveBeenCalledTimes(1);
    });

    // Unmount should clear intervals
    unmount();

    // Advance time - should not trigger another fetch
    await act(async () => {
      jest.advanceTimersByTime(30000);
    });

    // Should still be 1 (no additional fetches after unmount)
    expect(mockServer.loadAccount).toHaveBeenCalledTimes(1);
  });

  it('should differentiate between loading and refreshing states', async () => {
    const mockServer = require('@stellar/stellar-sdk').Horizon.Server.mock.results[0].value;
    mockServer.loadAccount.mockResolvedValueOnce({
      balances: [{ asset_type: 'native', balance: '100.0000' }],
    });

    const { result } = renderHook(() => useWalletBalance());

    // Initial load
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Manual refresh
    mockServer.loadAccount.mockResolvedValueOnce({
      balances: [{ asset_type: 'native', balance: '150.0000' }],
    });

    act(async () => {
      result.current.refetch();
    });

    await waitFor(() => {
      expect(result.current.refreshing).toBe(true);
    });
  });
});

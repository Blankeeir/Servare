// hooks/useSupplyChain.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@chakra-ui/react';
import { useCallback } from 'react';
import { useVeChain } from './useVeChain';
import { useContract } from './useContract';

interface SupplyChainEvent {
  tokenId: string;
  timestamp: number;
  eventType: string;
  location: string;
  handler: string;
  temperature: number;
  humidity: number;
  additionalDataHash: string;
  isValidated: boolean;
  validator?: string;
}

interface TrackingData {
  location: string;
  handler: string;
  status: string;
  temperature: number;
  humidity: number;
  envKeys: string[];
  envValues: string[];
}

export const useSupplyChain = (tokenId?: string) => {
  const queryClient = useQueryClient();
  const toast = useToast();
  const { account } = useVeChain();
  const contract = useContract('SupplyChainTracking');

  // Fetch tracking history
  const {
    data: trackingHistory,
    isLoading: isLoadingHistory,
    error: historyError,
    refetch: refetchHistory
  } = useQuery(
    ['tracking-history', tokenId],
    async () => {
      if (!tokenId || !contract) return [];
      const events = await contract.getTrackingHistory(tokenId);
      return events.map((event: any) => ({
        ...event,
        timestamp: Number(event.timestamp) * 1000,
        temperature: Number(event.temperature),
        humidity: Number(event.humidity)
      }));
    },
    {
      enabled: !!tokenId && !!contract,
      staleTime: 30000, // 30 seconds
      cacheTime: 5 * 60 * 1000, // 5 minutes
    }
  );

  // Add tracking data
  const addTracking = useMutation(
    async (data: TrackingData) => {
      if (!tokenId || !contract || !account) {
        throw new Error('Missing required parameters');
      }

      const tx = await contract.addTrackingData(
        tokenId,
        data.location,
        data.handler,
        data.status,
        data.envKeys,
        data.envValues,
        Math.round(data.temperature * 100), // Convert to fixed point
        Math.round(data.humidity * 100)     // Convert to fixed point
      );

      return tx.wait();
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['tracking-history', tokenId]);
        toast({
          title: 'Tracking updated',
          description: 'Supply chain event has been recorded',
          status: 'success',
          duration: 5000,
        });
      },
      onError: (error: any) => {
        toast({
          title: 'Failed to update tracking',
          description: error.message || 'Something went wrong',
          status: 'error',
          duration: 5000,
        });
      },
    }
  );

  // Validate tracking data
  const validateTracking = useMutation(
    async ({ 
      trackingIndex, 
      isValid, 
      notes 
    }: { 
      trackingIndex: number; 
      isValid: boolean; 
      notes: string; 
    }) => {
      if (!tokenId || !contract || !account) {
        throw new Error('Missing required parameters');
      }

      const tx = await contract.validateTrackingData(
        tokenId,
        trackingIndex,
        isValid,
        notes
      );

      return tx.wait();
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['tracking-history', tokenId]);
        toast({
          title: 'Validation complete',
          description: 'Tracking data has been validated',
          status: 'success',
          duration: 5000,
        });
      },
      onError: (error: any) => {
        toast({
          title: 'Validation failed',
          description: error.message || 'Something went wrong',
          status: 'error',
          duration: 5000,
        });
      },
    }
  );

  // Set environmental thresholds
  const setThresholds = useMutation(
    async (thresholds: {
      maxTemp: number;
      minTemp: number;
      maxHumidity: number;
      minHumidity: number;
    }) => {
      if (!tokenId || !contract || !account) {
        throw new Error('Missing required parameters');
      }

      const tx = await contract.setThresholds(
        tokenId,
        Math.round(thresholds.maxTemp * 100),
        Math.round(thresholds.minTemp * 100),
        Math.round(thresholds.maxHumidity * 100),
        Math.round(thresholds.minHumidity * 100)
      );

      return tx.wait();
    },
    {
      onSuccess: () => {
        toast({
          title: 'Thresholds updated',
          description: 'Environmental thresholds have been set',
          status: 'success',
          duration: 5000,
        });
      },
    }
  );

  // Subscribe to tracking events
  const subscribeToEvents = useCallback((callback: (event: any) => void) => {
    if (!contract) return () => {};

    const unsubscribe = contract.on('TrackingUpdated', (
      tokenId: string,
      location: string,
      status: string,
      timestamp: number,
      event: any
    ) => {
      callback({
        tokenId,
        location,
        status,
        timestamp: Number(timestamp) * 1000,
        transactionHash: event.transactionHash,
      });
    });

    return unsubscribe;
  }, [contract]);

  // Get tracking statistics
  const getStatistics = useCallback(async () => {
    if (!tokenId || !trackingHistory) return null;

    const stats = {
      totalEvents: trackingHistory.length,
      avgTemperature: 0,
      avgHumidity: 0,
      outOfRangeEvents: 0,
      lastUpdate: trackingHistory[0]?.timestamp || 0,
      locations: new Set<string>(),
      handlers: new Set<string>(),
    };

    trackingHistory.forEach((event: SupplyChainEvent) => {
      stats.avgTemperature += event.temperature;
      stats.avgHumidity += event.humidity;
      stats.locations.add(event.location);
      stats.handlers.add(event.handler);

      if (
        event.temperature < 2 || 
        event.temperature > 8 ||
        event.humidity < 45 || 
        event.humidity > 55
      ) {
        stats.outOfRangeEvents++;
      }
    });

    if (stats.totalEvents > 0) {
      stats.avgTemperature /= stats.totalEvents;
      stats.avgHumidity /= stats.totalEvents;
    }

    return {
      ...stats,
      uniqueLocations: stats.locations.size,
      uniqueHandlers: stats.handlers.size,
    };
  }, [tokenId, trackingHistory]);

  // Get quality score trend
  const getQualityTrend = useCallback(() => {
    if (!trackingHistory) return [];

    return trackingHistory.map((event: SupplyChainEvent) => ({
      timestamp: event.timestamp,
      temperature: event.temperature,
      humidity: event.humidity,
      isWithinRange: (
        event.temperature >= 2 && 
        event.temperature <= 8 &&
        event.humidity >= 45 && 
        event.humidity <= 55
      ),
    }));
  }, [trackingHistory]);

  return {
    // Data
    trackingHistory,
    isLoadingHistory,
    historyError,

    // Actions
    addTracking: addTracking.mutate,
    validateTracking: validateTracking.mutate,
    setThresholds: setThresholds.mutate,
    refetchHistory,

    // Loading states
    isAddingTracking: addTracking.isLoading,
    isValidating: validateTracking.isLoading,
    isSettingThresholds: setThresholds.isLoading,

    // Subscriptions
    subscribeToEvents,

    // Analytics
    getStatistics,
    getQualityTrend,

    // Status
    isReady: !!contract && !!account,
    account,
  };
};
// apps/frontend/src/hooks/useProfileData.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { profileService } from '../services/api';
import { ProfileFormData } from '../schemas/validation';
import { useToast } from '@chakra-ui/react';

export const useProfileData = (address?: string) => {
  const queryClient = useQueryClient();
  const toast = useToast();

  const {
    data: profile,
    isLoading,
    error
  } = useQuery(
    ['profile', address],
    () => address ? profileService.getProfile(address) : null,
    {
      enabled: !!address,
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 30 * 60 * 1000, // 30 minutes
    }
  );

  const { data: transactions } = useQuery(
    ['transactions', address],
    () => address ? profileService.getTransactions(address) : null,
    {
      enabled: !!address,
    }
  );

  const { data: activities } = useQuery(
    ['activities', address],
    () => address ? profileService.getActivities(address) : null,
    {
      enabled: !!address,
    }
  );

  const updateProfile = useMutation(
    (data: Partial<ProfileFormData>) => 
      profileService.updateProfile(address!, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['profile', address]);
        toast({
          title: 'Profile updated',
          status: 'success',
          duration: 3000,
        });
      },
      onError: (error: any) => {
        toast({
          title: 'Update failed',
          description: error.message,
          status: 'error',
          duration: 3000,
        });
      },
    }
  );

  return {
    profile,
    transactions,
    activities,
    isLoading,
    error,
    updateProfile: updateProfile.mutate,
    isUpdating: updateProfile.isLoading,
  };
};
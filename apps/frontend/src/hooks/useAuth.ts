// apps/frontend/src/hooks/useAuth.ts
import { useEffect } from 'react';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { useNavigate } from 'react-router-dom';
import { storage } from '@/utils/localStorage';
import { analytics } from '@/utils/analytics';

export const useAuth = () => {
  const { 
    isAuthenticated, 
    user, 
    handleLogOut, 
    showAuthFlow,
    primaryWallet 
  } = useDynamicContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user) {
      // Store user info
      storage.set('user', {
        address: user.address,
        primaryWallet: primaryWallet?.address
      });

      // Track authentication
      analytics.identify(user.address, {
        wallet: primaryWallet?.address,
        authMethod: primaryWallet?.connector?.name
      });
    }
  }, [isAuthenticated, user, primaryWallet]);

  const logout = async () => {
    try {
      await handleLogOut();
      storage.remove('user');
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const requireAuth = (callback: () => void) => {
    if (!isAuthenticated) {
      showAuthFlow();
    } else {
      callback();
    }
  };

  return {
    isAuthenticated,
    user,
    login: showAuthFlow,
    logout,
    requireAuth
  };
};
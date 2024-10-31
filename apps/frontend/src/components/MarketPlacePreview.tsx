// components/MarketplacePreview.tsx
import React from 'react';
import { Box, Button, Text, SimpleGrid, useColorModeValue } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../hooks/useProduct';
import { ProductCard} from './ProductCard';
import { Product } from '../util/types';
import { AnimatedContainer } from './Animations/AnimatedContainer';

import { BoxProps } from '@chakra-ui/react';
import { motion, isValidMotionProp } from 'framer-motion';
import {chakra, shouldForwardProp} from '@chakra-ui/react'
const MotionBox = chakra(motion.div, {
    shouldForwardProp: (prop) => isValidMotionProp(prop) || shouldForwardProp(prop),
  });


export const MarketplacePreview: React.FC = () => {
  const navigate = useNavigate();
  const { products, isLoading } = useProducts({ limit: 6 });
  const bgColor = useColorModeValue('white', 'gray.700');

  return (
    <AnimatedContainer>
      <Box bg={bgColor} p={6} borderRadius="xl" shadow="md">
        <Box mb={6} display="flex" justifyContent="space-between" alignItems="center">
          <Text fontSize="2xl" fontWeight="bold">
            Latest Products
          </Text>
          <Button
            colorScheme="blue"
            onClick={() => navigate('/marketplace')}
          >
            View All
          </Button>
        </Box>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {isLoading ? (
            // Skeleton loading state
            Array.from({ length: 6 }).map((_, i) => (
              <Box
                key={i}
                height="300px"
                borderRadius="lg"
                bg="gray.100"
                animation="pulse 2s infinite"
              />
            ))
          ) : (
            products?.slice(0, 6).map((product: Product) => (
              <MotionBox
                key={product.id}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
              >
                <ProductCard product={product} onClick={function (): void {
                        throw new Error('Function not implemented.');
                    } } />
              </MotionBox>
            ))
          )}
        </SimpleGrid>

        <Box mt={6} textAlign="center">
          <Button
            size="lg"
            colorScheme="blue"
            onClick={() => navigate('/marketplace')}
          >
            Explore Full Marketplace
          </Button>
        </Box>
      </Box>
    </AnimatedContainer>
  );
};

// constants/index.ts
export const DYNAMIC_ENV_ID = '7acebce4-9ec4-4363-a4f3-b85925f652a8';
export const VECHAIN_NODE_URL = 'https://testnet.vechain.org/';
export const VET_NETWORK = 'testnet'; // or 'mainnet'
export const SERVARE_NFT_ADDRESS = ''; // Add your deployed contract address
export const SERVARE_MARKETPLACE_ADDRESS = ''; // Add your deployed contract address
export const SERVARE_TRACKING_ADDRESS = ''; // Add your deployed contract address

// lib/queryClient.ts
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      staleTime: 30000,
    },
  },
});
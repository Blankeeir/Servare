// pages/SupplyChainTracking.tsx
import React, { useState } from 'react';
import { 
  Box,
  Container,
  Heading,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  VStack,
  HStack,
  Input,
  Button,
  Text,
  useColorModeValue,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { Search, Filter } from 'lucide-react';
import { useSupplyChain } from '../../hooks/useSupplyChain';
import { TrackingHistory } from './TrackingHistory';
import { TrackingForm } from './TrackingForm';
import { AnimatedContainer } from '../Animations/AnimatedContainer';
import { useWallet } from '@vechain/dapp-kit-react';

const MotionBox = motion(Box);

export const SupplyChainTracking: React.FC = () => {
  const [searchTokenId, setSearchTokenId] = useState('');
  const [activeTokenId, setActiveTokenId] = useState<string | null>(null);
  const bgColor = useColorModeValue('white', 'gray.700');
  const { account } = useWallet();

  const { trackingHistory, isLoadingHistory, addTracking } = useSupplyChain(activeTokenId);

  const handleSearch = () => {
    if (searchTokenId) {
      setActiveTokenId(searchTokenId);
    }
  };

  return (
    <Container maxW="container.xl" py={8}>
      <AnimatedContainer>
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <MotionBox
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Heading mb={4}>Supply Chain Tracking</Heading>
            <Text color="gray.600">
              Track and verify product journey from producer to consumer
            </Text>
          </MotionBox>

          {/* Search Bar */}
          <Box bg={bgColor} p={6} borderRadius="xl" shadow="md">
            <HStack>
              <Input
                placeholder="Enter Product Token ID"
                value={searchTokenId}
                onChange={(e) => setSearchTokenId(e.target.value)}
              />
              <Button
                leftIcon={<Search />}
                colorScheme="blue"
                onClick={handleSearch}
              >
                Search
              </Button>
            </HStack>
          </Box>

          {/* Main Content */}
          {!account ? (
            <Alert status="warning">
              <AlertIcon />
              Please connect your wallet to access tracking features
            </Alert>
          ) : activeTokenId ? (
            <Box bg={bgColor} p={6} borderRadius="xl" shadow="md">
              <Tabs variant="soft-rounded" colorScheme="blue">
                <TabList>
                  <Tab>Tracking History</Tab>
                  <Tab>Add Event</Tab>
                </TabList>

                <TabPanels>
                  <TabPanel>
                    <TrackingHistory
                      tokenId={activeTokenId}
                      events={trackingHistory}
                      isLoading={isLoadingHistory}
                    />
                  </TabPanel>
                  <TabPanel>
                    <TrackingForm
                      tokenId={activeTokenId}
                      onSubmit={addTracking}
                    />
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </Box>
          ) : (
            <Box
              bg={bgColor}
              p={8}
              borderRadius="xl"
              shadow="md"
              textAlign="center"
            >
              <Text color="gray.500">
                Enter a Product Token ID to view its supply chain history
              </Text>
            </Box>
          )}
        </VStack>
      </AnimatedContainer>
    </Container>
  );
};
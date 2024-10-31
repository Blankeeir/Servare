// apps/frontend/src/components/Profile/ProductsList.tsx
import React from 'react';
import {
  SimpleGrid,
  Box,
  Text,
  Badge,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  useDisclosure,
} from '@chakra-ui/react';
import { MoreVertical, Edit, Trash, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CardSkeleton } from '../Loading/CardSkeleton';
import { useToast } from '@chakra-ui/react';
import { useVeChain } from '../../hooks/useVeChain';

const MotionBox = motion(Box);

interface Product {
  id: string;
  name: string;
  status: 'active' | 'sold' | 'expired';
  price: number;
  quantity: number;
  createdAt: string;
}

export const ProductsList: React.FC<{ products?: Product[] }> = ({ products }) => {
  const toast = useToast();
  const { sendTransaction } = useVeChain();
  const editModal = useDisclosure();

  const handleDelete = async (productId: string) => {
    try {
      await sendTransaction({
        // Contract interaction for deleting product
      });
      toast({
        title: 'Product deleted',
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: 'Failed to delete product',
        status: 'error',
        duration: 3000,
      });
    }
  };

  if (!products) {
    return (
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
        {[...Array(6)].map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </SimpleGrid>
    );
  }

  return (
    <AnimatePresence>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
        {products.map((product, index) => (
          <MotionBox
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Box
              bg="white"
              p={6}
              borderRadius="xl"
              shadow="md"
              position="relative"
            >
              <Menu>
                <MenuButton
                  as={IconButton}
                  icon={<MoreVertical size={20} />}
                  variant="ghost"
                  size="sm"
                  position="absolute"
                  top={4}
                  right={4}
                />
                <MenuList>
                  <MenuItem icon={<Edit size={16} />}>Edit</MenuItem>
                  <MenuItem icon={<Eye size={16} />}>View Details</MenuItem>
                  <MenuItem 
                    icon={<Trash size={16} />} 
                    color="red.500"
                    onClick={() => handleDelete(product.id)}
                  >
                    Delete
                  </MenuItem>
                </MenuList>
              </Menu>

              <Text fontSize="lg" fontWeight="bold" mb={2}>
                {product.name}
              </Text>

              <Badge
                colorScheme={
                  product.status === 'active' ? 'green' :
                  product.status === 'sold' ? 'blue' : 'red'
                }
                mb={4}
              >
                {product.status}
              </Badge>

              <Text fontSize="sm" color="gray.600" mb={2}>
                Price: {product.price} VET
              </Text>

              <Text fontSize="sm" color="gray.600" mb={4}>
                Quantity: {product.quantity}
              </Text>

              <Text fontSize="xs" color="gray.500">
                Listed on: {new Date(product.createdAt).toLocaleDateString()}
              </Text>
            </Box>
          </MotionBox>
        ))}
      </SimpleGrid>
    </AnimatePresence>
  );
};
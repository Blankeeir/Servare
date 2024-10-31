// components/ProductEntryForm.tsx
import React, { useState } from 'react';
import {
  VStack,
  HStack,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Textarea,
  Select,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Text,
  Icon,
  useColorModeValue,
} from '@chakra-ui/react';

import { motion } from 'framer-motion';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AlertCircle, Check } from 'lucide-react';
import { useVeChain } from '../../hooks/useVeChain';
import { useToast } from '../../hooks/useToast';
import { useTransactionHandler } from '../../hooks/useTransaction';
import { useContract } from '../../hooks/useContract';
import { AnimatedContainer } from '../Animations/AnimatedContainer';
import { Dropzone } from '../Dropzone';
import { SERVARE_NFT_ADDRESS } from '../../const';
import { uploadToIPFS } from '../utils/ipfs';

// Form validation schema
const productSchema = z.object({
  name: z.string()
    .min(3, 'Name must be at least 3 characters')
    .max(100, 'Name must be less than 100 characters'),
  description: z.string()
    .min(10, 'Description must be at least 10 characters')
    .max(1000, 'Description must be less than 1000 characters'),
  quantity: z.number()
    .positive('Quantity must be positive')
    .int('Quantity must be a whole number'),
  location: z.string()
    .min(3, 'Location is required'),
  expiryDate: z.date()
    .min(new Date(), 'Expiry date must be in the future'),
  productionDate: z.date()
    .max(new Date(), 'Production date cannot be in the future'),
  category: z.enum(['fruits', 'vegetables', 'dairy', 'meat', 'grains']),
  price: z.number()
    .positive('Price must be positive')
    .multipleOf(0.001, 'Price must have at most 3 decimal places'),
  image: z.any()
    .refine((file) => file instanceof File, 'Image is required')
    .refine(
      (file) => file?.size <= 5000000,
      'Image must be less than 5MB'
    ),
  carbonFootprint: z.number()
    .min(0, 'Carbon footprint cannot be negative')
});

type ProductFormData = z.infer<typeof productSchema>;

import { chakra } from '@chakra-ui/react';

const MotionVStack = motion(chakra(VStack));

export const ProductEntryForm: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();
  const handleTransaction = useTransactionHandler();
  const { account } = useVeChain();
  const nftContract = useContract('ServareNFT', SERVARE_NFT_ADDRESS);
  const bgColor = useColorModeValue('white', 'gray.700');

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    mode: 'onChange',
  });

  const onSubmit = async (data: ProductFormData) => {
    if (!account) {
      toast.error('Please connect your wallet first');
      return;
    }

    try {
      setIsSubmitting(true);

      // Upload image to IPFS
      const imageHash = await uploadToIPFS(data.image);

      // Create metadata
      const metadata = {
        name: data.name,
        description: data.description,
        image: `ipfs://${imageHash}`,
        attributes: {
          quantity: data.quantity,
          location: data.location,
          category: data.category,
          carbonFootprint: data.carbonFootprint,
        },
      };

      // Upload metadata to IPFS
      const metadataHash = await uploadToIPFS(JSON.stringify(metadata));

      // Create product on blockchain
      await handleTransaction(
        nftContract.methods.createProduct(
          data.name,
          data.description,
          data.quantity,
          data.location,
          Math.floor(data.expiryDate.getTime() / 1000),
          Math.floor(data.productionDate.getTime() / 1000),
          data.category,
          `ipfs://${imageHash}`,
          data.price,
          metadataHash,
          data.carbonFootprint
        ).send({ from: account }),
        {
          pendingMessage: 'Creating product...',
          successMessage: 'Product created successfully!',
          errorMessage: 'Failed to create product',
        }
      );

      reset();
    } catch (error: unknown) {
      toast.error('Failed to create product', {
        description: (error as Error).message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatedContainer
      variants="scale"
      bg={bgColor}
      p={8}
      borderRadius="xl"
      shadow="lg"
      maxW="3xl"
      mx="auto"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <MotionVStack
          spacing={6}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Text fontSize="2xl" fontWeight="bold">Create New Product</Text>

          {/* Basic Information */}
          <HStack width="full" spacing={4}>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <FormControl isInvalid={!!errors.name}>
                  <FormLabel>Product Name</FormLabel>
                  <Input {...field} />
                  <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
                </FormControl>
              )}
            />

            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <FormControl isInvalid={!!errors.category}>
                  <FormLabel>Category</FormLabel>
                  <Select {...field}>
                    <option value="">Select category</option>
                    <option value="fruits">Fruits</option>
                    <option value="vegetables">Vegetables</option>
                    <option value="dairy">Dairy</option>
                    <option value="meat">Meat</option>
                    <option value="grains">Grains</option>
                  </Select>
                  <FormErrorMessage>{errors.category?.message}</FormErrorMessage>
                </FormControl>
              )}
            />
          </HStack>

          {/* Description */}
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <FormControl isInvalid={!!errors.description}>
                <FormLabel>Description</FormLabel>
                <Textarea {...field} rows={4} />
                <FormErrorMessage>{errors.description?.message}</FormErrorMessage>
              </FormControl>
            )}
          />

          {/* Quantity and Price */}
          <HStack width="full" spacing={4}>
            <Controller
              name="quantity"
              control={control}
              render={({ field: { onChange, value } }) => (
                <FormControl isInvalid={!!errors.quantity}>
                  <FormLabel>Quantity</FormLabel>
                  <NumberInput
                    value={value}
                    onChange={(_, value) => onChange(value)}
                    min={1}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                  <FormErrorMessage>{errors.quantity?.message}</FormErrorMessage>
                </FormControl>
              )}
            />

            <Controller
              name="price"
              control={control}
              render={({ field: { onChange, value } }) => (
                <FormControl isInvalid={!!errors.price}>
                  <FormLabel>Price (VET)</FormLabel>
                  <NumberInput
                    value={value}
                    onChange={(_, value) => onChange(value)}
                    min={0}
                    precision={3}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                  <FormErrorMessage>{errors.price?.message}</FormErrorMessage>
                </FormControl>
              )}
            />
          </HStack>

          {/* Dates */}
          <HStack width="full" spacing={4}>
            <Controller
              name="productionDate"
              control={control}
              render={({ field: { onChange, value } }) => (
                <FormControl isInvalid={!!errors.productionDate}>
                  <FormLabel>Production Date</FormLabel>
                  <Input
                    type="date"
                    value={value ? new Date(value).toISOString().split('T')[0] : ''}
                    onChange={(e) => onChange(new Date(e.target.value))}
                    max={new Date().toISOString().split('T')[0]}
                  />
                  <FormErrorMessage>{errors.productionDate?.message}</FormErrorMessage>
                </FormControl>
              )}
            />

            <Controller
              name="expiryDate"
              control={control}
              render={({ field: { onChange, value } }) => (
                <FormControl isInvalid={!!errors.expiryDate}>
                  <FormLabel>Expiry Date</FormLabel>
                  <Input
                    type="date"
                    value={value ? new Date(value).toISOString().split('T')[0] : ''}
                    onChange={(e) => onChange(new Date(e.target.value))}
                    min={new Date().toISOString().split('T')[0]}
                  />
                  <FormErrorMessage>{errors.expiryDate?.message}</FormErrorMessage>
                </FormControl>
              )}
            />
          </HStack>

          {/* Location and Carbon Footprint */}
          <HStack width="full" spacing={4}>
            <Controller
              name="location"
              control={control}
              render={({ field }) => (
                <FormControl isInvalid={!!errors.location}>
                  <FormLabel>Location</FormLabel>
                  <Input {...field} />
                  <FormErrorMessage>{errors.location?.message}</FormErrorMessage>
                </FormControl>
              )}
            />

            <Controller
              name="carbonFootprint"
              control={control}
              render={({ field: { onChange, value } }) => (
                <FormControl isInvalid={!!errors.carbonFootprint}>
                  <FormLabel>Carbon Footprint (kg CO2)</FormLabel>
                  <NumberInput
                    value={value}
                    onChange={(_, value) => onChange(value)}
                    min={0}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                  <FormErrorMessage>{errors.carbonFootprint?.message}</FormErrorMessage>
                </FormControl>
              )}
            />
          </HStack>

          {/* Image Upload */}
          <Controller
            name="image"
            control={control}
            render={({ field: { onChange, value } }) => (
              <FormControl isInvalid={!!errors.image}>
                <FormLabel>Product Image</FormLabel>
                <Dropzone
                  onFileAccepted={onChange}
                  maxSize={5000000}
                  acceptedFileTypes={['image/jpeg', 'image/png', 'image/webp']}
                  value={value}
                />
                <FormErrorMessage>{errors.image?.message}</FormErrorMessage>
              </FormControl>
            )}
          />

          {/* Submit Button */}
          <AnimatedButton
            type="submit"
            colorScheme="blue"
            size="lg"
            width="full"
            isLoading={isSubmitting}
            isDisabled={!isValid || isSubmitting || !account}
            leftIcon={<Icon as={isValid ? Check : AlertCircle} />}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isSubmitting ? 'Creating Product...' : 'Create Product'}
          </AnimatedButton>
        </MotionVStack>
      </form>
    </AnimatedContainer>
  );
};
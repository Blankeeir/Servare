// components/TrackingForm.tsx
import React from 'react';
import {
  VStack,
  FormControl,
  FormLabel,
  Input,
  Button,
  NumberInput,
  NumberInputField,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useSupplyChain } from '../hooks/useSupplyChain';

export const TrackingForm: React.FC<{ tokenId: string }> = ({ tokenId }) => {
  const { addTracking } = useSupplyChain(tokenId);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data: any) => {
    await addTracking.mutateAsync({
      ...data,
      envKeys: ['temperature', 'humidity'],
      envValues: [data.temperature.toString(), data.humidity.toString()]
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <VStack spacing={4}>
        <FormControl>
          <FormLabel>Location</FormLabel>
          <Input {...register('location', { required: true })} />
        </FormControl>

        <FormControl>
          <FormLabel>Handler</FormLabel>
          <Input {...register('handler', { required: true })} />
        </FormControl>

        <FormControl>
          <FormLabel>Temperature (°C)</FormLabel>
          <NumberInput>
            <NumberInputField {...register('temperature', { required: true })} />
          </NumberInput>
        </FormControl>

        <FormControl>
          <FormLabel>Humidity (%)</FormLabel>
          <NumberInput>
            <NumberInputField {...register('humidity', { required: true })} />
          </NumberInput>
        </FormControl>

        <Button 
          type="submit" 
          colorScheme="blue" 
          isLoading={addTracking.isLoading}
        >
          Add Tracking Data
        </Button>
      </VStack>
    </form>
  );
};
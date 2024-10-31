// apps/frontend/src/hooks/useProducts.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productService } from '../services/api';
import { ProductFormData } from ',,/schemas/validation.ts';
import { useToast } from '@chakra-ui/react';

export const useProducts = (filters?: Record<string, any>) => {
  const queryClient = useQueryClient();
  const toast = useToast();

  const {
    data: products,
    isLoading,
    error
  } = useQuery({
    queryKey: ['products', filters],
    queryFn: () => productService.getProducts(filters),
    staleTime: 1 * 60 * 1000, // 1 minute
  });

  const createProduct = useMutation(
    (productData: ProductFormData) => productService.createProduct(productData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['products']);
        toast({
          title: 'Product created',
          status: 'success',
          duration: 3000,
        });
      },
      onError: (error: any) => {
        toast({
          title: 'Creation failed',
          description: error.message,
          status: 'error',
          duration: 3000,
        });
      },
    }
  );

  const deleteProduct = useMutation(
    (productId: string) => productService.deleteProduct(productId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['products']);
        toast({
          title: 'Product deleted',
          status: 'success',
          duration: 3000,
        });
      },
    }
  );

  return {
    products,
    isLoading,
    error,
    createProduct: createProduct.mutate,
    isCreating: createProduct.isLoading,
    deleteProduct: deleteProduct.mutate,
    isDeleting: deleteProduct.isLoading,
  };
};

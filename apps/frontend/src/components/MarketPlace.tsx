// apps/frontend/src/pages/Marketplace.tsx
import React, { useState } from 'react';
import {
  Box,
  SimpleGrid,
  Input,
  Select,
  HStack,
  Skeleton,
  useDisclosure,
  ScaleFade,
  SlideFade,
  InputGroup,
  InputLeftElement,
} from '@chakra-ui/react';
import { Search, Filter, Tag } from 'lucide-react';
import { motion } from 'framer-motion';
import { useProducts } from '../hooks/useProduct';
import { ProductCard } from './ProductCard';
import {Product} from '../util/types';
// import { ProductDetailModal } from './ProductDetailModal';
import { FilterDrawer } from './FilterDrawer';

const MotionGrid = motion.custom(SimpleGrid);

export const Marketplace: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { products, isLoading, error } = useProducts();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const filterDrawer = useDisclosure();

  const filteredProducts = products?.filter((product: {
      name: any;
      description: any;
      category: string;type: Product
}) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <Box>
      <SlideFade in offsetY={20}>
        <HStack spacing={4} mb={8}>
          <InputGroup>
            <InputLeftElement>
              <Search className="text-gray-400" />
            </InputLeftElement>
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              bg="white"
            />
          </InputGroup>
          <Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            bg="white"
            w="200px"
          >
            <option value="all">All Categories</option>
            <option value="fruits">Fruits & Vegetables</option>
            <option value="dairy">Dairy Products</option>
            <option value="meat">Meat & Poultry</option>
            <option value="grains">Grains</option>
          </Select>
          <Box
            as="button"
            onClick={filterDrawer.onOpen}
            p={2}
            borderRadius="md"
            bg="white"
          >
            <Filter />
          </Box>
        </HStack>
      </SlideFade>

      {isLoading ? (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} height="400px" borderRadius="xl" />
          ))}
        </SimpleGrid>
      ) : (
        <MotionGrid
          columns={{ base: 1, md: 2, lg: 3 }}
          spacing={6}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {filteredProducts?.map((product: any, index: number) => (
            product && (
              <ScaleFade in delay={index * 0.1} key={product.id}>
                <ProductCard
                  product={product}
                  onClick={() => {
                    setSelectedProduct(product);
                    onOpen();
                  }}
                />
              </ScaleFade>
            )
          ))}
        </MotionGrid>
      )}

      <ProductDetailModal
        isOpen={isOpen}
        onClose={onClose}
        product={selectedProduct}
      />

      <FilterDrawer
              isOpen={filterDrawer.isOpen}
              onClose={filterDrawer.onClose} onApplyFilters={function (filters: any): void {
                  throw new Error('Function not implemented.');
              } }      />
    </Box>
  );
};



    const { isOpen, onOpen, onClose } = useDisclosure();
    const { filters, setFilters, applyFilters } = useProductFilters();
    const { products, isLoading } = useProduct();
  
    const filteredProducts = useMemo(() => {
      if (!products) return [];
      return applyFilters(products);
    }, [products, filters]);
  
    return (
      <Box>
        {/* Your existing marketplace UI */}
        <Button leftIcon={<FilterIcon />} onClick={onOpen}>
          Filters
        </Button>
  
        <FilterDrawer
          isOpen={isOpen}
          onClose={onClose}
          onApplyFilters={setFilters}
          currentFilters={filters}
        />
  
        {/* Display filtered products */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </SimpleGrid>
      </Box>
    );
  };
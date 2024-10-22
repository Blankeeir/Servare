import React, { useState } from 'react';
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Input,
    Textarea,
    Flex,
    Heading,
    Icon,
    useToast,
    Spinner,
} from '@chakra-ui/react';
import { FaAppleAlt, FaGlobe, FaBoxOpen, FaClipboard } from 'react-icons/fa';
import { ethers } from 'ethers';

const ProductEntryForm: React.FC = () => {
    const [name, setName] = useState('');
    const [origin, setOrigin] = useState('');
    const [quantity, setQuantity] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const toast = useToast();

    // Placeholder contract address and ABI (replace with actual values)
    const contractAddress = '0xYourContractAddress';
    const contractABI = [
        // Add your contract's ABI here
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!window.ethereum) {
            toast({
                title: 'MetaMask not detected.',
                description: 'Please install MetaMask to submit product data.',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        setLoading(true);

        try {
            // Connect to MetaMask
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            await provider.send('eth_requestAccounts', []);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(contractAddress, contractABI, signer);

            // Call the smart contract's addProduct function
            const tx = await contract.addProduct(name, origin, quantity, description);
            await tx.wait();

            toast({
                title: 'Product submitted successfully!',
                description: 'Your product data has been recorded on the blockchain.',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });

            // Clear form fields
            setName('');
            setOrigin('');
            setQuantity('');
            setDescription('');
        } catch (error) {
            console.error('Blockchain error:', error);
            toast({
                title: 'Submission failed.',
                description: 'An error occurred while submitting product data.',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            p={8}
            borderWidth="1px"
            borderRadius="md"
            boxShadow="lg"
            bg="white"
            maxW="500px"
            mx="auto"
            mt={6}
        >
            <Heading as="h3" size="lg" mb={6} textAlign="center" color="teal.500">
                Enter Product Information
            </Heading>
            <form onSubmit={handleSubmit}>
                <FormControl mb={4} isRequired>
                    <FormLabel>
                        <Icon as={FaAppleAlt} mr={2} color="teal.500" />
                        Product Name
                    </FormLabel>
                    <Input
                        placeholder="e.g., Wheat, Rice"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </FormControl>

                <FormControl mb={4} isRequired>
                    <FormLabel>
                        <Icon as={FaGlobe} mr={2} color="teal.500" />
                        Origin
                    </FormLabel>
                    <Input
                        placeholder="e.g., Australia, India"
                        value={origin}
                        onChange={(e) => setOrigin(e.target.value)}
                    />
                </FormControl>

                <FormControl mb={4} isRequired>
                    <FormLabel>
                        <Icon as={FaBoxOpen} mr={2} color="teal.500" />
                        Quantity
                    </FormLabel>
                    <Input
                        type="number"
                        placeholder="e.g., 20"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                    />
                </FormControl>

                <FormControl mb={4}>
                    <FormLabel>
                        <Icon as={FaClipboard} mr={2} color="teal.500" />
                        Description
                    </FormLabel>
                    <Textarea
                        placeholder="Describe the product quality, etc."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </FormControl>

                <Flex justify="center">
                    <Button
                        colorScheme="teal"
                        type="submit"
                        width="full"
                        mt={4}
                        size="lg"
                        isLoading={loading}
                        loadingText="Submitting"
                    >
                        {loading ? <Spinner size="md" /> : 'Submit'}
                    </Button>
                </Flex>
            </form>
        </Box>
    );
};

export default ProductEntryForm;

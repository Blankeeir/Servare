import { DAppKitProvider } from "@vechain/dapp-kit-react";
import { ChakraProvider, Container, Flex, Box, Heading, Text } from "@chakra-ui/react";
import {
    Navbar,
    Footer,
    SubmissionModal,
} from "./components";
import ProductEntryForm from "./components/ProductEntryForm"; // Import the form component
import { lightTheme } from "./theme";

function App() {
    return (
        <ChakraProvider theme={lightTheme}>
            <DAppKitProvider
                usePersistence
                requireCertificate={false}
                genesis="test"
                nodeUrl="https://testnet.vechain.org/"
                logLevel="DEBUG"
            >
                <Navbar />
                <Flex flex={1} direction="column" bg="gray.100" minHeight="100vh">
                    <Box
                        bg="teal.600"
                        py={10}
                        px={4}
                        color="white"
                        textAlign="center"
                    >
                        <Heading as="h1" size="2xl" mb={2}>
                            Welcome to Servare
                        </Heading>
                        <Text fontSize="lg" maxW="600px" mx="auto">
                            Blockchain-powered solution to reduce food waste.
                        </Text>
                    </Box>

                    <Container mt={6} maxW="container.md" p={6}>
                        <ProductEntryForm />
                    </Container>

                    <Footer />
                    <SubmissionModal />
                </Flex>
            </DAppKitProvider>
        </ChakraProvider>
    );
}

export default App;

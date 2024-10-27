import { DAppKitProvider } from "@vechain/dapp-kit-react";
import { ChakraProvider, Container, Flex } from "@chakra-ui/react";
import {
  Dropzone,
  Footer,
  InfoCard,
  Instructions,
  Navbar,
  SubmissionModal,
} from "./components";
import { lightTheme } from "./theme";
import { DynamicContextProvider, DynamicWidget } from '@dynamic-labs/sdk-react-core';
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";


const App = () => (
    <ChakraProvider theme={lightTheme}>

      <DAppKitProvider
        usePersistence
        requireCertificate={false}
        genesis="test"
        nodeUrl="https://testnet.vechain.org/"
        logLevel={"DEBUG"}
      >
        <Navbar />
        <DynamicContextProvider
        settings={{
          environmentId: '7acebce4-9ec4-4363-a4f3-b85925f652a8',
          walletConnectors: [ EthereumWalletConnectors ],
        }}
      >
        <DynamicWidget />
      </DynamicContextProvider>
        <Flex flex={1}>
          <Container
            mt={{ base: 4, md: 10 }}
            maxW={"container.xl"}
            mb={{ base: 4, md: 10 }}
            display={"flex"}
            flex={1}
            alignItems={"center"}
            justifyContent={"flex-start"}
            flexDirection={"column"}
          >
            <InfoCard />
            <Instructions />
            <Dropzone />
          </Container>
        </Flex>
        <Footer />

        {/* MODALS  */}
        <SubmissionModal />
      </DAppKitProvider>
    </ChakraProvider>
);

export default App;
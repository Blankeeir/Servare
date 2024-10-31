// apps/frontend/src/hooks/useVeChain.ts
import { useEffect, useState } from 'react';
import { Connex } from '@vechain/connex';
import { useWallet } from '@vechain/dapp-kit-react';

export const useVeChain = () => {
  const [connex, setConnex] = useState<Connex | null>(null);
  const { account } = useWallet();

  useEffect(() => {
    const initConnex = async () => {
      const connexInstance = new Connex({
        node: 'https://testnet.vechain.org',
        network: 'test'
      });
      setConnex(connexInstance);
    };

    initConnex();
  }, []);

  const getBalance = async () => {
    if (!connex || !account) return null;
    const balance = await connex.thor
      .account(account)
      .get();
    return balance.balance;
  };

  const sendTransaction = async (txParams: any) => {
    if (!connex || !account) throw new Error('Connex or account not initialized');

    try {
      const signedTx = await connex.vendor
        .sign('tx', [txParams])
        .request();
      return signedTx;
    } catch (error) {
      console.error('Transaction failed:', error);
      throw error;
    }
  };

  return {
    connex,
    getBalance,
    sendTransaction
  };
};

// apps/frontend/src/hooks/useContract.ts
import { useEffect, useState } from 'react';
import { useVeChain } from './useVeChain';

export const useContract = (address: string, abi: any) => {
  const { connex } = useVeChain();
  const [contract, setContract] = useState<any>(null);

  useEffect(() => {
    if (!connex || !address || !abi) return;

    const contractInstance = {
      address,
      abi,
      methods: {} as any
    };

    // Create methods from ABI
    abi.forEach((abiItem: any) => {
      if (abiItem.type === 'function') {
        contractInstance.methods[abiItem.name] = async (...args: any[]) => {
          const method = connex.thor
            .account(address)
            .method(abiItem);

          if (abiItem.stateMutability === 'view') {
            return method.call(...args);
          } else {
            const clause = method.asClause(...args);
            return connex.vendor
              .sign('tx', [clause])
              .request();
          }
        };
      }
    });

    setContract(contractInstance);
  }, [connex, address, abi]);

  return contract;
};
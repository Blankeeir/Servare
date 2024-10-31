// apps/frontend/src/hooks/useTransactions.ts
import { useState, useEffect } from 'react';
import { useVeChain } from './useVeChain';
import { FormattingUtils } from '@repo/utils';
import {Transaction} from '../util/types';

export const useTransactions = (address?: string) => {
  const { connex } = useVeChain();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!connex || !address) return;

      try {
        setLoading(true);
        const events = await connex.thor
          .account(address)
          .event({ name: 'transfer' })
          .filter([{ range: { unit: 'block', from: 0, to: 'best' } }])
          .apply(0, Number.MAX_SAFE_INTEGER);

        const formattedTransactions = events.map(event => ({
          id: event.meta.blockNumber + '-' + event.meta.txID,
          hash: event.meta.txID,
          block: event.meta.blockNumber,
          timestamp: event.meta.blockTimestamp,
          from: FormattingUtils.formatAddress(event.sender),
          to: FormattingUtils.formatAddress(event.recipient),
          value: event.amount
        }));

        setTransactions(formattedTransactions);
      } catch (error) {
        console.error('Failed to fetch transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [connex, address]);

  return { transactions, loading };
};
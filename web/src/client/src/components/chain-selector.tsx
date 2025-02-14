'use client';
import { ArbitrumLogo } from '@/components/logo/arbitrum-logo';
import { AvalancheLogo } from '@/components/logo/avalanche-logo';
import { BaseLogo } from '@/components/logo/base-logo';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { extractChain } from 'viem';
import { useChainId, useSwitchChain } from 'wagmi';
import { SUPPORTED_CHAINS } from '../constants/supported-chains';
const CHAIN_LOGOS = {
  84532: BaseLogo,
  421614: ArbitrumLogo,
  43113: AvalancheLogo,
} as const;

export const ChainSelector = () => {
  const chainId = useChainId();
  const { chains, switchChain } = useSwitchChain();
  const currentChain = extractChain({ chains, id: chainId });

  const handleChainChange = (chainId: string) => {
    const id = Number(chainId);
    const newChain = extractChain({ chains, id });
    if (newChain) {
      switchChain({ chainId: id });
    }
  };

  return (
    <Select
      value={currentChain?.id?.toString()}
      onValueChange={handleChainChange}
    >
      <SelectTrigger className="bg-background border-border w-[140px]">
        <SelectValue>
          <div className="flex items-center gap-2">
            {currentChain ? (
              <>
                {currentChain.id && (
                  <>
                    {(() => {
                      const Logo =
                        CHAIN_LOGOS[
                          currentChain.id as keyof typeof CHAIN_LOGOS
                        ];
                      return (
                        <Logo width={20} height={20} className="rounded-full" />
                      );
                    })()}
                    <span className="truncate">{currentChain.name}</span>
                  </>
                )}
              </>
            ) : (
              'Select Chain'
            )}
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {SUPPORTED_CHAINS.map((chain) => {
          const Logo = CHAIN_LOGOS[chain.id as keyof typeof CHAIN_LOGOS];
          return (
            <SelectItem
              key={chain.id}
              value={chain.id.toString()}
              className="flex items-center gap-2 data-[highlighted]:bg-background-secondary data-[highlighted]:text-white transition-colors"
            >
              <div className="flex items-center gap-2">
                <Logo width={20} height={20} className="rounded-full" />
                <span className="truncate">{chain.name}</span>
              </div>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
};

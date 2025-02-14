import { cn } from '@/lib/utils';
import { BrainCircuit, Briefcase, Lightbulb, Zap } from 'lucide-react';

const SUGGESTION_TAGS = [
  {
    icon: Briefcase,
    text: 'Analyze my portfolio',
  },
  {
    icon: BrainCircuit,
    text: 'Rebalance my portfolio',
  },
  {
    icon: Lightbulb,
    text: 'Conservative strategies USDC',
  },
  {
    icon: Zap,
    text: 'Aggressive strategies USDC',
  },
] as const;

interface ChatInfoProps {
  isExpanded: boolean;
}

export const ChatInfo = ({ isExpanded }: ChatInfoProps) => {
  return (
    <div className="flex flex-col items-center w-2/3">
      <div
        className={cn(
          'text-center transition-all duration-300 transform',
          isExpanded ? 'opacity-0 -translate-y-8' : 'opacity-100 translate-y-0',
        )}
      >
        <h1 className="text-text-secondary mb-2">Hi there</h1>
        <h2 className="text-4xl font-semibold text-white">
          How can i help you ?
        </h2>
      </div>

      {/* Gap for ChatBox */}
      <div className="h-28" />

      <div
        className={cn(
          'flex flex-wrap gap-3 justify-center transition-all duration-300 transform',
          isExpanded ? 'opacity-0 translate-y-8' : 'opacity-100 translate-y-0',
        )}
      >
        {SUGGESTION_TAGS.map(({ icon: Icon, text }) => (
          <div
            key={text}
            className="flex items-center gap-2 px-4 py-2 rounded-md text-[#C58FFF] bg-[#2A1547]"
          >
            <Icon className="w-5 h-5" />
            <span>{text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { SkillLifecycle } from '@/lib/mockData';

interface LifecycleBadgeProps {
  lifecycle: SkillLifecycle;
  showLabel?: boolean;
}

const lifecycleConfig: Record<SkillLifecycle, { label: string; className: string; icon: typeof TrendingUp }> = {
  emerging: { 
    label: 'Emerging', 
    className: 'metric-badge-emerging',
    icon: TrendingUp 
  },
  growing: { 
    label: 'Growing', 
    className: 'metric-badge-growth',
    icon: TrendingUp 
  },
  mature: { 
    label: 'Mature', 
    className: 'metric-badge-stable',
    icon: Minus 
  },
  stable: { 
    label: 'Stable', 
    className: 'metric-badge-stable',
    icon: Minus 
  },
  declining: { 
    label: 'Declining', 
    className: 'metric-badge-declining',
    icon: TrendingDown 
  },
};

export function LifecycleBadge({ lifecycle, showLabel = true }: LifecycleBadgeProps) {
  const config = lifecycleConfig[lifecycle];
  const Icon = config.icon;

  return (
    <span className={config.className}>
      <Icon className="h-3 w-3" />
      {showLabel && config.label}
    </span>
  );
}

"use client";

import Link from 'next/link';
import { Skill } from '@/lib/mockData';
import { LifecycleBadge } from './LifecycleBadge';
import { MiniTrendChart } from './MiniTrendChart';
import { TrendingUp, TrendingDown, Clock, DollarSign, Briefcase } from 'lucide-react';

interface SkillCardProps {
  skill: Skill;
}

export function SkillCard({ skill }: SkillCardProps) {
  const trendColor = skill.growthRate >= 0
    ? 'hsl(var(--chart-growth))'
    : 'hsl(var(--chart-declining))';

  return (
    <Link
      href={`/explainability?skill=${skill.id}`}
      className="data-card hover:border-accent/50 transition-colors block"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-foreground">{skill.name}</h3>
          <p className="text-sm text-muted-foreground">{skill.category}</p>
        </div>
        <LifecycleBadge lifecycle={skill.lifecycle} />
      </div>

      <div className="mb-4">
        <MiniTrendChart data={skill.demandTrend} color={trendColor} />
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          {skill.growthRate >= 0 ? (
            <TrendingUp className="h-3.5 w-3.5 text-chart-growth" />
          ) : (
            <TrendingDown className="h-3.5 w-3.5 text-chart-declining" />
          )}
          <span className={skill.growthRate >= 0 ? 'text-chart-growth' : 'text-chart-declining'}>
            {skill.growthRate > 0 ? '+' : ''}{skill.growthRate}%
          </span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <DollarSign className="h-3.5 w-3.5" />
          <span>{skill.salaryImpact > 0 ? '+' : ''}{skill.salaryImpact}%</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Briefcase className="h-3.5 w-3.5" />
          <span>{(skill.jobPostings / 1000).toFixed(1)}k jobs</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock className="h-3.5 w-3.5" />
          <span>{skill.timeToAcquire}</span>
        </div>
      </div>
    </Link>
  );
}

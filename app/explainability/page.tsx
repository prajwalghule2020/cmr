"use client";

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { skillsData, skillRecommendations, careerPaths } from '@/lib/mockData';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LifecycleBadge } from '@/components/LifecycleBadge';
import { Navigation } from '@/components/Navigation';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import {
    TrendingUp,
    AlertTriangle,
    Globe,
    BookOpen,
    ExternalLink,
    Shield,
    Target,
    Clock,
} from 'lucide-react';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function ExplainabilityContent() {
    const searchParams = useSearchParams();
    const skillId = searchParams.get('skill');
    const pathId = searchParams.get('path');

    // Find the relevant skill or path
    const selectedSkill = skillId
        ? skillsData.find(s => s.id === skillId)
        : skillsData[0];

    const selectedPath = pathId
        ? careerPaths.find(p => p.id === pathId)
        : null;

    const recommendation = skillRecommendations.find(r => r.skillId === selectedSkill?.id);

    if (!selectedSkill) {
        return (
            <div className="min-h-screen bg-background">
                <Navigation />
                <div className="container py-8">
                    <p className="text-muted-foreground">Skill not found.</p>
                </div>
            </div>
        );
    }

    const trendData = selectedSkill.demandTrend.map((value, index) => ({
        month: months[index],
        demand: value,
    }));

    // Risk breakdown mock
    const riskFactors = [
        { name: 'Automation Risk', value: selectedSkill.riskScore * 0.4, color: 'hsl(var(--chart-declining))' },
        { name: 'Oversaturation', value: selectedSkill.riskScore * 0.3, color: 'hsl(var(--chart-emerging))' },
        { name: 'Obsolescence', value: selectedSkill.riskScore * 0.3, color: 'hsl(var(--chart-stable))' },
    ];

    return (
        <div className="min-h-screen bg-background">
            <Navigation />
            <div className="container py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-2xl font-bold text-foreground">{selectedSkill.name}</h1>
                        <LifecycleBadge lifecycle={selectedSkill.lifecycle} />
                    </div>
                    <p className="text-muted-foreground">
                        Detailed analysis and explainability metrics for skill recommendation
                    </p>
                </div>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <Card className="p-4">
                        <div className="flex items-center gap-2 text-muted-foreground mb-2">
                            <TrendingUp className="h-4 w-4 text-chart-growth" />
                            <span className="text-sm">Growth Rate</span>
                        </div>
                        <p className="text-2xl font-bold text-foreground">
                            {selectedSkill.growthRate > 0 ? '+' : ''}{selectedSkill.growthRate}%
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">YoY change in demand</p>
                    </Card>
                    <Card className="p-4">
                        <div className="flex items-center gap-2 text-muted-foreground mb-2">
                            <Globe className="h-4 w-4 text-chart-mature" />
                            <span className="text-sm">Market Diffusion</span>
                        </div>
                        <p className="text-2xl font-bold text-foreground">{selectedSkill.diffusion}%</p>
                        <p className="text-xs text-muted-foreground mt-1">Adoption across industries</p>
                    </Card>
                    <Card className="p-4">
                        <div className="flex items-center gap-2 text-muted-foreground mb-2">
                            <AlertTriangle className="h-4 w-4 text-chart-declining" />
                            <span className="text-sm">Risk Score</span>
                        </div>
                        <p className="text-2xl font-bold text-foreground">{selectedSkill.riskScore}/100</p>
                        <p className="text-xs text-muted-foreground mt-1">
                            {selectedSkill.riskScore < 30 ? 'Low risk' : selectedSkill.riskScore < 60 ? 'Moderate risk' : 'High risk'}
                        </p>
                    </Card>
                    <Card className="p-4">
                        <div className="flex items-center gap-2 text-muted-foreground mb-2">
                            <Target className="h-4 w-4 text-accent" />
                            <span className="text-sm">Salary Impact</span>
                        </div>
                        <p className="text-2xl font-bold text-foreground">
                            {selectedSkill.salaryImpact > 0 ? '+' : ''}{selectedSkill.salaryImpact}%
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">Avg. compensation lift</p>
                    </Card>
                </div>

                <div className="grid lg:grid-cols-3 gap-6 mb-8">
                    {/* Demand Trend Chart */}
                    <Card className="p-6 lg:col-span-2">
                        <h2 className="font-semibold text-foreground mb-4">12-Month Demand Trend</h2>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={trendData}>
                                    <defs>
                                        <linearGradient id="demandGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                                    <XAxis
                                        dataKey="month"
                                        tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                                        axisLine={{ stroke: 'hsl(var(--border))' }}
                                    />
                                    <YAxis
                                        tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                                        axisLine={{ stroke: 'hsl(var(--border))' }}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'hsl(var(--popover))',
                                            border: '1px solid hsl(var(--border))',
                                            borderRadius: 'var(--radius)',
                                        }}
                                        labelStyle={{ color: 'hsl(var(--foreground))' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="demand"
                                        stroke="hsl(var(--accent))"
                                        strokeWidth={2}
                                        fill="url(#demandGradient)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>

                    {/* Risk Breakdown */}
                    <Card className="p-6">
                        <h2 className="font-semibold text-foreground mb-4">Risk Breakdown</h2>
                        <div className="space-y-4">
                            {riskFactors.map((factor) => (
                                <div key={factor.name}>
                                    <div className="flex items-center justify-between text-sm mb-1">
                                        <span className="text-muted-foreground">{factor.name}</span>
                                        <span className="font-medium text-foreground">{factor.value.toFixed(0)}%</span>
                                    </div>
                                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                                        <div
                                            className="h-full rounded-full transition-all"
                                            style={{
                                                width: `${factor.value}%`,
                                                backgroundColor: factor.color,
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 pt-4 border-t border-border">
                            <div className="flex items-center gap-2 text-sm">
                                <Shield className="h-4 w-4 text-muted-foreground" />
                                <span className="text-muted-foreground">Overall Risk Assessment</span>
                            </div>
                            <p className="mt-2 text-sm text-foreground">
                                {selectedSkill.riskScore < 30
                                    ? 'This skill has strong long-term viability with low disruption probability.'
                                    : selectedSkill.riskScore < 60
                                        ? 'Moderate risk factors present. Monitor for changes in market dynamics.'
                                        : 'Higher risk detected. Consider pairing with more stable foundational skills.'
                                }
                            </p>
                        </div>
                    </Card>
                </div>

                {/* Evidence Panel */}
                {recommendation && (
                    <div className="evidence-panel mb-8">
                        <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                            <BookOpen className="h-5 w-5" />
                            Evidence & Justification
                        </h2>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-sm font-medium text-foreground mb-2">Recommendation Rationale</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {recommendation.reason}
                                </p>

                                <div className="mt-4 grid grid-cols-2 gap-3">
                                    <div className="bg-card rounded-md p-3 border border-border">
                                        <p className="text-xs text-muted-foreground">Growth Rate</p>
                                        <p className="text-lg font-semibold text-foreground">+{recommendation.metrics.growthRate}%</p>
                                    </div>
                                    <div className="bg-card rounded-md p-3 border border-border">
                                        <p className="text-xs text-muted-foreground">Market Demand</p>
                                        <p className="text-lg font-semibold text-foreground">{recommendation.metrics.marketDemand}</p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium text-foreground mb-2">Data Sources</h3>
                                <ul className="space-y-2">
                                    {recommendation.sources.map((source, index) => (
                                        <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                                            {source}
                                        </li>
                                    ))}
                                </ul>

                                <div className="mt-4 p-3 bg-card rounded-md border border-border">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Clock className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm font-medium text-foreground">Time to Acquire</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground">{selectedSkill.timeToAcquire}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Related Skills */}
                <Card className="p-6">
                    <h2 className="font-semibold text-foreground mb-4">Related Skills in Trajectory</h2>
                    <div className="flex flex-wrap gap-2">
                        {skillsData
                            .filter(s => s.category === selectedSkill.category && s.id !== selectedSkill.id)
                            .slice(0, 6)
                            .map((skill) => (
                                <Badge
                                    key={skill.id}
                                    variant="outline"
                                    className="cursor-pointer hover:bg-secondary"
                                >
                                    {skill.name}
                                    <span className={`ml-1 text-xs ${skill.growthRate >= 0 ? 'text-chart-growth' : 'text-chart-declining'}`}>
                                        {skill.growthRate > 0 ? '+' : ''}{skill.growthRate}%
                                    </span>
                                </Badge>
                            ))}
                    </div>
                </Card>

                {/* Methodology Note */}
                <div className="mt-8 pt-6 border-t border-border">
                    <p className="text-xs text-muted-foreground leading-relaxed">
                        <strong className="text-foreground">Methodology:</strong> Metrics are derived from labor market data
                        including job postings, salary surveys, and industry reports. Growth rates represent year-over-year
                        change in demand. Diffusion measures adoption across sectors. Risk scores combine automation potential,
                        market saturation, and technology obsolescence factors. Data updated monthly from verified sources.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function Explainability() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-background">
                <Navigation />
                <div className="container py-8">
                    <div className="animate-pulse">Loading...</div>
                </div>
            </div>
        }>
            <ExplainabilityContent />
        </Suspense>
    );
}

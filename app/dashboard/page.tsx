"use client";

import { useState } from 'react';
import { skillsData, skillCategories, timePeriods } from '@/lib/mockData';
import { SkillCard } from '@/components/SkillCard';
import { Navigation } from '@/components/Navigation';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    BarChart,
    Bar,
} from 'recharts';
import { TrendingUp, Activity, AlertTriangle, BarChart3 } from 'lucide-react';

const lifecycleData = [
    { stage: 'Emerging', count: skillsData.filter(s => s.lifecycle === 'emerging').length, fill: 'hsl(var(--chart-emerging))' },
    { stage: 'Growing', count: skillsData.filter(s => s.lifecycle === 'growing').length, fill: 'hsl(var(--chart-growth))' },
    { stage: 'Mature', count: skillsData.filter(s => s.lifecycle === 'mature').length, fill: 'hsl(var(--chart-mature))' },
    { stage: 'Stable', count: skillsData.filter(s => s.lifecycle === 'stable').length, fill: 'hsl(var(--chart-stable))' },
    { stage: 'Declining', count: skillsData.filter(s => s.lifecycle === 'declining').length, fill: 'hsl(var(--chart-declining))' },
];

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function Dashboard() {
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [selectedPeriod, setSelectedPeriod] = useState<string>('1y');
    const [selectedLifecycle, setSelectedLifecycle] = useState<string>('all');

    const filteredSkills = skillsData.filter(skill => {
        if (selectedCategory !== 'all' && skill.category !== selectedCategory) return false;
        if (selectedLifecycle !== 'all' && skill.lifecycle !== selectedLifecycle) return false;
        return true;
    });

    // Prepare trend comparison data
    const trendComparisonData = months.map((month, index) => {
        const dataPoint: Record<string, string | number> = { month };
        skillsData.slice(0, 4).forEach(skill => {
            dataPoint[skill.name] = skill.demandTrend[index];
        });
        return dataPoint;
    });

    const summaryStats = {
        emergingCount: skillsData.filter(s => s.lifecycle === 'emerging').length,
        averageGrowth: Math.round(skillsData.reduce((sum, s) => sum + s.growthRate, 0) / skillsData.length),
        highRiskCount: skillsData.filter(s => s.riskScore > 50).length,
        totalJobPostings: skillsData.reduce((sum, s) => sum + s.jobPostings, 0),
    };

    return (
        <div className="min-h-screen bg-background">
            <Navigation />
            <div className="container py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-foreground mb-2">Skill Trends Dashboard</h1>
                    <p className="text-muted-foreground">
                        Global skill trends and lifecycle stages based on labor market data
                    </p>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="data-card">
                        <div className="flex items-center gap-2 text-muted-foreground mb-2">
                            <TrendingUp className="h-4 w-4 text-chart-emerging" />
                            <span className="text-sm">Emerging Skills</span>
                        </div>
                        <p className="text-2xl font-bold text-foreground">{summaryStats.emergingCount}</p>
                    </div>
                    <div className="data-card">
                        <div className="flex items-center gap-2 text-muted-foreground mb-2">
                            <Activity className="h-4 w-4 text-chart-growth" />
                            <span className="text-sm">Avg. Growth Rate</span>
                        </div>
                        <p className="text-2xl font-bold text-foreground">+{summaryStats.averageGrowth}%</p>
                    </div>
                    <div className="data-card">
                        <div className="flex items-center gap-2 text-muted-foreground mb-2">
                            <AlertTriangle className="h-4 w-4 text-chart-declining" />
                            <span className="text-sm">High Risk Skills</span>
                        </div>
                        <p className="text-2xl font-bold text-foreground">{summaryStats.highRiskCount}</p>
                    </div>
                    <div className="data-card">
                        <div className="flex items-center gap-2 text-muted-foreground mb-2">
                            <BarChart3 className="h-4 w-4 text-chart-mature" />
                            <span className="text-sm">Total Job Postings</span>
                        </div>
                        <p className="text-2xl font-bold text-foreground">{(summaryStats.totalJobPostings / 1000).toFixed(0)}k</p>
                    </div>
                </div>

                {/* Charts Section */}
                <div className="grid lg:grid-cols-2 gap-6 mb-8">
                    {/* Trend Comparison */}
                    <div className="data-card">
                        <h2 className="font-semibold text-foreground mb-4">Demand Trend Comparison</h2>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={trendComparisonData}>
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
                                    <Legend />
                                    <Line type="monotone" dataKey="Large Language Models" stroke="hsl(var(--chart-emerging))" strokeWidth={2} dot={false} />
                                    <Line type="monotone" dataKey="Prompt Engineering" stroke="hsl(var(--chart-growth))" strokeWidth={2} dot={false} />
                                    <Line type="monotone" dataKey="Kubernetes" stroke="hsl(var(--chart-mature))" strokeWidth={2} dot={false} />
                                    <Line type="monotone" dataKey="TypeScript" stroke="hsl(var(--accent))" strokeWidth={2} dot={false} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Lifecycle Distribution */}
                    <div className="data-card">
                        <h2 className="font-semibold text-foreground mb-4">Skill Lifecycle Distribution</h2>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={lifecycleData} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                                    <XAxis
                                        type="number"
                                        tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                                        axisLine={{ stroke: 'hsl(var(--border))' }}
                                    />
                                    <YAxis
                                        type="category"
                                        dataKey="stage"
                                        tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                                        axisLine={{ stroke: 'hsl(var(--border))' }}
                                        width={80}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'hsl(var(--popover))',
                                            border: '1px solid hsl(var(--border))',
                                            borderRadius: 'var(--radius)',
                                        }}
                                        labelStyle={{ color: 'hsl(var(--foreground))' }}
                                    />
                                    <Bar dataKey="count" radius={[0, 4, 4, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-4 mb-6">
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger className="w-40">
                            <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            {skillCategories.map((cat) => (
                                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={selectedLifecycle} onValueChange={setSelectedLifecycle}>
                        <SelectTrigger className="w-40">
                            <SelectValue placeholder="Lifecycle" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Stages</SelectItem>
                            <SelectItem value="emerging">Emerging</SelectItem>
                            <SelectItem value="growing">Growing</SelectItem>
                            <SelectItem value="mature">Mature</SelectItem>
                            <SelectItem value="stable">Stable</SelectItem>
                            <SelectItem value="declining">Declining</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                        <SelectTrigger className="w-32">
                            <SelectValue placeholder="Period" />
                        </SelectTrigger>
                        <SelectContent>
                            {timePeriods.map((period) => (
                                <SelectItem key={period.value} value={period.value}>{period.label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Skills Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredSkills.map((skill) => (
                        <SkillCard key={skill.id} skill={skill} />
                    ))}
                </div>

                {filteredSkills.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">No skills match your filters.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

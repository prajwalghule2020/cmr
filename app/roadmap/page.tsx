"use client";

import Link from 'next/link';
import { careerPaths } from '@/lib/mockData';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Navigation } from '@/components/Navigation';
import {
    GitBranch,
    Clock,
    DollarSign,
    Percent,
    ChevronRight,
    CircleDot,
} from 'lucide-react';

export default function Roadmap() {
    const currentNode = careerPaths.find(n => n.id === 'cp-001')!;
    const nextStepNodes = careerPaths.filter(n => currentNode.outcomes.includes(n.id));
    const futureNodes = careerPaths.filter(n =>
        nextStepNodes.some(next => next.outcomes.includes(n.id))
    );

    return (
        <div className="min-h-screen bg-background">
            <Navigation />
            <div className="container py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-foreground mb-2">Career Roadmap</h1>
                    <p className="text-muted-foreground">
                        Timeline-based career pathways with branching outcomes based on skill acquisition
                    </p>
                </div>

                {/* Timeline View */}
                <div className="relative">
                    {/* Current Position */}
                    <section className="mb-12">
                        <div className="flex items-center gap-2 mb-4">
                            <CircleDot className="h-5 w-5 text-accent" />
                            <h2 className="text-lg font-semibold text-foreground">Current Position</h2>
                        </div>
                        <Card className="p-6 border-accent border-2">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                <div>
                                    <h3 className="text-xl font-bold text-foreground mb-2">{currentNode.title}</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {currentNode.skills.map((skill) => (
                                            <Badge key={skill} variant="secondary">{skill}</Badge>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex flex-col items-start md:items-end gap-2">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <DollarSign className="h-4 w-4" />
                                        <span className="text-sm">{currentNode.salaryRange}</span>
                                    </div>
                                    <Badge className="bg-accent text-accent-foreground">Active</Badge>
                                </div>
                            </div>
                        </Card>
                    </section>

                    {/* Connecting Line */}
                    <div className="hidden md:block absolute left-1/2 top-[140px] w-0.5 h-16 bg-border -translate-x-1/2" />
                    <div className="hidden md:flex absolute left-1/2 top-[200px] -translate-x-1/2 items-center justify-center">
                        <ChevronRight className="h-6 w-6 text-border rotate-90" />
                    </div>

                    {/* Next Steps (1-2 years) */}
                    <section className="mb-12">
                        <div className="flex items-center gap-2 mb-4">
                            <Clock className="h-5 w-5 text-muted-foreground" />
                            <h2 className="text-lg font-semibold text-foreground">Next Steps (1-2 years)</h2>
                            <span className="text-sm text-muted-foreground">Choose your path</span>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                            {nextStepNodes.map((node) => (
                                <Link
                                    key={node.id}
                                    href={`/explainability?path=${node.id}`}
                                    className="block"
                                >
                                    <Card className="p-6 hover:border-accent/50 transition-colors h-full">
                                        <div className="flex items-start justify-between mb-4">
                                            <h3 className="text-lg font-semibold text-foreground">{node.title}</h3>
                                            <div className="flex items-center gap-1 text-sm">
                                                <Percent className="h-3.5 w-3.5 text-accent" />
                                                <span className="font-medium text-accent">{node.probability}%</span>
                                            </div>
                                        </div>

                                        <div className="mb-4">
                                            <p className="text-sm text-muted-foreground mb-2">Required Skills:</p>
                                            <div className="flex flex-wrap gap-1.5">
                                                {node.skills.map((skill) => (
                                                    <Badge key={skill} variant="outline" className="text-xs">{skill}</Badge>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between text-sm">
                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                <Clock className="h-3.5 w-3.5" />
                                                <span>{node.timeline}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                <DollarSign className="h-3.5 w-3.5" />
                                                <span>{node.salaryRange}</span>
                                            </div>
                                        </div>

                                        {node.outcomes.length > 0 && (
                                            <div className="mt-4 pt-4 border-t border-border">
                                                <p className="text-xs text-muted-foreground">
                                                    <GitBranch className="h-3 w-3 inline mr-1" />
                                                    Leads to {node.outcomes.length} future path{node.outcomes.length > 1 ? 's' : ''}
                                                </p>
                                            </div>
                                        )}
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    </section>

                    {/* Future Positions (3-5 years) */}
                    <section>
                        <div className="flex items-center gap-2 mb-4">
                            <GitBranch className="h-5 w-5 text-muted-foreground" />
                            <h2 className="text-lg font-semibold text-foreground">Future Positions (3-5 years)</h2>
                        </div>
                        <div className="grid md:grid-cols-3 gap-4">
                            {futureNodes.map((node) => (
                                <Link
                                    key={node.id}
                                    href={`/explainability?path=${node.id}`}
                                    className="block"
                                >
                                    <Card className="p-5 hover:border-accent/50 transition-colors h-full bg-secondary/30">
                                        <div className="flex items-start justify-between mb-3">
                                            <h3 className="font-semibold text-foreground">{node.title}</h3>
                                            <div className="flex items-center gap-1 text-xs">
                                                <Percent className="h-3 w-3 text-muted-foreground" />
                                                <span className="text-muted-foreground">{node.probability}%</span>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-1 mb-3">
                                            {node.skills.slice(0, 3).map((skill) => (
                                                <Badge key={skill} variant="outline" className="text-xs">{skill}</Badge>
                                            ))}
                                            {node.skills.length > 3 && (
                                                <Badge variant="outline" className="text-xs">+{node.skills.length - 3}</Badge>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <DollarSign className="h-3 w-3" />
                                            <span>{node.salaryRange}</span>
                                        </div>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    </section>

                    {/* Legend */}
                    <section className="mt-12 pt-8 border-t border-border">
                        <h3 className="text-sm font-medium text-foreground mb-4">Understanding the Roadmap</h3>
                        <div className="grid md:grid-cols-3 gap-6 text-sm">
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded bg-accent/10 flex items-center justify-center shrink-0">
                                    <Percent className="h-4 w-4 text-accent" />
                                </div>
                                <div>
                                    <p className="font-medium text-foreground">Probability Score</p>
                                    <p className="text-muted-foreground">Likelihood of reaching this position based on your current skills and market trends</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded bg-accent/10 flex items-center justify-center shrink-0">
                                    <Clock className="h-4 w-4 text-accent" />
                                </div>
                                <div>
                                    <p className="font-medium text-foreground">Timeline</p>
                                    <p className="text-muted-foreground">Estimated time to reach this position with focused skill development</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded bg-accent/10 flex items-center justify-center shrink-0">
                                    <GitBranch className="h-4 w-4 text-accent" />
                                </div>
                                <div>
                                    <p className="font-medium text-foreground">Branching Paths</p>
                                    <p className="text-muted-foreground">Click any node to see detailed explainability metrics</p>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}

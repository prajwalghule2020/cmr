import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, TrendingUp, GitBranch, FileSearch } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-accent" />
            <span className="font-semibold text-lg text-foreground">SkillIntel</span>
          </div>
          <Link href="/auth">
            <Button variant="outline" size="sm">
              Sign in
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container py-24 md:py-32">
        <div className="max-w-3xl">
          <p className="text-sm font-medium text-accent mb-4 tracking-wide uppercase">
            Skill Intelligence Platform
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
            Careers change fast.
            <br />
            <span className="text-muted-foreground">Skills change faster.</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl leading-relaxed">
            A skill-first intelligence system that tracks emerging skills, forecasts their trajectories,
            and translates them into explainable career pathways. Built on labor market data,
            not speculation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/auth">
              <Button size="lg" className="w-full sm:w-auto">
                Start analyzing your skills
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              View methodology
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="border-t border-border bg-secondary/30">
        <div className="container py-20">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-md bg-accent/10">
                <TrendingUp className="h-5 w-5 text-accent" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Skill Lifecycle Tracking</h3>
              <p className="text-muted-foreground leading-relaxed">
                Monitor skills across five lifecycle stages: emerging, growing, mature, stable, and declining.
                Understand where each skill is in its trajectory.
              </p>
            </div>

            <div className="space-y-4">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-md bg-accent/10">
                <GitBranch className="h-5 w-5 text-accent" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Career Path Modeling</h3>
              <p className="text-muted-foreground leading-relaxed">
                Visualize branching career outcomes based on skill acquisition.
                See probability-weighted pathways with timeline estimates.
              </p>
            </div>

            <div className="space-y-4">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-md bg-accent/10">
                <FileSearch className="h-5 w-5 text-accent" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Explainable Recommendations</h3>
              <p className="text-muted-foreground leading-relaxed">
                Every recommendation backed by metrics: growth rate, market diffusion,
                risk assessment. No black-box suggestions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Data Sources */}
      <section className="border-t border-border">
        <div className="container py-16">
          <p className="text-sm text-muted-foreground text-center mb-8">
            Built on verified labor market intelligence
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 text-muted-foreground">
            <span className="text-sm font-medium">LinkedIn Talent Insights</span>
            <span className="text-border">•</span>
            <span className="text-sm font-medium">Burning Glass</span>
            <span className="text-border">•</span>
            <span className="text-sm font-medium">Stack Overflow Survey</span>
            <span className="text-border">•</span>
            <span className="text-sm font-medium">GitHub Octoverse</span>
            <span className="text-border">•</span>
            <span className="text-sm font-medium">Gartner</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm font-medium">SkillIntel</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Research-grade skill intelligence for career planning.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

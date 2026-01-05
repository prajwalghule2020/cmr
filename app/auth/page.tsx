"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TrendingUp, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function Auth() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login, signup, hasCompletedProfile } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (isLogin) {
                const result = await login(email, password);
                if (result.success) {
                    toast.success('Welcome back!');
                    router.push(hasCompletedProfile ? '/dashboard' : '/profile-setup');
                } else {
                    toast.error(result.error || 'Invalid credentials');
                }
            } else {
                const result = await signup(email, password, name);
                if (result.success) {
                    toast.success('Account created successfully!');
                    router.push('/profile-setup');
                } else {
                    toast.error(result.error || 'Failed to create account');
                }
            }
        } catch {
            toast.error('An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex">
            {/* Left Panel - Form */}
            <div className="flex-1 flex items-center justify-center p-8">
                <div className="w-full max-w-sm">
                    <div className="flex items-center gap-2 mb-8">
                        <TrendingUp className="h-5 w-5 text-accent" />
                        <span className="font-semibold text-lg text-foreground">SkillIntel</span>
                    </div>

                    <h1 className="text-2xl font-bold text-foreground mb-2">
                        {isLogin ? 'Sign in to your account' : 'Create your account'}
                    </h1>
                    <p className="text-muted-foreground mb-8">
                        {isLogin
                            ? 'Access your skill intelligence dashboard'
                            : 'Start tracking your skill trajectory today'
                        }
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {!isLogin && (
                            <div className="space-y-2">
                                <Label htmlFor="name">Full name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Alex Chen"
                                    required={!isLogin}
                                />
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="email">Email address</Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isLogin ? 'Sign in' : 'Create account'}
                        </Button>
                    </form>

                    <p className="mt-6 text-center text-sm text-muted-foreground">
                        {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
                        <button
                            type="button"
                            onClick={() => setIsLogin(!isLogin)}
                            className="font-medium text-foreground hover:underline"
                        >
                            {isLogin ? 'Sign up' : 'Sign in'}
                        </button>
                    </p>
                </div>
            </div>

            {/* Right Panel - Info */}
            <div className="hidden lg:flex flex-1 bg-primary p-12 items-center justify-center">
                <div className="max-w-md text-primary-foreground">
                    <blockquote className="text-2xl font-medium leading-relaxed mb-6">
                        "Understanding skill trajectories changed how I plan my career.
                        I'm now learning skills with verified growth patterns, not just trending topics."
                    </blockquote>
                    <div>
                        <p className="font-semibold">Sarah Mitchell</p>
                        <p className="text-primary-foreground/70">Software Engineer → ML Engineer</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { TrendingUp, ArrowRight, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { skillCategories } from '@/lib/mockData';

const experienceLevels = [
    { value: '0-1', label: '0-1 years' },
    { value: '1-3', label: '1-3 years' },
    { value: '3-5', label: '3-5 years' },
    { value: '5-10', label: '5-10 years' },
    { value: '10+', label: '10+ years' },
];

const commonSkills = [
    'JavaScript', 'TypeScript', 'Python', 'React', 'Node.js',
    'AWS', 'Docker', 'SQL', 'Git', 'Machine Learning',
    'Data Analysis', 'Product Management', 'UI/UX Design',
];

const careerGoals = [
    'Increase compensation',
    'Become a technical leader',
    'Transition to AI/ML',
    'Start a company',
    'Work remotely',
    'Join a FAANG company',
    'Become a consultant',
];

export default function ProfileSetup() {
    const { user, updateProfile, setHasCompletedProfile, supabaseUser } = useAuth();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const supabase = createClient();

    const [formData, setFormData] = useState({
        currentRole: user?.currentRole || '',
        experience: user?.experience || '',
        skills: user?.skills || [],
        interests: user?.interests || [],
        goals: user?.goals || [],
    });

    const toggleSkill = (skill: string) => {
        setFormData(prev => ({
            ...prev,
            skills: prev.skills.includes(skill)
                ? prev.skills.filter(s => s !== skill)
                : [...prev.skills, skill]
        }));
    };

    const toggleInterest = (interest: string) => {
        setFormData(prev => ({
            ...prev,
            interests: prev.interests.includes(interest)
                ? prev.interests.filter(i => i !== interest)
                : [...prev.interests, interest]
        }));
    };

    const toggleGoal = (goal: string) => {
        setFormData(prev => ({
            ...prev,
            goals: prev.goals.includes(goal)
                ? prev.goals.filter(g => g !== goal)
                : [...prev.goals, goal]
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!supabaseUser) {
            toast.error('You must be logged in to save your profile');
            return;
        }

        setIsLoading(true);

        try {
            // Save skills to userskills table if any skills are selected
            if (formData.skills.length > 0) {
                console.log('🔍 Saving skills for user:', supabaseUser.id);
                console.log('📝 Skills to save:', formData.skills);

                // Map the selected skills to the format expected by userskills table
                const skillsToInsert = formData.skills.map(skillName => ({
                    user_id: supabaseUser.id,
                    skill_name: skillName.trim(),
                    proficiency_level: 'intermediate', // Default proficiency
                    years_of_experience: parseExperienceToYears(formData.experience),
                    category: getCategoryForSkill(skillName),
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                }));

                console.log('💾 Inserting skills:', skillsToInsert);

                // First, delete existing skills for this user to avoid duplicates
                const { error: deleteError } = await supabase
                    .from('userskills')
                    .delete()
                    .eq('user_id', supabaseUser.id);

                if (deleteError) {
                    console.error('❌ Error deleting existing skills:', deleteError);
                }

                // Insert new skills
                const { data, error } = await supabase
                    .from('userskills')
                    .insert(skillsToInsert)
                    .select();

                if (error) {
                    console.error('❌ Error saving skills:', error);
                    throw new Error(`Failed to save skills: ${error.message}`);
                }

                console.log('✅ Skills saved successfully:', data);
            }

            // Update profile in AuthContext
            updateProfile(formData);
            setHasCompletedProfile(true);
            
            toast.success('Profile created successfully!');
            router.push('/dashboard');
        } catch (error: any) {
            console.error('❌ Error in handleSubmit:', error);
            toast.error(error.message || 'Failed to save profile. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // Helper function to convert experience range to approximate years
    const parseExperienceToYears = (experience: string): number => {
        const experienceMap: { [key: string]: number } = {
            '0-1': 0.5,
            '1-3': 2,
            '3-5': 4,
            '5-10': 7,
            '10+': 10
        };
        return experienceMap[experience] || 0;
    };

    // Helper function to determine category based on skill name
    const getCategoryForSkill = (skillName: string): string => {
        const skillName_lower = skillName.toLowerCase();
        
        // Programming skills
        if (['javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'ruby', 'php', 'go', 'rust'].some(s => skillName_lower.includes(s))) {
            return 'programming';
        }
        
        // Technical/DevOps skills
        if (['aws', 'azure', 'docker', 'kubernetes', 'git', 'ci/cd', 'linux'].some(s => skillName_lower.includes(s))) {
            return 'technical';
        }
        
        // Framework/Library skills
        if (['react', 'angular', 'vue', 'node.js', 'django', 'flask', 'spring'].some(s => skillName_lower.includes(s))) {
            return 'programming';
        }
        
        // Database skills
        if (['sql', 'mongodb', 'postgresql', 'mysql', 'redis', 'database'].some(s => skillName_lower.includes(s))) {
            return 'technical';
        }
        
        // Design skills
        if (['ui/ux', 'design', 'figma', 'photoshop', 'illustrator'].some(s => skillName_lower.includes(s))) {
            return 'design';
        }
        
        // Management skills
        if (['product management', 'project management', 'agile', 'scrum'].some(s => skillName_lower.includes(s))) {
            return 'management';
        }
        
        // Data/ML skills
        if (['machine learning', 'data analysis', 'data science', 'ai', 'tensorflow', 'pytorch'].some(s => skillName_lower.includes(s))) {
            return 'analytical';
        }
        
        // Default to 'other'
        return 'other';
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b border-border">
                <div className="container flex h-16 items-center">
                    <div className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-accent" />
                        <span className="font-semibold text-lg text-foreground">SkillIntel</span>
                    </div>
                </div>
            </header>

            <div className="container py-12">
                <div className="max-w-2xl mx-auto">
                    <div className="mb-8">
                        <p className="text-sm font-medium text-accent mb-2">Step 1 of 1</p>
                        <h1 className="text-2xl font-bold text-foreground mb-2">Set up your profile</h1>
                        <p className="text-muted-foreground">
                            Help us understand your background so we can provide personalized skill recommendations.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Current Role & Experience */}
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="role">Current Role</Label>
                                <Input
                                    id="role"
                                    value={formData.currentRole}
                                    onChange={(e) => setFormData(prev => ({ ...prev, currentRole: e.target.value }))}
                                    placeholder="e.g., Frontend Developer"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="experience">Years of Experience</Label>
                                <Select
                                    value={formData.experience}
                                    onValueChange={(value) => setFormData(prev => ({ ...prev, experience: value }))}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select experience" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {experienceLevels.map((level) => (
                                            <SelectItem key={level.value} value={level.value}>
                                                {level.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Current Skills */}
                        <div className="space-y-3">
                            <Label>Current Skills</Label>
                            <p className="text-sm text-muted-foreground">Select all that apply</p>
                            <div className="flex flex-wrap gap-2">
                                {commonSkills.map((skill) => (
                                    <button
                                        key={skill}
                                        type="button"
                                        onClick={() => toggleSkill(skill)}
                                        className={`px-3 py-1.5 text-sm rounded-md border transition-colors ${formData.skills.includes(skill)
                                                ? 'bg-primary text-primary-foreground border-primary'
                                                : 'bg-background text-foreground border-border hover:bg-secondary'
                                            }`}
                                    >
                                        {skill}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Areas of Interest */}
                        <div className="space-y-3">
                            <Label>Areas of Interest</Label>
                            <p className="text-sm text-muted-foreground">What domains interest you?</p>
                            <div className="flex flex-wrap gap-2">
                                {skillCategories.map((category) => (
                                    <button
                                        key={category}
                                        type="button"
                                        onClick={() => toggleInterest(category)}
                                        className={`px-3 py-1.5 text-sm rounded-md border transition-colors ${formData.interests.includes(category)
                                                ? 'bg-accent text-accent-foreground border-accent'
                                                : 'bg-background text-foreground border-border hover:bg-secondary'
                                            }`}
                                    >
                                        {category}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Career Goals */}
                        <div className="space-y-3">
                            <Label>Career Goals</Label>
                            <p className="text-sm text-muted-foreground">What are you working towards?</p>
                            <div className="space-y-2">
                                {careerGoals.map((goal) => (
                                    <div key={goal} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={goal}
                                            checked={formData.goals.includes(goal)}
                                            onCheckedChange={() => toggleGoal(goal)}
                                        />
                                        <label
                                            htmlFor={goal}
                                            className="text-sm text-foreground cursor-pointer"
                                        >
                                            {goal}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <Button type="submit" size="lg" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Continue to Dashboard
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}

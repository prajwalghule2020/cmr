"use client";

import UserSkills from '@/components/UserSkills';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function SkillsPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    router.push('/auth');
    return null;
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Manage Your Skills</h1>
          <p className="text-muted-foreground">
            Add and update your professional skills for personalized career pathway recommendations
          </p>
        </div>
        
        <UserSkills 
          onSubmitSuccess={() => {
            // You can redirect after successful save
            // router.push('/dashboard');
          }}
        />
      </div>
    </div>
  );
}

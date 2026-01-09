"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import UserSkills from '@/components/UserSkills';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { AlertCircle, CheckCircle, XCircle } from 'lucide-react';

export default function TestSkillsPage() {
  const { supabaseUser, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [diagnostics, setDiagnostics] = useState({
    authLoaded: false,
    isAuthenticated: false,
    hasUserId: false,
    userEmail: '',
  });

  useEffect(() => {
    if (!isLoading) {
      setDiagnostics({
        authLoaded: true,
        isAuthenticated: isAuthenticated,
        hasUserId: !!supabaseUser?.id,
        userEmail: supabaseUser?.email || 'Not logged in',
      });
    }
  }, [isLoading, isAuthenticated, supabaseUser]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Skills Form Test Page</h1>
          <p className="text-muted-foreground">
            Test your skills form and verify database connectivity
          </p>
        </div>

        {/* Diagnostics Card */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🔍 System Diagnostics
            </CardTitle>
            <CardDescription>
              Current authentication and system status
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <DiagnosticItem 
              label="Authentication System" 
              status={diagnostics.authLoaded} 
              detail="Auth context loaded"
            />
            <DiagnosticItem 
              label="User Authenticated" 
              status={diagnostics.isAuthenticated} 
              detail={diagnostics.isAuthenticated ? 'User is logged in' : 'No user session found'}
            />
            <DiagnosticItem 
              label="User ID Available" 
              status={diagnostics.hasUserId} 
              detail={diagnostics.hasUserId ? `ID: ${supabaseUser?.id.substring(0, 20)}...` : 'Not available'}
            />
            <div className="pt-2 border-t">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Email:</span>
                <span className="text-sm text-muted-foreground">{diagnostics.userEmail}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Instructions Card */}
        {!isAuthenticated && (
          <Card className="border-yellow-500 bg-yellow-50 dark:bg-yellow-950">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-900 dark:text-yellow-100">
                <AlertCircle className="h-5 w-5" />
                Authentication Required
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                You must be logged in to save skills to the database. The Row Level Security (RLS) 
                policies require an authenticated user session.
              </p>
              <div className="space-y-2">
                <p className="text-sm font-medium text-yellow-900 dark:text-yellow-100">Next Steps:</p>
                <ol className="list-decimal list-inside space-y-1 text-sm text-yellow-800 dark:text-yellow-200">
                  <li>Click the button below to go to the login page</li>
                  <li>Sign up for a new account or login with existing credentials</li>
                  <li>Return to this page to test the skills form</li>
                </ol>
              </div>
              <Button 
                onClick={() => router.push('/auth')}
                className="w-full"
                variant="default"
              >
                Go to Login Page
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Success Card */}
        {isAuthenticated && (
          <Card className="border-green-500 bg-green-50 dark:bg-green-950">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-900 dark:text-green-100">
                <CheckCircle className="h-5 w-5" />
                Ready to Test!
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-green-800 dark:text-green-200">
                You're authenticated and ready to save skills. Fill out the form below and check 
                your browser console (F12) for detailed logs.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Skills Form */}
        <UserSkills 
          onSubmitSuccess={() => {
            console.log('✅ Skills saved successfully! Check Supabase Table Editor.');
          }}
        />

        {/* Debug Info */}
        <Card className="bg-muted">
          <CardHeader>
            <CardTitle className="text-sm">🐛 Debug Information</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-xs overflow-auto">
              {JSON.stringify({
                isLoading,
                isAuthenticated,
                userId: supabaseUser?.id || null,
                userEmail: supabaseUser?.email || null,
                timestamp: new Date().toISOString(),
              }, null, 2)}
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function DiagnosticItem({ label, status, detail }: { label: string; status: boolean; detail: string }) {
  return (
    <div className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
      <div className="flex items-center gap-3">
        {status ? (
          <CheckCircle className="h-5 w-5 text-green-600" />
        ) : (
          <XCircle className="h-5 w-5 text-red-600" />
        )}
        <div>
          <p className="text-sm font-medium">{label}</p>
          <p className="text-xs text-muted-foreground">{detail}</p>
        </div>
      </div>
      <span className={`text-xs px-2 py-1 rounded ${status ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'}`}>
        {status ? 'OK' : 'FAILED'}
      </span>
    </div>
  );
}

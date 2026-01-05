import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="text-center">
                <h1 className="text-6xl font-bold text-foreground mb-4">404</h1>
                <p className="text-xl text-muted-foreground mb-8">Page not found</p>
                <Link href="/">
                    <Button>
                        <Home className="mr-2 h-4 w-4" />
                        Back to Home
                    </Button>
                </Link>
            </div>
        </div>
    );
}

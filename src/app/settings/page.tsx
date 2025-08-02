
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { users } from '@/lib/data';
import type { User } from '@/lib/types';
import { SettingsTabs } from '@/components/settings/settings-tabs';

export default function SettingsPage() {
  const currentUser = users.find(u => u.id === 'user-1') as User;

  if (!currentUser) {
    // Or a proper loading/error state
    return null;
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
       <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <Link href="/">
              <Button size="icon" variant="outline" className="h-8 w-8">
                  <ArrowLeft className="h-4 w-4" />
                  <span className="sr-only">Back</span>
              </Button>
          </Link>
          <h1 className="text-xl font-headline font-bold text-primary">Settings</h1>
        </header>
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <SettingsTabs currentUser={currentUser} />
        </main>
      </div>
    </div>
  );
}

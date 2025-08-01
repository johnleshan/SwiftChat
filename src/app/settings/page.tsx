
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Palette, User, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserAvatar } from '@/components/chat/user-avatar';
import { useToast } from '@/hooks/use-toast';
import { users } from '@/lib/data';
import { Switch } from '@/components/ui/switch';

export default function SettingsPage() {
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState(users.find(u => u.id === 'user-1'));
  const [name, setName] = useState(currentUser?.name || '');

  if (!currentUser) {
    return null;
  }

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentUser(prev => prev ? { ...prev, name } : prev);
    // In a real app, you would also update the user in your backend
    // and maybe update the users array in the data.ts for demo purposes
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    if(userIndex !== -1) {
      users[userIndex].name = name;
    }
    toast({
      title: 'Success',
      description: 'Your profile has been updated.',
    });
  };

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
          <Tabs defaultValue="profile">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="profile">
                <User className="mr-2 h-4 w-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="appearance">
                <Palette className="mr-2 h-4 w-4" />
                Appearance
              </TabsTrigger>
            </TabsList>
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Profile</CardTitle>
                  <CardDescription>
                    Update your personal information here.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleProfileSave} className="space-y-6">
                    <div className="space-y-2">
                      <Label>Avatar</Label>
                      <div className="flex items-center gap-4">
                        <UserAvatar user={currentUser} className="h-20 w-20" />
                        <Button variant="outline"><Camera />Change Avatar</Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" value={currentUser.email} disabled />
                    </div>
                    <Button type="submit">Save Changes</Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="appearance">
              <Card>
                <CardHeader>
                  <CardTitle>Appearance</CardTitle>
                  <CardDescription>
                    Customize the look and feel of the application.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label>Theme</Label>
                        <p className="text-sm text-muted-foreground">Select a theme for the application.</p>
                        {/* In a real app, this would be implemented with a ThemeProvider */}
                        <div className="flex items-center space-x-2 rounded-lg border p-4">
                            <div className="flex-1 space-y-1">
                                <p className="text-sm font-medium leading-none">
                                    Dark Mode
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Enable dark theme across the app.
                                </p>
                            </div>
                            <Switch id="dark-mode" />
                        </div>
                    </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}

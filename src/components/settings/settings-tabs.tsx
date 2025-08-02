
'use client';

import { Palette, User as UserIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProfileTabContent } from '@/components/settings/profile-tab-content';
import { AppearanceTabContent } from '@/components/settings/appearance-tab-content';
import type { User } from '@/lib/types';

interface SettingsTabsProps {
    currentUser: User;
}

export function SettingsTabs({ currentUser }: SettingsTabsProps) {
    return (
        <Tabs defaultValue="profile">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="profile">
                <UserIcon className="mr-2 h-4 w-4" />
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
                  <ProfileTabContent user={currentUser} />
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
                  <AppearanceTabContent />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
    );
}

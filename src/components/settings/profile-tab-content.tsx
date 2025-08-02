
'use client';

import { useState } from 'react';
import type { User } from '@/lib/types';
import { users } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserAvatar } from '@/components/chat/user-avatar';
import { useToast } from '@/hooks/use-toast';
import { Camera } from 'lucide-react';

interface ProfileTabContentProps {
    user: User;
}

export function ProfileTabContent({ user }: ProfileTabContentProps) {
    const { toast } = useToast();
    const [currentUser, setCurrentUser] = useState(user);
    const [name, setName] = useState(user.name || '');

    const handleProfileSave = (e: React.FormEvent) => {
        e.preventDefault();
        setCurrentUser(prev => ({ ...prev, name }));
        
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
        <form onSubmit={handleProfileSave} className="space-y-6">
            <div className="space-y-2">
                <Label>Avatar</Label>
                <div className="flex items-center gap-4">
                <UserAvatar user={currentUser} className="h-20 w-20" />
                <Button type="button" variant="outline"><Camera className="mr-2 h-4 w-4" />Change Avatar</Button>
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={currentUser.email || ''} disabled />
            </div>
            <Button type="submit">Save Changes</Button>
        </form>
    );
}


'use client';

import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

export function AppearanceTabContent() {
    return (
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
    );
}

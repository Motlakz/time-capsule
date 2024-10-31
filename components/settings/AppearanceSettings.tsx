import React, { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { useToast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Contrast, Move, Palette } from 'lucide-react';

const AppearanceSettings = () => {
    const { theme, setTheme } = useTheme();
    const { toast } = useToast();
    const [highContrast, setHighContrast] = useState(false);
    const [reducedMotion, setReducedMotion] = useState(false);

    useEffect(() => {
        // Load settings from local storage
        const savedHighContrast = localStorage.getItem('highContrast') === 'true';
        const savedReducedMotion = localStorage.getItem('reducedMotion') === 'true';
        const savedTheme = localStorage.getItem('theme') || 'system';

        setHighContrast(savedHighContrast);
        setReducedMotion(savedReducedMotion);
        setTheme(savedTheme); 

        // Apply settings to the document
        if (savedHighContrast) document.documentElement.classList.add('high-contrast');
        if (savedReducedMotion) document.documentElement.classList.add('reduced-motion');
    }, [setTheme]);

    const handleHighContrastChange = (checked: boolean) => {
        setHighContrast(checked);
        localStorage.setItem('highContrast', checked.toString());
        if (checked) {
            document.documentElement.classList.add('high-contrast');
        } else {
            document.documentElement.classList.remove('high-contrast');
        }
    };

    const handleReducedMotionChange = (checked: boolean) => {
        setReducedMotion(checked);
        localStorage.setItem('reducedMotion', checked.toString());
        if (checked) {
            document.documentElement.classList.add('reduced-motion');
        } else {
            document.documentElement.classList.remove('reduced-motion');
        }
    };

    const handleThemeChange = (newTheme: string) => {
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        toast({
            title: "Settings saved",
            description: "Your appearance settings have been updated.",
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 p-4 bg-white dark:bg-slate-900 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold">Appearance Settings</h2>
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <Contrast className="h-5 w-5 mr-2 text-gray-600" />
                    <span>High Contrast</span>
                </div>
                <Switch
                    checked={highContrast}
                    onCheckedChange={handleHighContrastChange}
                />
            </div>
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <Move className="h-5 w-5 mr-2 text-gray-600" />
                    <span>Reduced Motion</span>
                </div>
                <Switch
                    checked={reducedMotion}
                    onCheckedChange={handleReducedMotionChange}
                />
            </div>
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <Palette className="h-5 w-5 mr-2 text-gray-600" />
                    <span>Theme</span>
                </div>
                <select 
                    value={theme} 
                    onChange={(e) => handleThemeChange(e.target.value)} 
                    className="border rounded p-1"
                >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="system">System</option>
                </select>
            </div>
            <Button type="submit" className="w-full bg-gray-600 text-white hover:bg-gray-700 transition duration-200">Save Changes</Button>
        </form>
    );
};

export default AppearanceSettings;

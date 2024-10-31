import React, { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { ShieldCheck } from 'lucide-react';

const SecuritySettings = () => {
    const { toast } = useToast();
    const [is2FAEnabled, setIs2FAEnabled] = useState(false);

    useEffect(() => {
        const saved2FASetting = localStorage.getItem('is2FAEnabled') === 'true';
        setIs2FAEnabled(saved2FASetting);
    }, []);

    const handle2FAChange = (checked: boolean) => {
        setIs2FAEnabled(checked);
        localStorage.setItem('is2FAEnabled', checked.toString());
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        toast({
            title: "Settings saved",
            description: "Your security settings have been updated.",
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 p-4 bg-white dark:bg-slate-900 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold">Security Settings</h2>
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <ShieldCheck className="h-5 w-5 mr-2 text-gray-600" />
                    <span>Enable Two-Factor Authentication</span>
                </div>
                <Switch
                    checked={is2FAEnabled}
                    onCheckedChange={handle2FAChange}
                />
            </div>
            <Button type="submit" className="w-full bg-gray-600 text-white hover:bg-gray-700 transition duration-200">Save Changes</Button>
        </form>
    );
};

export default SecuritySettings;

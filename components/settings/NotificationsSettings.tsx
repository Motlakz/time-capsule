import React, { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Mail, Bell, MessageSquare } from 'lucide-react';

const NotificationSettings = () => {
    const { toast } = useToast();
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [pushNotifications, setPushNotifications] = useState(true);
    const [smsNotifications, setSmsNotifications] = useState(false);

    useEffect(() => {
        const savedEmailNotifications = localStorage.getItem('emailNotifications') === 'true';
        const savedPushNotifications = localStorage.getItem('pushNotifications') === 'true';
        const savedSmsNotifications = localStorage.getItem('smsNotifications') === 'true';

        setEmailNotifications(savedEmailNotifications);
        setPushNotifications(savedPushNotifications);
        setSmsNotifications(savedSmsNotifications);
    }, []);

    const handleEmailChange = (checked: boolean) => {
        setEmailNotifications(checked);
        localStorage.setItem('emailNotifications', checked.toString());
    };

    const handlePushChange = (checked: boolean) => {
        setPushNotifications(checked);
        localStorage.setItem('pushNotifications', checked.toString());
    };

    const handleSmsChange = (checked: boolean) => {
        setSmsNotifications(checked);
        localStorage.setItem('smsNotifications', checked.toString());
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        toast({
            title: "Settings updated",
            description: "Your notification preferences have been saved.",
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-white dark:bg-slate-900 rounded-lg shadow-md">
            <h2 className="text-xl font-bold">Notification Settings</h2>
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <Mail className="h-5 w-5 mr-2 text-gray-600" />
                    <span>Email Notifications</span>
                </div>
                <Switch
                    checked={emailNotifications}
                    onCheckedChange={handleEmailChange}
                />
            </div>
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <Bell className="h-5 w-5 mr-2 text-gray-600" />
                    <span>Push Notifications</span>
                </div>
                <Switch
                    checked={pushNotifications}
                    onCheckedChange={handlePushChange}
                />
            </div>
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <MessageSquare className="h-5 w-5 mr-2 text-gray-600" />
                    <span>SMS Notifications</span>
                </div>
                <Switch
                    checked={smsNotifications}
                    onCheckedChange={handleSmsChange}
                />
            </div>
            <Button type="submit" className="w-full bg-gray-600 text-white hover:bg-gray-700 transition duration-200">Save Changes</Button>
        </form>
    );
};

export default NotificationSettings;

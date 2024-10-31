"use client";

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import SecuritySettings from './SecuritySettings';
import NotificationSettings from './NotificationsSettings';
import AppearanceSettings from './AppearanceSettings';
import { motion } from 'framer-motion';

const SettingsPage = () => {
    const [activeTab, setActiveTab] = useState("appearance");

    const getTabClass = (tabValue: string) => {
        return `relative overflow-hidden transition-colors duration-300 ease-in-out ${
            activeTab === tabValue ? 'text-gray-700 dark:text-white' : 'dark:text-gray-100 text-gray-800'
        }`;
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="p-4 min-h-screen"
        >
            <h1 className="text-3xl font-bold mb-6 dark:text-gray-100 text-gray-700">Settings</h1>
            <Tabs defaultValue="appearance" className="w-full dark:bg-slate-950 p-4 rounded-lg bg-gray-50" onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3 dark:bg-slate-400 bg-gray-200">
                    <TabsTrigger className={getTabClass("security")} value="security">
                        Security
                        {activeTab === "security" && (
                            <motion.div
                                className="absolute inset-0 bg-white/20 dark:bg-slate-900/20 z-0"
                                layoutId="activeTab"
                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            />
                        )}
                    </TabsTrigger>
                    <TabsTrigger className={getTabClass("notifications")} value="notifications">
                        Notifications
                        {activeTab === "notifications" && (
                            <motion.div
                                className="absolute inset-0 bg-white/20 dark:bg-slate-900/20 z-0"
                                layoutId="activeTab"
                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            />
                        )}
                    </TabsTrigger>
                    <TabsTrigger className={getTabClass("appearance")} value="appearance">
                        Appearance
                        {activeTab === "appearance" && (
                            <motion.div
                                className="absolute inset-0 bg-white/20 dark:bg-slate-900/20 z-0"
                                layoutId="activeTab"
                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            />
                        )}
                    </TabsTrigger>
                </TabsList>
                <div className="flex flex-col" style={{ minHeight: '300px' }}>
                    <TabsContent value="security" className="flex-grow">
                        <Card className="dark:bg-slate-800 bg-gray-200 border-slate-300">
                            <CardHeader>
                                <CardTitle className="dark:text-gray-100 text-gray-700">Security Settings</CardTitle>
                                <CardDescription className="text-gray-600 dark:text-gray-400">Manage your account security and privacy settings.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <SecuritySettings />
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="notifications" className="flex-grow">
                        <Card className="dark:bg-slate-800 bg-gray-200 border-slate-300">
                            <CardHeader>
                                <CardTitle className="dark:text-gray-100 text-gray-700">Notification Preferences</CardTitle>
                                <CardDescription className="text-gray-600 dark:text-gray-400">Customize your notification settings.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <NotificationSettings />
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="appearance" className="flex-grow">
                        <Card className="dark:bg-slate-800 bg-gray-200 border-slate-300">
                            <CardHeader>
                                <CardTitle className="dark:text-gray-100 text-gray-700">Appearance Settings</CardTitle>
                                <CardDescription className="text-gray-600 dark:text-gray-400">Customize the look and feel of your dashboard.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <AppearanceSettings />
                            </CardContent>
                        </Card>
                    </TabsContent>
                </div>
            </Tabs>
        </motion.div>
    );
};

export default SettingsPage;

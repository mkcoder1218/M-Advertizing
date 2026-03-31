import React from 'react';
import { Card, Button, Input } from './UI';
import { 
  Settings as SettingsIcon, 
  Bell, 
  Lock, 
  User, 
  Globe,
  Database
} from 'lucide-react';

export const Settings = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Settings</h1>
        <p className="text-slate-500">Manage your account and application preferences.</p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-4">
          <button className="flex w-full items-center space-x-3 rounded-xl bg-blue-50 p-4 text-blue-600 dark:bg-blue-900/20">
            <User size={20} />
            <span className="font-bold">Profile</span>
          </button>
          <button className="flex w-full items-center space-x-3 rounded-xl p-4 text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800">
            <Bell size={20} />
            <span className="font-medium">Notifications</span>
          </button>
          <button className="flex w-full items-center space-x-3 rounded-xl p-4 text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800">
            <Lock size={20} />
            <span className="font-medium">Security</span>
          </button>
          <button className="flex w-full items-center space-x-3 rounded-xl p-4 text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800">
            <Globe size={20} />
            <span className="font-medium">Localization</span>
          </button>
          <button className="flex w-full items-center space-x-3 rounded-xl p-4 text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800">
            <Database size={20} />
            <span className="font-medium">Data & Privacy</span>
          </button>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card>
            <h3 className="text-lg font-bold mb-6">Profile Information</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">First Name</label>
                  <Input defaultValue="Alexander" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Last Name</label>
                  <Input defaultValue="Forge" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email Address</label>
                <Input defaultValue="alex@forgeflow.com" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Bio</label>
                <textarea className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm dark:border-slate-800 dark:bg-slate-950" rows={4} defaultValue="Founder and CEO of ForgeFlow Industries. Passionate about modern manufacturing and efficient workflows." />
              </div>
              <div className="pt-4">
                <Button>Save Changes</Button>
              </div>
            </div>
          </Card>

          <Card className="border-red-100 dark:border-red-900/30">
            <h3 className="text-lg font-bold text-red-600 mb-2">Danger Zone</h3>
            <p className="text-sm text-slate-500 mb-4">Permanently delete your account and all associated data.</p>
            <Button variant="danger">Delete Account</Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

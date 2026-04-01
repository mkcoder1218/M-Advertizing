import React, { useState } from 'react';
import { Card, Button, Input } from './UI';
import { User } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useUpdateUser, useUploadProfileImage } from '../lib/api/hooks/useUserProfile';

export const Settings = () => {
  const { user } = useApp();
  const [fullName, setFullName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [file, setFile] = useState<File | null>(null);
  const updateMutation = useUpdateUser();
  const uploadMutation = useUploadProfileImage();

  const handleSave = async () => {
    if (!user) return;
    await updateMutation.mutateAsync({ id: user.id, payload: { fullName, email } });
    if (file) await uploadMutation.mutateAsync({ id: user.id, file });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Settings</h1>
        <p className="text-slate-500">Manage your account and application preferences.</p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-2">
          <div className="flex w-full items-center space-x-3 rounded-xl bg-blue-50 p-4 text-blue-600 dark:bg-blue-900/20">
            <User size={20} />
            <span className="font-bold">Profile</span>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card>
            <h3 className="text-lg font-bold mb-6">Profile Information</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Full Name</label>
                <Input value={fullName} onChange={(e) => setFullName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email Address</label>
                <Input value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Profile Image</label>
                <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
              </div>
              <div className="pt-4">
                <Button onClick={handleSave} isLoading={updateMutation.isPending || uploadMutation.isPending}>Save Changes</Button>
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

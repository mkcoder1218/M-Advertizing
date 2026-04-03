import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { Card, Button, Input } from './UI';
import { useApp } from '../context/AppContext';
import { useLogin } from '../lib/api/hooks/useLogin';
import { UserRole } from '../types';

export const Auth = () => {
  const { login } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const loginMutation = useLogin();

  const mapRole = (roles: string[] | undefined): UserRole => {
    const first = roles?.[0];
    if (!first) return 'PRODUCTION_TEAM';
    return first as UserRole;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const data = await loginMutation.mutateAsync({ email, password });
      const backendRoles = data?.user?.roles || data?.user?.Roles?.map((r: any) => r.name);
      const role = mapRole(backendRoles);
      login(
        {
          id: data.user.id,
          name: data.user.fullName || data.user.email.split('@')[0],
          email: data.user.email,
          role,
          workTypeId: data.user.workTypeId || data.user.WorkType?.id || null,
        },
        data.token,
        data.refreshToken
      );
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 transition-colors duration-300">
      <div className="w-full max-w-md space-y-8">
        {/* Logo & Header */}
        <div className="text-center space-y-2">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-red-600 text-white shadow-xl shadow-red-500/20 mb-4"
          >
            <img src="/Artboard 1.png" alt="M-adverizin" className="h-10 w-10 object-contain" />
          </motion.div>
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-3xl font-black tracking-tight text-slate-900 dark:text-white"
          >
            M-adverizing
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-slate-500 dark:text-slate-400"
          >
            Workshop Management System
          </motion.p>
        </div>

        {/* Login Card */}
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-8 shadow-2xl shadow-slate-200/50 dark:shadow-none border-slate-100 dark:border-slate-800">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <Input 
                      type="email" 
                      placeholder="name@company.com" 
                      className="pl-10 h-12"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between ml-1">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Password</label>
                    <button type="button" className="text-xs font-bold text-red-600 hover:underline">Forgot password?</button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <Input 
                      type="password" 
                      placeholder="••••••••" 
                      className="pl-10 h-12"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 text-base font-bold shadow-lg shadow-red-500/20"
                isLoading={isLoading}
              >
                Sign In <ArrowRight size={18} className="ml-2" />
              </Button>

              {error ? (
                <div className="rounded-lg bg-red-50 text-red-700 text-sm px-3 py-2 border border-red-200">
                  {error}
                </div>
              ) : null}
            </form>
          </Card>
        </motion.div>

        {/* Footer */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-sm text-slate-500 dark:text-slate-400"
        >
          Don't have an account? <button className="font-bold text-red-600 hover:underline">Contact your administrator</button>
        </motion.p>
      </div>
    </div>
  );
};

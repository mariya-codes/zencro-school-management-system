'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/auth-context';
import { UserRole } from '@/types/auth';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/toast';
import {
  SchoolIcon,
  ShieldIcon,
  EyeIcon,
  EyeOffIcon,
  MailIcon,
  SparklesIcon,
  GraduationCapIcon,
  UsersIcon,
  BuildingIcon,
} from '@/components/ui/icons';

export default function LoginPage() {
  const router = useRouter();
  const { signInWithPassword, isLoading, isSupabaseConnected } = useAuth();
  const { success, error: toastError } = useToast();

  const [email, setEmail] = useState('admin@delhipublicacademy.edu.in');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [loginMode, setLoginMode] = useState<'password' | 'otp'>('password');
  const [otpCode, setOtpCode] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!email) {
      setFormError('Please enter your school email address.');
      return;
    }

    if (loginMode === 'password' && !password) {
      setFormError('Please enter your password.');
      return;
    }

    if (loginMode === 'otp' && otpCode.length < 4) {
      setFormError('Please enter the 6-digit OTP code sent to your registered number.');
      return;
    }

    const res = await signInWithPassword(email, password);
    if (res.success) {
      success('Login Successful', 'Welcome back to ZenCro School Management System');
      router.push('/dashboard');
    } else {
      setFormError(res.error || 'Invalid credentials. Please verify your details.');
      toastError('Login Failed', res.error || 'Authentication error');
    }
  };

  const handleQuickRoleSelect = (roleEmail: string, roleName: string) => {
    setEmail(roleEmail);
    setPassword('password123');
    setFormError(null);
    success('Role Preset Selected', `Loaded demo credentials for ${roleName}`);
  };

  const quickRoles = [
    { role: 'School Admin', email: 'admin@delhipublicacademy.edu.in', badge: 'Full Admin' },
    { role: 'Principal', email: 'principal@delhipublicacademy.edu.in', badge: 'Academic Head' },
    { role: 'Teacher', email: 'teacher.ananya@delhipublicacademy.edu.in', badge: 'Faculty' },
    { role: 'Accountant', email: 'accountant@delhipublicacademy.edu.in', badge: 'Accounts' },
  ];

  return (
    <div className="flex min-h-screen w-full bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* Left decorative brand visual for larger screens */}
      <div className="relative hidden lg:flex lg:w-1/2 flex-col justify-between p-12 bg-gradient-to-br from-slate-900 via-indigo-950/80 to-slate-950 border-r border-slate-800/80 overflow-hidden">
        {/* Ambient background glows */}
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-indigo-600/15 blur-3xl pointer-events-none" />

        {/* Top brand */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-xl shadow-indigo-600/40 font-black">
            <SchoolIcon size={26} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold tracking-tight text-white">ZenCro</span>
              <span className="text-xs uppercase font-bold tracking-widest px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                India K-12
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">Smart School Management Platform</p>
          </div>
        </div>

        {/* Center feature highlights */}
        <div className="relative z-10 space-y-6 my-auto max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-300">
            <SparklesIcon size={14} className="text-indigo-400" />
            <span>Modern SaaS for Indian Schools & Institutions</span>
          </div>

          <h2 className="text-3xl xl:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Institutional excellence, streamlined from Nursery to Class 12.
          </h2>

          <p className="text-sm text-slate-400 leading-relaxed">
            Engineered specifically for Indian K-12 schools affiliated with CBSE, ICSE, and State Boards. Complete role-based control for Administrators, Principals, Faculty, and Accounts.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xs">
              <div className="flex items-center gap-2.5 text-indigo-400 font-bold text-sm mb-1">
                <BuildingIcon size={16} />
                <span>Multi-Wing Hierarchy</span>
              </div>
              <p className="text-xs text-slate-400">Pre-primary, Primary, Middle & Senior Secondary Streams.</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xs">
              <div className="flex items-center gap-2.5 text-emerald-400 font-bold text-sm mb-1">
                <GraduationCapIcon size={16} />
                <span>CBSE & Board Ready</span>
              </div>
              <p className="text-xs text-slate-400">U-DISE mapping, term exams, and section allocations.</p>
            </div>
          </div>
        </div>

        {/* Bottom footer quote */}
        <div className="relative z-10 pt-8 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
          <span>ZenCro Enterprise School Suite v1.0</span>
          <span>India Standard Edition</span>
        </div>
      </div>

      {/* Right Login Form Container */}
      <div className="flex flex-1 flex-col justify-center px-6 py-12 sm:px-12 lg:px-16 xl:px-24 bg-slate-950">
        <div className="mx-auto w-full max-w-md space-y-8">
          {/* Header */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex lg:hidden items-center gap-2 mb-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white">
                  <SchoolIcon size={20} />
                </div>
                <span className="text-lg font-bold text-white">ZenCro</span>
              </div>
              
              <div className="ml-auto">
                <Badge variant={isSupabaseConnected ? 'success' : 'purple'} size="sm" dot>
                  {isSupabaseConnected ? 'Supabase Auth Ready' : 'Frontend Auth Mode'}
                </Badge>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Sign in to your portal
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Access administrative controls, academic management, and faculty records.
            </p>
          </div>

          {/* Quick Demo Role Selector */}
          <div className="space-y-2.5 p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>Quick Role Demo Credentials</span>
              <span className="text-indigo-400">Click to autofill</span>
            </p>
            <div className="grid grid-cols-2 gap-2">
              {quickRoles.map((qr) => (
                <button
                  key={qr.role}
                  type="button"
                  onClick={() => handleQuickRoleSelect(qr.email, qr.role)}
                  className={`flex flex-col items-start p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    email === qr.email
                      ? 'bg-indigo-600/20 border-indigo-500 text-white'
                      : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/50'
                  }`}
                >
                  <span className="text-xs font-bold">{qr.role}</span>
                  <span className="text-[10px] text-slate-400">{qr.badge}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Login Tab Switcher */}
            <div className="flex p-1 bg-slate-900 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setLoginMode('password');
                  setFormError(null);
                }}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                  loginMode === 'password'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Institutional Email & Password
              </button>
              <button
                type="button"
                onClick={() => {
                  setLoginMode('otp');
                  setFormError(null);
                }}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                  loginMode === 'otp'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Mobile OTP Login
              </button>
            </div>

            {formError && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium flex items-center gap-2">
                <ShieldIcon size={16} className="shrink-0 text-rose-400" />
                <span>{formError}</span>
              </div>
            )}

            <div className="space-y-4">
              <Input
                label="Institutional Email / Username"
                type="email"
                placeholder="name@school.edu.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftIcon={<MailIcon size={16} />}
                required
              />

              {loginMode === 'password' ? (
                <div className="space-y-1">
                  <Input
                    label="Account Password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    leftIcon={<ShieldIcon size={16} />}
                    rightIcon={
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-slate-400 hover:text-slate-200 cursor-pointer"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
                      </button>
                    }
                    required
                  />
                  <div className="flex justify-end pt-1">
                    <button
                      type="button"
                      onClick={() => success('Password Reset', 'Password recovery link sent to registered email.')}
                      className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  </div>
                </div>
              ) : (
                <Input
                  label="Enter 6-digit OTP"
                  type="text"
                  maxLength={6}
                  placeholder="e.g. 492018"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  helperText="Demo OTP: Any 6 digits (e.g. 123456)"
                  required
                />
              )}
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full text-base font-bold shadow-lg shadow-indigo-600/30"
              isLoading={isLoading}
            >
              Sign In to Portal
            </Button>
          </form>

          {/* Compliance notice */}
          <div className="text-center pt-2">
            <p className="text-[11px] text-slate-400">
              Secured with institutional SSO & Role-Based Access Control.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

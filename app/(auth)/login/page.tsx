"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Package, ArrowRight, Globe } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { AuthCard } from "@/components/auth/auth-card";
import { toast } from "sonner";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.error("Please fill in all fields.");
      return;
    }
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setIsLoading(false);
    toast.success("Welcome back! Redirecting…");
  };

  const handleGoogle = () => {
    toast.info("Google sign-in coming soon.");
  };

  return (
    <AuthCard className="w-full max-w-[420px]">
      <div className="relative z-10 p-8 flex flex-col gap-6">

        {/* Brand */}
        <div className="auth-brand">
          <div className="auth-brand-icon">
            <Package size={22} color="#fff" strokeWidth={2.2} />
          </div>
          <span className="auth-brand-name">
            Logi<span>Track</span>
          </span>
        </div>

        {/* Heading */}
        <div>
          <h1 className="auth-heading">Welcome back</h1>
          <p className="auth-subheading">Sign in to your logistics dashboard</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>

          {/* Email */}
          <div className="auth-field flex flex-col gap-1.5">
            <label htmlFor="login-email" className="auth-label">
              Email address
            </label>
            <Input
              id="login-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@company.com"
              value={form.email}
              onChange={handleChange}
              className="auth-input"
            />
          </div>

          {/* Password */}
          <div className="auth-field flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="login-password" className="auth-label" style={{ marginBottom: 0 }}>
                Password
              </label>
              <Link href="/forget-password" className="auth-footer-link" style={{ fontSize: "0.8125rem" }}>
                Forgot password?
              </Link>
            </div>
            <div className="auth-input-wrapper">
              <Input
                id="login-password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="••••••••••"
                value={form.password}
                onChange={handleChange}
                className="auth-input"
              />
              <button
                type="button"
                className="auth-input-eye"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((v) => !v)}
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </div>

          {/* Remember me */}
          <div className="auth-field auth-checkbox-wrap">
            <Checkbox
              id="login-remember"
              checked={rememberMe}
              onCheckedChange={(v) => setRememberMe(Boolean(v))}
              className="border-white/20 data-checked:bg-[#007AFF] data-checked:border-[#007AFF] data-checked:text-white"
            />
            <label htmlFor="login-remember" className="auth-checkbox-label cursor-pointer">
              Remember me for 30 days
            </label>
          </div>

          {/* Submit */}
          <div className="auth-field">
            <Button
              id="login-submit"
              type="submit"
              disabled={isLoading}
              className="auth-btn-primary"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in…
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Sign in
                  <ArrowRight size={16} />
                </span>
              )}
            </Button>
          </div>
        </form>

        {/* Divider */}
        <div className="auth-divider">
          <div className="auth-divider-line" />
          <span className="auth-divider-text">or continue with</span>
          <div className="auth-divider-line" />
        </div>

        {/* Social */}
        <Button
          id="login-google"
          type="button"
          onClick={handleGoogle}
          className="auth-btn-social"
        >
          <span className="flex items-center gap-2.5">
            <Globe size={18} />
            Continue with Google
          </span>
        </Button>

        {/* Footer */}
        <p className="text-center auth-subheading mt-0">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="auth-footer-link">
            Create account
          </Link>
        </p>
      </div>
    </AuthCard>
  );
}

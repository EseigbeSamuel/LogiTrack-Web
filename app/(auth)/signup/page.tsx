"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Package, ArrowRight, Globe } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { AuthCard } from "@/components/auth/auth-card";
import { toast } from "sonner";

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName || !form.email || !form.password || !form.confirmPassword) {
      toast.error("Please fill in all fields.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    if (!agreed) {
      toast.error("Please accept the Terms & Conditions.");
      return;
    }
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1600));
    setIsLoading(false);
    toast.success("Account created! Please check your email to verify.");
  };

  const handleGoogle = () => {
    toast.info("Google sign-up coming soon.");
  };

  return (
    <AuthCard className="w-full max-w-[440px]">
      <div className="relative z-10 p-8 flex flex-col gap-5">

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
          <h1 className="auth-heading">Create account</h1>
          <p className="auth-subheading">Start managing your logistics smarter</p>
        </div>

        {/* Social first */}
        <Button
          id="signup-google"
          type="button"
          onClick={handleGoogle}
          className="auth-btn-social"
        >
          <span className="flex items-center gap-2.5">
            <Globe size={18} />
            Sign up with Google
          </span>
        </Button>

        {/* Divider */}
        <div className="auth-divider">
          <div className="auth-divider-line" />
          <span className="auth-divider-text">or with email</span>
          <div className="auth-divider-line" />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>

          {/* Full Name */}
          <div className="auth-field flex flex-col gap-1.5">
            <label htmlFor="signup-name" className="auth-label">Full name</label>
            <Input
              id="signup-name"
              name="fullName"
              type="text"
              autoComplete="name"
              placeholder="Jane Smith"
              value={form.fullName}
              onChange={handleChange}
              className="auth-input"
            />
          </div>

          {/* Email */}
          <div className="auth-field flex flex-col gap-1.5">
            <label htmlFor="signup-email" className="auth-label">Email address</label>
            <Input
              id="signup-email"
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
            <label htmlFor="signup-password" className="auth-label">Password</label>
            <div className="auth-input-wrapper">
              <Input
                id="signup-password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Min. 8 characters"
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
            {/* Strength bar */}
            {form.password.length > 0 && (
              <div className="flex gap-1 mt-1">
                {[...Array(4)].map((_, i) => {
                  const strength = Math.min(Math.floor(form.password.length / 3), 4);
                  const colors = ["bg-red-500", "bg-orange-400", "bg-yellow-400", "bg-emerald-400"];
                  return (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                        i < strength ? colors[strength - 1] : "bg-white/10"
                      }`}
                    />
                  );
                })}
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="auth-field flex flex-col gap-1.5">
            <label htmlFor="signup-confirm" className="auth-label">Confirm password</label>
            <div className="auth-input-wrapper">
              <Input
                id="signup-confirm"
                name="confirmPassword"
                type={showConfirm ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Re-enter your password"
                value={form.confirmPassword}
                onChange={handleChange}
                className="auth-input"
              />
              <button
                type="button"
                className="auth-input-eye"
                aria-label={showConfirm ? "Hide password" : "Show password"}
                onClick={() => setShowConfirm((v) => !v)}
              >
                {showConfirm ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </div>

          {/* Terms */}
          <div className="auth-field auth-checkbox-wrap">
            <Checkbox
              id="signup-terms"
              checked={agreed}
              onCheckedChange={(v) => setAgreed(Boolean(v))}
              className="border-white/20 data-checked:bg-[#007AFF] data-checked:border-[#007AFF] data-checked:text-white"
            />
            <label htmlFor="signup-terms" className="auth-checkbox-label cursor-pointer">
              I agree to the{" "}
              <a href="#" className="auth-footer-link">Terms of Service</a>
              {" "}and{" "}
              <a href="#" className="auth-footer-link">Privacy Policy</a>
            </label>
          </div>

          {/* Submit */}
          <div className="auth-field">
            <Button
              id="signup-submit"
              type="submit"
              disabled={isLoading}
              className="auth-btn-primary"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account…
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Create account
                  <ArrowRight size={16} />
                </span>
              )}
            </Button>
          </div>
        </form>

        {/* Footer */}
        <p className="text-center auth-subheading mt-0">
          Already have an account?{" "}
          <Link href="/login" className="auth-footer-link">
            Sign in
          </Link>
        </p>
      </div>
    </AuthCard>
  );
}

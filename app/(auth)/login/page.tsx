"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Package, ArrowRight, Globe } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { AuthCard } from "@/components/auth/auth-card";
import { toast } from "sonner";
import { useAuthStore } from "@/store/auth-store";

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
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
    try {
      await login(form.email);
      toast.success("Welcome back! Redirecting...");
      router.push("/dashboard");
    } catch {
      toast.error("Authentication failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogle = () => {
    toast.info("Google sign-in coming soon.");
  };

  return (
    <AuthCard className="w-full max-w-[420px] select-none">
      <div className="relative z-10 p-8 flex flex-col gap-6">
        {/* Brand */}
        <div className="flex items-center gap-3 select-none">
          <div className="flex items-center justify-center w-9 h-9 bg-primary text-primary-foreground rounded-lg shadow-sm">
            <Package size={18} strokeWidth={2.5} />
          </div>
          <span className="text-lg font-bold text-foreground tracking-tight">
            Logi<span className="text-primary">Track</span>
          </span>
        </div>

        {/* Heading */}
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            Welcome back
          </h1>
          <p className="text-xs text-muted-foreground mt-1 font-medium">
            Sign in to your logistics dashboard
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4.5"
          noValidate
        >
          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="login-email"
              className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider"
            >
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
              className="h-10 text-xs rounded-xl"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="login-password"
                className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider"
              >
                Password
              </label>
              <Link
                href="/forget-password"
                className="text-[11px] font-semibold text-primary hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Input
                id="login-password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="••••••••••"
                value={form.password}
                onChange={handleChange}
                className="h-10 text-xs rounded-xl pr-10"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((v) => !v)}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Remember me */}
          <div className="flex items-center gap-2">
            <Checkbox
              id="login-remember"
              checked={rememberMe}
              onCheckedChange={(v) => setRememberMe(Boolean(v))}
              className="rounded-md border-muted-foreground/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
            />
            <label
              htmlFor="login-remember"
              className="text-xs text-muted-foreground font-semibold cursor-pointer"
            >
              Remember me for 30 days
            </label>
          </div>

          {/* Submit */}
          <Button
            id="login-submit"
            type="submit"
            disabled={isLoading}
            className="w-full h-10 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-primary/10"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="size-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                Signing in...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Sign in
                <ArrowRight size={15} />
              </span>
            )}
          </Button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 py-1">
          <div className="flex-1 h-px bg-border" />
          <span className="text-[10px] font-bold text-muted-foreground/70 uppercase tracking-widest">
            or continue with
          </span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Social */}
        <Button
          id="login-google"
          type="button"
          variant="outline"
          onClick={handleGoogle}
          className="w-full h-10 rounded-xl text-xs font-semibold flex items-center justify-center gap-2.5 cursor-pointer border-border hover:bg-accent/40"
        >
          <Globe size={16} className="text-muted-foreground" />
          Continue with Google
        </Button>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground font-medium mt-1">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="font-semibold text-primary hover:underline"
          >
            Create account
          </Link>
        </p>
      </div>
    </AuthCard>
  );
}

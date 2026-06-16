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

export default function SignupPage() {
  const router = useRouter();
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
    if (
      !form.fullName ||
      !form.email ||
      !form.password ||
      !form.confirmPassword
    ) {
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
    toast.success("Account created! Redirecting to login...");
    router.push("/login");
  };

  const handleGoogle = () => {
    toast.info("Google sign-up coming soon.");
  };

  return (
    <AuthCard className="w-full max-w-[440px] select-none">
      <div className="relative z-10 p-8 flex flex-col gap-5">
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
            Create account
          </h1>
          <p className="text-xs text-muted-foreground mt-1 font-medium">
            Start managing your logistics smarter
          </p>
        </div>

        {/* Social first */}
        <Button
          id="signup-google"
          type="button"
          variant="outline"
          onClick={handleGoogle}
          className="w-full h-10 rounded-xl text-xs font-semibold flex items-center justify-center gap-2.5 cursor-pointer border-border hover:bg-accent/40"
        >
          <Globe size={16} className="text-muted-foreground" />
          Sign up with Google
        </Button>

        {/* Divider */}
        <div className="flex items-center gap-3 py-1">
          <div className="flex-1 h-px bg-border" />
          <span className="text-[10px] font-bold text-muted-foreground/70 uppercase tracking-widest">
            or with email
          </span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4"
          noValidate
        >
          {/* Full Name */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="signup-name"
              className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider"
            >
              Full name
            </label>
            <Input
              id="signup-name"
              name="fullName"
              type="text"
              autoComplete="name"
              placeholder="Jane Smith"
              value={form.fullName}
              onChange={handleChange}
              className="h-10 text-xs rounded-xl"
            />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="signup-email"
              className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider"
            >
              Email address
            </label>
            <Input
              id="signup-email"
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
            <label
              htmlFor="signup-password"
              className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider"
            >
              Password
            </label>
            <div className="relative">
              <Input
                id="signup-password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Min. 8 characters"
                value={form.password}
                onChange={handleChange}
                className="h-10 text-xs rounded-xl pr-10"
              />
              <Button
                variant="ghost"
                size="icon"
                type="button"
                className="absolute right-1 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground hover:bg-accent/50 cursor-pointer h-8 w-8 rounded-lg"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((v) => !v)}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </Button>
            </div>

            {/* Strength bar */}
            {form.password.length > 0 && (
              <div className="flex gap-1 mt-1">
                {[...Array(4)].map((_, i) => {
                  const strength = Math.min(
                    Math.floor(form.password.length / 3),
                    4,
                  );
                  const colors = [
                    "bg-red-500",
                    "bg-orange-400",
                    "bg-yellow-400",
                    "bg-emerald-400",
                  ];
                  return (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                        i < strength ? colors[strength - 1] : "bg-muted"
                      }`}
                    />
                  );
                })}
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="signup-confirm"
              className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider"
            >
              Confirm password
            </label>
            <div className="relative">
              <Input
                id="signup-confirm"
                name="confirmPassword"
                type={showConfirm ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Re-enter your password"
                value={form.confirmPassword}
                onChange={handleChange}
                className="h-10 text-xs rounded-xl pr-10"
              />
              <Button
                variant="ghost"
                size="icon"
                type="button"
                className="absolute right-1 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground hover:bg-accent/50 cursor-pointer h-8 w-8 rounded-lg"
                aria-label={showConfirm ? "Hide password" : "Show password"}
                onClick={() => setShowConfirm((v) => !v)}
              >
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </Button>
            </div>
          </div>

          {/* Terms */}
          <div className="flex items-start gap-2">
            <Checkbox
              id="signup-terms"
              checked={agreed}
              onCheckedChange={(v) => setAgreed(Boolean(v))}
              className="rounded-md border-muted-foreground/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary mt-0.5"
            />
            <label
              htmlFor="signup-terms"
              className="text-xs text-muted-foreground font-semibold cursor-pointer leading-normal"
            >
              I agree to the{" "}
              <a
                href="#"
                className="font-semibold text-primary hover:underline"
              >
                Terms of Service
              </a>{" "}
              and{" "}
              <a
                href="#"
                className="font-semibold text-primary hover:underline"
              >
                Privacy Policy
              </a>
            </label>
          </div>

          {/* Submit */}
          <Button
            id="signup-submit"
            type="submit"
            disabled={isLoading}
            className="w-full h-10 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-primary/10 mt-2"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="size-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                Creating account...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Create account
                <ArrowRight size={15} />
              </span>
            )}
          </Button>
        </form>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground font-medium mt-1">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-primary hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </AuthCard>
  );
}

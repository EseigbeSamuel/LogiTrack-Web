"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Package,
  ArrowLeft,
  ArrowRight,
  Mail,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { AuthCard } from "@/components/auth/auth-card";
import { toast } from "sonner";

type Step = "email" | "otp" | "success";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("email");
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  /* ── Step 1: Send reset email ── */
  const handleSendLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address.");
      return;
    }
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1400));
    setIsLoading(false);
    toast.success("Verification code sent! Check your inbox.");
    setStep("otp");
    startResendCooldown();
  };

  /* ── Resend cooldown ── */
  const startResendCooldown = () => {
    setResendCooldown(60);
    const interval = setInterval(() => {
      setResendCooldown((v) => {
        if (v <= 1) {
          clearInterval(interval);
          return 0;
        }
        return v - 1;
      });
    }, 1000);
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setIsLoading(false);
    toast.success("Code resent successfully!");
    startResendCooldown();
  };

  /* ── Step 2: Verify OTP ── */
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 6) {
      toast.error("Please enter the full 6-digit code.");
      return;
    }
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1400));
    setIsLoading(false);
    setStep("success");
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

        {/* ──────────── STEP 1: Email ──────────── */}
        {step === "email" && (
          <>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-foreground">Reset password</h1>
              <p className="text-xs text-muted-foreground mt-1 font-medium">
                Enter your email and we&apos;ll send you a verification code.
              </p>
            </div>

            {/* Email icon */}
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 text-primary">
              <Mail size={20} strokeWidth={2} />
            </div>

            <form onSubmit={handleSendLink} className="flex flex-col gap-4.5" noValidate>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="forgot-email" className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                  Email address
                </label>
                <Input
                  id="forgot-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-10 text-xs rounded-xl"
                />
              </div>

              <Button
                id="forgot-send"
                type="submit"
                disabled={isLoading}
                className="w-full h-10 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-primary/10"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="size-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Sending code...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Send verification code
                    <ArrowRight size={15} />
                  </span>
                )}
              </Button>
            </form>

            <p className="text-center text-xs text-muted-foreground font-medium mt-1">
              <Link href="/login" className="font-semibold text-primary hover:underline inline-flex items-center gap-1.5">
                <ArrowLeft size={13} />
                Back to sign in
              </Link>
            </p>
          </>
        )}

        {/* ──────────── STEP 2: OTP ──────────── */}
        {step === "otp" && (
          <>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-foreground">Check your email</h1>
              <p className="text-xs text-muted-foreground mt-1 font-medium">
                We sent a 6-digit code to <strong className="text-foreground font-semibold">{email}</strong>
              </p>
            </div>

            <form onSubmit={handleVerifyOtp} className="flex flex-col gap-6" noValidate>
              {/* OTP slots */}
              <div className="flex justify-center py-2">
                <InputOTP
                  maxLength={6}
                  value={otp}
                  onChange={setOtp}
                >
                  <InputOTPGroup className="gap-2">
                    {[...Array(6)].map((_, i) => (
                      <InputOTPSlot
                        key={i}
                        index={i}
                        className="w-10 h-11 text-xs rounded-xl border border-border text-center font-bold"
                      />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              </div>

              <Button
                id="forgot-verify"
                type="submit"
                disabled={isLoading || otp.length < 6}
                className="w-full h-10 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-primary/10"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="size-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Verifying...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Verify code
                    <ArrowRight size={15} />
                  </span>
                )}
              </Button>
            </form>

            {/* Resend */}
            <div className="text-center">
              <p className="text-xs text-muted-foreground font-medium mt-1">
                Didn&apos;t receive a code?{" "}
                <Button
                  variant="link"
                  type="button"
                  id="forgot-resend"
                  onClick={handleResend}
                  disabled={resendCooldown > 0}
                  className="font-semibold text-primary hover:underline inline-flex items-center gap-1 cursor-pointer bg-transparent border-0 p-0 disabled:opacity-50 disabled:cursor-not-allowed h-auto"
                >
                  <RefreshCw size={12} className={resendCooldown > 0 ? "" : "animate-spin-slow"} />
                  {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend code"}
                </Button>
              </p>
            </div>

            <p className="text-center text-xs text-muted-foreground font-medium mt-1">
              <Button
                variant="link"
                type="button"
                onClick={() => setStep("email")}
                className="font-semibold text-primary hover:underline inline-flex items-center gap-1.5 cursor-pointer bg-transparent border-0 p-0 h-auto"
              >
                <ArrowLeft size={13} />
                Change email
              </Button>
            </p>
          </>
        )}

        {/* ──────────── STEP 3: Success ──────────── */}
        {step === "success" && (
          <div className="flex flex-col items-center gap-5 py-4 text-center">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 size={24} strokeWidth={2.3} />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-foreground">Password reset!</h1>
              <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                Your password has been reset successfully. You can now sign in with your new credentials.
              </p>
            </div>
            <Button
              id="forgot-back-login"
              type="button"
              className="w-full h-10 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-primary/10 max-w-[280px]"
              onClick={() => router.push("/login")}
            >
              <span className="flex items-center gap-2">
                Back to sign in
                <ArrowRight size={15} />
              </span>
            </Button>
          </div>
        )}
      </div>
    </AuthCard>
  );
}

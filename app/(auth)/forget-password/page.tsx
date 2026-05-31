"use client";

import React, { useState } from "react";
import Link from "next/link";
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
        if (v <= 1) { clearInterval(interval); return 0; }
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

        {/* ──────────── STEP 1: Email ──────────── */}
        {step === "email" && (
          <>
            <div>
              <h1 className="auth-heading">Reset password</h1>
              <p className="auth-subheading">
                Enter your email and we&apos;ll send you a verification code.
              </p>
            </div>

            {/* Email icon */}
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 16,
                background: "linear-gradient(135deg, rgba(0,122,255,0.15) 0%, rgba(88,86,214,0.15) 100%)",
                border: "1px solid rgba(0,122,255,0.25)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Mail size={24} color="#007AFF" />
            </div>

            <form onSubmit={handleSendLink} className="flex flex-col gap-4" noValidate>
              <div className="auth-field flex flex-col gap-1.5">
                <label htmlFor="forgot-email" className="auth-label">Email address</label>
                <Input
                  id="forgot-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="auth-input"
                />
              </div>

              <div className="auth-field">
                <Button
                  id="forgot-send"
                  type="submit"
                  disabled={isLoading}
                  className="auth-btn-primary"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending code…
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Send verification code
                      <ArrowRight size={16} />
                    </span>
                  )}
                </Button>
              </div>
            </form>

            <p className="text-center auth-subheading mt-0">
              <Link href="/login" className="auth-footer-link inline-flex items-center gap-1">
                <ArrowLeft size={14} />
                Back to sign in
              </Link>
            </p>
          </>
        )}

        {/* ──────────── STEP 2: OTP ──────────── */}
        {step === "otp" && (
          <>
            <div>
              <h1 className="auth-heading">Check your email</h1>
              <p className="auth-subheading">
                We sent a 6-digit code to{" "}
                <span style={{ color: "var(--auth-text)", fontWeight: 500 }}>
                  {email}
                </span>
              </p>
            </div>

            <form onSubmit={handleVerifyOtp} className="flex flex-col gap-6" noValidate>
              {/* OTP slots */}
              <div className="auth-field flex justify-center">
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
                        className="auth-otp-slot w-11 h-12"
                      />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              </div>

              <div className="auth-field">
                <Button
                  id="forgot-verify"
                  type="submit"
                  disabled={isLoading || otp.length < 6}
                  className="auth-btn-primary"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Verifying…
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Verify code
                      <ArrowRight size={16} />
                    </span>
                  )}
                </Button>
              </div>
            </form>

            {/* Resend */}
            <div className="text-center">
              <p className="auth-subheading mt-0">
                Didn&apos;t receive a code?{" "}
                <button
                  type="button"
                  id="forgot-resend"
                  onClick={handleResend}
                  disabled={resendCooldown > 0}
                  className="auth-footer-link inline-flex items-center gap-1"
                  style={{
                    opacity: resendCooldown > 0 ? 0.5 : 1,
                    cursor: resendCooldown > 0 ? "not-allowed" : "pointer",
                    background: "none",
                    border: "none",
                    padding: 0,
                  }}
                >
                  <RefreshCw size={13} />
                  {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend code"}
                </button>
              </p>
            </div>

            <p className="text-center auth-subheading mt-0">
              <button
                type="button"
                onClick={() => setStep("email")}
                className="auth-footer-link inline-flex items-center gap-1"
                style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}
              >
                <ArrowLeft size={14} />
                Change email
              </button>
            </p>
          </>
        )}

        {/* ──────────── STEP 3: Success ──────────── */}
        {step === "success" && (
          <div className="flex flex-col items-center gap-6 py-4 text-center">
            <div className="auth-success-icon">
              <CheckCircle2 size={32} color="#10b981" />
            </div>
            <div>
              <h1 className="auth-heading">Password reset!</h1>
              <p className="auth-subheading mt-2">
                Your password has been reset successfully. You can now sign in with your new credentials.
              </p>
            </div>
            <Button
              id="forgot-back-login"
              type="button"
              className="auth-btn-primary"
              style={{ maxWidth: 280 }}
              onClick={() => (window.location.href = "/login")}
            >
              <span className="flex items-center gap-2">
                Back to sign in
                <ArrowRight size={16} />
              </span>
            </Button>
          </div>
        )}
      </div>
    </AuthCard>
  );
}

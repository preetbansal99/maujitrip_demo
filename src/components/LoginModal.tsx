"use client";

import { useRef, useState } from "react";
import { Check, X } from "lucide-react";

export default function LoginModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [step, setStep] = useState<"mobile" | "otp" | "success">("mobile");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  if (!open) return null;

  const close = () => {
    onClose();
    setTimeout(() => {
      setStep("mobile");
      setOtp(["", "", "", "", "", ""]);
    }, 200);
  };

  const setDigit = (i: number, v: string) => {
    const d = v.replace(/\D/g, "").slice(-1);
    const next = [...otp];
    next[i] = d;
    setOtp(next);
    if (d && i < 5) inputs.current[i + 1]?.focus();
  };

  const pasteOtp = (text: string) => {
    const digits = text.replace(/\D/g, "").slice(0, 6);
    if (digits.length === 6) {
      setOtp(digits.split(""));
      inputs.current[5]?.focus();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={step === "mobile" ? "Login or Create account" : "Verify OTP"}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-enter" onClick={close} />
      <div className="relative w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl">
        <button
          type="button"
          aria-label="Close"
          onClick={close}
          className="absolute right-4 top-4 rounded-full p-1.5 text-gray-500 hover:bg-gray-100"
        >
          <X size={18} />
        </button>

        {step === "mobile" && (
          <>
            <h3 className="text-[18px] font-extrabold text-gray-900">Login or Create account</h3>
            <p className="mt-1 text-[13px] text-gray-400">
              Enter your mobile number to continue
            </p>
            <form
              className="mt-4"
              onSubmit={(e) => {
                e.preventDefault();
                if (mobile.replace(/\D/g, "").length >= 10) setStep("otp");
              }}
            >
              <div className="flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2.5 focus-within:border-[#023341]">
                <span className="text-sm font-semibold text-gray-700">+91</span>
                <input
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  required
                  placeholder="Mobile number"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
                  className="w-full bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400"
                />
              </div>
              <button
                type="submit"
                className="mt-3 w-full rounded-xl bg-[#023341] py-3 text-sm font-bold text-white hover:bg-[#034a5c] transition-colors"
              >
                Continue
              </button>
              <p className="mt-3 text-center text-[11px] leading-relaxed text-gray-400">
                By proceeding you agree to the User Agreement &amp; Privacy Policy
              </p>
            </form>
          </>
        )}

        {step === "otp" && (
          <>
            <h3 className="text-[18px] font-extrabold text-gray-900">Verify OTP</h3>
            <p className="mt-1 text-[13px] text-gray-400">
              Sent to <span className="font-semibold text-gray-700">+91 {mobile}</span>{" "}
              <button
                type="button"
                onClick={() => setStep("mobile")}
                className="font-semibold text-[#f74800] hover:underline"
              >
                Change
              </button>
            </p>
            <form
              className="mt-4"
              onSubmit={(e) => {
                e.preventDefault();
                if (otp.every((d) => d !== "")) setStep("success");
              }}
            >
              <div className="flex justify-between gap-2" onPaste={(e) => pasteOtp(e.clipboardData.getData("text"))}>
                {otp.map((d, i) => (
                  <input
                    key={i}
                    ref={(el) => {
                      inputs.current[i] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={d}
                    onChange={(e) => setDigit(i, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Backspace" && !otp[i] && i > 0) inputs.current[i - 1]?.focus();
                    }}
                    aria-label={`OTP digit ${i + 1}`}
                    className="h-11 w-11 rounded-xl border border-gray-200 text-center text-lg font-bold text-gray-900 outline-none focus:border-[#023341]"
                  />
                ))}
              </div>
              <button
                type="submit"
                className="mt-4 w-full rounded-xl bg-[#023341] py-3 text-sm font-bold text-white hover:bg-[#034a5c] transition-colors"
              >
                Verify OTP
              </button>
              <p className="mt-3 text-center text-[13px] text-gray-400">
                Didn&apos;t receive it?{" "}
                <button type="button" className="font-semibold text-[#f74800] hover:underline">
                  Resend
                </button>
              </p>
            </form>
          </>
        )}

        {step === "success" && (
          <div className="py-4 text-center">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-green-500">
              <Check size={28} />
            </span>
            <h3 className="mt-3 text-[18px] font-extrabold text-gray-900">
              Welcome to MaujiTrip!
            </h3>
            <p className="mt-1 text-[13px] text-gray-400">
              Signed in as <span className="font-semibold text-gray-700">+91 {mobile}</span>
            </p>
            <button
              type="button"
              onClick={close}
              className="mt-4 w-full rounded-xl bg-[#023341] py-3 text-sm font-bold text-white hover:bg-[#034a5c] transition-colors"
            >
              Start Exploring
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

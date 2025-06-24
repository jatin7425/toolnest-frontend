"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { sendOTP, verifyOTP } from "@/features/auth/services/authService";

export default function OTPVerifyPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const nextTool = searchParams.get("next") || "";

    const [otp, setOtp] = useState("");
    const [error, setError] = useState("");
    const [sending, setSending] = useState(false);
    const [verifying, setVerifying] = useState(false);
    useEffect(() => {
        const triggerOTP = async () => {
            setSending(true);
            try {
                await sendOTP();
            } catch (err) {
                setError("Failed to send OTP. Try reloading.");
            } finally {
                setSending(false);
            }
        };

        triggerOTP();
    }, [])


    const handleVerify = async () => {
        setVerifying(true);
        setError("");
        try {
            await verifyOTP({ otp });
            router.push(`/${nextTool}`);
        } catch (err) {
            setError("Invalid OTP. Try again.");
        } finally {
            setVerifying(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
                <h2 className="text-center text-black text-2xl font-semibold mb-2">Check your email</h2>
                <p className="text-center text-gray-600 mb-6">
                    We've sent a one-time password to your email address.
                </p>
                <label htmlFor="otp" className="block text-sm font-medium mb-1">
                    One-Time Password
                </label>
                <input
                    id="otp"
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter your OTP"
                    className="w-full px-4 py-2 border border-purple-500 rounded-md mb-4 text-black"
                />
                {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
                <button
                    onClick={handleVerify}
                    disabled={verifying || sending}
                    className={`w-full bg-purple-600 text-white py-2 rounded-md transition hover:bg-purple-700 ${verifying || sending ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                >
                    {verifying ? "Verifying..." : sending ? "Sending OTP..." : "Verify"}
                </button>
            </div>
        </div>
    );
}

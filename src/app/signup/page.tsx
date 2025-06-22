"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveToken, signup } from "@/features/auth/services/authService";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import { APP_NAME } from "@/constants/meta_data";

export default function SignupPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            const res = await signup({ email, password });
            console.log("Signup success:", res.data);
            saveToken(res.data.token);

            // Redirect to login or dashboard after success
            router.push("/");
        } catch (err: any) {
            setError(err.response?.data?.detail || "Signup failed");
        }
    };

    return (
        <div className="h-screen w-screen flex flex-col items-center justify-center bg-gray-50 px-4">
            <Header heading={APP_NAME} />
            <div className="w-full max-w-sm bg-white rounded-xl shadow-md p-8">
                <h2 className="text-2xl font-semibold text-center text-zinc-800">
                    Create your ToolNest account
                </h2>
                <p className="text-sm text-zinc-500 text-center mt-1 mb-6">
                    Enter your email and password to get started.
                </p>

                <form onSubmit={handleSignup} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-zinc-700 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            placeholder="you@example.com"
                            className="w-full px-3 py-2 border border-zinc-300 rounded-md bg-gray-100 text-black"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-zinc-700 mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            className="w-full px-3 py-2 border border-zinc-300 rounded-md bg-gray-100 text-black"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {error && <p className="text-sm text-red-500 text-center">{error}</p>}

                    <Button
                        type="submit"
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                    >
                        Sign Up
                    </Button>
                </form>

                <p className="mt-5 text-sm text-center text-zinc-600">
                    Already have an account?{" "}
                    <a href="/login" className="text-purple-600 hover:underline">
                        Log in
                    </a>
                </p>
            </div>
        </div>
    );
}

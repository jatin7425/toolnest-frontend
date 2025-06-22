"use client"

import Link from 'next/link';
import { Package } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { logout, useIsLoggedIn } from '@/features/auth/services/authService';

export default function Header({heading}: { heading?: string }) {
  const isLoggedIn = useIsLoggedIn();

  return (
    <header className="py-4 px-4 md:px-6 border-b bg-card bg-gray-50 text-black shadow-lg fixed top-0 z-50 w-screen">
      <div className="container mx-auto flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 font-semibold text-card-foreground transition-opacity hover:opacity-80">
          <Package className="h-6 w-6 text-black" />
          <span className="text-xl font-headline">{heading}</span>
        </Link>
        <div className="flex items-center gap-2">
          {isLoggedIn ? (
            <Button className="bg-purple-600 hover:bg-purple-700 text-white">
              <div onClick={logout}>Logout</div>
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <Button>
                <Link href="/login">Log In</Link>
              </Button>
              <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                <Link href="/signup">Sign Up</Link>
              </Button>
            </div>
          )}

        </div>
      </div>
    </header>
  );
}

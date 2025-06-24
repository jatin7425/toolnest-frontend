"use client"

import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Tittle } from "@/components/ui/tittle";
import { logout, useIsLoggedIn } from '@/features/auth/services/authService';

export default function Header({ heading }: { heading?: string }) {
  const isLoggedIn = useIsLoggedIn();

  return (
    <header className="py-4 px-4 md:px-6 border-b bg-card bg-gray-50 text-black shadow-lg fixed top-0 z-50 w-screen">
      <div className="container mx-auto flex items-center justify-between gap-4">
        <Tittle heading={heading} />
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

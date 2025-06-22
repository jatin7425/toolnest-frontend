"use client"

import Link from 'next/link';
import { Package } from 'lucide-react';

export const Tittle = ({ heading }: { heading?: string }) => {
    return (
        <Link href="/" className="flex items-center gap-2 font-semibold text-card-foreground transition-opacity hover:opacity-80">
            <Package className="h-6 w-6 text-black" />
            <span className="text-xl font-headline">{heading}</span>
        </Link>
    )
}
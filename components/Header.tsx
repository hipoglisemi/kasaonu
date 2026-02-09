"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Globe, Menu, User, Heart, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeaderProps {
    searchQuery?: string;
    onSearchChange?: (query: string) => void;
    onSearchSubmit?: () => void;
    isFocused?: boolean;
    onFocusChange?: (focused: boolean) => void;
}

export function Header({
    searchQuery = '',
    onSearchChange,
    onSearchSubmit,
    isFocused = false,
    onFocusChange
}: HeaderProps) {
    const [scrolled, setScrolled] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header className={cn(
            "fixed top-0 left-0 right-0 z-50 w-full border-b transition-all duration-300",
            (mounted && scrolled)
                ? "bg-white/90 backdrop-blur-xl border-slate-200/60 shadow-sm"
                : "bg-white/80 backdrop-blur-md border-slate-200/40"
        )}>
            <div className="max-w-[1280px] mx-auto h-16 px-6 flex items-center justify-between gap-4">

                {/* 1. Logo */}
                <div className="flex items-center gap-2 shrink-0">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="bg-rose-50 p-1.5 rounded-lg group-hover:bg-rose-100 transition-colors shadow-sm shadow-rose-100/50">
                            <Heart className="h-4 w-4 fill-rose-600 text-rose-600" />
                        </div>
                        <h1 className="text-lg font-bold tracking-tight text-slate-900">
                            Kasa<span className="text-rose-600">Önü</span>
                        </h1>
                    </Link>
                </div>

                {/* 2. Center Search Bar */}
                <div className="flex-1 max-w-xl mx-auto hidden md:block">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-rose-500 transition-colors" />
                        <input
                            type="text"
                            value={searchQuery}
                            onFocus={() => onFocusChange?.(true)}
                            onBlur={() => onFocusChange?.(false)}
                            onChange={(e) => onSearchChange?.(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && onSearchSubmit?.()}
                            placeholder="Marka, kampanya veya kategori ara..."
                            className="w-full h-10 pl-10 pr-4 bg-slate-50 border border-slate-200/60 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-4 focus:ring-rose-500/5 focus:border-rose-200 transition-all font-medium"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-1">
                            <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border border-slate-200 bg-slate-100 px-1.5 font-mono text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
                                <span className="text-xs">⌘</span>K
                            </kbd>
                        </div>
                    </div>
                </div>

                {/* 3. User & Global Actions */}
                <div className="flex items-center gap-3 shrink-0">
                    <Link
                        href="/admin"
                        className="hidden lg:block text-[13px] font-bold text-slate-500 hover:text-rose-600 transition-colors uppercase tracking-widest"
                    >
                        Panel
                    </Link>

                    <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-all">
                        <Globe size={18} />
                    </button>

                    <button className="flex items-center gap-2 pl-1 pr-1 py-1 rounded-full border border-slate-200/80 hover:border-slate-300 hover:shadow-md transition-all bg-white ml-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-rose-500 to-rose-600 flex items-center justify-center text-white text-xs font-bold shadow-sm shadow-rose-200">
                            <User size={15} fill="currentColor" />
                        </div>
                        <Menu size={16} className="text-slate-500 mr-2 ml-0.5" />
                    </button>
                </div>
            </div>
        </header>
    );
}

export default Header;

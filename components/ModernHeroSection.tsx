"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import {
    Sparkles,
    ShoppingCart,
    Shirt,
    Fuel,
    Utensils,
    Laptop,
    Plane,
    GraduationCap,
    Heart,
    Gamepad2,
    Sofa,
    Shield,
    Car,
    Sparkle,
    Baby,
    Home,
    Palette,
    Dumbbell,
    Package,
    MoreHorizontal,
    Bus,
    Landmark,
    Watch
} from 'lucide-react';

// 18 Master Sektör İkonları (KACF ile Senkronize)
const sectorIcons = [
    { Icon: ShoppingCart, name: 'Market & Gıda', slug: 'market-gida', color: '#10B981' },
    { Icon: Fuel, name: 'Akaryakıt', slug: 'akaryakit', color: '#F59E0B' },
    { Icon: Shirt, name: 'Giyim & Aksesuar', slug: 'giyim-aksesuar', color: '#8B5CF6' },
    { Icon: Utensils, name: 'Restoran & Kafe', slug: 'restoran-kafe', color: '#EF4444' },
    { Icon: Laptop, name: 'Elektronik', slug: 'elektronik', color: '#3B82F6' },
    { Icon: Home, name: 'Mobilya & Dekorasyon', slug: 'mobilya-dekorasyon', color: '#84CC16' },
    { Icon: Heart, name: 'Kozmetik & Sağlık', slug: 'kozmetik-saglik', color: '#EC4899' },
    { Icon: Package, name: 'E-Ticaret', slug: 'e-ticaret', color: '#3B82F6' },
    { Icon: Bus, name: 'Ulaşım', slug: 'ulasim', color: '#06B6D4' },
    { Icon: Gamepad2, name: 'Dijital Platform', slug: 'dijital-platform', color: '#A855F7' },
    { Icon: Palette, name: 'Kültür & Sanat', slug: 'kultur-sanat', color: '#A855F7' },
    { Icon: GraduationCap, name: 'Eğitim', slug: 'egitim', color: '#6366F1' },
    { Icon: Shield, name: 'Sigorta', slug: 'sigorta', color: '#14B8A6' },
    { Icon: Car, name: 'Otomotiv', slug: 'otomotiv', color: '#F97316' },
    { Icon: Landmark, name: 'Vergi & Kamu', slug: 'vergi-kamu', color: '#64748B' },
    { Icon: Plane, name: 'Turizm & Konaklama', slug: 'turizm-konaklama', color: '#06B6D4' },
    { Icon: Watch, name: 'Kuyum & Saat', slug: 'kuyum-optik-saat', color: '#F59E0B' },
    { Icon: MoreHorizontal, name: 'Diğer', slug: 'diger', color: '#94A3B8' },
];

interface ModernHeroSectionProps {
    onSectorClick?: (slug: string) => void;
}

export function ModernHeroSection({ onSectorClick }: ModernHeroSectionProps) {
    return (
        <div className="w-full bg-white border-b border-gray-100">
            {/* Hero Content Area */}
            <section className="relative overflow-hidden bg-white px-6 pt-6 pb-16 lg:px-20 lg:pt-8 lg:pb-24">
                {/* Dot Pattern Background */}
                <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

                <div className="mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:min-h-[450px] relative z-20">
                    {/* Left: Text Content */}
                    <div className="relative z-10 space-y-8 text-center lg:text-left">
                        <div className="space-y-6">
                            {/* Badge */}
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-50 border border-gray-200 text-[11px] font-semibold uppercase tracking-wider text-gray-500 hover:border-gray-300 transition-colors animate-fade-in-up">
                                <Sparkles size={14} className="text-rose-500" />
                                TÜM KAMPANYALAR TEK PLATFORMDA
                            </div>

                            {/* Main Heading */}
                            <h1 className="text-5xl font-bold leading-[1.1] tracking-tight text-gray-900 opacity-0 animate-fade-in-up delay-100 lg:text-7xl">
                                Keşfet, Birleştir,
                                <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-rose-400">AVANTAJI YAKALA.</span>
                            </h1>

                            {/* Subtitle */}
                            <p className="max-w-xl mx-auto lg:mx-0 text-xl font-normal leading-relaxed text-gray-500 opacity-0 animate-fade-in-up delay-200">
                                Bankanızın ve kartınızın tüm fırsatlarını tek bir platformda toplayın,
                                <br className="hidden lg:block" />
                                harcadıkça kazandıran modern bir keşif deneyimini yaşayın.
                            </p>
                        </div>
                    </div>

                    {/* Right: 18 Sector Icons in Staggered Grid */}
                    <div className="relative flex justify-center lg:justify-end opacity-0 animate-scale-in">
                        <div className="relative w-full max-w-[600px] py-10">
                            {/* Background Glow */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-rose-100/40 via-transparent to-blue-50/40 blur-3xl rounded-full"></div>

                            <div className="grid grid-cols-3 sm:grid-cols-6 gap-x-4 gap-y-12 sm:gap-x-6 sm:gap-y-16 relative z-10">
                                {sectorIcons.map((sector, index) => {
                                    // Use a staggered effect: push every other column down
                                    const isStaggered = (index % 6) % 2 === 1;

                                    return (
                                        <button
                                            key={sector.name}
                                            onClick={() => onSectorClick?.(sector.slug)}
                                            className={cn(
                                                "group/item relative flex flex-col items-center gap-3 opacity-0 animate-fade-in-up transition-all duration-500 cursor-pointer",
                                                isStaggered && "sm:translate-y-8"
                                            )}
                                            style={{ animationDelay: `${index * 40}ms` }}
                                        >
                                            <div className="relative h-16 w-16 sm:h-20 sm:w-20 perspective-1000">
                                                {/* Flat Minimalist Card */}
                                                <div className="absolute inset-0 bg-white rounded-2xl border border-gray-200 shadow-[0_2px_4px_rgba(0,0,0,0.02)] transition-all duration-300 group-hover/item:-translate-y-2 group-hover/item:shadow-[0_12px_24px_rgba(0,0,0,0.06)] group-hover/item:border-rose-200 flex items-center justify-center">
                                                    <sector.Icon
                                                        size={28}
                                                        style={{ color: sector.color }}
                                                        strokeWidth={2}
                                                        className="relative z-10 transition-transform duration-300 group-hover/item:scale-110 opacity-90 group-hover/item:opacity-100"
                                                    />
                                                </div>
                                            </div>

                                            {/* Name Label */}
                                            <div className="flex flex-col items-center">
                                                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide transition-colors group-hover/item:text-gray-900 text-center leading-tight whitespace-pre-wrap max-w-[80px]">
                                                    {sector.name}
                                                </span>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default ModernHeroSection;

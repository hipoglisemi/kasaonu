"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    ArrowLeft,
    Calendar,
    ShieldCheck,
    Building2,
    Info,
    Share2,
    Heart,
    Grid,
    MousePointer2,
    CreditCard,
    Smartphone,
    ScrollText,
    ChevronDown,
    ChevronUp,
    Zap,
    ThumbsUp,
    ThumbsDown
} from 'lucide-react';
import { cn, formatDate, formatRewardValue } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface CampaignDetailClientProps {
    campaign: {
        id: string;
        title: string;
        imageUrl?: string | null;
        detailsText: string | null;
        conditionsText: string | null;
        endDate: Date | null;
        rewardValue: number | string | null | { toString(): string };
        rewardType: string | null;
        trackingUrl?: string | null;
        sector?: { name: string } | null;
        card: {
            name: string;
            logoUrl?: string | null;
            bank: { name: string };
        };
    };
    similarCampaigns: Array<{
        id: string;
        title: string;
        imageUrl?: string | null;
    }>;
}

export function CampaignDetailClient({ campaign, similarCampaigns }: CampaignDetailClientProps) {
    const [mounted, setMounted] = useState(false);
    const [isFavorited, setIsFavorited] = useState(false);
    const [showAllConditions, setShowAllConditions] = useState(false);
    const [isDescExpanded, setIsDescExpanded] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setMounted(true);
        }, 0);
        return () => clearTimeout(timer);
    }, []);

    const rewardValue = campaign.rewardValue ? Number(campaign.rewardValue) : null;
    const rewardText = formatRewardValue(rewardValue, campaign.rewardType);

    // Dynamic Card Logo Mapping (Copied from CampaignCard)
    const getCardLogoPath = (bankName: string, cardName: string) => {
        const normalize = (text: string) => text
            ?.replace(/İ/g, 'i')
            ?.replace(/I/g, 'ı')
            ?.replace(/ğ/g, 'g')
            ?.replace(/ü/g, 'u')
            ?.replace(/ş/g, 's')
            ?.replace(/ö/g, 'o')
            ?.replace(/ç/g, 'c')
            ?.replace(/Ğ/g, 'g')
            ?.replace(/Ü/g, 'u')
            ?.replace(/Ş/g, 's')
            ?.replace(/Ö/g, 'o')
            ?.replace(/Ç/g, 'c')
            ?.toLowerCase()
            ?.replace(/[^a-z0-9]/g, '') || '';

        const b = normalize(bankName || '');
        const c = normalize(cardName || '');
        return `/logos/cards/${b}${c}.png`;
    };

    const cardLogoPath = campaign.card.logoUrl || getCardLogoPath(campaign.card?.bank?.name, campaign.card?.name);

    if (!mounted) return null;

    return (
        <div className="max-w-7xl mx-auto px-6">
            {/* Header / Navigation Row */}
            <div className="flex items-center justify-between pt-4 mb-4">
                <Link
                    href="/"
                    className="flex items-center gap-2 text-slate-900 hover:bg-slate-50 px-3 py-2 -ml-3 rounded-lg transition-all font-bold text-[13px] uppercase tracking-widest"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Geri Dön
                </Link>

                <div className="flex items-center gap-1">
                    <button className="p-2 hover:bg-slate-50 rounded-full transition-all text-slate-400 hover:text-slate-900" title="Paylaş">
                        <Share2 className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => setIsFavorited(!isFavorited)}
                        className={cn(
                            "p-2 hover:bg-slate-50 rounded-full transition-all",
                            isFavorited ? "text-rose-600" : "text-slate-400 hover:text-rose-600"
                        )}
                        title="Favorilere Ekle"
                    >
                        <Heart className={cn("h-4 w-4", isFavorited && "fill-current")} />
                    </button>
                </div>
            </div>

            {/* Title above Hero */}
            <div className="mb-6">
                <h1 className="text-[22px] md:text-[32px] font-bold text-slate-900 leading-[1.1] tracking-tight">
                    {campaign.title}
                </h1>
            </div>

            {/* 1. Hero Section */}
            <div className="grid grid-cols-1 lg:grid-cols-4 lg:grid-rows-2 gap-2 mb-12 overflow-hidden rounded-2xl h-[280px] md:h-[320px] lg:h-[420px]">
                {/* Main Hero Image */}
                <div className="lg:col-span-2 lg:row-span-2 relative bg-gray-50 overflow-hidden group border border-gray-100">
                    {campaign.imageUrl ? (
                        <img
                            src={campaign.imageUrl}
                            alt={campaign.title}
                            className="w-full h-full object-cover opacity-95 group-hover:opacity-100 transition-opacity duration-500"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-200">
                            <Building2 className="h-10 w-10" />
                        </div>
                    )}
                </div>

                {/* Side Grid: 4 Similar or Fallback */}
                {similarCampaigns.slice(0, 4).map((sim) => (
                    <Link
                        key={sim.id}
                        href={`/kampanya/${sim.id}`}
                        className="hidden lg:block relative bg-gray-50 overflow-hidden group border border-gray-100"
                    >
                        {sim.imageUrl ? (
                            <img
                                src={sim.imageUrl}
                                alt={sim.title}
                                className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-100">
                                <Grid className="h-5 w-5" />
                            </div>
                        )}
                        <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
                    </Link>
                ))}

                {/* Fallback blocks if less than 4 similar */}
                {similarCampaigns.length < 4 && Array.from({ length: 4 - similarCampaigns.length }).map((_, i) => (
                    <div key={`fallback-${i}`} className="hidden lg:flex items-center justify-center bg-gray-50 border border-gray-100 text-gray-200">
                        <Grid className="h-5 w-5" />
                    </div>
                ))}
            </div>


            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 pb-24">
                {/* Left Column: Content */}
                <div className="lg:col-span-8">
                    <div className="space-y-8">
                        {/* Description Section */}
                        {campaign.detailsText && (
                            <div className="prose prose-airbnb max-w-none border-t border-slate-100 pt-8">
                                <div className="relative">
                                    <div className={cn(
                                        "text-[16px] text-slate-700 leading-[24px] transition-all duration-500 overflow-hidden font-light whitespace-pre-line",
                                        (campaign.detailsText.length > 400 && !isDescExpanded) ? "max-h-[144px]" : "max-h-none"
                                    )}>
                                        {campaign.detailsText}
                                    </div>
                                    {campaign.detailsText.length > 400 && (
                                        <button
                                            onClick={() => setIsDescExpanded(!isDescExpanded)}
                                            className="mt-4 flex items-center gap-1.5 text-[15px] font-semibold text-rose-600 underline underline-offset-4 hover:opacity-70 transition-opacity"
                                        >
                                            {isDescExpanded ? (
                                                <>Daha Az Göster <ChevronDown size={14} className="rotate-180" /></>
                                            ) : (
                                                <>Devamını Oku <ChevronDown size={14} /></>
                                            )}
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Feature List Section (Structured Info) */}
                        <div className="flex flex-col border-t border-slate-100 mt-8 pt-4">
                            {/* Kampanya Dönemi */}
                            <div className="flex items-start gap-4 py-4">
                                <Calendar size={24} className="text-slate-900 mt-0.5 shrink-0" strokeWidth={1.5} />
                                <div className="flex flex-col w-full">
                                    <span className="text-[16px] font-semibold text-slate-900 leading-tight">Kampanya Dönemi</span>
                                    <span className="text-[14px] text-slate-500 leading-relaxed mt-0.5">
                                        {formatDate(campaign.endDate)}&apos;e kadar geçerli
                                    </span>
                                </div>
                            </div>

                            {/* Geçerli Kartlar */}
                            <div className="flex items-start gap-4 py-4">
                                <CreditCard size={24} className="text-slate-900 mt-0.5 shrink-0" strokeWidth={1.5} />
                                <div className="flex flex-col w-full">
                                    <span className="text-[16px] font-semibold text-slate-900 leading-tight">Geçerli Kartlar</span>
                                    <span className="text-[14px] text-slate-500 leading-relaxed mt-0.5">
                                        {campaign.card.bank.name} {campaign.card.name}
                                    </span>
                                </div>
                            </div>

                            {/* Katılım Şekli */}
                            <div className="flex items-start gap-4 py-4">
                                <Smartphone size={24} className="text-slate-900 mt-0.5 shrink-0" strokeWidth={1.5} />
                                <div className="flex flex-col w-full">
                                    <span className="text-[16px] font-semibold text-slate-900 leading-tight">Katılım Şekli</span>
                                    <span className="text-[14px] text-slate-500 leading-relaxed mt-0.5">
                                        Mobil uygulama üzerinden veya banka kanallarından kampanya detaylarındaki talimatları izleyerek katılabilirsiniz.
                                    </span>
                                </div>
                            </div>

                            {/* Kampanya Koşulları */}
                            <div className="flex items-start gap-4 py-4">
                                <ScrollText size={24} className="text-slate-900 mt-0.5 shrink-0" strokeWidth={1.5} />
                                <div className="flex flex-col w-full">
                                    <span className="text-[16px] font-semibold text-slate-900 leading-tight">Kampanya Koşulları</span>
                                    {campaign.conditionsText ? (
                                        <>
                                            <ul className="mt-4 space-y-3">
                                                {campaign.conditionsText.split('\n').slice(0, showAllConditions ? undefined : 5).map((item, idx) => (
                                                    item.trim() && (
                                                        <li key={idx} className="flex items-start gap-3 text-slate-800 leading-relaxed group">
                                                            <div className="mt-2 flex items-center justify-center shrink-0">
                                                                <div className="w-1 h-1 rounded-full bg-slate-400" />
                                                            </div>
                                                            <span className="text-[14px] font-light">{item}</span>
                                                        </li>
                                                    )
                                                ))}
                                            </ul>
                                            {campaign.conditionsText.split('\n').filter(l => l.trim()).length > 5 && (
                                                <button
                                                    onClick={() => setShowAllConditions(!showAllConditions)}
                                                    className="mt-4 flex items-center gap-2 text-[14px] font-medium text-rose-600 hover:text-rose-700 transition-colors"
                                                >
                                                    {showAllConditions ? (
                                                        <>Daha Az Göster <ChevronUp size={16} /></>
                                                    ) : (
                                                        <>Tümünü Göster ({campaign.conditionsText.split('\n').filter(l => l.trim()).length - 5} koşul daha) <ChevronDown size={16} /></>
                                                    )}
                                                </button>
                                            )}
                                        </>
                                    ) : (
                                        <span className="text-[14px] text-slate-500 leading-relaxed mt-0.5">
                                            Detaylı katılım koşulları için kampanya kanalını ziyaret ediniz.
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Sidebar */}
                <div className="lg:col-span-4 lg:block">
                    <div className="sticky top-28 space-y-6">
                        <div className="bg-white/80 backdrop-blur-md border border-slate-200/60 rounded-2xl p-6 shadow-xl shadow-slate-200/40">
                            {/* 1. Countdown Section (Urgency) */}
                            <div className="mb-6 flex items-center justify-between">
                                <span className="text-[13px] font-bold text-slate-800 tracking-tight">Kalan Süre</span>
                                <div className="flex gap-2">
                                    <div className="bg-rose-50/50 px-3 py-1 rounded-full border border-rose-100">
                                        <span className="text-[13px] font-bold text-rose-600">
                                            {formatDate(campaign.endDate)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* 2. Primary Action Button */}
                            {campaign.trackingUrl && (
                                <a
                                    href={campaign.trackingUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full relative group overflow-hidden bg-gradient-to-r from-rose-500 to-rose-600 text-white py-4 rounded-xl font-bold text-[16px] transition-all active:scale-[0.98] flex items-center justify-center gap-2 mb-6 shadow-lg shadow-rose-200 no-underline"
                                >
                                    <span className="relative z-10 flex items-center gap-2">
                                        Kampanyaya Katıl <MousePointer2 size={18} className="rotate-[-10deg] fill-white" />
                                    </span>
                                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </a>
                            )}

                            <p className="text-[12px] text-center text-slate-400 font-medium leading-relaxed mb-8 border-b border-slate-100 pb-6">
                                Resmi banka sayfasına yönlendirileceksiniz.
                            </p>

                            {/* 3. Card Discovery Module */}
                            <div className="mb-6">
                                <h4 className="text-[13px] font-bold uppercase tracking-widest text-slate-400 mb-4">Kartı Keşfet</h4>
                                <div className="flex items-center gap-4 mb-7 p-3 bg-slate-50/50 rounded-xl border border-slate-100">
                                    <div className="w-20 h-13 rounded-lg overflow-hidden border border-slate-200 bg-white shrink-0 shadow-sm flex items-center justify-center aspect-[1.58/1]">
                                        <img src={cardLogoPath} alt={campaign.card.name} className="w-full h-full object-contain p-1.5" />
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                        <span className="text-[15px] font-bold text-slate-900 leading-tight truncate">{campaign.card.name}</span>
                                        <span className="text-[12px] text-slate-500 font-medium truncate">{campaign.card.bank.name}</span>
                                    </div>
                                </div>

                                <button className="w-full border-2 border-rose-600 text-rose-600 hover:bg-rose-50 py-3.5 rounded-xl font-bold text-[15px] transition-all active:scale-[0.98] flex items-center justify-center gap-2 bg-white mb-2">
                                    Kart Başvurusu Yap <MousePointer2 size={18} className="rotate-[-10deg]" />
                                </button>
                            </div>

                            {/* 4. Footer: Analytics & Feedback */}
                            <div className="pt-6 border-t border-slate-100 space-y-4">
                                <div className="flex items-center justify-between text-[13px]">
                                    <span className="text-slate-500 font-medium">Güvenlik Kontrolü</span>
                                    <span className="text-rose-600 font-bold flex items-center gap-1.5 px-2 py-0.5 bg-rose-50 rounded-md text-[11px]">
                                        <Zap size={14} className="fill-rose-600" /> AI DOĞRULANDI
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-[13px]">
                                    <span className="text-slate-500 font-medium">Bilgiler yararlı mı?</span>
                                    <div className="flex items-center gap-1">
                                        <button className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-rose-600 transition-all"><ThumbsUp size={16} /></button>
                                        <button className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-rose-600 transition-all"><ThumbsDown size={16} /></button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Similar Offers (Minimal) */}
                        {similarCampaigns.length > 0 && (
                            <div className="py-6 border-t border-slate-100">
                                <h4 className="text-[16px] font-bold text-slate-900 mb-6">Benzer Fırsatlar</h4>
                                <div className="grid grid-cols-1 gap-4">
                                    {similarCampaigns.slice(0, 3).map((sim) => (
                                        <Link
                                            key={sim.id}
                                            href={`/kampanya/${sim.id}`}
                                            className="flex items-center gap-4 group"
                                        >
                                            <div className="w-16 h-10 rounded-lg bg-slate-50 border border-slate-100 overflow-hidden shrink-0">
                                                <img src={sim.imageUrl || undefined} alt={sim.title} className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500" />
                                            </div>
                                            <span className="text-[14px] font-medium text-slate-500 group-hover:text-slate-900 line-clamp-2 transition-colors">
                                                {sim.title}
                                            </span>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Legal Disclaimer (Feragat Metni) */}
            <div className="mt-12 pt-10 border-t border-slate-100">
                <div className="w-full text-center space-y-3">
                    <div className="flex items-center justify-center gap-2 text-slate-400">
                        <ShieldCheck size={14} />
                        <span className="text-[9px] font-bold uppercase tracking-[0.2em]">Yasal Bilgilendirme ve Feragatname</span>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-relaxed max-w-4xl mx-auto px-4 text-center font-medium opacity-80">
                        Bu sayfada sunulan kampanya bilgileri; ilgili banka, marka veya finansal kuruluşun dijital mecralarından otomatik veya manuel yöntemlerle derlenmiştir.
                        KasaÖnü, sağlanan bu verilerin her an güncel, hatasız veya eksiksiz olduğu konusunda herhangi bir taahhüt veya garanti vermez.
                        Kampanya koşulları, ödül miktarları ve geçerlilik süreleri, kampanya sahibi kuruluş tarafından önceden bildirim yapılmaksızın tek taraflı
                        olarak değiştirilebilir. Herhangi bir harcama yapmadan veya katılım sağlamadan önce, en güncel bilgileri ilgili kurumun resmi mobil
                        uygulaması, internet sitesi veya müşteri hizmetleri kanalları üzerinden teyit etmeniz önemle tavsiye olunur. Sunulan bilgilerdeki
                        olası yanlışlıklar veya gecikmeler nedeniyle oluşabilecek doğrudan veya dolaylı maddi/manevi zararlardan KasaÖnü sorumlu tutulamaz.
                    </p>
                </div>
            </div>

            {/* Mobile Bottom Bar (Refined Airbnb style) */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-slate-100 flex flex-col z-[150] shadow-[0_-4px_25px_rgba(0,0,0,0.05)]">
                <div className="px-6 py-4 flex items-center justify-between">
                    <div className="flex flex-col min-w-0">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">KAZANÇ POTANSİYELİ</span>
                        <span className="text-[15px] font-bold text-slate-900 truncate leading-none">
                            {rewardText || "Özel Fırsat"}
                        </span>
                    </div>

                    {campaign.trackingUrl && (
                        <a
                            href={campaign.trackingUrl}
                            target="_blank"
                            className="flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-xl text-[14px] font-bold shadow-lg shadow-rose-100 active:scale-95 transition-all no-underline"
                        >
                            Hemen Katıl <MousePointer2 size={16} className="rotate-[-10deg] fill-white" />
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
}

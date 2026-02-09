"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight } from 'lucide-react';
import { cn, formatDate, formatRewardValue } from '@/lib/utils';
interface CampaignCardProps {
    campaign: {
        id: string;
        title: string;
        rewardText: string;
        rewardValue: any;
        rewardType: string | null;
        imageUrl?: string | null;
        endDate?: Date | string | null;
        card: {
            name: string;
            logoUrl?: string | null;
            bank: {
                name: string;
                logoUrl?: string | null;
            };
        };
        sector?: { name: string } | null;
        createdAt?: Date | string;
        brands?: Array<{ brand: { name: string } }>;
    };
    isUserCard?: boolean;
}

export function CampaignCard({ campaign, isUserCard = false }: CampaignCardProps) {
    // KasaÖnü Standardized Design Tokens
    const stripeStyles = {
        card: "bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1.5",
        headerText: "text-[14px] font-bold text-slate-900 tracking-tight leading-snug",
        label: "text-[11px] font-bold text-slate-400 uppercase tracking-widest",
        value: "text-[11px] font-bold text-slate-900 text-right opacity-80",
        divider: "h-[1px] bg-slate-100/50 mx-4",
    };

    const rewardValue = campaign.rewardValue ? Number(campaign.rewardValue) : null;
    const rewardText = formatRewardValue(rewardValue, campaign.rewardType);

    // Dynamic Color for Visuals based on Bank
    const getBankColor = (bankName: string) => {
        const name = bankName?.toLowerCase() || '';
        if (name.includes('garanti')) return 'from-emerald-400 to-emerald-600';
        if (name.includes('is') || name.includes('i̇ş')) return 'from-blue-500 to-indigo-700';
        if (name.includes('akbank')) return 'from-rose-500 to-rose-700';
        if (name.includes('yapi')) return 'from-amber-400 to-amber-600';
        if (name.includes('qnb')) return 'from-teal-400 to-teal-600';
        return 'from-slate-400 to-slate-600';
    };

    const bankGradient = getBankColor(campaign.card?.bank?.name);

    // Dynamic Card Logo Mapping
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
        let c = normalize(cardName || '');

        // Fix for Garanti cards (Garanti Bonus -> Bonus)
        // 1. If card name starts with bank name (e.g. Garanti BBVA Bonus), remove it
        if (c.startsWith(b)) {
            c = c.replace(b, '');
        }

        // 2. Specific fix for Garanti variations (Garanti Bonus -> Bonus)
        if (b.includes('garanti')) {
            if (c.startsWith('garanti')) c = c.replace('garanti', '');
            if (c.startsWith('bbva')) c = c.replace('bbva', '');
            if (c.includes('kartlar')) c = c.replace('kartlar', '');
        }

        return `/logos/cards/${b}${c}.png`;
    };

    const imageUrl = campaign.imageUrl || '/images/placeholder-campaign.jpg';
    const cardLogoPath = campaign.card.logoUrl || getCardLogoPath(campaign.card.bank.name, campaign.card.name);
    const [logoError, setLogoError] = useState(false);

    return (
        <div className={cn("relative group", stripeStyles.card)}>
            {/* Clickable Wrapper */}
            <Link href={`/kampanya/${campaign.id}`} className="block no-underline">

                {/* Visual Header (KasaÖnü Standard) */}
                <div className="relative h-40 w-full bg-slate-50 overflow-hidden">
                    {/* Abstract Gradient Shape with Image */}
                    <div className={cn(
                        "absolute top-0 right-0 w-[85%] h-full bg-gradient-to-br opacity-90 overflow-hidden",
                        "origin-bottom-left -skew-x-12 rounded-bl-[40px]",
                        bankGradient
                    )}>
                        {campaign.imageUrl && (
                            <Image
                                src={campaign.imageUrl}
                                alt={campaign.title}
                                fill
                                className="object-cover transition-opacity duration-500 skew-x-12 scale-125"
                            />
                        )}
                    </div>

                    {/* Decorative Blobs */}
                    <div className="absolute top-[-20px] right-[-20px] w-32 h-32 bg-white/20 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute bottom-[-10px] right-[20px] w-20 h-20 bg-black/10 rounded-full blur-xl pointer-events-none" />

                    {/* Card Logo Placement (Top Left - Raw Image) */}
                    <div className="absolute left-1 top-4 z-20 w-16 h-8 transition-transform duration-500">
                        <Image
                            src={!logoError ? cardLogoPath : (campaign.card?.bank?.logoUrl || '/logos/cards/creditcard.png')}
                            alt={campaign.card?.name}
                            fill
                            className="object-contain object-left drop-shadow-md"
                            onError={() => setLogoError(true)}
                        />
                    </div>
                </div>

                {/* 1. Visual Strip (Primary Reward Badge) */}
                <div className="w-full bg-rose-600/90 backdrop-blur-sm py-1.5 flex items-center justify-center border-y border-rose-500/20">
                    <span className="text-[11px] font-black text-rose-50 uppercase tracking-[0.25em]">
                        {rewardText || "ÖZEL KAMPANYA"}
                    </span>
                </div>

                <div className="p-5 flex flex-col bg-white">
                    {/* 2. Campaign Title (Left Aligned - Reduced Margin) */}
                    <h3 className={cn("line-clamp-3 min-h-[63px] mb-4 text-left", stripeStyles.headerText)}>
                        {campaign.title}
                    </h3>

                    {/* 3. Simplified Metadata Divider & Row */}
                    <div className="pt-3 border-t border-slate-100/40">
                        <div className="flex justify-between items-center text-[10px] font-medium tracking-wider uppercase">
                            <span className="text-slate-400">Son Katılım</span>
                            <span className="text-slate-500 font-bold">
                                {formatDate(campaign.endDate || null)}
                            </span>
                        </div>
                    </div>
                </div>
            </Link>

            {/* User Card Badge (Bottom Overlay Gradient) */}
            {isUserCard && (
                <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-emerald-400 to-emerald-600" title="Kayıtlı Kartınız" />
            )}
        </div>
    );
}

export default CampaignCard;

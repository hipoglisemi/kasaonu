"use client";

import React from 'react';
import { cn } from '@/lib/utils';

export function LoadingSkeleton() {
    return (
        <div className="bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-gray-100 overflow-hidden animate-pulse">
            {/* Visual Header Skeleton */}
            <div className="h-24 w-full bg-gray-50 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-3/4 h-full bg-gray-100/30" style={{ clipPath: 'polygon(20% 0%, 100% 0%, 100% 100%, 0% 100%)' }} />

                {/* Card Logo Skeleton (Top Left) */}
                <div className="absolute left-4 top-3 w-16 h-5 rounded bg-gray-100/50" />
            </div>

            <div className="p-[18px] pt-4 pb-[20px] flex flex-col space-y-3">
                {/* Title Skeleton (3 lines) */}
                <div className="space-y-2">
                    <div className="h-4 bg-gray-100/80 rounded w-full" />
                    <div className="h-4 bg-gray-100/80 rounded w-11/12" />
                    <div className="h-4 bg-gray-100/80 rounded w-2/3" />
                </div>

                {/* Centered Badge Skeleton */}
                <div className="flex justify-center py-1">
                    <div className="h-7 bg-gray-50 border border-gray-100 rounded-full w-[120px]" />
                </div>

                {/* Metadata Rows Skeleton */}
                <div className="space-y-4 pt-1">
                    <div className="flex justify-between items-center">
                        <div className="h-2 bg-gray-100/60 rounded w-16" />
                        <div className="h-2 bg-gray-100/60 rounded w-20" />
                    </div>
                    <div className="h-[1px] bg-gray-50" />
                    <div className="flex justify-between items-center">
                        <div className="h-2 bg-gray-100/60 rounded w-20" />
                        <div className="h-2 bg-gray-100/60 rounded w-16" />
                    </div>
                </div>

                {/* Action Link Skeleton */}
                <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
                    <div className="h-2 bg-gray-50 rounded w-24" />
                    <div className="w-3 h-3 bg-gray-50 rounded" />
                </div>
            </div>
        </div>
    );
}

export default LoadingSkeleton;

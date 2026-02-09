'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/Header'
import { BarChart, TrendingUp, Search, ArrowUpRight } from 'lucide-react'
import { Table } from '@/components/ui/Table'

interface AnalyticsData {
    totalCampaigns: number;
    activeCampaigns: number;
    totalSearches: number;
    topSearches: Array<{ id: string; query: string; count: number }>;
    missingSearches: Array<{ id: string; query: string; searchCount: number }>;
}

export default function AdminDashboard() {
    const [password, setPassword] = useState('')
    const [authenticated, setAuthenticated] = useState(false)
    const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
    const [loading, setLoading] = useState(false)

    const handleLogin = async (e?: React.FormEvent) => {
        if (e) e.preventDefault()
        setLoading(true)

        try {
            const res = await fetch('/api/admin/analytics', {
                headers: { Authorization: `Bearer ${password}` }
            })

            if (res.ok) {
                const data = await res.json()
                setAnalytics(data)
                setAuthenticated(true)
                localStorage.setItem('admin_token', password)
            } else {
                alert('Yanlış şifre!')
            }
        } catch {
            alert('Hata oluştu')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const token = localStorage.getItem('admin_token')
        if (token) {
            const checkSession = async () => {
                setLoading(true)
                try {
                    const res = await fetch('/api/admin/analytics', {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                    if (res.ok) {
                        const data = await res.json()
                        setAnalytics(data)
                        setAuthenticated(true)
                    } else {
                        localStorage.removeItem('admin_token')
                    }
                } catch {
                    localStorage.removeItem('admin_token')
                } finally {
                    setLoading(false)
                }
            }
            // Defer execution to avoid synchronous setState warning in effect
            const timer = setTimeout(() => {
                setPassword(token)
                checkSession()
            }, 0)
            return () => clearTimeout(timer)
        }
    }, [])

    if (!authenticated) {
        return (
            <>
                <Header />
                <div className="min-h-screen flex items-center justify-center bg-gray-50">
                    <form onSubmit={handleLogin} className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 max-w-md w-full">
                        <h1 className="text-2xl font-bold mb-6 text-gray-900">Admin Girişi</h1>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Şifre"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg mb-4 focus:outline-none focus:bg-white focus:ring-2 focus:ring-gray-200 transition-all"
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gray-900 text-white py-3 rounded-lg hover:bg-gray-800 disabled:opacity-50 font-medium transition-colors"
                        >
                            {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
                        </button>
                    </form>
                </div>
            </>
        )
    }

    if (!analytics) return <div className="min-h-screen flex items-center justify-center bg-gray-50">Yükleniyor...</div>

    const topSearchesColumns = [
        { header: 'Arama Terimi', accessorKey: 'query' as const, className: 'font-medium text-gray-900' },
        { header: 'Arama Sayısı', accessorKey: 'count' as const, className: 'text-gray-500' },
    ]

    const missingSearchesColumns = [
        { header: 'Aranan Terim', accessorKey: 'query' as const, className: 'font-medium text-gray-900' },
        { header: 'Tekrar', accessorKey: 'searchCount' as const, className: 'text-gray-500' },
    ]

    return (
        <div className="min-h-screen bg-gray-50/50">
            <Header />
            <main className="max-w-[1280px] mx-auto px-6 py-12">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Dashboard Overview</h1>
                    <div className="flex gap-2">
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium border border-green-200">System Online</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <StatCard
                        title="Toplam Kampanya"
                        value={analytics.totalCampaigns}
                        icon={<BarChart className="w-5 h-5 text-gray-500" />}
                    />
                    <StatCard
                        title="Aktif Kampanya"
                        value={analytics.activeCampaigns}
                        icon={<TrendingUp className="w-5 h-5 text-green-500" />}
                        trend="+12% bu hafta"
                    />
                    <StatCard
                        title="Toplam Arama"
                        value={analytics.totalSearches}
                        icon={<Search className="w-5 h-5 text-purple-500" />}
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <Table
                            title="En Çok Arananlar"
                            description="Son 30 günde en çok aranan terimler."
                            data={analytics.topSearches}
                            columns={topSearchesColumns}
                        />
                    </div>

                    <div className="space-y-4">
                        <Table
                            title="Bulunamayan Aramalar"
                            description="Kullanıcıların arayıp sonuç bulamadığı terimler."
                            data={analytics.missingSearches}
                            columns={missingSearchesColumns}
                        />
                    </div>
                </div>
            </main>
        </div>
    )
}

function StatCard({ title, value, icon, trend }: { title: string, value: string | number, icon: React.ReactNode, trend?: string }) {
    return (
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.05)] transition-shadow">
            <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-medium text-gray-500">{title}</p>
                {icon}
            </div>
            <div className="flex items-end justify-between">
                <h3 className="text-3xl font-bold text-gray-900 tracking-tight">{value}</h3>
                {trend && (
                    <div className="flex items-center text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-md">
                        {trend} <ArrowUpRight className="w-3 h-3 ml-1" />
                    </div>
                )}
            </div>
        </div>
    )
}

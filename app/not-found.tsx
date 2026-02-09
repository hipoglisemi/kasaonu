import Link from 'next/link'
import { Home } from 'lucide-react'

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 to-indigo-100">
            <div className="text-center">
                <h1 className="text-9xl font-bold text-rose-600 mb-4">404</h1>
                <p className="text-2xl text-gray-700 mb-8">Sayfa bulunamadı</p>
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 bg-rose-600 text-white px-6 py-3 rounded-lg hover:bg-rose-700 transition-colors"
                >
                    <Home className="w-5 h-5" />
                    Ana Sayfaya Dön
                </Link>
            </div>
        </div>
    )
}

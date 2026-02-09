'use client'

import { useEffect } from 'react'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Bir hata oluştu!</h2>
                <button
                    onClick={reset}
                    className="bg-rose-600 text-white px-6 py-3 rounded-lg hover:bg-rose-700"
                >
                    Tekrar Dene
                </button>
            </div>
        </div>
    )
}

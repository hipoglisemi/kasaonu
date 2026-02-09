import { Search } from 'lucide-react'

interface EmptyStateProps {
    query?: string
    message?: string
}

export function EmptyState({ query, message }: EmptyStateProps) {
    return (
        <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {query ? `"${query}" için sonuç bulunamadı` : 'Sonuç bulunamadı'}
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
                {message || 'Başka bir arama yapmayı deneyin veya farklı kategorilere göz atın.'}
            </p>
        </div>
    )
}

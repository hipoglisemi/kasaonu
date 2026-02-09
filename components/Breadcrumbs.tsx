import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

interface BreadcrumbItem {
    label: string
    href?: string
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[]
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
    return (
        <nav className="flex items-center space-x-2 text-sm mb-6">
            <Link href="/" className="text-gray-500 hover:text-gray-700">
                Ana Sayfa
            </Link>
            {items.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                    {item.href ? (
                        <Link href={item.href} className="text-gray-500 hover:text-gray-700">
                            {item.label}
                        </Link>
                    ) : (
                        <span className="text-gray-900 font-medium">{item.label}</span>
                    )}
                </div>
            ))}
        </nav>
    )
}

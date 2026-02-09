import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { generateSEO } from '@/lib/seo'
import { Mail } from 'lucide-react'

export const metadata = generateSEO({
    title: 'İletişim',
    description: 'Bizimle iletişime geçin.',
    path: '/iletisim',
})

export default function ContactPage() {
    return (
        <>
            <Header />
            <main className="max-w-4xl mx-auto px-4 py-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-6">İletişim</h1>

                <div className="bg-white rounded-2xl shadow-lg p-8">
                    <div className="flex items-start gap-4 mb-6">
                        <div className="p-3 bg-rose-100 rounded-lg">
                            <Mail className="w-6 h-6 text-rose-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold mb-2">E-posta</h2>
                            <p className="text-gray-600">
                                Sorularınız ve önerileriniz için:
                            </p>
                            <a
                                href="mailto:iletisim@kasaonu.com"
                                className="text-rose-600 hover:text-rose-700 font-medium"
                            >
                                iletisim@kasaonu.com
                            </a>
                        </div>
                    </div>

                    <div className="border-t pt-6 mt-6">
                        <h3 className="font-semibold mb-2">Sıkça Sorulan Sorular</h3>
                        <ul className="space-y-2 text-gray-700">
                            <li>• Kampanya bilgileri güncel mi?</li>
                            <li>• Hangi bankalarla çalışıyorsunuz?</li>
                            <li>• Yeni kampanya eklemek için nasıl başvurabilirim?</li>
                        </ul>
                        <p className="text-gray-600 mt-4">
                            Tüm sorularınız için bize e-posta gönderebilirsiniz.
                        </p>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    )
}

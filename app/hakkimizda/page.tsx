import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { generateSEO } from '@/lib/seo'

export const metadata = generateSEO({
    title: 'Hakkımızda',
    description: 'KasaÖnü hakkında bilgi edinin.',
    path: '/hakkimizda',
})

export default function AboutPage() {
    return (
        <>
            <Header />
            <main className="max-w-4xl mx-auto px-4 py-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-6">Hakkımızda</h1>

                <div className="prose prose-lg max-w-none">
                    <p className="text-xl text-gray-600 mb-6">
                        KasaÖnü, kredi kartı kampanyalarını karşılaştırmanın en kolay yoludur.
                    </p>

                    <h2 className="text-2xl font-bold mt-8 mb-4">Misyonumuz</h2>
                    <p className="text-gray-700 mb-4">
                        Tüketicilerin alışverişlerinde en avantajlı kredi kartını kullanmalarını sağlamak
                        ve kart kampanyalarından maksimum fayda elde etmelerini kolaylaştırmak.
                    </p>

                    <h2 className="text-2xl font-bold mt-8 mb-4">Nasıl Çalışır?</h2>
                    <p className="text-gray-700 mb-4">
                        Binlerce kredi kartı kampanyasını analiz ediyor, marka ve kategori bazında
                        en avantajlı seçenekleri size sunuyoruz. Aradığınız markayı girin,
                        hangi kartla ne kadar kazanç elde edeceğinizi anında görün.
                    </p>

                    <h2 className="text-2xl font-bold mt-8 mb-4">İletişim</h2>
                    <p className="text-gray-700">
                        Sorularınız için <a href="/iletisim" className="text-rose-600 hover:text-rose-700">iletişim sayfamızı</a> ziyaret edebilirsiniz.
                    </p>
                </div>
            </main>
            <Footer />
        </>
    )
}

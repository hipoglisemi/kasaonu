import Link from 'next/link';
import { Facebook, Twitter, Instagram, Mail, MapPin, Globe, Heart } from 'lucide-react';

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-50 border-t border-gray-200 pt-16 pb-32 md:pb-12 mt-auto">
            <div className="max-w-[1120px] mx-auto px-6">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-12 pb-16">
                    {/* Brand & Description */}
                    <div className="col-span-2 md:col-span-1 flex flex-col gap-6">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="bg-rose-100/50 p-2 rounded-lg group-hover:bg-rose-100 transition-colors">
                                <Heart className="h-5 w-5 fill-rose-600 text-rose-600" />
                            </div>
                            <span className="text-xl font-bold text-gray-900 tracking-tight">KasaÖnü</span>
                        </Link>
                        <p className="text-sm leading-relaxed text-gray-500">
                            En güncel banka ve marka kampanyalarını profesyonelce keşfedin.
                        </p>
                        <div className="flex gap-4">
                            <Facebook size={18} className="text-gray-400 cursor-pointer hover:text-rose-600 transition-colors" />
                            <Twitter size={18} className="text-gray-400 cursor-pointer hover:text-rose-600 transition-colors" />
                            <Instagram size={18} className="text-gray-400 cursor-pointer hover:text-rose-600 transition-colors" />
                        </div>
                    </div>

                    {/* Columns */}
                    <div className="flex flex-col gap-4">
                        <h4 className="text-sm font-semibold text-gray-900">Bankalar</h4>
                        <ul className="flex flex-col gap-3 text-sm text-gray-500">
                            <li><Link href="#" className="hover:text-rose-600 transition-colors">Garanti BBVA</Link></li>
                            <li><Link href="#" className="hover:text-rose-600 transition-colors">Yapı Kredi</Link></li>
                            <li><Link href="#" className="hover:text-rose-600 transition-colors">Akbank</Link></li>
                            <li><Link href="#" className="hover:text-rose-600 transition-colors">İş Bankası</Link></li>
                        </ul>
                    </div>

                    <div className="flex flex-col gap-4">
                        <h4 className="text-sm font-semibold text-gray-900">Kategoriler</h4>
                        <ul className="flex flex-col gap-3 text-sm text-gray-500">
                            <li><Link href="/kategori/market-gida" className="hover:text-rose-600 transition-colors">Market & Gıda</Link></li>
                            <li><Link href="/kategori/akaryakit" className="hover:text-rose-600 transition-colors">Akaryakıt</Link></li>
                            <li><Link href="/kategori/giyim-aksesuar" className="hover:text-rose-600 transition-colors">Giyim & Aksesuar</Link></li>
                            <li><Link href="/kategori/restoran-kafe" className="hover:text-rose-600 transition-colors">Restoran & Kafe</Link></li>
                        </ul>
                    </div>

                    <div className="flex flex-col gap-4">
                        <h4 className="text-sm font-semibold text-gray-900">Kurumsal</h4>
                        <ul className="flex flex-col gap-3 text-sm text-gray-500">
                            <li><Link href="/hakkimizda" className="hover:text-rose-600 transition-colors">Hakkımızda</Link></li>
                            <li><Link href="#" className="hover:text-rose-600 transition-colors">Kullanım Koşulları</Link></li>
                            <li><Link href="#" className="hover:text-rose-600 transition-colors">Gizlilik Politikası</Link></li>
                            <li><Link href="#" className="hover:text-rose-600 transition-colors">KVKK</Link></li>
                        </ul>
                    </div>

                    <div className="flex flex-col gap-4">
                        <h4 className="text-sm font-semibold text-gray-900">İletişim</h4>
                        <ul className="flex flex-col gap-3 text-sm text-gray-500">
                            <li className="flex gap-2 items-center">
                                <MapPin size={16} className="shrink-0 text-gray-400" />
                                <span>İstanbul, Türkiye</span>
                            </li>
                            <li className="flex gap-2">
                                <Link href="/iletisim" className="flex gap-2 items-center hover:text-rose-600 transition-colors">
                                    <Mail size={16} className="shrink-0 text-gray-400" />
                                    <span>destek@kasaonu.com</span>
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-2 text-xs text-gray-500">
                        <span>© {currentYear} KasaÖnü</span>
                        <span>·</span>
                        <span>Tüm hakları saklıdır</span>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 text-xs font-medium text-gray-600">
                            <Globe size={14} /> Türkçe (TR)
                        </div>
                        <div className="flex items-center gap-2 text-xs font-medium text-gray-600">
                            ₺ TRY
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

import Link from 'next/link';

// SVG Icon
const PlaneIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
  </svg>
);

interface FooterProps {
  onDestinationClick?: (destination: string) => void;
}

export default function Footer({ onDestinationClick }: FooterProps) {
  const handleDestinationClick = (destination: string) => {
    if (onDestinationClick) {
      onDestinationClick(destination);
    }
  };

  return (
    <footer className="mt-auto relative z-10 border-t border-white/10 bg-[#040515]/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          
          {/* Brand column (2 spans) */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-cyan-400 flex items-center justify-center text-white shadow-md">
                <PlaneIcon />
              </div>
              <span className="text-xl font-black tracking-tight text-white">
                Kelana<span className="text-purple-400">AI</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              KelanaAI adalah platform asisten perjalanan pintar berbasis Artificial Intelligence yang mempermudah perencanaan itinerari, efisiensi rute, dan estimasi anggaran liburan.
            </p>
            <div className="flex items-center gap-3 text-slate-400 text-xs mt-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/5 border border-white/10">
                ⚡ Powered by AI Engine
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/5 border border-white/10">
                🇮🇩 Indonesia
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Navigasi Utama
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-400">
              <li><Link href="/" className="hover:text-purple-400 transition-colors">Beranda</Link></li>
              <li><Link href="/trips" className="hover:text-purple-400 transition-colors">My Trips</Link></li>
              <li><a href="/#planner-form" className="hover:text-purple-400 transition-colors">Buat Itinerari</a></li>
              <li><a href="/#destinasi" className="hover:text-purple-400 transition-colors">Destinasi Populer</a></li>
              <li><a href="/#fitur" className="hover:text-purple-400 transition-colors">Fitur Unggulan</a></li>
            </ul>
          </div>

          {/* Popular Destinations Links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Destinasi Favorit
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-400">
              <li>
                <a 
                  href="/#planner-form" 
                  onClick={() => handleDestinationClick("Tokyo, Kyoto, Osaka")} 
                  className="hover:text-purple-400 transition-colors"
                >
                  Tokyo & Kyoto
                </a>
              </li>
              <li>
                <a 
                  href="/#planner-form" 
                  onClick={() => handleDestinationClick("Bali, Nusa Penida, Ubud")} 
                  className="hover:text-purple-400 transition-colors"
                >
                  Bali & Lombok
                </a>
              </li>
              <li>
                <a 
                  href="/#planner-form" 
                  onClick={() => handleDestinationClick("Zurich, Interlaken, Zermatt")} 
                  className="hover:text-purple-400 transition-colors"
                >
                  Swiss Alps
                </a>
              </li>
              <li>
                <a 
                  href="/#planner-form" 
                  onClick={() => handleDestinationClick("Paris, Rome, Florence")} 
                  className="hover:text-purple-400 transition-colors"
                >
                  Paris & Roma
                </a>
              </li>
            </ul>
          </div>

          {/* Legal & Social Links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Informasi & Bantuan
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-400">
              <li><a href="#" className="hover:text-purple-400 transition-colors">Tentang Kami</a></li>
              <li><a href="#" className="hover:text-purple-400 transition-colors">Kebijakan Privasi</a></li>
              <li><a href="#" className="hover:text-purple-400 transition-colors">Syarat & Ketentuan</a></li>
              <li><a href="#" className="hover:text-purple-400 transition-colors">Pusat Bantuan (FAQ)</a></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar with Copyright */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 KelanaAI. Seluruh hak cipta dilindungi undang-undang.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-slate-300 transition-colors">Syarat Penggunaan</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Privasi</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Dokumentasi</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

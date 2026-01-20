
import React, { useState, useRef, useEffect } from 'react';
import { Search, Download, Share2, Loader2, Calendar, MapPin, AlertCircle, Moon, Facebook, FileText } from 'lucide-react';
import { ImsakiaData, LocationState } from './types';
import { getImsakiaSchedule } from './services/geminiService';
import ImsakiaCard from './components/ImsakiaCard';
import { toPng } from 'html-to-image';

const App: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [downloading, setDownloading] = useState<boolean>(false);
  const [sharing, setSharing] = useState<boolean>(false);
  const [printing, setPrinting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<LocationState>({ country: '', city: '' });
  const [imsakiaData, setImsakiaData] = useState<ImsakiaData | null>(null);
  const imsakiaRef = useRef<HTMLDivElement>(null);

  // مراقبة حدث الطباعة لإغلاق وضع الطباعة تلقائياً
  useEffect(() => {
    const handleAfterPrint = () => setPrinting(false);
    window.addEventListener('afterprint', handleAfterPrint);
    return () => window.removeEventListener('afterprint', handleAfterPrint);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!location.country || !location.city) {
      setError('يرجى إدخال الدولة والمدينة أولاً');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await getImsakiaSchedule(location.country, location.city);
      setImsakiaData(data);
    } catch (err: any) {
      setError(err.message || 'حدث خطأ غير متوقع');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    if (!imsakiaData) return;
    setPrinting(true);
    // تأخير لضمان تحديث الـ DOM وتطبيق الـ CSS الخاص بالطباعة
    setTimeout(() => {
      window.print();
    }, 500);
  };

  const handleDownload = async () => {
    if (!imsakiaRef.current || !imsakiaData) return;
    setDownloading(true);
    try {
      const dataUrl = await toPng(imsakiaRef.current, {
        cacheBust: true,
        quality: 1,
        pixelRatio: 3, 
      });
      const link = document.createElement('a');
      link.download = `إمساكية_رمضان_2026_${imsakiaData.city}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      setError('فشل تحميل الصورة.');
    } finally {
      setDownloading(false);
    }
  };

  const handleShare = async () => {
    if (!imsakiaRef.current || !imsakiaData) return;
    setSharing(true);
    try {
      const dataUrl = await toPng(imsakiaRef.current, {
        cacheBust: true,
        quality: 0.9,
        pixelRatio: 2,
      });
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      const file = new File([blob], `Imsakia_${imsakiaData.city}.png`, { type: 'image/png' });
      if (navigator.share) {
        await navigator.share({
          files: [file],
          title: `إمساكية رمضان 2026 - ${imsakiaData.city}`,
        });
      } else {
        setError('المشاركة غير مدعومة في متصفحك.');
      }
    } catch (err) {
      setError('حدث خطأ أثناء المشاركة.');
    } finally {
      setSharing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-8 px-4 font-tajawal rtl text-right relative overflow-x-hidden">
      <div className="absolute top-20 -left-20 w-64 h-64 bg-amber-500/10 blur-[100px] rounded-full no-print" />
      <div className="absolute bottom-20 -right-20 w-64 h-64 bg-emerald-500/10 blur-[100px] rounded-full no-print" />
      
      <header className="w-full max-w-4xl text-center mb-10 no-print relative z-10">
        <div className="flex justify-center mb-6">
          <div className="bg-amber-400 p-4 rounded-full shadow-lg">
            <Moon className="text-emerald-950 w-10 h-10" fill="currentColor" />
          </div>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-amber-400 mb-3 font-amiri drop-shadow-lg">
          إمساكية رمضان المبارك ٢٠٢٦
        </h1>
        <p className="text-amber-100/70 text-lg md:text-xl font-light">
          أوقات صلاة دقيقة لشهر رمضان كامل (30 يوماً)
        </p>
      </header>

      <section className="w-full max-w-2xl bg-emerald-900/30 backdrop-blur-2xl p-8 rounded-[2.5rem] border border-amber-400/20 shadow-2xl mb-12 no-print relative z-10">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative">
              <label className="block text-amber-200/80 text-sm mb-2 mr-1">الدولة</label>
              <MapPin className="absolute right-3 top-11 text-amber-400 w-5 h-5" />
              <input
                type="text"
                placeholder="مثال: مصر"
                className="w-full bg-emerald-950/60 border-2 border-amber-400/10 rounded-2xl py-4 pr-11 pl-4 text-white focus:outline-none focus:border-amber-400/50"
                value={location.country}
                onChange={(e) => setLocation({ ...location, country: e.target.value })}
              />
            </div>
            <div className="relative">
              <label className="block text-amber-200/80 text-sm mb-2 mr-1">المدينة</label>
              <Search className="absolute right-3 top-11 text-amber-400 w-5 h-5" />
              <input
                type="text"
                placeholder="مثال: القاهرة"
                className="w-full bg-emerald-950/60 border-2 border-amber-400/10 rounded-2xl py-4 pr-11 pl-4 text-white focus:outline-none focus:border-amber-400/50"
                value={location.city}
                onChange={(e) => setLocation({ ...location, city: e.target.value })}
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-200 bg-red-900/40 p-4 rounded-2xl text-sm no-print">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-5 rounded-2xl font-bold text-xl flex items-center justify-center gap-3 bg-gradient-to-br from-amber-500 to-amber-600 text-emerald-950 hover:shadow-xl active:scale-95 transition-all no-print"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Calendar size={24} />}
            {loading ? 'جاري التحميل...' : 'عرض إمساكية الشهر الكامل'}
          </button>
        </form>
      </section>

      {imsakiaData && (
        <div className="w-full flex flex-col items-center relative z-10">
          <div className="w-full flex flex-wrap justify-center no-print gap-4 mb-8">
            <button 
              onClick={handlePrint}
              className="flex items-center gap-2 bg-white/10 hover:bg-amber-400 hover:text-emerald-950 border border-amber-400/30 py-3 px-6 rounded-2xl transition-all font-bold"
            >
              <FileText size={20} />
              حفظ كـ PDF (جاهز للطباعة)
            </button>
            <button 
              onClick={handleDownload}
              disabled={downloading}
              className="flex items-center gap-2 bg-amber-400 text-emerald-950 py-3 px-6 rounded-2xl font-bold hover:bg-amber-300"
            >
              {downloading ? <Loader2 size={20} className="animate-spin" /> : <Download size={20} />}
              تحميل كصورة عالية الدقة
            </button>
            <button 
              onClick={handleShare}
              className="flex items-center gap-2 bg-white/10 hover:bg-emerald-500 py-3 px-6 rounded-2xl font-bold transition-all"
            >
              <Share2 size={20} />
              مشاركة
            </button>
          </div>

          <div className={`print-area-wrapper flex justify-center w-full ${printing ? 'fixed inset-0 bg-[#022c22] z-[99999]' : ''}`}>
            <div className="print-area shadow-2xl mb-24 max-w-full">
              <div ref={imsakiaRef} className="p-1 bg-amber-400/10 rounded-sm">
                <ImsakiaCard data={imsakiaData} />
              </div>
            </div>
          </div>
        </div>
      )}

      <footer className="mt-auto py-8 text-center text-amber-100/30 no-print border-t border-amber-400/10 w-full">
        <p className="font-amiri text-lg mb-2">إعداد وتصميم: بوزيد دحو</p>
        <p className="text-xs">© ٢٠٢٦ جميع الحقوق محفوظة</p>
      </footer>
    </div>
  );
};

export default App;
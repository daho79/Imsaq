
import React from 'react';
import { ImsakiaData } from '../types';
import OrnamentalBorder from './OrnamentalBorder';
import { MapPin } from 'lucide-react';

interface ImsakiaCardProps {
  data: ImsakiaData;
}

const ImsakiaCard: React.FC<ImsakiaCardProps> = ({ data }) => {
  const headers = ["رمضان", "التاريخ", "الإمساك", "الفجر", "الشروق", "الظهر", "العصر", "المغرب", "العشاء"];

  return (
    <div 
      className="relative w-full max-w-[800px] aspect-[1/1.414] bg-emerald-950 text-white p-4 overflow-hidden rounded-sm border-[8px] border-double border-amber-400/30 flex flex-col"
      style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}
    >
      <OrnamentalBorder />

      {/* Header */}
      <div className="relative z-10 text-center mb-3 mt-4">
        <h1 className="text-2xl md:text-3xl font-amiri font-bold text-amber-400 mb-1 drop-shadow-md">
          إمساكية رمضان المبارك لعام ١٤٤٧ هـ
        </h1>
        <div className="flex items-center justify-center gap-2 bg-emerald-900/50 py-1 px-4 rounded-full border border-amber-400/20 inline-flex mx-auto">
          <MapPin size={14} className="text-amber-400" />
          <span className="text-sm font-bold text-amber-50">{data.city}، {data.country}</span>
        </div>
      </div>

      {/* Table */}
      <div className="relative z-10 flex-1 rounded-lg border border-amber-400/20 bg-emerald-950/40 backdrop-blur-sm overflow-hidden">
        <table className="w-full text-center border-collapse table-fixed h-full">
          <thead>
            <tr className="bg-amber-500 text-emerald-950 font-bold text-[8px] md:text-[11px] uppercase">
              {headers.map((h, i) => (
                <th key={i} className="py-2 border-l border-amber-600/30 last:border-l-0">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="text-[9px] md:text-[11px]">
            {data.schedule.slice(0, 30).map((row, idx) => (
              <tr 
                key={idx} 
                className={`border-b border-emerald-900/30 h-[3.1%] ${row.isFriday ? 'bg-amber-400/10 font-bold' : 'bg-emerald-900/10'}`}
              >
                <td className="py-0.5 border-l border-emerald-900/20 text-amber-400">{row.hijriDay}</td>
                <td className="py-0.5 border-l border-emerald-900/20 text-white/70">
                  {new Date(row.gregorianDate).toLocaleDateString('ar-SA', { day: 'numeric', month: 'short' })}
                </td>
                <td className="py-0.5 border-l border-emerald-900/20 font-bold text-amber-200">{row.imsak}</td>
                <td className="py-0.5 border-l border-emerald-900/20">{row.fajr}</td>
                <td className="py-0.5 border-l border-emerald-900/20 opacity-50">{row.sunrise}</td>
                <td className="py-0.5 border-l border-emerald-900/20">{row.dhuhr}</td>
                <td className="py-0.5 border-l border-emerald-900/20">{row.asr}</td>
                <td className="py-0.5 border-l border-emerald-900/20 font-bold text-amber-400 text-[11px] md:text-[13px]">{row.maghrib}</td>
                <td className="py-0.5 border-l border-emerald-900/20">{row.isha}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="relative z-10 mt-2 text-center border-t border-amber-400/20 pt-2">
        <p className="font-amiri text-xs text-amber-200/70 mb-1">صُمم خصيصاً بمناسبة الشهر الكريم ٢٠٢٦ م</p>
        <div className="flex justify-between items-center text-[7px] md:text-[9px] text-white/30">
          <span>بوزيد دحو - bouzid.daho.5</span>
          <span className="font-bold tracking-widest text-amber-500/20">RAMADAN KAREEM</span>
        </div>
      </div>
    </div>
  );
};

export default ImsakiaCard;
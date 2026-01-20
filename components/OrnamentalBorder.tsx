
import React from 'react';

const OrnamentalBorder: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none z-0">
      {/* Main Outer Frame */}
      <div className="absolute inset-4 border-2 border-amber-400/30 rounded-sm" />
      <div className="absolute inset-6 border border-amber-400/10 rounded-sm" />
      
      {/* Corners with Islamic Geometric Patterns */}
      {[
        "top-0 left-0",
        "top-0 right-0 rotate-90",
        "bottom-0 right-0 rotate-180",
        "bottom-0 left-0 -rotate-90"
      ].map((pos, i) => (
        <div key={i} className={`absolute ${pos} w-32 h-32 text-amber-500/40`}>
          <svg viewBox="0 0 100 100" fill="currentColor">
            <path d="M0 0 L30 0 C30 10 20 20 10 20 C10 30 0 30 0 30 Z" opacity="0.6"/>
            <path d="M0 0 L100 0 L100 5 L5 5 L5 100 L0 100 Z" />
            <circle cx="15" cy="15" r="3" />
            <path d="M40 0 Q50 20 60 0" fill="none" stroke="currentColor" strokeWidth="1" />
            <path d="M0 40 Q20 50 0 60" fill="none" stroke="currentColor" strokeWidth="1" />
          </svg>
        </div>
      ))}

      {/* Repeating Border Pattern Side (Top/Bottom) */}
      <div className="absolute top-0 left-32 right-32 h-8 opacity-20 flex justify-around overflow-hidden">
        {Array.from({ length: 10 }).map((_, i) => (
          <svg key={i} className="w-8 h-8 text-amber-400" viewBox="0 0 24 24" fill="currentColor">
             <path d="M12 2L14.5 9H21L15.5 13.5L18 21L12 16.5L6 21L8.5 13.5L3 9H9.5L12 2Z" />
          </svg>
        ))}
      </div>
      <div className="absolute bottom-0 left-32 right-32 h-8 opacity-20 flex justify-around overflow-hidden rotate-180">
        {Array.from({ length: 10 }).map((_, i) => (
          <svg key={i} className="w-8 h-8 text-amber-400" viewBox="0 0 24 24" fill="currentColor">
             <path d="M12 2L14.5 9H21L15.5 13.5L18 21L12 16.5L6 21L8.5 13.5L3 9H9.5L12 2Z" />
          </svg>
        ))}
      </div>

      {/* Arabesque Background Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l15 30-15 30-15-30z' fill='%23fbbf24' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E")`,
          backgroundSize: '30px 30px'
        }}
      />
    </div>
  );
};

export default OrnamentalBorder;

import React from 'react';
import { Calendar, Award, Sparkles, BookOpen, Star } from 'lucide-react';
import { KISHORE_BIO } from '../data/playlist';

export default function BiographyTimeline() {
  return (
    <section id="journey" className="relative z-10 py-24 px-4 sm:px-8 lg:px-16 max-w-7xl mx-auto space-y-16">
      
      {/* HEADER */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#D49A32]/20 border border-[#D49A32]/30 text-xs font-mono text-[#D49A32]">
          <BookOpen className="w-3.5 h-3.5" />
          <span>SECTION 2 • BIOGRAPHY & MILESTONES</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-black font-['Playfair_Display'] text-[#F5E6C8]">
          Journey of a <span className="gold-gradient-text">Legend</span>
        </h2>
        <p className="text-sm text-stone-300">
          From Khandwa, Madhya Pradesh to becoming the legendary voice of Indian cinema. Singer, actor, composer, director, and eccentric genius.
        </p>
      </div>

      {/* QUICK METRICS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-2xl border border-[#F5E6C8]/15 space-y-2 text-center">
          <div className="w-12 h-12 rounded-full bg-[#D49A32]/20 text-[#D49A32] flex items-center justify-center mx-auto mb-2">
            <Award className="w-6 h-6" />
          </div>
          <h4 className="text-2xl font-bold text-[#F5E6C8] font-['Playfair_Display']">8 Filmfare Awards</h4>
          <p className="text-xs text-stone-300">All-time record holder for Best Male Playback Singer</p>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-[#F5E6C8]/15 space-y-2 text-center">
          <div className="w-12 h-12 rounded-full bg-[#C87925]/20 text-[#C87925] flex items-center justify-center mx-auto mb-2">
            <Star className="w-6 h-6" />
          </div>
          <h4 className="text-2xl font-bold text-[#F5E6C8] font-['Playfair_Display']">2,900+ Melodies</h4>
          <p className="text-xs text-stone-300">Sung across Hindi, Bengali, Marathi, Gujarati & Kannada</p>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-[#F5E6C8]/15 space-y-2 text-center">
          <div className="w-12 h-12 rounded-full bg-[#155E63]/20 text-[#155E63] flex items-center justify-center mx-auto mb-2">
            <Sparkles className="w-6 h-6" />
          </div>
          <h4 className="text-2xl font-bold text-[#F5E6C8] font-['Playfair_Display']">Unmatched Versatility</h4>
          <p className="text-xs text-stone-300">Master of yodeling, scatting, comedy, and deep soulful gazals</p>
        </div>
      </div>

      {/* VERTICAL TIMELINE */}
      <div className="relative border-l-2 border-[#D49A32]/40 ml-4 sm:ml-32 space-y-12 py-4">
        {KISHORE_BIO.milestones.map((m, idx) => (
          <div key={m.year} className="relative pl-8 group">
            
            {/* Timeline Dot */}
            <div className="absolute -left-[11px] top-1.5 w-5 h-5 rounded-full bg-[#111] border-2 border-[#D49A32] group-hover:bg-[#D49A32] group-hover:scale-125 transition-all"></div>
            
            {/* Year Badge on Left for Desktop */}
            <div className="hidden sm:block absolute -left-32 top-0.5 w-24 text-right">
              <span className="text-xl font-bold font-mono text-[#D49A32]">
                {m.year}
              </span>
            </div>

            {/* Content Card */}
            <div className="glass-panel p-6 rounded-2xl border border-[#F5E6C8]/15 group-hover:border-[#D49A32]/50 transition-all space-y-2">
              <div className="sm:hidden text-lg font-bold font-mono text-[#D49A32] mb-1">
                {m.year}
              </div>
              <p className="text-sm sm:text-base text-[#F5E6C8] leading-relaxed">
                {m.event}
              </p>
            </div>

          </div>
        ))}
      </div>

    </section>
  );
}

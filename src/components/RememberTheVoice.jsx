import React, { useState } from 'react';
import { Heart, Send, Sparkles, Quote, Award, Radio } from 'lucide-react';

export default function RememberTheVoice({ onShowToast }) {
  const [tributeText, setTributeText] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [submittedMessage, setSubmittedMessage] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!tributeText.trim()) return;

    setSubmittedMessage({
      text: tributeText,
      author: authorName.trim() || 'Anonymous Fan',
      time: 'Just now'
    });

    onShowToast('❤️ Tribute submitted successfully!');
    setTributeText('');
    setAuthorName('');
  };

  const quotes = [
    {
      quote: "Kishore was a force of nature. He didn't just sing a song; he lived it, breathed it, and infused it with his infectious soul.",
      author: "R.D. Burman (Pancham Da)"
    },
    {
      quote: "He had a natural voice that required no formal classical training to reach the hearts of millions. There will never be another Kishore.",
      author: "Lata Mangeshkar"
    },
    {
      quote: "70% of my stardom on screen belongs to Kishore Kumar's voice. When he sang for me, it felt like my own soul was singing.",
      author: "Rajesh Khanna"
    }
  ];

  return (
    <section id="tribute" className="relative z-10 py-24 px-4 sm:px-8 lg:px-16 max-w-7xl mx-auto space-y-16">
      
      {/* HEADER */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#D49A32]/20 border border-[#D49A32]/30 text-xs font-mono text-[#D49A32]">
          <Heart className="w-3.5 h-3.5 fill-current" />
          <span>SECTION 4 • ETERNAL TRIBUTE</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-black font-['Playfair_Display'] text-[#F5E6C8]">
          Remember the <span className="gold-gradient-text">Voice</span>
        </h2>
        <p className="text-sm text-stone-300">
          "Songs fade into silence, but true voices resonate through eternity." Leave your personal memory or tribute for Kishore Da.
        </p>
      </div>

      {/* LEGEND QUOTES CAROUSEL / GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {quotes.map((q, idx) => (
          <div
            key={idx}
            className="glass-panel p-6 rounded-2xl border border-[#F5E6C8]/15 space-y-4 relative overflow-hidden flex flex-col justify-between"
          >
            <Quote className="w-8 h-8 text-[#D49A32]/40" />
            <p className="text-sm italic text-[#F5E6C8] leading-relaxed">
              "{q.quote}"
            </p>
            <div className="pt-3 border-t border-[#F5E6C8]/10 text-xs font-bold text-[#D49A32]">
              — {q.author}
            </div>
          </div>
        ))}
      </div>

      {/* TRIBUTE FORM CONTAINER */}
      <div className="max-w-2xl mx-auto glass-panel p-8 rounded-3xl border border-[#D49A32]/40 shadow-2xl space-y-6">
        <div className="space-y-1 text-center">
          <h3 className="text-2xl font-bold font-['Playfair_Display'] text-[#F5E6C8]">
            Leave a Fan Tribute
          </h3>
          <p className="text-xs text-stone-300">
            Share what Kishore Kumar's music means in your life.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-[#D49A32] mb-1">YOUR NAME</label>
            <input
              type="text"
              placeholder="e.g. Rahul Sharma"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#111111]/80 border border-[#F5E6C8]/20 text-sm text-[#F5E6C8] focus:outline-none focus:border-[#D49A32]"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-[#D49A32] mb-1">YOUR MEMORY / FAVORITE SONG TRIBUTE</label>
            <textarea
              rows="3"
              placeholder="Write your emotional message or favorite memory listening to Kishore Da..."
              value={tributeText}
              onChange={(e) => setTributeText(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#111111]/80 border border-[#F5E6C8]/20 text-sm text-[#F5E6C8] focus:outline-none focus:border-[#D49A32]"
              required
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#D49A32] to-[#C87925] text-black font-bold text-sm tracking-wider uppercase flex items-center justify-center gap-2 hover:brightness-110 active:scale-[0.99] transition-all shadow-lg"
          >
            <Send className="w-4 h-4" />
            <span>Post Fan Tribute</span>
          </button>
        </form>

        {submittedMessage && (
          <div className="p-4 rounded-xl bg-[#D49A32]/10 border border-[#D49A32]/40 text-xs text-[#F5E6C8] space-y-1 animate-in fade-in duration-300">
            <div className="flex items-center justify-between text-[#D49A32] font-semibold">
              <span>{submittedMessage.author}</span>
              <span className="font-mono text-[10px]">{submittedMessage.time}</span>
            </div>
            <p className="italic">"{submittedMessage.text}"</p>
          </div>
        )}
      </div>

      {/* FOOTER ACKNOWLEDGEMENTS */}
      <div className="text-center pt-8 border-t border-[#F5E6C8]/10 text-xs text-stone-400 space-y-2">
        <p className="font-['Playfair_Display'] text-sm text-[#F5E6C8]">
          Kishore Kumar Digital Tribute & Vinyl Player Experience
        </p>
        <p className="font-mono text-[11px] text-[#D49A32]">
          Crafted with reverence for the Golden Era of Hindi Cinema • 1929 — Forever
        </p>
      </div>

    </section>
  );
}

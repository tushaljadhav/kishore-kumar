import React from 'react';
import { Sparkles, Heart, Flame, Compass, Moon, Play } from 'lucide-react';
import { playlist } from '../data/playlist';

export default function MoodPlaylists({ onPlayTrack }) {
  const moods = [
    {
      id: 'romantic',
      title: 'Romantic Classics',
      icon: Heart,
      color: 'from-amber-600/30 to-rose-900/30',
      borderColor: 'border-amber-500/40',
      songIds: [
        'pal-pal-dil-ke-paas',
        'o-mere-dil-ke-chain',
        'yeh-shaam-mastani',
        'mere-sapnon-ki-rani',
        'roop-tera-mastana',
        'yeh-jo-mohabbat-hai',
        'hum-mein-tumse-pyar',
        'aane-wala-pal-jaane-wala-hai',
        'kya-yahi-pyaar-hai',
        'dil-kya-kare',
        'chookar-mere-man-ko',
        'ek-ajnabee-haseena-se',
        'aap-ki-aankhon-mein-kuch',
        'tere-bina-zindagi-se-koi',
        'saagar-jaisi-aankhonwali',
        'pyar-deewana-hota-hai',
        'pal-bhar-ke-liye',
        'phoolon-ke-rang-se'
      ]
    },
    {
      id: 'emotional',
      title: 'Emotional & Deep Melodies',
      icon: Moon,
      color: 'from-teal-600/30 to-emerald-950/30',
      borderColor: 'border-teal-500/40',
      songIds: [
        'o-saathi-re',
        'chingari-koi-bhadke',
        'meri-bheegi-bheegi-si',
        'zindagi-ke-safar',
        'ruk-jaana-nahin',
        'musafir-hoon-yaaro',
        'kuchh-to-log-kahenge',
        'mere-naina-sawan-bhadon',
        'agar-tum-na-hote'
      ]
    },
    {
      id: 'energetic',
      title: 'High-Energy Hits',
      icon: Flame,
      color: 'from-orange-600/30 to-amber-900/30',
      borderColor: 'border-orange-500/40',
      songIds: [
        'khaike-paan-banaraswala',
        'zindagi-ek-safar-hai-suhana',
        'apni-to-jaise-taise',
        'ek-ladki-bheegi-bhagi',
        'kehdoon-tumhen',
        'mere-samne-wali-khidki',
        'pag-ghunghroo-baandh',
        'bachna-ae-haseeno',
        'om-shanti-om',
        'jahan-teri-yeh-nazar-hai',
        'my-name-is-anthony-gonsalves',
        'samne-ye-kaun-aaya'
      ]
    },
    {
      id: 'classic',
      title: 'Evergreen Golden Classics',
      icon: Compass,
      color: 'from-yellow-600/30 to-stone-900/30',
      borderColor: 'border-yellow-500/40',
      songIds: [
        'neele-neele-ambar-par',
        'mere-mehboob-qayamat-hogi',
        'rimjhim-gire-saawan',
        'oh-hansini',
        'kehna-hai-kehna-hai',
        'phir-wohi-raat-hai',
        'aise-na-mujhe-tum-dekho',
        'dilbar-mere',
        'dream-girl'
      ]
    }
  ];

  return (
    <section id="moods" className="relative z-10 py-24 px-4 sm:px-8 lg:px-16 max-w-7xl mx-auto space-y-12">
      
      {/* HEADER */}
      <div className="space-y-3 border-b border-[#F5E6C8]/15 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D49A32]/20 border border-[#D49A32]/30 text-xs font-mono text-[#D49A32]">
          <Sparkles className="w-3.5 h-3.5" />
          <span>SECTION 3 • CURATED EXPERIENCES</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-black font-['Playfair_Display'] text-[#F5E6C8]">
          Essential <span className="gold-gradient-text">Moods</span>
        </h2>
        <p className="text-sm text-stone-300 max-w-2xl">
          Whether you are looking for soulful evening comfort, monsoon love songs, or high-energy comedy classics, select a mood to start listening.
        </p>
      </div>

      {/* MOOD CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {moods.map((m) => {
          const Icon = m.icon;
          const moodSongs = playlist.filter((s) => m.songIds.includes(s.id));

          return (
            <div
              key={m.id}
              className={`glass-panel p-6 rounded-3xl border ${m.borderColor} bg-gradient-to-br ${m.color} space-y-6 hover:scale-[1.01] transition-transform shadow-xl`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#111] text-[#D49A32] flex items-center justify-center border border-[#D49A32]/30">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-bold font-['Playfair_Display'] text-[#F5E6C8]">
                    {m.title}
                  </h3>
                </div>
                <span className="text-xs font-mono text-stone-400">
                  {moodSongs.length} Tracks
                </span>
              </div>

              {/* TRACK LISTING INSIDE MOOD CARD */}
              <div className="space-y-2.5">
                {moodSongs.map((song) => {
                  const globalIndex = playlist.findIndex((s) => s.id === song.id);
                  return (
                    <div
                      key={song.id}
                      onClick={() => onPlayTrack(globalIndex)}
                      className="p-3 rounded-xl bg-[#111111]/60 hover:bg-[#111111]/90 border border-[#F5E6C8]/10 hover:border-[#D49A32]/50 flex items-center justify-between gap-3 cursor-pointer transition-all group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img src={song.cover} alt={song.title} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                        <div className="min-w-0">
                          <h4 className="text-sm font-semibold text-[#F5E6C8] truncate group-hover:text-[#D49A32] transition-colors">
                            {song.title}
                          </h4>
                          <p className="text-xs text-stone-400 truncate">
                            {song.movie}
                          </p>
                        </div>
                      </div>

                      <div className="w-8 h-8 rounded-full bg-[#D49A32]/20 text-[#D49A32] group-hover:bg-[#D49A32] group-hover:text-black flex items-center justify-center transition-all flex-shrink-0">
                        <Play className="w-4 h-4 fill-current ml-0.5" />
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          );
        })}
      </div>

    </section>
  );
}

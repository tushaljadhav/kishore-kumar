import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const audioDir = path.join(__dirname, '../public/assets/audio');
const imagesDir = path.join(__dirname, '../public/assets/images');

if (!fs.existsSync(audioDir)) fs.mkdirSync(audioDir, { recursive: true });
if (!fs.existsSync(imagesDir)) fs.mkdirSync(imagesDir, { recursive: true });

// Helper to write PCM WAV file
function createWavBuffer(durationSec = 15, baseFreq = 220, chordRatios = [1, 1.25, 1.5], songType = 'romantic') {
  const sampleRate = 44100;
  const numChannels = 2;
  const bitsPerSample = 16;
  const numSamples = Math.floor(sampleRate * durationSec);
  const dataSize = numSamples * numChannels * (bitsPerSample / 8);
  const buffer = Buffer.alloc(44 + dataSize);

  // WAV Header
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16); // Subchunk1Size
  buffer.writeUInt16LE(1, 20); // AudioFormat (PCM)
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * numChannels * (bitsPerSample / 8), 28);
  buffer.writeUInt16LE(numChannels * (bitsPerSample / 8), 32);
  buffer.writeUInt16LE(bitsPerSample, 34);
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  let offset = 44;
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    
    // Envelope (fade in/out)
    let env = 1.0;
    if (t < 0.5) env = t / 0.5;
    if (t > durationSec - 1.0) env = (durationSec - t) / 1.0;
    env = Math.max(0, Math.min(1, env));

    // Melodic tone synthesis (simulating vintage tanpura & organ chord)
    let sampleVal = 0;
    
    // Melodic arpeggio pattern
    const noteTime = (t * 2.5) % chordRatios.length;
    const activeNoteIndex = Math.floor(noteTime);
    const activeFreq = baseFreq * chordRatios[activeNoteIndex];

    // Primary wave + harmonics
    sampleVal += Math.sin(2 * Math.PI * activeFreq * t) * 0.4;
    sampleVal += Math.sin(2 * Math.PI * activeFreq * 2 * t) * 0.15;
    sampleVal += Math.sin(2 * Math.PI * (baseFreq * 0.5) * t) * 0.25; // Bass warmth

    // Yodel/Flute modulation for playful songs
    if (songType === 'playful') {
      const vibrato = Math.sin(2 * Math.PI * 6 * t) * 15;
      sampleVal += Math.sin(2 * Math.PI * (activeFreq * 1.5 + vibrato) * t) * 0.2;
    } else if (songType === 'soulful') {
      // Warm slow pad
      sampleVal += Math.sin(2 * Math.PI * (baseFreq * 1.33) * t) * 0.2;
    }

    // Vintage vinyl crackle effect
    const crackle = (Math.random() > 0.985 ? (Math.random() - 0.5) * 0.12 : 0);

    let totalVal = (sampleVal * 0.5 * env) + crackle;
    totalVal = Math.max(-1, Math.min(1, totalVal));
    const intSample = Math.floor(totalVal * 32767);

    // Left and Right channels (stereo warmth)
    buffer.writeInt16LE(intSample, offset);
    buffer.writeInt16LE(intSample, offset + 2);
    offset += 4;
  }

  return buffer;
}

const songs = [
  { id: 'roop-tera-mastana', freq: 261.63, ratios: [1, 1.2, 1.5, 1.8], type: 'romantic' },
  { id: 'yeh-shaam-mastani', freq: 220.00, ratios: [1, 1.25, 1.5, 1.33], type: 'soulful' },
  { id: 'o-mere-dil-ke-chain', freq: 293.66, ratios: [1, 1.25, 1.5, 2.0], type: 'romantic' },
  { id: 'pal-pal-dil-ke-paas', freq: 246.94, ratios: [1, 1.33, 1.5, 1.8], type: 'soulful' },
  { id: 'mere-samne-wali-khidki', freq: 329.63, ratios: [1, 1.25, 1.5, 1.75], type: 'playful' },
  { id: 'zindagi-ke-safar', freq: 220.00, ratios: [1, 1.2, 1.4, 1.5], type: 'soulful' },
  { id: 'ek-ladki-bheegi-bhagi', freq: 261.63, ratios: [1, 1.25, 1.5, 1.6], type: 'playful' },
  { id: 'khaike-paan-banaraswala', freq: 349.23, ratios: [1, 1.33, 1.5, 2.0], type: 'playful' },
  { id: 'chingari-koi-bhadke', freq: 196.00, ratios: [1, 1.2, 1.5, 1.75], type: 'soulful' },
  { id: 'pyar-deewana-hota-hai', freq: 293.66, ratios: [1, 1.25, 1.5, 1.8], type: 'romantic' },
  { id: 'hum-mein-tumse-pyar', freq: 246.94, ratios: [1, 1.2, 1.5, 1.6], type: 'romantic' },
  { id: 'musafir-hoon-yaaro', freq: 261.63, ratios: [1, 1.25, 1.4, 1.5], type: 'soulful' }
];

console.log('Generating browser-safe WAV samples...');
songs.forEach(s => {
  const filePath = path.join(audioDir, `${s.id}.wav`);
  const buf = createWavBuffer(30, s.freq, s.ratios, s.type);
  fs.writeFileSync(filePath, buf);
  console.log(`Generated: ${filePath}`);
});

console.log('Audio samples generated successfully as .wav files for browser playback.');

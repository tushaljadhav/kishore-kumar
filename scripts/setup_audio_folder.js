import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicAudioDir = path.join(__dirname, '../public/audio');
const assetsAudioDir = path.join(__dirname, '../public/assets/audio');

if (!fs.existsSync(publicAudioDir)) {
  fs.mkdirSync(publicAudioDir, { recursive: true });
}

// Copy or create files in public/audio/
const audioFiles = [
  'roop-tera-mastana.mp3',
  'ye-shaam-mastani.mp3',
  'yeh-shaam-mastani.mp3',
  'o-mere-dil-ke-chain.mp3',
  'pal-pal-dil-ke-paas.mp3',
  'mere-samne-wali-khidki.mp3',
  'zindagi-ke-safar.mp3',
  'ek-ladki-bheegi-bhagi.mp3',
  'khaike-paan-banaraswala.mp3',
  'chingari-koi-bhadke.mp3',
  'pyar-deewana-hota-hai.mp3',
  'hum-mein-tumse-pyar.mp3',
  'musafir-hoon-yaaro.mp3'
];

audioFiles.forEach(file => {
  const sourcePath = path.join(assetsAudioDir, file.replace('ye-shaam', 'yeh-shaam'));
  const destPath = path.join(publicAudioDir, file);

  if (fs.existsSync(sourcePath)) {
    fs.copyFileSync(sourcePath, destPath);
    console.log(`Copied: ${file}`);
  }
});

console.log('Audio folder setup completed successfully!');

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const imagesDir = path.join(__dirname, '../public/assets/images');

const songsCoverData = [
  { id: 'roop-tera-mastana', title: 'Roop Tera Mastana', movie: 'Aradhana', color: '#D49A32', bg: '#241812' },
  { id: 'yeh-shaam-mastani', title: 'Yeh Shaam Mastani', movie: 'Kati Patang', color: '#C87925', bg: '#1A120B' },
  { id: 'o-mere-dil-ke-chain', title: 'O Mere Dil Ke Chain', movie: 'Mere Jeevan Saathi', color: '#E5AA38', bg: '#2B1A0E' },
  { id: 'pal-pal-dil-ke-paas', title: 'Pal Pal Dil Ke Paas', movie: 'Blackmail', color: '#155E63', bg: '#0D272A' },
  { id: 'mere-samne-wali-khidki', title: 'Mere Samne Wali Khidki', movie: 'Padosan', color: '#D49A32', bg: '#332014' },
  { id: 'zindagi-ke-safar', title: 'Zindagi Ke Safar', movie: 'Aap Ki Kasam', color: '#8C5220', bg: '#17100D' },
  { id: 'ek-ladki-bheegi-bhagi', title: 'Ek Ladki Bheegi Bhagi', movie: 'Chalti Ka Naam Gaadi', color: '#D49A32', bg: '#1C1625' },
  { id: 'khaike-paan-banaraswala', title: 'Khaike Paan Banaraswala', movie: 'Don', color: '#C87925', bg: '#2A1808' },
  { id: 'chingari-koi-bhadke', title: 'Chingari Koi Bhadke', movie: 'Amar Prem', color: '#155E63', bg: '#0E1F21' },
  { id: 'pyar-deewana-hota-hai', title: 'Pyar Deewana Hota Hai', movie: 'Kati Patang', color: '#D49A32', bg: '#231610' },
  { id: 'hum-mein-tumse-pyar', title: 'Humein Tumse Pyar', movie: 'Kudrat', color: '#C87925', bg: '#1F110B' },
  { id: 'musafir-hoon-yaaro', title: 'Musafir Hoon Yaaro', movie: 'Parichay', color: '#F5E6C8', bg: '#261C14' }
];

function generateSvgCover(item) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
  <rect width="400" height="400" fill="${item.bg}"/>
  <circle cx="200" cy="200" r="180" fill="#111" stroke="${item.color}" stroke-width="4"/>
  <circle cx="200" cy="200" r="160" fill="none" stroke="#222" stroke-width="8"/>
  <circle cx="200" cy="200" r="140" fill="none" stroke="#181818" stroke-width="8"/>
  <circle cx="200" cy="200" r="120" fill="none" stroke="#252525" stroke-width="6"/>
  <circle cx="200" cy="200" r="100" fill="none" stroke="#1a1a1a" stroke-width="6"/>
  <circle cx="200" cy="200" r="75" fill="${item.color}"/>
  <circle cx="200" cy="200" r="70" fill="none" stroke="#fff" stroke-width="1.5" stroke-dasharray="4,4"/>
  <circle cx="200" cy="200" r="14" fill="#111"/>
  <text x="200" y="160" font-family="serif" font-size="14" font-weight="bold" fill="#111" text-anchor="middle">KISHORE KUMAR</text>
  <text x="200" y="180" font-family="sans-serif" font-size="12" font-weight="bold" fill="#111" text-anchor="middle">${item.title}</text>
  <text x="200" y="230" font-family="sans-serif" font-size="10" font-weight="600" fill="#222" text-anchor="middle">${item.movie.toUpperCase()}</text>
  <text x="200" y="244" font-family="sans-serif" font-size="8" fill="#333" text-anchor="middle">GOLDEN VINYL RECORD</text>
</svg>`;
}

songsCoverData.forEach(item => {
  const filePathSvg = path.join(imagesDir, `${item.id}.svg`);
  const filePathJpg = path.join(imagesDir, `${item.id}.jpg`);
  const svgContent = generateSvgCover(item);
  fs.writeFileSync(filePathSvg, svgContent);
  fs.writeFileSync(filePathJpg, svgContent);
});

console.log('Fixed cover artwork files!');

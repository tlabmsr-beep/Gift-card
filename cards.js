// cards.js — фирменные дизайны подарочных карт KASHEMIR
// Каждый дизайн — SVG из элементов бренда: листья, кольцо-медальон, соты, золото.
// Палитра: forest #3D7337, pine #21432A, gold #DABD91, gold-deep #BE9F6F, cream #FFF2D0, graphite #231E16

const CARD_DESIGNS = [
  {
    id: 'medallion',
    name: 'Медальон',
    svg: (c = '#21432A') => `
      <svg viewBox="0 0 400 252" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="g-med" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="${c}"/><stop offset="1" stop-color="#152C1B"/>
          </linearGradient>
        </defs>
        <rect width="400" height="252" rx="18" fill="url(#g-med)"/>
        <circle cx="200" cy="118" r="62" fill="none" stroke="#DABD91" stroke-width="1.5"/>
        <circle cx="200" cy="118" r="70" fill="none" stroke="#DABD91" stroke-width="0.6" opacity="0.5"/>
        <text x="200" y="132" font-family="Cinzel,serif" font-size="44" fill="#DABD91" text-anchor="middle" letter-spacing="2">K</text>
        <text x="200" y="210" font-family="Cinzel,serif" font-size="15" fill="#FFF2D0" text-anchor="middle" letter-spacing="5">KASHEMIR</text>
        <text x="200" y="228" font-family="Tilda Sans,sans-serif" font-size="7" fill="#DABD91" text-anchor="middle" letter-spacing="4">BEAUTY STUDIO</text>
      </svg>`,
  },
  {
    id: 'leaves',
    name: 'Листья',
    svg: (c = '#3D7337') => `
      <svg viewBox="0 0 400 252" xmlns="http://www.w3.org/2000/svg">
        <defs><linearGradient id="g-lv" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#FBF5E6"/><stop offset="1" stop-color="#F1F6ED"/>
        </linearGradient></defs>
        <rect width="400" height="252" rx="18" fill="url(#g-lv)"/>
        <g fill="${c}" opacity="0.92">
          <path d="M40 30 C70 50 75 95 45 120 C20 95 15 55 40 30 Z"/>
          <path d="M68 55 C95 72 100 110 72 132 C50 110 46 75 68 55 Z" opacity="0.6"/>
        </g>
        <g fill="${c}" opacity="0.85" transform="translate(360 220) rotate(180)">
          <path d="M0 0 C30 20 35 65 5 90 C-20 65 -25 25 0 0 Z"/>
        </g>
        <line x1="50" y1="35" x2="48" y2="115" stroke="#21432A" stroke-width="1" opacity="0.4"/>
        <text x="200" y="120" font-family="Cinzel,serif" font-size="30" fill="#21432A" text-anchor="middle" letter-spacing="3">KASHEMIR</text>
        <text x="200" y="146" font-family="Tilda Sans,sans-serif" font-size="8" fill="#3D7337" text-anchor="middle" letter-spacing="5">BEAUTY STUDIO</text>
        <line x1="150" y1="158" x2="250" y2="158" stroke="#DABD91" stroke-width="1"/>
      </svg>`,
  },
  {
    id: 'honeycomb',
    name: 'Соты',
    svg: (c = '#DABD91') => `
      <svg viewBox="0 0 400 252" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="252" rx="18" fill="#21432A"/>
        <g fill="none" stroke="${c}" stroke-width="1.2" opacity="0.55">
          ${honeycomb()}
        </g>
        <rect x="120" y="96" width="160" height="60" rx="6" fill="#21432A"/>
        <text x="200" y="126" font-family="Cinzel,serif" font-size="26" fill="#FFF2D0" text-anchor="middle" letter-spacing="3">KASHEMIR</text>
        <text x="200" y="146" font-family="Tilda Sans,sans-serif" font-size="7.5" fill="#DABD91" text-anchor="middle" letter-spacing="4">BEAUTY STUDIO</text>
      </svg>`,
  },
  {
    id: 'gold-line',
    name: 'Золотая линия',
    svg: (c = '#DABD91') => `
      <svg viewBox="0 0 400 252" xmlns="http://www.w3.org/2000/svg">
        <defs><linearGradient id="g-gl" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stop-color="#FFF2D0"/><stop offset="1" stop-color="#FBF5E6"/>
        </linearGradient></defs>
        <rect width="400" height="252" rx="18" fill="url(#g-gl)"/>
        <rect x="14" y="14" width="372" height="224" rx="12" fill="none" stroke="${c}" stroke-width="1"/>
        <text x="200" y="118" font-family="Cinzel,serif" font-size="34" fill="#231E16" text-anchor="middle" letter-spacing="4">KASHEMIR</text>
        <text x="200" y="146" font-family="Tilda Sans,sans-serif" font-size="8" fill="#BE9F6F" text-anchor="middle" letter-spacing="6">BEAUTY STUDIO</text>
        <text x="200" y="200" font-family="Tilda Sans,sans-serif" font-size="9" fill="#8C846F" text-anchor="middle" letter-spacing="2" font-style="italic">подарочная карта</text>
      </svg>`,
  },
  {
    id: 'forest',
    name: 'Хвоя',
    svg: (c = '#3D7337') => `
      <svg viewBox="0 0 400 252" xmlns="http://www.w3.org/2000/svg">
        <defs><radialGradient id="g-fr" cx="0.3" cy="0.3" r="0.9">
          <stop offset="0" stop-color="${c}"/><stop offset="1" stop-color="#152C1B"/>
        </radialGradient></defs>
        <rect width="400" height="252" rx="18" fill="url(#g-fr)"/>
        <g stroke="#DABD91" stroke-width="0.8" opacity="0.5" fill="none">
          <path d="M30 220 Q60 180 30 140 M30 200 L55 188 M30 200 L8 188 M30 175 L52 165 M30 175 L10 165"/>
          <path d="M370 40 Q340 80 370 120 M370 60 L345 72 M370 60 L392 72 M370 85 L348 95 M370 85 L390 95"/>
        </g>
        <circle cx="200" cy="110" r="3" fill="#DABD91"/>
        <text x="200" y="135" font-family="Cinzel,serif" font-size="30" fill="#FFF2D0" text-anchor="middle" letter-spacing="3">KASHEMIR</text>
        <text x="200" y="158" font-family="Tilda Sans,sans-serif" font-size="8" fill="#DABD91" text-anchor="middle" letter-spacing="5">BEAUTY STUDIO</text>
      </svg>`,
  },
  {
    id: 'ritual',
    name: 'Ритуал',
    svg: (c = '#FFF2D0') => `
      <svg viewBox="0 0 400 252" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="252" rx="18" fill="#3D7337"/>
        <rect x="0" y="0" width="400" height="252" rx="18" fill="none" stroke="#21432A" stroke-width="8"/>
        <circle cx="200" cy="100" r="46" fill="none" stroke="#DABD91" stroke-width="1"/>
        <text x="200" y="114" font-family="Cinzel,serif" font-size="38" fill="${c}" text-anchor="middle">K</text>
        <text x="200" y="180" font-family="Cinzel,serif" font-size="11" fill="${c}" text-anchor="middle" letter-spacing="3" font-style="italic">Красота как ритуал</text>
        <text x="200" y="206" font-family="Tilda Sans,sans-serif" font-size="7" fill="#DABD91" text-anchor="middle" letter-spacing="4">KASHEMIR · BEAUTY STUDIO</text>
      </svg>`,
  },
];

function honeycomb() {
  let cells = '';
  const r = 22, w = r * Math.sqrt(3);
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 8; col++) {
      const x = col * w + (row % 2 ? w / 2 : 0) - 10;
      const y = row * r * 1.5 - 10;
      let pts = '';
      for (let i = 0; i < 6; i++) {
        const a = Math.PI / 180 * (60 * i - 30);
        pts += `${(x + r * Math.cos(a)).toFixed(1)},${(y + r * Math.sin(a)).toFixed(1)} `;
      }
      cells += `<polygon points="${pts}"/>`;
    }
  }
  return cells;
}

// Палитра выбора цвета (как кружочки на goldapple)
const CARD_COLORS = [
  { id: 'pine', hex: '#21432A', name: 'Тёмная хвоя' },
  { id: 'forest', hex: '#3D7337', name: 'Лесной зелёный' },
  { id: 'gold', hex: '#DABD91', name: 'Золотой песок' },
  { id: 'gold-deep', hex: '#BE9F6F', name: 'Глубокое золото' },
  { id: 'cream', hex: '#FFF2D0', name: 'Кремовый' },
  { id: 'graphite', hex: '#231E16', name: 'Графит' },
  { id: 'pine-deep', hex: '#152C1B', name: 'Глубокая хвоя' },
];

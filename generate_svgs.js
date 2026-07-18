const fs = require('fs');
const path = require('path');

const dirs = [
  path.join(__dirname, 'assets'),
  path.join(__dirname, 'assets', 'dark')
];

dirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const isDark = (type) => type === 'dark';

// Color themes
const themes = {
  light: {
    bg: '#ffffff',
    text: '#0d1117',
    muted: '#57606a',
    accent: '#0969da',
    border: '#d0d7de',
    grid: '#afb8c1',
    line: '#e1e4e8',
  },
  dark: {
    bg: '#0d1117',
    text: '#c9d1d9',
    muted: '#8b949e',
    accent: '#58a6ff',
    border: '#30363d',
    grid: '#8b949e',
    line: '#21262d',
  }
};

const createHeader = (themeName) => {
  const t = themes[themeName];
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 200" width="100%" height="100%">
    <rect width="100%" height="100%" fill="${t.bg}"/>
    <text x="400" y="90" font-family="monospace" font-size="42" font-weight="bold" fill="${t.text}" text-anchor="middle" letter-spacing="4">THAYANITHI S</text>
    <text x="400" y="130" font-family="monospace" font-size="16" fill="${t.accent}" text-anchor="middle" letter-spacing="2">FULL STACK SOFTWARE ENGINEER | SAAS ARCHITECT</text>
    <line x1="100" y1="160" x2="700" y2="160" stroke="${t.border}" stroke-width="1.5" stroke-dasharray="5 5"/>
  </svg>`;
};

const createSectionHeader = (themeName, number, title) => {
  const t = themes[themeName];
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 60" width="100%" height="100%">
    <rect width="100%" height="100%" fill="${t.bg}"/>
    <line x1="20" y1="30" x2="80" y2="30" stroke="${t.accent}" stroke-width="2"/>
    <text x="100" y="36" font-family="monospace" font-size="18" font-weight="bold" fill="${t.text}">${number} — ${title.toUpperCase()}</text>
    <line x1="300" y1="30" x2="780" y2="30" stroke="${t.border}" stroke-width="1" stroke-dasharray="2 4"/>
  </svg>`;
};

const createWhoAmI = (themeName) => {
  const t = themes[themeName];
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 180" width="100%" height="100%">
    <rect width="100%" height="100%" fill="${t.bg}"/>
    <rect x="20" y="10" width="760" height="150" rx="6" fill="${themeName === 'dark' ? '#161b22' : '#f6f8fa'}" stroke="${t.border}" stroke-width="1.5"/>
    <text x="50" y="45" font-family="monospace" font-size="14" fill="${t.muted}">$ whoami</text>
    <text x="50" y="70" font-family="monospace" font-size="14" fill="${t.text}">Thayanithi S — B.E. Computer Science Engineering Student @ BIT (2027)</text>
    <text x="50" y="95" font-family="monospace" font-size="14" fill="${t.muted}">$ cat focus.json</text>
    <text x="50" y="120" font-family="monospace" font-size="14" fill="${t.accent}">["Next.js", "TypeScript", "Node.js", "Express", "GCP", "PostgreSQL", "MongoDB"]</text>
  </svg>`;
};

const createEcosystem = (themeName) => {
  const t = themes[themeName];
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 240" width="100%" height="100%">
    <rect width="100%" height="100%" fill="${t.bg}"/>
    
    <!-- Box: Client/Frontend -->
    <rect x="50" y="30" width="180" height="70" rx="4" fill="${themeName === 'dark' ? '#161b22' : '#f6f8fa'}" stroke="${t.accent}" stroke-width="1.5"/>
    <text x="140" y="60" font-family="monospace" font-size="14" font-weight="bold" fill="${t.text}" text-anchor="middle">Frontend Platforms</text>
    <text x="140" y="80" font-family="monospace" font-size="11" fill="${t.muted}" text-anchor="middle">Next.js / React / Vue</text>
    
    <!-- Box: Backend API -->
    <rect x="310" y="30" width="180" height="70" rx="4" fill="${themeName === 'dark' ? '#161b22' : '#f6f8fa'}" stroke="${t.accent}" stroke-width="1.5"/>
    <text x="400" y="60" font-family="monospace" font-size="14" font-weight="bold" fill="${t.text}" text-anchor="middle">Backend Services</text>
    <text x="400" y="80" font-family="monospace" font-size="11" fill="${t.muted}" text-anchor="middle">Node.js / Express / Go</text>

    <!-- Box: Databases & Cloud -->
    <rect x="570" y="30" width="180" height="70" rx="4" fill="${themeName === 'dark' ? '#161b22' : '#f6f8fa'}" stroke="${t.accent}" stroke-width="1.5"/>
    <text x="660" y="60" font-family="monospace" font-size="14" font-weight="bold" fill="${t.text}" text-anchor="middle">Databases &amp; Cloud</text>
    <text x="660" y="80" font-family="monospace" font-size="11" fill="${t.muted}" text-anchor="middle">GCP / Postgres / Mongo</text>

    <!-- Connectors (Vector Arrows) -->
    <line x1="230" y1="65" x2="300" y2="65" stroke="${t.border}" stroke-width="2"/>
    <polygon points="300,61 308,65 300,69" fill="${t.border}"/>

    <line x1="490" y1="65" x2="560" y2="65" stroke="${t.border}" stroke-width="2"/>
    <polygon points="560,61 568,65 560,69" fill="${t.border}"/>

    <!-- Bottom Description -->
    <rect x="50" y="140" width="700" height="70" rx="4" fill="${themeName === 'dark' ? '#0d1117' : '#ffffff'}" stroke="${t.border}" stroke-width="1"/>
    <text x="70" y="165" font-family="monospace" font-size="13" fill="${t.text}">SYSTEM TOPO: Decentralized API integration, scalable microservices, telemetry visualization</text>
    <text x="70" y="190" font-family="monospace" font-size="13" fill="${t.muted}">Status: Operational [100% stable execution]</text>
  </svg>`;
};

const createProjects = (themeName) => {
  const t = themes[themeName];
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 240" width="100%" height="100%">
    <rect width="100%" height="100%" fill="${t.bg}"/>
    <!-- Project 1 -->
    <rect x="20" y="20" width="245" height="200" rx="6" fill="${themeName === 'dark' ? '#161b22' : '#f6f8fa'}" stroke="${t.border}" stroke-width="1.5"/>
    <text x="40" y="55" font-family="monospace" font-size="16" font-weight="bold" fill="${t.text}">CNC VAULT</text>
    <text x="40" y="90" font-family="monospace" font-size="12" fill="${t.muted}">Centralized CNC/PLC backup with</text>
    <text x="40" y="110" font-family="monospace" font-size="12" fill="${t.muted}">version control &amp; live reporting.</text>
    <text x="40" y="130" font-family="monospace" font-size="12" fill="${t.muted}">Efficiency improved by 70%.</text>
    <text x="40" y="170" font-family="monospace" font-size="12" fill="${t.accent}">Next.js | Express | MongoDB | GCP</text>

    <!-- Project 2 -->
    <rect x="285" y="20" width="245" height="200" rx="6" fill="${themeName === 'dark' ? '#161b22' : '#f6f8fa'}" stroke="${t.border}" stroke-width="1.5"/>
    <text x="305" y="55" font-family="monospace" font-size="16" font-weight="bold" fill="${t.text}">DEV RANK</text>
    <text x="305" y="90" font-family="monospace" font-size="12" fill="${t.muted}">Developer discovery &amp; ranking</text>
    <text x="305" y="110" font-family="monospace" font-size="12" fill="${t.muted}">via Github/LeetCode profiling</text>
    <text x="305" y="130" font-family="monospace" font-size="12" fill="${t.muted}">and dynamic data scrapers.</text>
    <text x="305" y="170" font-family="monospace" font-size="12" fill="${t.accent}">Next.js | Scraping | MongoDB</text>

    <!-- Project 3 -->
    <rect x="550" y="20" width="245" height="200" rx="6" fill="${themeName === 'dark' ? '#161b22' : '#f6f8fa'}" stroke="${t.border}" stroke-width="1.5"/>
    <text x="570" y="55" font-family="monospace" font-size="16" font-weight="bold" fill="${t.text}">EQ REV</text>
    <text x="570" y="90" font-family="monospace" font-size="12" fill="${t.muted}">Quick commerce SaaS analytics</text>
    <text x="570" y="110" font-family="monospace" font-size="12" fill="${t.muted}">mapping 1,000+ D2C stores on</text>
    <text x="570" y="130" font-family="monospace" font-size="12" fill="${t.muted}">Blinkit, Zepto, and Instamart.</text>
    <text x="570" y="170" font-family="monospace" font-size="12" fill="${t.accent}">React | BigQuery | Cloudflare | Zustand</text>

    <!-- Project 4 -->
    <rect x="815" y="20" width="245" height="200" rx="6" fill="${themeName === 'dark' ? '#161b22' : '#f6f8fa'}" stroke="${t.border}" stroke-width="1.5"/>
    <text x="835" y="55" font-family="monospace" font-size="16" font-weight="bold" fill="${t.text}">BITLINKS</text>
    <text x="835" y="90" font-family="monospace" font-size="12" fill="${t.muted}">Collaborative discovery &amp; community</text>
    <text x="835" y="110" font-family="monospace" font-size="12" fill="${t.muted}">network platform built for student</text>
    <text x="835" y="130" font-family="monospace" font-size="12" fill="${t.muted}">interactions &amp; networking.</text>
    <text x="835" y="170" font-family="monospace" font-size="12" fill="${t.accent}">Next.js | Framer Motion | Vercel</text>
  </svg>`;
};

const createTelemetry = (themeName) => {
  const t = themes[themeName];
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 120" width="100%" height="100%">
    <rect width="100%" height="100%" fill="${t.bg}"/>
    <rect x="20" y="10" width="760" height="90" rx="4" fill="${themeName === 'dark' ? '#161b22' : '#f6f8fa'}" stroke="${t.border}" stroke-width="1.5"/>
    
    <text x="50" y="45" font-family="monospace" font-size="13" fill="${t.text}">Commits (Total): <tspan fill="${t.accent}" font-weight="bold">2,000+</tspan></text>
    <text x="50" y="70" font-family="monospace" font-size="13" fill="${t.text}">LeetCode Problems: <tspan fill="${t.accent}" font-weight="bold">300+</tspan></text>

    <text x="450" y="45" font-family="monospace" font-size="13" fill="${t.text}">Deployment Success: <tspan fill="#2ea44f" font-weight="bold">100%</tspan></text>
    <text x="450" y="70" font-family="monospace" font-size="13" fill="${t.text}">Active Contribution Streak: <tspan fill="#e51b24" font-weight="bold">Continuous</tspan></text>
  </svg>`;
};

const createTimeline = (themeName) => {
  const t = themes[themeName];
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 160" width="100%" height="100%">
    <rect width="100%" height="100%" fill="${t.bg}"/>
    
    <!-- Timeline central line -->
    <line x1="50" y1="80" x2="750" y2="80" stroke="${t.border}" stroke-width="3"/>
    
    <!-- Node 1 -->
    <circle cx="150" cy="80" r="8" fill="${t.accent}" stroke="${t.bg}" stroke-width="2"/>
    <text x="150" y="55" font-family="monospace" font-size="12" font-weight="bold" fill="${t.text}" text-anchor="middle">Crayon'd</text>
    <text x="150" y="110" font-family="monospace" font-size="11" fill="${t.muted}" text-anchor="middle">Sep 24 - Apr 25</text>
    <text x="150" y="130" font-family="monospace" font-size="10" fill="${t.muted}" text-anchor="middle">Full Stack Intern</text>

    <!-- Node 2 -->
    <circle cx="400" cy="80" r="8" fill="${t.accent}" stroke="${t.bg}" stroke-width="2"/>
    <text x="400" y="55" font-family="monospace" font-size="12" font-weight="bold" fill="${t.text}" text-anchor="middle">EQREV</text>
    <text x="400" y="110" font-family="monospace" font-size="11" fill="${t.muted}" text-anchor="middle">Jan 25 - Dec 25</text>
    <text x="400" y="130" font-family="monospace" font-size="10" fill="${t.muted}" text-anchor="middle">Software Developer</text>

    <!-- Node 3 -->
    <circle cx="650" cy="80" r="8" fill="${t.accent}" stroke="${t.bg}" stroke-width="2"/>
    <text x="650" y="55" font-family="monospace" font-size="12" font-weight="bold" fill="${t.text}" text-anchor="middle">Thinkuni</text>
    <text x="650" y="110" font-family="monospace" font-size="11" fill="${t.muted}" text-anchor="middle">Oct 25 - Jan 26</text>
    <text x="650" y="130" font-family="monospace" font-size="10" fill="${t.muted}" text-anchor="middle">Frontend Engineer</text>
  </svg>`;
};

const createExperience = (themeName) => {
  const t = themes[themeName];
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 220" width="100%" height="100%">
    <rect width="100%" height="100%" fill="${t.bg}"/>
    <rect x="20" y="10" width="760" height="190" rx="6" fill="${themeName === 'dark' ? '#161b22' : '#f6f8fa'}" stroke="${t.border}" stroke-width="1.5"/>
    <text x="40" y="45" font-family="monospace" font-size="14" font-weight="bold" fill="${t.text}">Professional Overview</text>
    <text x="40" y="80" font-family="monospace" font-size="12" fill="${t.text}">- EQREV: Built geo-tracking &amp; analytics UI mapping 1,000+ active retail outlets</text>
    <text x="40" y="110" font-family="monospace" font-size="12" fill="${t.text}">- Crayon'd: Led implementation of client projects, slashing API delivery lag by 20%</text>
    <text x="40" y="140" font-family="monospace" font-size="12" fill="${t.text}">- Thinkuni: Engineered modular dashboards and role-based learning portals</text>
    <text x="40" y="170" font-family="monospace" font-size="11" fill="${t.muted}">Total Tenure: 1.5+ Years Product Delivery Experience</text>
  </svg>`;
};

const createStack = (themeName) => {
  const t = themes[themeName];
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 220" width="100%" height="100%">
    <rect width="100%" height="100%" fill="${t.bg}"/>
    <rect x="20" y="10" width="760" height="190" rx="6" fill="${themeName === 'dark' ? '#161b22' : '#f6f8fa'}" stroke="${t.border}" stroke-width="1.5"/>
    
    <text x="40" y="45" font-family="monospace" font-size="14" font-weight="bold" fill="${t.accent}">Languages &amp; Frontend</text>
    <text x="40" y="70" font-family="monospace" font-size="12" fill="${t.text}">TypeScript, JavaScript, Java, Python, C / Next.js, React.js, Vue, Tailwind CSS, Redux, Zustand</text>

    <text x="40" y="110" font-family="monospace" font-size="14" font-weight="bold" fill="${t.accent}">Backend, Databases &amp; Cloud</text>
    <text x="40" y="135" font-family="monospace" font-size="12" fill="${t.text}">Node.js, Express, Fastify, MongoDB, MySQL, PostgreSQL, GCP, Firebase, Docker, Vercel, Git</text>

    <text x="40" y="170" font-family="monospace" font-size="14" font-weight="bold" fill="${t.accent}">ORMs, Testing & Architecture</text>
    <text x="40" y="195" font-family="monospace" font-size="12" fill="${t.text}">Prisma, Sequelize, BDD Testing, Unit and Integration suites, REST APIs, Web Scraping</text>
  </svg>`;
};

const createFooter = (themeName) => {
  const t = themes[themeName];
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 80" width="100%" height="100%">
    <rect width="100%" height="100%" fill="${t.bg}"/>
    <line x1="20" y1="10" x2="780" y2="10" stroke="${t.border}" stroke-width="1"/>
    <text x="400" y="45" font-family="monospace" font-size="12" fill="${t.muted}" text-anchor="middle">© ${new Date().getFullYear()} Thayanithi S. Status: Active & ready for engineering opportunities.</text>
  </svg>`;
};

// Generate SVGs
const writeSvg = (filename, content) => {
  fs.writeFileSync(filename, content, 'utf8');
  console.log(`Generated ${filename}`);
};

// Light
writeSvg(path.join(__dirname, 'assets', 'header-v1.svg'), createHeader('light'));
writeSvg(path.join(__dirname, 'assets', 's01.svg'), createSectionHeader('light', '01', 'whoami'));
writeSvg(path.join(__dirname, 'assets', 'whoami.svg'), createWhoAmI('light'));
writeSvg(path.join(__dirname, 'assets', 's02.svg'), createSectionHeader('light', '02', 'system map'));
writeSvg(path.join(__dirname, 'assets', 'ecosystem.svg'), createEcosystem('light'));
writeSvg(path.join(__dirname, 'assets', 's03.svg'), createSectionHeader('light', '03', 'projects'));
writeSvg(path.join(__dirname, 'assets', 'projects.svg'), createProjects('light'));
writeSvg(path.join(__dirname, 'assets', 's04.svg'), createSectionHeader('light', '04', 'telemetry'));
writeSvg(path.join(__dirname, 'assets', 'telemetry.svg'), createTelemetry('light'));
writeSvg(path.join(__dirname, 'assets', 's05.svg'), createSectionHeader('light', '05', 'the route'));
writeSvg(path.join(__dirname, 'assets', 'timeline.svg'), createTimeline('light'));
writeSvg(path.join(__dirname, 'assets', 'experience.svg'), createExperience('light'));
writeSvg(path.join(__dirname, 'assets', 's06.svg'), createSectionHeader('light', '06', 'stack'));
writeSvg(path.join(__dirname, 'assets', 'stack.svg'), createStack('light'));
writeSvg(path.join(__dirname, 'assets', 'footer.svg'), createFooter('light'));

// Dark
writeSvg(path.join(__dirname, 'assets', 'dark', 'header-v1.svg'), createHeader('dark'));
writeSvg(path.join(__dirname, 'assets', 'dark', 's01.svg'), createSectionHeader('dark', '01', 'whoami'));
writeSvg(path.join(__dirname, 'assets', 'dark', 'whoami.svg'), createWhoAmI('dark'));
writeSvg(path.join(__dirname, 'assets', 'dark', 's02.svg'), createSectionHeader('dark', '02', 'system map'));
writeSvg(path.join(__dirname, 'assets', 'dark', 'ecosystem.svg'), createEcosystem('dark'));
writeSvg(path.join(__dirname, 'assets', 'dark', 's03.svg'), createSectionHeader('dark', '03', 'projects'));
writeSvg(path.join(__dirname, 'assets', 'dark', 'projects.svg'), createProjects('dark'));
writeSvg(path.join(__dirname, 'assets', 'dark', 's04.svg'), createSectionHeader('dark', '04', 'telemetry'));
writeSvg(path.join(__dirname, 'assets', 'dark', 'telemetry.svg'), createTelemetry('dark'));
writeSvg(path.join(__dirname, 'assets', 'dark', 's05.svg'), createSectionHeader('dark', '05', 'the route'));
writeSvg(path.join(__dirname, 'assets', 'dark', 'timeline.svg'), createTimeline('dark'));
writeSvg(path.join(__dirname, 'assets', 'dark', 'experience.svg'), createExperience('dark'));
writeSvg(path.join(__dirname, 'assets', 'dark', 's06.svg'), createSectionHeader('dark', '06', 'stack'));
writeSvg(path.join(__dirname, 'assets', 'dark', 'stack.svg'), createStack('dark'));
writeSvg(path.join(__dirname, 'assets', 'dark', 'footer.svg'), createFooter('dark'));

console.log('All SVGs generated successfully!');

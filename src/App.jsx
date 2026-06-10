import { useEffect, useRef, useState } from 'react';
import {
  ArrowUpRight,
  BriefcaseBusiness,
  CircleDot,
  Component,
  Grid3X3,
  Handshake,
  LoaderCircle,
  Mail,
  MapPin,
  Menu,
  Phone,
  Rocket,
  Settings,
  WandSparkles,
  X,
} from 'lucide-react';
import {
  experience,
  heroStats,
  metrics,
  navItems,
  profile,
  projects,
} from './portfolioData.js';
import ShuffleTitle from './ShuffleTitle.jsx';

const bubbleLinks = [
  { label: 'AI', href: '#strengths', ariaLabel: '查看AI设计能力' },
  { label: 'IP', href: '#projects', ariaLabel: '查看IP设计项目' },
  { label: '作品集', href: '#projects', ariaLabel: '查看作品集项目' },
];

const showcaseCards = [
  'showcase-card--left',
  'showcase-card--middle',
  'showcase-card--dark',
  'showcase-card--right',
];

const skillTags = [
  'AI视觉工作流',
  '跨部门推进',
  'B/G端系统UI',
  '品牌VIS升级',
  'IP形象设计',
  '开发落地跟进',
];

const processSteps = [
  {
    label: 'AI FIRST',
    title: 'AI视觉探索',
    description: '用AI快速做风格发散、角色设定、主视觉草案和物料延展，先把方向跑出来，再进入精修落地。',
  },
  {
    label: 'ALIGN',
    title: '跨部门需求拆解',
    description: '对齐产品、运营、开发和业务目标，把模糊需求拆成页面结构、视觉优先级和交付节点。',
  },
  {
    label: 'SYSTEM',
    title: '设计系统落地',
    description: '沉淀组件、色彩、字体、图标和标注规范，让B端系统、官网、APP和品牌物料保持一致。',
  },
  {
    label: 'DELIVER',
    title: '交付与复盘',
    description: '跟进上线走查、开发还原、平台审核和数据反馈，把设计从视觉稿推进到真实业务结果。',
  },
];

const processIcons = [WandSparkles, Handshake, Component, Rocket];

const toolStack = [
  { label: 'Photoshop', kind: 'ps' },
  { label: 'Illustrator', kind: 'ai' },
  { label: 'After Effects', kind: 'ae' },
  { label: 'Blender', kind: 'blender' },
  { label: 'Cinema 4D', kind: 'c4d' },
  { label: 'Midjourney', kind: 'midjourney' },
];

const projectDirectionItems = [
  {
    title: '成都某飞综合数据处理系统',
    category: 'B/G端系统 UI/UX',
    image: '/assets/direction-coffee.png',
  },
  {
    title: '沫小兔 / 诗嘶蛙品牌IP',
    category: '品牌IP全案',
    image: '/assets/direction-moxiao-tu.png',
  },
  {
    title: '美哩电商VIS迭代',
    category: '品牌升级 / APP',
    image: '/assets/direction-meili-brand.png',
  },
  {
    title: '天猫 / 中免运营设计',
    category: '电商运营视觉',
    image: '/assets/direction-taobao-journal.png',
  },
  {
    title: 'AI + 3D视觉探索',
    category: 'AIGC / 三维视觉',
    image: '/assets/direction-yeirong.png',
  },
  {
    title: 'APP / 小程序界面设计',
    category: 'UI设计 / 交互原型',
    image: '/assets/direction-travel-app.png',
  },
  {
    title: 'AI作品展示',
    category: 'LOADING / 持续更新中',
    isLoading: true,
  },
];

const partnerMarks = [
  'TMALL',
  'CDF',
  'MEILI',
  'B/G SYSTEM',
  'APP DESIGN',
  'VIS',
  'IP DESIGN',
  'AIGC',
  '3D VISUAL',
];

const showcaseImages = [
  '/assets/showcase-avic-system.png',
  null,
  '/assets/direction-meili-brand.png',
  '/assets/showcase-tmall-618.png',
];

const fitChoices = [
  {
    id: 'fulltime',
    label: '全职',
    message: '风格合适，请联系。',
    Icon: BriefcaseBusiness,
  },
  {
    id: 'collaboration',
    label: '合作',
    message: '风格合适，可以选择兼职合作。',
    Icon: Handshake,
  },
];

function useSectionEntrance() {
  useEffect(() => {
    const sections = Array.from(document.querySelectorAll('.section-stage'));
    if (!sections.length) return undefined;

    const enterVisibleSections = () => {
      sections.forEach((section) => {
        if (section.classList.contains('is-section-entered')) return;
        const rect = section.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight * 0.88 && rect.bottom > window.innerHeight * 0.12;
        if (isVisible) {
          section.classList.add('is-section-entered');
        }
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-section-entered');
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.04, rootMargin: '0px 0px -4% 0px' },
    );

    sections.forEach((section, index) => {
      section.style.setProperty('--section-order', index);
      observer.observe(section);
    });
    enterVisibleSections();
    window.addEventListener('scroll', enterVisibleSections, { passive: true });
    window.addEventListener('resize', enterVisibleSections);

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', enterVisibleSections);
      window.removeEventListener('resize', enterVisibleSections);
    };
  }, []);
}

function handleHeroPointerMove(event) {
  const rect = event.currentTarget.getBoundingClientRect();
  const pointerX = (event.clientX - rect.left) / rect.width;
  const pointerY = (event.clientY - rect.top) / rect.height;
  const x = pointerX - 0.5;
  const y = pointerY - 0.5;
  event.currentTarget.style.setProperty('--hero-shift-x', `${x * 26}px`);
  event.currentTarget.style.setProperty('--hero-shift-y', `${y * 18}px`);
  event.currentTarget.style.setProperty('--hero-rotate-y', `${x * 7}deg`);
  event.currentTarget.style.setProperty('--hero-rotate-x', `${y * -5}deg`);
  event.currentTarget.style.setProperty('--hero-light-x', `${62 + x * 18}%`);
  event.currentTarget.style.setProperty('--hero-light-y', `${42 + y * 14}%`);
  event.currentTarget.style.setProperty('--hero-aura-x', `${x * 34}px`);
  event.currentTarget.style.setProperty('--hero-aura-y', `${y * 26}px`);
}

function resetHeroPointer(event) {
  event.currentTarget.style.setProperty('--hero-shift-x', '0px');
  event.currentTarget.style.setProperty('--hero-shift-y', '0px');
  event.currentTarget.style.setProperty('--hero-rotate-y', '0deg');
  event.currentTarget.style.setProperty('--hero-rotate-x', '0deg');
  event.currentTarget.style.setProperty('--hero-light-x', '62%');
  event.currentTarget.style.setProperty('--hero-light-y', '42%');
  event.currentTarget.style.setProperty('--hero-aura-x', '0px');
  event.currentTarget.style.setProperty('--hero-aura-y', '0px');
}

function handlePortraitPointerMove(event) {
  const rect = event.currentTarget.getBoundingClientRect();
  const pointerX = (event.clientX - rect.left) / rect.width;
  const pointerY = (event.clientY - rect.top) / rect.height;
  const x = pointerX - 0.5;
  const y = pointerY - 0.5;

  event.currentTarget.style.setProperty('--portrait-glow-x', `${pointerX * 100}%`);
  event.currentTarget.style.setProperty('--portrait-glow-y', `${pointerY * 100}%`);
  event.currentTarget.style.setProperty('--portrait-tilt-x', `${y * -8}deg`);
  event.currentTarget.style.setProperty('--portrait-tilt-y', `${x * 9}deg`);
  event.currentTarget.style.setProperty('--portrait-shift-x', `${x * 10}px`);
  event.currentTarget.style.setProperty('--portrait-shift-y', `${y * 8}px`);
  event.currentTarget.style.setProperty('--portrait-image-x', `${x * -4}px`);
  event.currentTarget.style.setProperty('--portrait-image-y', `${y * -3}px`);
}

function resetPortraitPointer(event) {
  event.currentTarget.style.setProperty('--portrait-glow-x', '50%');
  event.currentTarget.style.setProperty('--portrait-glow-y', '44%');
  event.currentTarget.style.setProperty('--portrait-tilt-x', '0deg');
  event.currentTarget.style.setProperty('--portrait-tilt-y', '0deg');
  event.currentTarget.style.setProperty('--portrait-shift-x', '0px');
  event.currentTarget.style.setProperty('--portrait-shift-y', '0px');
  event.currentTarget.style.setProperty('--portrait-image-x', '0px');
  event.currentTarget.style.setProperty('--portrait-image-y', '0px');
}

function handleMetricPointerMove(event) {
  const rect = event.currentTarget.getBoundingClientRect();
  const pointerX = (event.clientX - rect.left) / rect.width;
  const pointerY = (event.clientY - rect.top) / rect.height;
  const x = pointerX - 0.5;
  const y = pointerY - 0.5;

  event.currentTarget.style.setProperty('--metric-glow-x', `${pointerX * 100}%`);
  event.currentTarget.style.setProperty('--metric-glow-y', `${pointerY * 100}%`);
  event.currentTarget.style.setProperty('--metric-tilt-x', `${y * -7}deg`);
  event.currentTarget.style.setProperty('--metric-tilt-y', `${x * 8}deg`);
  event.currentTarget.style.setProperty('--metric-shift-x', `${x * 7}px`);
  event.currentTarget.style.setProperty('--metric-shift-y', `${y * 6}px`);
}

function resetMetricPointer(event) {
  event.currentTarget.style.setProperty('--metric-glow-x', '50%');
  event.currentTarget.style.setProperty('--metric-glow-y', '50%');
  event.currentTarget.style.setProperty('--metric-tilt-x', '0deg');
  event.currentTarget.style.setProperty('--metric-tilt-y', '0deg');
  event.currentTarget.style.setProperty('--metric-shift-x', '0px');
  event.currentTarget.style.setProperty('--metric-shift-y', '0px');
}

function renderMetricValue(value) {
  if (value.includes('万')) {
    return (
      <strong className="metric-value metric-value--ten-thousand">
        <span>1</span>
        <span className="metric-unit">
          万
          <sup>+</sup>
        </span>
      </strong>
    );
  }

  return <strong className="metric-value">{value}</strong>;
}

function ToolLogo({ kind }) {
  if (kind === 'figma') {
    return (
      <svg className="tool-logo-svg" viewBox="0 0 64 64" aria-hidden="true">
        <circle cx="24" cy="14" r="11" fill="#ff7262" />
        <circle cx="40" cy="14" r="11" fill="#f76b5c" />
        <circle cx="24" cy="32" r="11" fill="#a259ff" />
        <circle cx="40" cy="32" r="11" fill="#1abcfe" />
        <circle cx="24" cy="50" r="11" fill="#0acf83" />
      </svg>
    );
  }

  if (kind === 'framer') {
    return (
      <svg className="tool-logo-svg" viewBox="0 0 64 64" aria-hidden="true">
        <path d="M18 8h30v16H32L18 8Z" fill="#8ddcff" />
        <path d="M18 24h30L32 40H18V24Z" fill="#5aa7ff" />
        <path d="M18 40h16v16L18 40Z" fill="#2f74ff" />
      </svg>
    );
  }

  if (kind === 'ai' || kind === 'ps' || kind === 'ae' || kind === 'id') {
    const labelMap = {
      ai: 'Ai',
      ps: 'Ps',
      ae: 'Ae',
      id: 'Id',
    };

    return <span className="tool-letter">{labelMap[kind]}</span>;
  }

  if (kind === 'sketch') {
    return (
      <svg className="tool-logo-svg" viewBox="0 0 64 64" aria-hidden="true">
        <path d="M13 19 24 8h16l11 11-19 37L13 19Z" fill="#f9b72d" />
        <path d="M13 19h38L32 56 13 19Z" fill="#ffcf3d" />
        <path d="M24 8 13 19h13L24 8Zm16 0 11 11H38L40 8Z" fill="#ffe17a" />
        <path d="M26 19h12L32 56 26 19Z" fill="#f29f05" opacity="0.65" />
      </svg>
    );
  }

  if (kind === 'axure') {
    return (
      <svg className="tool-logo-svg" viewBox="0 0 64 64" aria-hidden="true">
        <rect x="8" y="8" width="48" height="48" rx="12" fill="#0b57d0" />
        <path d="M18 45 29 18h6l11 27h-7l-2-6H27l-2 6h-7Zm11-12h6l-3-8-3 8Z" fill="#fff" />
        <path d="M43 18h5v27h-5V18Z" fill="#8bc7ff" />
      </svg>
    );
  }

  if (kind === 'pxcook') {
    return (
      <svg className="tool-logo-svg" viewBox="0 0 64 64" aria-hidden="true">
        <rect x="8" y="8" width="48" height="48" rx="14" fill="#ff7a1a" />
        <path d="M20 25c0-7 5-11 12-11s12 4 12 11H20Z" fill="#fff" />
        <path d="M20 28h24v13c0 6-5 10-12 10S20 47 20 41V28Z" fill="#fff5e8" />
        <path d="M26 34h12v4H26v-4Zm0 8h9v4h-9v-4Z" fill="#ff7a1a" />
      </svg>
    );
  }

  if (kind === 'lanhu') {
    return (
      <svg className="tool-logo-svg" viewBox="0 0 64 64" aria-hidden="true">
        <rect x="8" y="8" width="48" height="48" rx="14" fill="#1688ff" />
        <path d="M21 18v28h22" fill="none" stroke="#fff" strokeLinecap="round" strokeWidth="7" />
        <path d="M25 38c7-10 14-10 21 0" fill="none" stroke="#9ed5ff" strokeLinecap="round" strokeWidth="6" />
      </svg>
    );
  }

  if (kind === 'spline') {
    return (
      <svg className="tool-logo-svg" viewBox="0 0 64 64" aria-hidden="true">
        <rect x="7" y="7" width="50" height="50" rx="14" fill="#65dcb8" />
        <path
          d="M18 39c12 0 12-19 23-19 5 0 8 3 8 8 0 11-14 11-14 0"
          fill="none"
          stroke="#fff"
          strokeLinecap="round"
          strokeWidth="6"
        />
      </svg>
    );
  }

  if (kind === 'blender') {
    return (
      <svg className="tool-logo-svg" viewBox="0 0 64 64" aria-hidden="true">
        <path
          d="M10 33h21L20 23l7-6 18 18-18 18-7-6 11-10H10v-4Z"
          fill="#f48a00"
        />
        <circle cx="42" cy="36" r="15" fill="#f48a00" />
        <circle cx="42" cy="36" r="8" fill="#7ac8ff" />
        <circle cx="42" cy="36" r="4" fill="#fff" />
      </svg>
    );
  }

  if (kind === 'c4d') {
    return (
      <svg className="tool-logo-svg" viewBox="0 0 64 64" aria-hidden="true">
        <rect x="8" y="8" width="48" height="48" rx="14" fill="#111923" />
        <circle cx="32" cy="32" r="21" fill="url(#c4dGlow)" />
        <path d="M22 37c4 8 19 8 24-3-8 4-17 2-24 3Z" fill="#eaf7ff" opacity="0.92" />
        <defs>
          <radialGradient id="c4dGlow" cx="32" cy="26" r="24" gradientUnits="userSpaceOnUse">
            <stop stopColor="#f7fbff" />
            <stop offset="0.45" stopColor="#4fa8ff" />
            <stop offset="1" stopColor="#082b5f" />
          </radialGradient>
        </defs>
      </svg>
    );
  }

  if (kind === 'midjourney') {
    return (
      <svg className="tool-logo-svg" viewBox="0 0 64 64" aria-hidden="true">
        <rect x="8" y="8" width="48" height="48" rx="14" fill="#111" />
        <path d="M13 44c12-3 20-11 26-26 5 12 8 21 12 29-12-8-25-8-38-3Z" fill="#f1eee7" />
        <path d="M31 26c-4 8-9 13-16 17 12-3 23-2 33 4-8-5-13-12-17-21Z" fill="#111" opacity="0.28" />
      </svg>
    );
  }

  if (kind === 'deepseek') {
    return (
      <svg className="tool-logo-svg" viewBox="0 0 64 64" aria-hidden="true">
        <rect x="8" y="8" width="48" height="48" rx="14" fill="#2f7dff" />
        <path d="M19 37c0-10 8-18 18-18 6 0 11 3 15 7-4 0-8 2-11 5 3 1 6 4 7 8-5-3-9-3-13 0-5 4-11 5-16-2Z" fill="#fff" />
        <circle cx="39" cy="29" r="3" fill="#2f7dff" />
      </svg>
    );
  }

  if (kind === 'liblib') {
    return (
      <svg className="tool-logo-svg" viewBox="0 0 64 64" aria-hidden="true">
        <path d="M9 16c0-5 4-9 9-9h20v24H18c-5 0-9-4-9-9v-6Z" fill="#99ff2d" />
        <path d="M38 7h17v24H38V7Z" fill="#75df20" />
        <path d="M9 33h20v24H18c-5 0-9-4-9-9V33Z" fill="#8af12a" />
        <path d="M31 33h24v24H31V33Z" fill="#b9ff38" />
      </svg>
    );
  }

  if (kind === 'motion') {
    return (
      <svg className="tool-logo-svg" viewBox="0 0 64 64" aria-hidden="true">
        <rect x="8" y="8" width="48" height="48" rx="12" fill="#f12610" />
        <path d="M31 14c10 3 14 8 13 17-9 1-15-3-17-12 2-2 3-3 4-5Z" fill="#fff" opacity="0.92" />
        <path d="M50 31c-3 10-8 14-17 13-1-9 3-15 12-17 2 2 3 3 5 4Z" fill="#fff" opacity="0.84" />
        <path d="M33 50c-10-3-14-8-13-17 9-1 15 3 17 12-2 2-3 3-4 5Z" fill="#fff" opacity="0.92" />
      </svg>
    );
  }

  if (kind === 'notion') {
    return (
      <svg className="tool-logo-svg" viewBox="0 0 64 64" aria-hidden="true">
        <path d="M12 10 50 7l7 8v39l-38 4-7-8V10Z" fill="#0d0d0d" stroke="#f7f3ea" strokeWidth="3" />
        <path d="M19 17 50 14v37l-31 3V17Z" fill="#050505" stroke="#f7f3ea" strokeWidth="2" />
        <path d="M25 25h5l13 17V24h5v27h-5L30 33v19h-5V25Z" fill="#f7f3ea" />
      </svg>
    );
  }

  return <span className="tool-letter">{kind}</span>;
}

function Header() {
  const [isBubbleOpen, setIsBubbleOpen] = useState(false);

  return (
    <header className="site-header">
      <a className="brand-mark" href="#top" aria-label="回到首页">
        <CircleDot size={28} aria-hidden="true" />
      </a>
      <button className="menu-button" type="button" aria-label="打开导航">
        <Menu size={30} aria-hidden="true" />
      </button>
      <nav className="site-nav" aria-label="主导航">
        {navItems.map((item, index) => (
          <a href={item.href} key={item.href}>
            <ShuffleTitle
              as="small"
              className="nav-shuffle nav-shuffle-index"
              text={`${String(index + 1).padStart(2, '0')} /`}
              scrambleCharset="0123456789/"
              startDelay={360 + index * 70}
            />
            <ShuffleTitle
              as="span"
              className="nav-shuffle nav-shuffle-label"
              text={item.label}
              scrambleCharset="经历项目优势联系AIUX"
              startDelay={460 + index * 70}
            />
          </a>
        ))}
      </nav>
      <div className="header-tools">
        <button type="button" aria-label="视觉设置">
          <Settings size={18} aria-hidden="true" />
        </button>
        <button type="button" aria-label="网格视图">
          <Grid3X3 size={18} aria-hidden="true" />
        </button>
        <div className={`bubble-link-menu ${isBubbleOpen ? 'is-open' : ''}`}>
          <button
            className="header-contact bubble-link-toggle"
            type="button"
            aria-label="打开快速链接"
            aria-expanded={isBubbleOpen}
            onClick={() => setIsBubbleOpen((open) => !open)}
          >
            <X size={16} aria-hidden="true" />
          </button>
          <div className="bubble-link-panel" aria-label="快速链接">
            {bubbleLinks.map((link, index) => (
              <a
                className="bubble-link-item"
                href={link.href}
                key={link.label}
                aria-label={link.ariaLabel}
                style={{
                  '--bubble-index': index,
                  '--bubble-rotate': `${(index - 1) * 4}deg`,
                  '--bubble-nudge': `${index * -4}px`,
                }}
                tabIndex={isBubbleOpen ? 0 : -1}
                onClick={() => setIsBubbleOpen(false)}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section
      className="hero section-screen section-stage"
      id="top"
      aria-label="首页"
      onPointerMove={handleHeroPointerMove}
      onPointerLeave={resetHeroPointer}
    >
      <video
        className="hero-video"
        autoPlay
        muted
        loop
        playsInline
        poster="/assets/hero-poster.png"
      >
        <source src="/assets/hero-loop.webm" type="video/webm" />
      </video>
      <div className="hero-follow-light" aria-hidden="true" />
      <div className="hero-vignette" />
      <Header />

      <div className="hero-inner content-shell">
        <div className="hero-copy">
          <p className="eyebrow">VISUAL DESIGNER / AI DESIGNER / BRANDING</p>
          <h1>
            解锁你的
            <span>视觉商业潜能</span>
            <span>WITH AI DESIGN.</span>
          </h1>
          <p className="hero-lead">
            从品牌VI、B端系统到电商运营视觉，用更强的视觉识别与AIGC工作流，
            让设计方案更快、更准、更能落地。
          </p>
          <a className="read-more" href="#projects">
            查看作品
          </a>
        </div>

        <div className="hero-title">
          <span>CREATIVE</span>
          <span>BRANDING</span>
          <span>STUDIO</span>
        </div>

        <figure className="hero-flying">
          <img src="/assets/hero-flying.png" alt="飞行中的3D设计师形象" />
        </figure>

        <div className="hero-stats" aria-label="关键项目数据">
          {heroStats.map((item) => (
            <article className="hero-stat" key={item.label}>
              <strong>{item.value}</strong>
              <span>{item.label}</span>
            </article>
          ))}
        </div>

        <article className="partner-card">
          <span>Your Partner in</span>
          <strong>Business Growth</strong>
          <p>UI/UX / Brand VIS / AIGC / 3D Visual</p>
          <a href={`mailto:${profile.email}`} aria-label="联系石书源">
            <ArrowUpRight size={20} aria-hidden="true" />
          </a>
        </article>

        <div className="hero-word" aria-hidden="true">
          BRANDING
        </div>
      </div>

      <div className="hero-footer">
        <div className="content-shell hero-footer-inner">
          <span>CORE SERVICES</span>
          <div>
            <b>UI/UX</b>
            <b>BRAND VIS</b>
            <b>AIGC WORKFLOW</b>
            <b>IP DESIGN</b>
            <b>ECOMMERCE</b>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProfileSection() {
  return (
    <section className="profile-section page-section section-stage" id="profile">
      <div className="content-shell profile-grid">
        <div className="section-heading profile-heading">
          <p className="section-kicker">01 / ABOUT</p>
          <ShuffleTitle text="不是套模板的设计师，而是把视觉、产品和AI工作流串起来的人。" />
        </div>
        <div className="profile-copy">
          <p>{profile.summary}</p>
          <div className="contact-row">
            <a href={`tel:${profile.phone}`}>
              <Phone size={18} aria-hidden="true" />
              {profile.phone}
            </a>
            <a href={`mailto:${profile.email}`}>
              <Mail size={18} aria-hidden="true" />
              {profile.email}
            </a>
            <span>
              <MapPin size={18} aria-hidden="true" />
              {profile.location}
            </span>
          </div>
        </div>
        <article
          className="about-portrait"
          onPointerMove={handlePortraitPointerMove}
          onPointerLeave={resetPortraitPointer}
        >
          <img src="/assets/about-avatar.png" alt="石书源个人视觉主图" />
          <div>
            <span>ABOUT SHI SHUYUAN</span>
            <h3>{profile.name}</h3>
            <p>{profile.headline}</p>
          </div>
        </article>
        <div className="metric-grid">
          {metrics.map((metric) => (
            <div
              className="metric-item"
              key={metric.label}
              onPointerMove={handleMetricPointerMove}
              onPointerLeave={resetMetricPointer}
            >
              {renderMetricValue(metric.value)}
              <span>{metric.label}</span>
            </div>
          ))}
        </div>
        <div className="experience-list">
          {experience.map((item) => (
            <article className="experience-item" key={`${item.company}-${item.period}`}>
              <time>{item.period}</time>
              <div>
                <h3>{item.company}</h3>
                <p>{item.title}</p>
                <span>{item.detail}</span>
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
}

function ProjectsSection() {
  const [selectedFitChoice, setSelectedFitChoice] = useState(null);
  const showcaseWallRef = useRef(null);
  const selectedFitMessage = fitChoices.find((choice) => choice.id === selectedFitChoice)?.message;

  useEffect(() => {
    const wall = showcaseWallRef.current;
    if (!wall) return undefined;

    const mobileQuery = window.matchMedia('(max-width: 900px)');
    let timerId;
    let currentIndex = 0;

    const getCards = () => Array.from(wall.querySelectorAll('.showcase-card'));
    const scrollToCard = (index) => {
      const cards = getCards();
      const card = cards[index];
      if (!card) return;
      currentIndex = index;
      wall.scrollTo({
        left: card.offsetLeft - wall.offsetLeft,
        behavior: 'smooth',
      });
    };
    const startAutoPaging = () => {
      window.clearInterval(timerId);
      if (!mobileQuery.matches) return;
      timerId = window.setInterval(() => {
        const cards = getCards();
        if (cards.length < 2) return;
        scrollToCard((currentIndex + 1) % cards.length);
      }, 2800);
    };

    const syncFromManualScroll = () => {
      const cards = getCards();
      if (!cards.length) return;
      const nearestIndex = cards.reduce((nearest, card, index) => {
        const currentDistance = Math.abs(card.offsetLeft - wall.offsetLeft - wall.scrollLeft);
        const nearestDistance = Math.abs(cards[nearest].offsetLeft - wall.offsetLeft - wall.scrollLeft);
        return currentDistance < nearestDistance ? index : nearest;
      }, currentIndex);
      currentIndex = nearestIndex;
    };

    startAutoPaging();
    wall.addEventListener('scroll', syncFromManualScroll, { passive: true });
    mobileQuery.addEventListener('change', startAutoPaging);

    return () => {
      window.clearInterval(timerId);
      wall.removeEventListener('scroll', syncFromManualScroll);
      mobileQuery.removeEventListener('change', startAutoPaging);
    };
  }, []);

  return (
    <section className="projects-section section-screen section-stage" id="projects">
      <div className="content-shell showcase-shell">
        <div className="showcase-topline">
          <p className="section-kicker">02 / WORKS</p>
          <p>用黑色舞台和倾斜画框展示项目主视觉，弱化模板感，把作品当成一组正在展开的设计样片。</p>
        </div>

        <ShuffleTitle
          text="SHOWCASE"
          className="showcase-title"
          scrambleCharset="SHOWCASE0123456789AIUX"
        />

        <div className="showcase-wall" aria-label="精选项目展示" ref={showcaseWallRef}>
          {projects.slice(0, 4).map((project, index) => (
            <article
              className={`showcase-card ${showcaseCards[index]}`}
              key={project.title}
              style={{ '--showcase-index': index }}
            >
              <img src={showcaseImages[index] ?? project.image} alt={`${project.title}作品展示`} />
              <div className="showcase-card-content">
                <div className="showcase-meta">
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <span>{project.type}</span>
                </div>
                <h3>{project.title}</h3>
                <div className="showcase-results">
                  {project.results.slice(0, 2).map((result) => (
                    <span key={result}>{result}</span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>

        <section className="portfolio-directions" aria-labelledby="portfolio-directions-title">
          <div className="portfolio-section-title">
            <span aria-hidden="true">
              <svg viewBox="0 0 1142 1024" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M651.16 497.059H174.948l150.798-155.905H219.145L30.635 536.01l188.51 194.866h106.601L174.948 574.981H651.16v-77.922zM761.593 574.981h-77.922v-77.922h77.922v77.922zM872.12 574.981h-77.922v-77.922h77.922v77.922z"
                  fill="currentColor"
                />
              </svg>
            </span>
            <div>
              <h2 id="portfolio-directions-title">PORTFOLIO DIRECTIONS</h2>
              <p>商业项目方向</p>
            </div>
          </div>

          <div className="direction-grid">
            {projectDirectionItems.map((item) => (
              <article
                className={`direction-card ${item.isLoading ? 'direction-card--loading' : ''}`}
                key={item.title}
              >
                {item.isLoading ? (
                  <div className="direction-loading-visual" aria-hidden="true">
                    <LoaderCircle className="direction-loading-icon" size={34} strokeWidth={1.7} />
                    <strong>加载中</strong>
                    <div className="direction-loading-dots">
                      <span />
                      <span />
                      <span />
                    </div>
                  </div>
                ) : (
                  <img src={item.image} alt={`${item.title}作品方向`} />
                )}
                <h3>{item.title}</h3>
                <p>{item.category}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="portfolio-fit" aria-label="合作方向">
          <div className="portfolio-fit-copy">
            <h2>双向选择</h2>
            <p>
              我更适合需要视觉升级、AI提效和跨部门落地的项目：从品牌定位、界面设计到物料上线，
              让作品不只停留在展示图，而是能进入真实业务流程。
            </p>
            <div className="fit-choice-row" aria-label="选择合作方式">
              {fitChoices.map(({ id, label, Icon }) => (
                <button
                  className={`fit-choice ${selectedFitChoice === id ? 'is-selected' : ''}`}
                  key={id}
                  type="button"
                  aria-pressed={selectedFitChoice === id}
                  onClick={() => setSelectedFitChoice(id)}
                >
                  <Icon size={22} strokeWidth={1.8} aria-hidden="true" />
                  <span>{label}</span>
                </button>
              ))}
            </div>
            {selectedFitMessage ? (
              <p className="fit-choice-message">{selectedFitMessage}</p>
            ) : null}
          </div>
          <div className="partner-mark-grid" aria-label="项目方向关键词">
            {partnerMarks.map((mark) => (
              <span key={mark}>{mark}</span>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}

function StrengthsSection() {
  return (
    <section className="strengths-section page-section section-stage" id="strengths">
      <div className="content-shell capability-shell">
        <div className="capability-intro">
          <article className="career-panel">
            <p className="section-kicker">03 / CAPABILITY</p>
            <ShuffleTitle
              text="CAREER SO FAR"
              className="capability-title"
              scrambleCharset="CAREER0123456789AIUX"
            />
            <p>
              从B/G端系统、品牌VIS、IP形象到电商运营视觉，我更擅长把视觉设计放进真实业务里推进。
              现在的工作方式以AI视觉探索为前置能力，并通过跨部门沟通把需求、审美、开发和上线结果串起来。
            </p>
          </article>

          <article className="skills-panel">
            <h2>SKILLS</h2>
            <div className="skill-tags">
              {skillTags.map((tag, index) => (
                <span
                  className={index < 2 ? 'is-priority' : ''}
                  key={tag}
                >
                  {tag}
                </span>
              ))}
            </div>
          </article>
        </div>

        <div className="process-heading">
          <h2>
            MY 4 STEPS CREATIVE PROCESS
            <span>AND TOOLS I USED</span>
          </h2>
        </div>

        <div className="process-grid">
          {processSteps.map((step, index) => {
            const StepIcon = processIcons[index];

            return (
              <article className="process-card" key={step.title}>
                <div className="process-orb" aria-hidden="true">
                  <StepIcon size={25} strokeWidth={1.8} />
                </div>
                <span>{String(index + 1).padStart(2, '0')} / {step.label}</span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </article>
            );
          })}
        </div>

        <div className="tool-strip" aria-label="常用工具">
          {toolStack.map((tool) => (
            <span className={`tool-chip tool-${tool.kind}`} key={tool.label}>
              {tool.label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactSection() {
  return (
    <section className="contact-section section-screen section-stage" id="contact">
      <div className="content-shell contact-inner">
        <p className="section-kicker">04 / CONTACT</p>
        <ShuffleTitle text="让品牌、界面与AI视觉成为你的下一次增长入口。" />
        <div className="contact-actions">
          <a className="primary-action" href={`mailto:${profile.email}`}>
            <Mail size={20} aria-hidden="true" />
            <span>{profile.email}</span>
          </a>
          <a className="secondary-action" href={`tel:${profile.phone}`}>
            <Phone size={20} aria-hidden="true" />
            <span>{profile.phone}</span>
          </a>
        </div>
        <div className="contact-word" aria-hidden="true">
          CREATIVE DESIGN
        </div>
      </div>
    </section>
  );
}

export default function App() {
  useSectionEntrance();

  return (
    <>
      <Hero />
      <main>
        <ProfileSection />
        <ProjectsSection />
        <StrengthsSection />
        <ContactSection />
      </main>
    </>
  );
}

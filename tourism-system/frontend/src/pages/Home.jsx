import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

/* ─── Keyframe injection ─── */
const injectStyles = () => {
  if (document.getElementById('home-animations')) return;
  const style = document.createElement('style');
  style.id = 'home-animations';
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500;600&display=swap');

    * { box-sizing: border-box; margin: 0; padding: 0; }

    @keyframes slideIn {
      from { opacity: 0; transform: translateY(40px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeSlideLeft {
      from { opacity: 0; transform: translateX(-30px); }
      to   { opacity: 1; transform: translateX(0); }
    }
    @keyframes scaleIn {
      from { opacity: 0; transform: scale(0.92); }
      to   { opacity: 1; transform: scale(1); }
    }
    @keyframes slideKen {
      0%   { transform: scale(1.08); }
      100% { transform: scale(1); }
    }
    @keyframes revealUp {
      from { opacity: 0; transform: translateY(60px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes progressBar {
      from { width: 0%; }
      to   { width: 100%; }
    }
    @keyframes countUp {
      from { opacity: 0; transform: translateY(20px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes pulseGlow {
      0%, 100% { box-shadow: 0 0 0 0 rgba(253,230,138,0.3); }
      50%       { box-shadow: 0 0 0 16px rgba(253,230,138,0); }
    }
    @keyframes shimmer {
      0%   { background-position: -200% center; }
      100% { background-position: 200% center; }
    }
    @keyframes floatBadge {
      0%, 100% { transform: translateY(0); }
      50%       { transform: translateY(-6px); }
    }
    @keyframes rotateSlow {
      from { transform: rotate(0deg); }
      to   { transform: rotate(360deg); }
    }
    @keyframes dotPulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50%       { opacity: 0.5; transform: scale(0.7); }
    }
    @keyframes cardFloat {
      0%, 100% { transform: translateY(0px); }
      50%       { transform: translateY(-8px); }
    }
    @keyframes orbPulse {
      0%, 100% { transform: scale(1); opacity: 0.6; }
      50%       { transform: scale(1.15); opacity: 1; }
    }
    @keyframes lineGrow {
      from { width: 0; }
      to   { width: 60px; }
    }
    @keyframes featureReveal {
      from { opacity: 0; transform: translateY(30px) scale(0.95); }
      to   { opacity: 1; transform: translateY(0) scale(1); }
    }
    @keyframes borderSpin {
      0%   { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    @keyframes numberCount {
      from { transform: translateY(10px); opacity: 0; }
      to   { transform: translateY(0); opacity: 1; }
    }
    @keyframes glowPulse {
      0%, 100% { opacity: 0.5; }
      50%       { opacity: 1; }
    }
    @keyframes weatherSlide {
      from { opacity: 0; transform: translateX(20px); }
      to   { opacity: 1; transform: translateX(0); }
    }

    .slide-enter { animation: slideIn 0.8s cubic-bezier(0.16,1,0.3,1) forwards; }
    .hero-title  { animation: fadeSlideLeft 1s cubic-bezier(0.16,1,0.3,1) 0.3s both; }
    .hero-sub    { animation: fadeSlideLeft 1s cubic-bezier(0.16,1,0.3,1) 0.5s both; }
    .hero-cta    { animation: fadeSlideLeft 1s cubic-bezier(0.16,1,0.3,1) 0.7s both; }
    .hero-stats  { animation: fadeSlideLeft 1s cubic-bezier(0.16,1,0.3,1) 0.9s both; }

    .slide-bg {
      position: absolute; inset: 0;
      background-size: cover; background-position: center;
      transition: opacity 1.2s cubic-bezier(0.4,0,0.2,1);
    }
    .slide-bg.active { opacity: 1; }
    .slide-bg.inactive { opacity: 0; }
    .slide-bg-inner {
      width: 100%; height: 100%;
      background-size: cover; background-position: center;
    }
    .slide-bg.active .slide-bg-inner { animation: slideKen 7s ease-out forwards; }

    /* ── Service Cards ── */
    .service-card-new {
      transition: transform 0.4s cubic-bezier(0.16,1,0.3,1),
                  box-shadow 0.4s ease;
      cursor: pointer;
    }
    .service-card-new:hover {
      transform: translateY(-12px) !important;
      box-shadow: 0 32px 64px rgba(12,74,110,0.18) !important;
    }
    .service-card-new:hover .card-arrow {
      transform: translateX(6px);
    }
    .service-card-new:hover .card-icon-wrap {
      transform: scale(1.1) rotate(-5deg);
    }
    .card-arrow {
      transition: transform 0.3s cubic-bezier(0.16,1,0.3,1);
    }
    .card-icon-wrap {
      transition: transform 0.4s cubic-bezier(0.34,1.56,0.64,1);
    }

    /* ── Feature Pills ── */
    .feature-item-new {
      transition: transform 0.3s cubic-bezier(0.16,1,0.3,1),
                  box-shadow 0.3s ease,
                  background 0.3s ease;
    }
    .feature-item-new:hover {
      transform: translateY(-6px) scale(1.04) !important;
      box-shadow: 0 20px 40px rgba(12,74,110,0.14) !important;
    }
    .feature-item-new:hover .feature-icon-bg {
      transform: scale(1.15) rotate(8deg);
    }
    .feature-icon-bg {
      transition: transform 0.4s cubic-bezier(0.34,1.56,0.64,1);
    }

    /* ── Widget cards ── */
    .widget-card-new {
      transition: transform 0.35s cubic-bezier(0.16,1,0.3,1),
                  box-shadow 0.35s ease;
    }
    .widget-card-new:hover {
      transform: translateY(-6px);
      box-shadow: 0 28px 56px rgba(12,74,110,0.16) !important;
    }

    .cta-btn-white {
      transition: transform 0.22s ease, box-shadow 0.22s ease, background 0.22s ease;
    }
    .cta-btn-white:hover {
      transform: translateY(-3px);
      box-shadow: 0 16px 40px rgba(0,0,0,0.3) !important;
      background: #f0f9ff !important;
    }
    .cta-btn-gold {
      transition: transform 0.22s ease, box-shadow 0.22s ease;
      animation: pulseGlow 3s ease-in-out infinite;
    }
    .cta-btn-gold:hover {
      transform: translateY(-3px) scale(1.03);
      box-shadow: 0 16px 40px rgba(249,115,22,0.5) !important;
    }

    .scroll-indicator {
      animation: slideIn 1s ease 1.4s both;
    }

    .stat-item {
      animation: countUp 0.7s cubic-bezier(0.16,1,0.3,1) both;
    }

    .reveal-section {
      opacity: 0;
      transform: translateY(40px);
      transition: opacity 0.8s cubic-bezier(0.16,1,0.3,1),
                  transform 0.8s cubic-bezier(0.16,1,0.3,1);
    }
    .reveal-section.visible {
      opacity: 1;
      transform: translateY(0);
    }

    .nav-dot {
      transition: all 0.3s ease;
      cursor: pointer;
    }
    .nav-dot:hover { transform: scale(1.3); }

    .slide-thumb {
      transition: all 0.3s ease;
      cursor: pointer;
      overflow: hidden;
    }
    .slide-thumb:hover { transform: scale(1.05); opacity: 1 !important; }

    .convert-btn {
      transition: transform 0.22s ease, box-shadow 0.22s ease;
    }
    .convert-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 28px rgba(3,105,161,0.4) !important;
    }

    @media (max-width: 768px) {
      .hero-title-text { font-size: clamp(2rem, 8vw, 3.5rem) !important; }
      .stats-row { flex-direction: row !important; flex-wrap: wrap !important; }
      .stats-row > div { border-right: none !important; border-bottom: 1px solid rgba(255,255,255,0.15); padding: 12px 16px !important; min-width: 45%; }
      .services-grid-new { grid-template-columns: 1fr !important; }
      .features-grid-new { grid-template-columns: repeat(2, 1fr) !important; }
      .widget-grid-new { grid-template-columns: 1fr !important; }
      .thumb-strip { display: none !important; }
      .section-label-line { display: none !important; }
    }
    @media (max-width: 480px) {
      .features-grid-new { grid-template-columns: repeat(2, 1fr) !important; }
    }
  `;
  document.head.appendChild(style);
};

/* ─── Slide data (Unsplash — travel / Sri Lanka) ─── */
const SLIDES = [
  {
    url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1800&q=80',
    tag: 'Beach Paradise',
    headline: <>Explore the <em style={{ color: '#fde68a', fontStyle: 'normal' }}>Golden</em><br />Shores of the South</>,
    sub: 'Sun-kissed beaches, warm turquoise waters and serenity await.',
  },
  {
    url: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=1800&q=80',
    tag: 'Luxury Stays',
    headline: <>Unwind in<br /><em style={{ color: '#fde68a', fontStyle: 'normal' }}>World-Class</em> Resorts</>,
    sub: 'Handpicked hotels where elegance meets tropical charm.',
  },
  {
    url: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=1800&q=80',
    tag: 'Heritage & Culture',
    headline: <>Discover<br /><em style={{ color: '#fde68a', fontStyle: 'normal' }}>Ancient</em> Wonders</>,
    sub: 'Walk through centuries of history along the southern coast.',
  },
  {
    url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1800&q=80',
    tag: 'Adventure Awaits',
    headline: <>Your Next<br /><em style={{ color: '#fde68a', fontStyle: 'normal' }}>Sri Lankan</em> Adventure</>,
    sub: 'Book hotels, vehicles & expert guides for the trip of a lifetime.',
  },
];

/* ─── Intersection-observer hook ─── */
function useReveal(ref) {
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } },
      { threshold: 0.12 }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
}

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════ */
export default function Home() {
  useEffect(() => { injectStyles(); }, []);
  const { t } = useTranslation();

  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef(null);
  const progressRef = useRef(null);

  const startCycle = (idx) => {
    clearInterval(intervalRef.current);
    clearInterval(progressRef.current);
    setProgress(0);
    let p = 0;
    progressRef.current = setInterval(() => {
      p += 100 / 70;
      if (p >= 100) { p = 100; clearInterval(progressRef.current); }
      setProgress(p);
    }, 100);
    intervalRef.current = setInterval(() => {
      setCurrent(c => { const next = (c + 1) % SLIDES.length; startCycle(next); return next; });
    }, 7000);
  };

  useEffect(() => { startCycle(0); return () => { clearInterval(intervalRef.current); clearInterval(progressRef.current); }; }, []);

  const goTo = (i) => { setCurrent(i); startCycle(i); };

  const servicesRef = useRef(null);
  const featuresRef = useRef(null);
  const widgetsRef  = useRef(null);
  useReveal(servicesRef);
  useReveal(featuresRef);
  useReveal(widgetsRef);

  return (
    <div style={{ fontFamily: '"DM Sans", sans-serif', overflowX: 'hidden' }}>

      {/* ── HERO ── */}
      <div style={{ position: 'relative', height: '100vh', minHeight: 600, overflow: 'hidden' }}>

        {/* Slide backgrounds */}
        {SLIDES.map((s, i) => (
          <div key={i} className={`slide-bg ${i === current ? 'active' : 'inactive'}`}>
            <div className="slide-bg-inner" style={{ backgroundImage: `url(${s.url})` }} />
          </div>
        ))}

        {/* Layered overlays */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(4,30,50,0.78) 0%, rgba(3,105,161,0.45) 60%, rgba(14,165,233,0.2) 100%)', zIndex: 1 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(4,20,40,0.9) 0%, transparent 55%)', zIndex: 2 }} />

        {/* Decorative orbs */}
        <div style={{ position: 'absolute', top: '8%', right: '6%', width: 320, height: 320, borderRadius: '50%', background: 'radial-gradient(circle, rgba(253,230,138,0.1) 0%, transparent 70%)', zIndex: 3, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '20%', left: '-4%', width: 260, height: 260, borderRadius: '50%', background: 'radial-gradient(circle, rgba(14,165,233,0.12) 0%, transparent 70%)', zIndex: 3, pointerEvents: 'none' }} />

        {/* Tag badge */}
        <div key={`tag-${current}`} style={{
          position: 'absolute', top: 40, left: '45%', transform: 'translateX(-50%)',
          zIndex: 10, animation: 'slideIn 0.6s cubic-bezier(0.16,1,0.3,1) both',
        }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.25)', borderRadius: 999,
            padding: '7px 20px',
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#fde68a', display: 'inline-block', animation: 'dotPulse 1.5s ease-in-out infinite' }} />
            <span style={{ fontSize: 11, color: '#bae6fd', letterSpacing: '0.1em', fontWeight: 600, textTransform: 'uppercase' }}>
              {SLIDES[current].tag}
            </span>
          </div>
        </div>

        {/* Main content */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 24px', textAlign: 'center' }}>
          <h1
            key={`h-${current}`}
            className="hero-title hero-title-text"
            style={{
              fontFamily: '"Cormorant Garamond", serif',
              fontSize: 'clamp(2.6rem, 7vw, 5.2rem)',
              fontWeight: 600, color: 'white', lineHeight: 1.1,
              marginBottom: 22, letterSpacing: '-0.01em',
              textShadow: '0 2px 40px rgba(0,0,0,0.4)',
            }}
          >
            {SLIDES[current].headline}
          </h1>

          <p key={`p-${current}`} className="hero-sub" style={{
            fontSize: 'clamp(0.95rem, 2vw, 1.15rem)',
            color: 'rgba(186,230,253,0.9)', lineHeight: 1.8,
            maxWidth: 520, marginBottom: 44,
            textShadow: '0 1px 12px rgba(0,0,0,0.3)',
          }}>
            {SLIDES[current].sub}
          </p>

          <div className="hero-cta" style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/hotels" className="cta-btn-white" style={{
              background: 'white', color: '#0c4a6e', padding: '15px 36px',
              borderRadius: 14, fontWeight: 700, fontSize: 15, textDecoration: 'none',
              boxShadow: '0 8px 32px rgba(0,0,0,0.25)', letterSpacing: '0.02em',
            }}>
              Explore Hotels
            </Link>
            <Link to="/packages" className="cta-btn-gold" style={{
              background: 'linear-gradient(135deg, #fde68a 0%, #f97316 100%)',
              color: '#7c2d12', padding: '15px 36px', borderRadius: 14,
              fontWeight: 700, fontSize: 15, textDecoration: 'none',
              boxShadow: '0 8px 32px rgba(249,115,22,0.4)', letterSpacing: '0.02em',
            }}>
              🎒 All-in-One Package
            </Link>
          </div>

          {/* Stats */}
          <div className="hero-stats stats-row" style={{
            display: 'flex', gap: 0, justifyContent: 'center',
            marginTop: 72, flexWrap: 'wrap',
          }}>
            {[['500+','Hotels Listed'],['200+','Vehicles'],['100+','Expert Guides'],['50K+','Happy Tourists']].map(([num, label], i) => (
              <div key={label} className="stat-item" style={{
                padding: '0 36px',
                borderRight: i < 3 ? '1px solid rgba(255,255,255,0.15)' : 'none',
                textAlign: 'center',
                animationDelay: `${1.0 + i * 0.12}s`,
              }}>
                <div style={{
                  fontSize: 'clamp(1.4rem,3vw,2rem)', fontWeight: 700, color: '#fde68a',
                  fontFamily: '"Cormorant Garamond",serif', letterSpacing: '-0.01em',
                }}>{num}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', marginTop: 3, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Slide navigation — dots + progress */}
        <div style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)', zIndex: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
          <div style={{ display: 'flex', gap: 10 }}>
            {SLIDES.map((_, i) => (
              <button key={i} className="nav-dot" onClick={() => goTo(i)} style={{
                width: i === current ? 32 : 8, height: 8,
                borderRadius: 999, border: 'none', cursor: 'pointer',
                background: i === current ? '#fde68a' : 'rgba(255,255,255,0.4)',
                padding: 0,
                transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)',
              }} />
            ))}
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, background: 'rgba(255,255,255,0.12)', zIndex: 20 }}>
          <div style={{ height: '100%', background: 'linear-gradient(90deg,#0ea5e9,#fde68a)', width: `${progress}%`, transition: 'width 0.1s linear', borderRadius: '0 999px 999px 0' }} />
        </div>

        {/* Scroll indicator */}
        <div className="scroll-indicator" style={{
          position: 'absolute', bottom: 80, left: '50%', transform: 'translateX(-50%)',
          zIndex: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
        }}>
          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Scroll</span>
          <div style={{
            width: 22, height: 36, border: '1.5px solid rgba(255,255,255,0.25)',
            borderRadius: 999, display: 'flex', justifyContent: 'center', paddingTop: 6,
          }}>
            <div style={{
              width: 4, height: 8, background: '#fde68a', borderRadius: 999,
              animation: 'slideIn 1.5s ease-in-out infinite',
            }} />
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════
          ── SERVICES — Enhanced ──
      ══════════════════════════════════════ */}
      <div ref={servicesRef} className="reveal-section" style={{
        position: 'relative',
        background: '#f8faff',
        padding: '120px 24px',
        overflow: 'hidden',
      }}>
        {/* Background decorative shapes */}
        <div style={{
          position: 'absolute', top: -80, right: -80, width: 400, height: 400,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(14,165,233,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: -60, left: -60, width: 320, height: 320,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(253,230,138,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: 1160, margin: '0 auto', position: 'relative' }}>
          {/* Section header */}
          <div style={{ marginBottom: 72, textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, marginBottom: 16 }}>
              <div className="section-label-line" style={{
                height: 2, width: 40,
                background: 'linear-gradient(90deg, #0ea5e9, #38bdf8)',
                borderRadius: 999,
                animation: 'lineGrow 0.6s ease 0.3s both',
              }} />
              <span style={{
                fontSize: 11, fontWeight: 700, letterSpacing: '0.18em',
                color: '#0369a1', textTransform: 'uppercase',
              }}>What We Offer</span>
            </div>
            <h2 style={{
              fontFamily: '"Cormorant Garamond", serif',
              fontSize: 'clamp(2rem, 4.5vw, 3.2rem)',
              color: '#071a2c',
              fontWeight: 700,
              lineHeight: 1.15,
              maxWidth: 520,
              margin: '0 auto 16px',
            }}>
              Curated Travel<br />
              <span style={{
                background: 'linear-gradient(135deg, #0369a1, #0ea5e9)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>Services</span>
            </h2>
            <p style={{ color: '#64748b', fontSize: 15, lineHeight: 1.8, maxWidth: 420, margin: '0 auto' }}>
              Everything you need for a perfect Southern Sri Lanka experience — handpicked, verified, and ready to book.
            </p>
          </div>

          <div className="services-grid-new" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 28,
          }}>
            {[
              {
                emoji: '🏨',
                title: 'Hotels & Resorts',
                desc: 'Browse curated hotels across Southern Sri Lanka with room-level booking, real-time availability, and verified reviews.',
                link: '/hotels',
                accent: '#0c4a6e',
                accentLight: '#bae6fd',
                accentMid: '#0ea5e9',
                grad: 'linear-gradient(135deg, #0c4a6e 0%, #0369a1 100%)',
                lightGrad: 'linear-gradient(135deg, #e0f2fe, #f0f9ff)',
                tag: 'Book Now',
                num: '500+',
                numLabel: 'Hotels',
              },
              {
                emoji: '🚗',
                title: 'Vehicle Rentals',
                desc: 'Rent cars, vans, tuk-tuks and more. Includes a built-in fuel cost estimator for your travel routes.',
                link: '/vehicles',
                accent: '#065f46',
                accentLight: '#a7f3d0',
                accentMid: '#10b981',
                grad: 'linear-gradient(135deg, #065f46 0%, #059669 100%)',
                lightGrad: 'linear-gradient(135deg, #d1fae5, #f0fdf4)',
                tag: 'Rent Now',
                num: '200+',
                numLabel: 'Vehicles',
              },
              {
                emoji: '🧭',
                title: 'Expert Tour Guides',
                desc: 'Find certified local guides with custom tour packages, multilingual support, and flexible scheduling.',
                link: '/guides',
                accent: '#78350f',
                accentLight: '#fde68a',
                accentMid: '#f59e0b',
                grad: 'linear-gradient(135deg, #92400e 0%, #d97706 100%)',
                lightGrad: 'linear-gradient(135deg, #fef3c7, #fffbeb)',
                tag: 'Find Guide',
                num: '100+',
                numLabel: 'Guides',
              },
            ].map((s, idx) => (
              <Link key={s.title} to={s.link} style={{ textDecoration: 'none', display: 'block' }}>
                <div
                  className="service-card-new"
                  style={{
                    background: 'white',
                    borderRadius: 28,
                    boxShadow: '0 8px 40px rgba(12,74,110,0.08)',
                    border: '1.5px solid rgba(241,245,249,0.8)',
                    padding: '40px 36px 36px',
                    height: '100%',
                    position: 'relative',
                    overflow: 'hidden',
                    animationDelay: `${idx * 0.12}s`,
                  }}
                >
                  {/* Decorative corner gradient */}
                  <div style={{
                    position: 'absolute', top: 0, right: 0,
                    width: 160, height: 160,
                    background: `radial-gradient(circle at top right, ${s.accentLight}40, transparent 70%)`,
                    pointerEvents: 'none',
                  }} />

                  {/* Number badge */}
                  <div style={{
                    position: 'absolute', top: 28, right: 28,
                    display: 'flex', flexDirection: 'column', alignItems: 'flex-end',
                  }}>
                    <span style={{
                      fontFamily: '"Cormorant Garamond", serif',
                      fontSize: '1.5rem', fontWeight: 700,
                      color: s.accentMid, lineHeight: 1,
                    }}>{s.num}</span>
                    <span style={{
                      fontSize: 9, color: '#94a3b8', letterSpacing: '0.1em',
                      textTransform: 'uppercase', marginTop: 2,
                    }}>{s.numLabel}</span>
                  </div>

                  {/* Icon */}
                  <div className="card-icon-wrap" style={{
                    width: 76, height: 76, borderRadius: 22,
                    background: s.lightGrad,
                    fontSize: 34,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: 28,
                    boxShadow: `0 8px 24px ${s.accentLight}60`,
                  }}>{s.emoji}</div>

                  <h3 style={{
                    fontFamily: '"Cormorant Garamond", serif',
                    fontSize: '1.45rem', color: '#071a2c',
                    marginBottom: 12, fontWeight: 700, lineHeight: 1.2,
                  }}>{s.title}</h3>

                  <p style={{ color: '#64748b', fontSize: 14, lineHeight: 1.8, marginBottom: 28 }}>{s.desc}</p>

                  {/* CTA row */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{
                      display: 'inline-flex', alignItems: 'center', gap: 8,
                      background: s.lightGrad,
                      border: `1.5px solid ${s.accentLight}`,
                      borderRadius: 999, padding: '8px 18px',
                    }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: s.accent, letterSpacing: '0.04em' }}>{s.tag}</span>
                    </div>
                    <div className="card-arrow" style={{
                      width: 38, height: 38, borderRadius: '50%',
                      background: s.grad,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: `0 4px 16px ${s.accentLight}80`,
                    }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════
          ── FEATURES — Enhanced ──
      ══════════════════════════════════════ */}
      <div ref={featuresRef} className="reveal-section" style={{
        position: 'relative',
        background: 'linear-gradient(160deg, #071a2c 0%, #0c2d4a 50%, #0a2540 100%)',
        padding: '120px 24px',
        overflow: 'hidden',
      }}>
        {/* Mesh background */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: `
            radial-gradient(ellipse at 20% 50%, rgba(14,165,233,0.12) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 20%, rgba(253,230,138,0.07) 0%, transparent 50%),
            radial-gradient(ellipse at 60% 80%, rgba(56,189,248,0.08) 0%, transparent 40%)
          `,
        }} />
        {/* Subtle grid lines */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: `linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }} />

        <div style={{ maxWidth: 1160, margin: '0 auto', position: 'relative' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 72 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              background: 'rgba(14,165,233,0.12)', border: '1px solid rgba(14,165,233,0.25)',
              borderRadius: 999, padding: '6px 18px', marginBottom: 20,
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#38bdf8', display: 'inline-block', animation: 'dotPulse 2s ease-in-out infinite' }} />
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', color: '#38bdf8', textTransform: 'uppercase' }}>Platform Benefits</span>
            </div>
            <h2 style={{
              fontFamily: '"Cormorant Garamond", serif',
              fontSize: 'clamp(2rem, 4.5vw, 3.2rem)',
              color: 'white', fontWeight: 700,
              lineHeight: 1.15, marginBottom: 14,
            }}>
              Why Choose{' '}
              <span style={{
                background: 'linear-gradient(135deg, #fde68a, #f97316)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>Us?</span>
            </h2>
            <p style={{ color: 'rgba(148,163,184,0.9)', fontSize: 15, maxWidth: 420, margin: '0 auto', lineHeight: 1.8 }}>
              A platform built for modern travellers with every feature you need.
            </p>
          </div>

          <div className="features-grid-new" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: 16,
          }}>
            {[
              { icon: '📅', text: 'Real-time Availability', color: '#38bdf8', bg: 'rgba(56,189,248,0.1)', border: 'rgba(56,189,248,0.2)' },
              { icon: '📧', text: 'Email Confirmations',   color: '#34d399', bg: 'rgba(52,211,153,0.1)', border: 'rgba(52,211,153,0.2)' },
              { icon: '📄', text: 'PDF Receipts',          color: '#f472b6', bg: 'rgba(244,114,182,0.1)', border: 'rgba(244,114,182,0.2)' },
              { icon: '⭐', text: 'Verified Reviews',      color: '#fbbf24', bg: 'rgba(251,191,36,0.1)', border: 'rgba(251,191,36,0.2)' },
              { icon: '🌍', text: 'Multi-language',        color: '#a78bfa', bg: 'rgba(167,139,250,0.1)', border: 'rgba(167,139,250,0.2)' },
              { icon: '💱', text: 'Currency Converter',    color: '#fb923c', bg: 'rgba(251,146,60,0.1)', border: 'rgba(251,146,60,0.2)' },
              { icon: '🗺️', text: 'Map Integration',       color: '#2dd4bf', bg: 'rgba(45,212,191,0.1)', border: 'rgba(45,212,191,0.2)' },
              { icon: '📦', text: 'Travel Packages',       color: '#f87171', bg: 'rgba(248,113,113,0.1)', border: 'rgba(248,113,113,0.2)' },
            ].map((f, i) => (
              <div key={f.text} className="feature-item-new" style={{
                background: 'rgba(255,255,255,0.04)',
                borderRadius: 20,
                padding: '28px 20px',
                textAlign: 'center',
                border: `1.5px solid rgba(255,255,255,0.07)`,
                backdropFilter: 'blur(12px)',
                animation: `featureReveal 0.6s cubic-bezier(0.16,1,0.3,1) ${i * 0.07}s both`,
                position: 'relative',
                overflow: 'hidden',
              }}>
                {/* Glow blob behind icon */}
                <div style={{
                  position: 'absolute', top: 10, left: '50%', transform: 'translateX(-50%)',
                  width: 60, height: 60,
                  background: f.bg,
                  borderRadius: '50%',
                  filter: 'blur(16px)',
                  pointerEvents: 'none',
                  animation: 'glowPulse 3s ease-in-out infinite',
                  animationDelay: `${i * 0.2}s`,
                }} />

                <div className="feature-icon-bg" style={{
                  width: 58, height: 58, borderRadius: 18,
                  background: f.bg,
                  border: `1.5px solid ${f.border}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 26, margin: '0 auto 16px',
                  position: 'relative',
                }}>
                  {f.icon}
                </div>

                <p style={{
                  color: 'rgba(226,232,240,0.9)',
                  fontSize: 13, fontWeight: 500,
                  lineHeight: 1.45,
                  letterSpacing: '0.01em',
                }}>{f.text}</p>

                {/* Bottom accent line */}
                <div style={{
                  position: 'absolute', bottom: 0, left: '50%',
                  transform: 'translateX(-50%)',
                  width: 30, height: 2,
                  background: f.color,
                  borderRadius: '999px 999px 0 0',
                  opacity: 0.6,
                }} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════
          ── WIDGETS — Enhanced ──
      ══════════════════════════════════════ */}
      <div ref={widgetsRef} className="reveal-section" style={{
        background: '#f0f7ff',
        padding: '120px 24px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Subtle wave bg */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: `
            radial-gradient(ellipse at 10% 50%, rgba(14,165,233,0.06) 0%, transparent 55%),
            radial-gradient(ellipse at 90% 50%, rgba(253,230,138,0.06) 0%, transparent 55%)
          `,
        }} />

        <div style={{ maxWidth: 960, margin: '0 auto', position: 'relative' }}>
          {/* Section header */}
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, marginBottom: 16 }}>
              <div className="section-label-line" style={{ height: 2, width: 32, background: 'linear-gradient(90deg, #0ea5e9, #38bdf8)', borderRadius: 999 }} />
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', color: '#0369a1', textTransform: 'uppercase' }}>Travel Tools</span>
              <div className="section-label-line" style={{ height: 2, width: 32, background: 'linear-gradient(270deg, #0ea5e9, #38bdf8)', borderRadius: 999 }} />
            </div>
            <h2 style={{
              fontFamily: '"Cormorant Garamond", serif',
              fontSize: 'clamp(1.9rem, 4vw, 2.8rem)',
              color: '#071a2c', fontWeight: 700, lineHeight: 1.2,
            }}>
              Plan Smarter, Travel Better
            </h2>
          </div>

          <div className="widget-grid-new" style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: 28,
          }}>
            <CurrencyConverter />
            <WeatherWidget />
          </div>
        </div>
      </div>

    </div>
  );
}

/* ─── CurrencyConverter — Enhanced UI ─── */
function CurrencyConverter() {
  const [amount, setAmount] = React.useState(1000);
  const [from, setFrom]   = React.useState('LKR');
  const [to, setTo]       = React.useState('USD');
  const [result, setResult] = React.useState(null);

  const rates = { LKR:1, USD:0.0031, EUR:0.0029, GBP:0.0025, AUD:0.0047, JPY:0.47, INR:0.26, CNY:0.022, SGD:0.0041, AED:0.011 };

  const convert = () => {
    const lkr = amount / (rates[from] || 1);
    setResult((lkr * (rates[to] || 1)).toFixed(2));
  };

  const selectStyle = {
    border: '1.5px solid #e2e8f0',
    borderRadius: 14, padding: '11px 14px',
    fontSize: 14, background: 'white',
    fontFamily: 'inherit', width: '100%',
    outline: 'none', color: '#071a2c',
    appearance: 'none', cursor: 'pointer',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  };

  return (
    <div className="widget-card-new" style={{
      background: 'white',
      borderRadius: 28,
      padding: '24px 28px',
      boxShadow: '0 8px 40px rgba(12,74,110,0.1)',
      border: '1.5px solid rgba(226,232,240,0.8)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Top gradient line */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 4,
        background: 'linear-gradient(90deg, #0369a1, #38bdf8, #0369a1)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 3s linear infinite',
      }} />

      {/* Corner deco */}
      <div style={{
        position: 'absolute', top: -30, right: -30, width: 140, height: 140,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(56,189,248,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28 }}>
        <div style={{
          width: 52, height: 52, borderRadius: 16,
          background: 'linear-gradient(135deg, #e0f2fe, #bae6fd)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 22,
          boxShadow: '0 4px 16px rgba(14,165,233,0.2)',
        }}>💱</div>
        <div>
          <h3 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.3rem', color: '#071a2c', fontWeight: 700 }}>Currency Converter</h3>
          <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 2, letterSpacing: '0.04em' }}>Approximate indicative rates</p>
        </div>
      </div>

      {/* Amount input */}
      <div style={{ marginBottom: 16, position: 'relative' }}>
        <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#64748b', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>Amount</label>
        <input
          type="number"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          style={{
            ...selectStyle,
            fontSize: 22, fontFamily: '"Cormorant Garamond", serif',
            fontWeight: 700, color: '#071a2c', padding: '14px 18px',
            border: '1.5px solid #e2e8f0', borderRadius: 16,
          }}
          onFocus={e => { e.currentTarget.style.borderColor = '#38bdf8'; e.currentTarget.style.boxShadow = '0 0 0 4px rgba(56,189,248,0.1)'; }}
          onBlur={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.boxShadow = 'none'; }}
        />
      </div>

      {/* Currency selectors */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 44px 1fr', gap: 10, alignItems: 'flex-end', marginBottom: 20 }}>
        <div>
          <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#64748b', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>From</label>
          <select value={from} onChange={e => setFrom(e.target.value)} style={selectStyle}
            onFocus={e => { e.currentTarget.style.borderColor = '#38bdf8'; }}
            onBlur={e => { e.currentTarget.style.borderColor = '#e2e8f0'; }}
          >
            {Object.keys(rates).map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div
          onClick={() => { setFrom(to); setTo(from); setResult(null); }}
          style={{
            height: 46, display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'linear-gradient(135deg, #f0f9ff, #e0f2fe)',
            borderRadius: 14, border: '1.5px solid #bae6fd',
            fontSize: 16, color: '#0369a1', fontWeight: 700,
            marginBottom: 1, cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#bae6fd'; e.currentTarget.style.transform = 'rotate(180deg)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'linear-gradient(135deg, #f0f9ff, #e0f2fe)'; e.currentTarget.style.transform = 'none'; }}
        >⇄</div>
        <div>
          <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#64748b', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>To</label>
          <select value={to} onChange={e => setTo(e.target.value)} style={selectStyle}
            onFocus={e => { e.currentTarget.style.borderColor = '#38bdf8'; }}
            onBlur={e => { e.currentTarget.style.borderColor = '#e2e8f0'; }}
          >
            {Object.keys(rates).map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <button
        onClick={convert}
        className="convert-btn"
        style={{
          width: '100%',
          background: 'linear-gradient(135deg, #0369a1, #0284c7)',
          color: 'white', border: 'none', borderRadius: 16,
          padding: '14px', fontWeight: 700, fontSize: 14,
          cursor: 'pointer', fontFamily: 'inherit',
          letterSpacing: '0.04em',
          boxShadow: '0 4px 20px rgba(3,105,161,0.3)',
        }}
      >
        Convert Currency
      </button>

      {result && (
        <div style={{
          marginTop: 18, padding: '18px 22px', borderRadius: 18,
          background: 'linear-gradient(135deg, #e0f2fe, #f0f9ff)',
          border: '1.5px solid #bae6fd',
          animation: 'scaleIn 0.35s cubic-bezier(0.16,1,0.3,1)',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: -20, right: -20, width: 80, height: 80, borderRadius: '50%', background: 'rgba(56,189,248,0.1)', pointerEvents: 'none' }} />
          <p style={{ fontSize: 11, color: '#64748b', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>Result</p>
          <p style={{ fontWeight: 700, color: '#0369a1', lineHeight: 1.2 }}>
            <span style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.1rem' }}>{amount} {from}</span>
            <span style={{ color: '#94a3b8', margin: '0 8px', fontSize: 14 }}>=</span>
            <span style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.6rem', color: '#0c4a6e' }}>{result} {to}</span>
          </p>
        </div>
      )}
    </div>
  );
}

/* ─── WeatherWidget — Enhanced UI ─── */
function WeatherWidget() {
  const [weather, setWeather] = useState(null);
  const [city, setCity]       = useState('Galle');
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const SL_CITIES = [
  'Colombo','Gampaha','Kalutara','Kandy','Matale','Nuwara Eliya',
  'Galle','Matara','Hambantota','Jaffna','Kilinochchi','Mannar',
  'Vavuniya','Mullaitivu','Batticaloa','Ampara','Trincomalee',
  'Kurunegala','Puttalam','Anuradhapura','Polonnaruwa','Badulla',
  'Monaragala','Ratnapura','Kegalle',
];

  const cityCoords = {
    Colombo:      [6.9271,  80.2212],
    Gampaha:      [7.0917,  80.0000],
    Kalutara:     [6.5854,  79.9607],
    Kandy:        [7.2906,  80.6337],
    Matale:       [7.4675,  80.6234],
    'Nuwara Eliya':[6.9497, 80.7891],
    Galle:        [6.0535,  80.2210],
    Matara:       [5.9549,  80.5550],
    Hambantota:   [6.1241,  81.1185],
    Jaffna:       [9.6615,  80.0255],
    Kilinochchi:  [9.3803,  80.3770],
    Mannar:       [8.9810,  79.9044],
    Vavuniya:     [8.7514,  80.4971],
    Mullaitivu:   [9.2671,  80.8128],
    Batticaloa:   [7.7170,  81.7003],
    Ampara:       [7.2966,  81.6747],
    Trincomalee:  [8.5874,  81.2152],
    Kurunegala:   [7.4863,  80.3647],
    Puttalam:     [8.0362,  79.8283],
    Anuradhapura: [8.3114,  80.4037],
    Polonnaruwa:  [7.9403,  81.0188],
    Badulla:      [6.9934,  81.0550],
    Monaragala:   [6.8728,  81.3507],
    Ratnapura:    [6.7056,  80.3847],
    Kegalle:      [7.2513,  80.3464],
  };

  const getWeatherInfo = (wcode) => {
    if (wcode >= 61 && wcode <= 67) return { desc: 'Rainy',         icon: '🌧️' };
    if (wcode >= 51 && wcode <= 57) return { desc: 'Drizzle',       icon: '🌦️' };
    if (wcode >= 71 && wcode <= 77) return { desc: 'Stormy',        icon: '⛈️' };
    if (wcode >= 2  && wcode <= 3)  return { desc: 'Cloudy',        icon: '☁️' };
    if (wcode === 1)                 return { desc: 'Partly Cloudy', icon: '⛅' };
    return { desc: 'Clear', icon: '☀️' };
  };

  const fetchWeather = async (sel) => {
    setLoading(true); setError('');
    const [lat, lon] = cityCoords[sel] || cityCoords['Colombo'];
    try {
      const res  = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
        `&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code` +
        `&daily=temperature_2m_max,temperature_2m_min,weather_code,precipitation_probability_max` +
        `&timezone=Asia%2FColombo&forecast_days=6`
      );
      const data = await res.json();
      const c = data.current;
      const { desc, icon } = getWeatherInfo(c.weather_code);

      const forecast = data.daily.time.slice(1, 6).map((date, i) => {
        const { icon: fIcon, desc: fDesc } = getWeatherInfo(data.daily.weather_code[i + 1]);
        const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'short' });
        const dateLabel = new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        return {
          day: dayName,
          date: dateLabel,
          icon: fIcon,
          desc: fDesc,
          max: Math.round(data.daily.temperature_2m_max[i + 1]),
          min: Math.round(data.daily.temperature_2m_min[i + 1]),
          rain: data.daily.precipitation_probability_max[i + 1],
        };
      });

      setWeather({
        temp: Math.round(c.temperature_2m),
        humidity: c.relative_humidity_2m,
        wind: Math.round(c.wind_speed_10m),
        desc, icon, forecast,
      });
    } catch { setError('Unable to fetch weather'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchWeather(city); }, []);

  const getWeatherBg = (desc) => {
    if (!desc) return 'linear-gradient(135deg, #fef9c3, #fde68a)';
    if (desc === 'Rainy' || desc === 'Drizzle') return 'linear-gradient(135deg, #e0f2fe, #bae6fd)';
    if (desc === 'Stormy') return 'linear-gradient(135deg, #ddd6fe, #c4b5fd)';
    if (desc === 'Cloudy') return 'linear-gradient(135deg, #f1f5f9, #e2e8f0)';
    return 'linear-gradient(135deg, #fef9c3, #fde68a)';
  };

  return (
    <div className="widget-card-new" style={{
      background: 'white',
      borderRadius: 28,
      padding: '24px 28px',
      boxShadow: '0 8px 40px rgba(12,74,110,0.1)',
      border: '1.5px solid rgba(226,232,240,0.8)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Top gradient line */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 4,
        background: 'linear-gradient(90deg, #f59e0b, #fde68a, #f59e0b)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 3s linear infinite',
      }} />

      {/* Corner deco */}
      <div style={{
        position: 'absolute', top: -30, right: -30, width: 140, height: 140,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(253,230,138,0.15) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28 }}>
        <div style={{
          width: 52, height: 52, borderRadius: 16,
          background: 'linear-gradient(135deg, #fef9c3, #fde68a)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 22,
          boxShadow: '0 4px 16px rgba(245,158,11,0.25)',
        }}>🌤️</div>
        <div>
          <h3 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.3rem', color: '#071a2c', fontWeight: 700 }}>Live Weather</h3>
          <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 2, letterSpacing: '0.04em' }}>Southern Sri Lanka</p>
        </div>
      </div>

      {/* City selector */}
      <div style={{ marginBottom: 24 }}>
        <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#64748b', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>Select City</label>
        <div style={{ display: 'flex', gap: 10 }}>
          <select
            value={city}
            onChange={e => { setCity(e.target.value); fetchWeather(e.target.value); }}
            style={{
              flex: 1, border: '1.5px solid #e2e8f0', borderRadius: 16,
              padding: '12px 16px', fontSize: 14, background: 'white',
              fontFamily: 'inherit', color: '#071a2c', cursor: 'pointer',
              outline: 'none', fontWeight: 500,
            }}
            onFocus={e => { e.currentTarget.style.borderColor = '#fbbf24'; e.currentTarget.style.boxShadow = '0 0 0 4px rgba(251,191,36,0.1)'; }}
            onBlur={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.boxShadow = 'none'; }}
          >
            {SL_CITIES.map(c => <option key={c}>{c}</option>)}
          </select>
          <button
            onClick={() => fetchWeather(city)}
            style={{
              background: 'linear-gradient(135deg, #fef9c3, #fde68a)',
              border: '1.5px solid #fde68a',
              borderRadius: 16, width: 50, height: 50,
              color: '#92400e', fontSize: 18, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s', flexShrink: 0,
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#fde68a'; e.currentTarget.style.transform = 'rotate(180deg)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'linear-gradient(135deg, #fef9c3, #fde68a)'; e.currentTarget.style.transform = 'none'; }}
          >↻</button>
        </div>
      </div>

      {loading && (
        <div style={{
          textAlign: 'center', padding: '32px 0',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
        }}>
          <div style={{
            width: 48, height: 48,
            border: '3px solid #fde68a',
            borderTopColor: '#f59e0b',
            borderRadius: '50%',
            animation: 'rotateSlow 1s linear infinite',
          }} />
          <p style={{ fontSize: 13, color: '#94a3b8' }}>Fetching weather…</p>
        </div>
      )}

      {error && (
        <div style={{
          padding: '14px 18px', borderRadius: 14,
          background: 'rgba(254,226,226,0.5)', border: '1.5px solid #fca5a5',
          color: '#dc2626', fontSize: 13, textAlign: 'center',
        }}>{error}</div>
      )}

      {weather && !loading && (
        <div style={{ animation: 'weatherSlide 0.5s cubic-bezier(0.16,1,0.3,1)' }}>
          {/* Main weather display */}
          <div style={{
            background: getWeatherBg(weather.desc),
            borderRadius: 20, padding: '24px',
            marginBottom: 16,
            display: 'flex', alignItems: 'center', gap: 20,
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', top: -20, right: -20, fontSize: 80, opacity: 0.12, pointerEvents: 'none', userSelect: 'none' }}>
              {weather.icon}
            </div>
            <div style={{ fontSize: 40, filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.1))', lineHeight: 1 }}>
              {weather.icon}
            </div>
            <div>
              <div style={{
                fontFamily: '"Cormorant Garamond", serif',
                fontSize: '2.2rem', fontWeight: 700,
                color: '#071a2c', lineHeight: 1,
                letterSpacing: '-0.02em',
              }}>{weather.temp}°<span style={{ fontSize: '1.6rem' }}>C</span></div>
              <div style={{
                color: '#475569', fontSize: 14, fontWeight: 600,
                marginTop: 4, letterSpacing: '0.02em',
              }}>{weather.desc}</div>
              <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>{city}, Sri Lanka</div>
            </div>
          </div>

          {/* Stats row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {[
              { icon: '💧', label: 'Humidity', val: `${weather.humidity}%`, color: '#38bdf8', bg: '#f0f9ff', border: '#bae6fd' },
              { icon: '💨', label: 'Wind Speed', val: `${weather.wind} km/h`, color: '#34d399', bg: '#f0fdf4', border: '#a7f3d0' },
            ].map(({ icon, label, val, color, bg, border }) => (
              <div key={label} style={{
                background: bg, borderRadius: 16,
                padding: '16px 18px', border: `1.5px solid ${border}`,
                display: 'flex', alignItems: 'center', gap: 12,
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 12,
                  background: 'white', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: 17,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                }}>{icon}</div>
                <div>
                  <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{label}</div>
                  <div style={{ fontSize: 17, fontWeight: 700, color: '#071a2c', fontFamily: '"Cormorant Garamond", serif', marginTop: 1 }}>{val}</div>
                </div>
              </div>
            ))}
          </div>

          {/* 5-Day Forecast */}
          {weather.forecast && (
            <div style={{ marginTop: 20 }}>
              <div style={{
                fontSize: 11, fontWeight: 700, color: '#64748b',
                letterSpacing: '0.12em', textTransform: 'uppercase',
                marginBottom: 12,
              }}>5-Day Forecast</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {weather.forecast.map((day, i) => (
                  <div key={i} style={{
                    display: 'grid',
                    gridTemplateColumns: '72px 32px 1fr auto',
                    alignItems: 'center', gap: 12,
                    background: i % 2 === 0 ? '#f8faff' : 'white',
                    borderRadius: 14, padding: '10px 14px',
                    border: '1.5px solid #f1f5f9',
                    animation: `weatherSlide 0.4s cubic-bezier(0.16,1,0.3,1) ${i * 0.07}s both`,
                  }}>
                    {/* Day */}
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#071a2c' }}>{day.day}</div>
                      <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 1 }}>{day.date}</div>
                    </div>

                    {/* Icon */}
                    <div style={{ fontSize: 22, textAlign: 'center' }}>{day.icon}</div>

                    {/* Rain probability bar */}
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontSize: 10 }}>💧</span>
                        <div style={{
                          flex: 1, height: 5, background: '#e2e8f0',
                          borderRadius: 999, overflow: 'hidden',
                        }}>
                          <div style={{
                            height: '100%',
                            width: `${day.rain}%`,
                            background: day.rain > 60
                              ? 'linear-gradient(90deg, #38bdf8, #0369a1)'
                              : day.rain > 30
                              ? 'linear-gradient(90deg, #7dd3fc, #38bdf8)'
                              : 'linear-gradient(90deg, #bae6fd, #7dd3fc)',
                            borderRadius: 999,
                            transition: 'width 0.8s ease',
                          }} />
                        </div>
                        <span style={{ fontSize: 10, color: '#64748b', minWidth: 28 }}>{day.rain}%</span>
                      </div>
                    </div>

                    {/* Temp range */}
                    <div style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                      <span style={{
                        fontFamily: '"Cormorant Garamond", serif',
                        fontSize: 15, fontWeight: 700, color: '#071a2c',
                      }}>{day.max}°</span>
                      <span style={{ color: '#94a3b8', fontSize: 13, margin: '0 2px' }}>/</span>
                      <span style={{
                        fontFamily: '"Cormorant Garamond", serif',
                        fontSize: 13, color: '#94a3b8',
                      }}>{day.min}°</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      )}

    </div>
  );
}
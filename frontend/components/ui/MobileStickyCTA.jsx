'use client';

import { useEffect, useState } from 'react';

// Fiksna traka sa CTA dugmicima na dnu ekrana (samo mobilni/tablet, < lg).
// Pojavljuje se kad korisnik skroluje ispod elementa `afterId` (npr. hero) i
// skriva se dok je bilo koji element iz `hideWhenVisible` (CSS selektori, npr.
// forma i footer) na ekranu, da ne prekriva formu ni dno footera.
// Upotrebljivo i na drugim stranicama (kategorije): prosledi svoj `afterId`.

const Arrow = () => (
  <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.25} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

const PhoneIcon = () => (
  <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
  </svg>
);

const DocIcon = () => (
  <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8l-5-5z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M14 3v5h5M9 13h6M9 17h6" />
  </svg>
);

export default function MobileStickyCTA({
  phone,
  quoteHref = '#kontakt-forma',
  quoteLabel = 'Zatražite ponudu',
  afterId,
  hideWhenVisible = [],
}) {
  const [pastAnchor, setPastAnchor] = useState(false);
  const [targetVisible, setTargetVisible] = useState(false);
  const hideKey = hideWhenVisible.join(',');

  useEffect(() => {
    const anchor = afterId ? document.getElementById(afterId) : null;
    const observers = [];

    if (anchor) {
      const io = new IntersectionObserver(([entry]) => {
        // Vidljivo tek kad je element ceo iznad viewporta (skrolovan ispod njega).
        setPastAnchor(!entry.isIntersecting && entry.boundingClientRect.bottom <= 0);
      });
      io.observe(anchor);
      observers.push(io);
    }

    let onScroll;
    if (!anchor) {
      onScroll = () => setPastAnchor(window.scrollY > 400);
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
    }

    const targets = hideKey ? [...document.querySelectorAll(hideKey)] : [];
    if (targets.length) {
      const onScreen = new Set();
      const io = new IntersectionObserver((entries) => {
        for (const e of entries) e.isIntersecting ? onScreen.add(e.target) : onScreen.delete(e.target);
        setTargetVisible(onScreen.size > 0);
      });
      targets.forEach((t) => io.observe(t));
      observers.push(io);
    }

    return () => {
      observers.forEach((io) => io.disconnect());
      if (onScroll) window.removeEventListener('scroll', onScroll);
    };
  }, [afterId, hideKey]);

  if (!phone?.href) return null;
  const visible = pastAnchor && !targetVisible;

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 lg:hidden transition-transform duration-300 ease-out ${
        visible ? 'translate-y-0' : 'translate-y-full'
      }`}
      aria-hidden={!visible}
      inert={!visible}
    >
      <div className="flex gap-2.5 rounded-t-3xl bg-white px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] shadow-[0_-8px_24px_rgba(0,0,0,0.08)]">
        <a
          href={phone.href}
          aria-label={`Pozovite ${phone.localLabel || phone.label}`}
          className="flex h-14 flex-auto shrink-0 items-center justify-center gap-2 rounded-2xl bg-brand px-4 text-sm font-bold text-white shadow-brand-sm transition-colors hover:bg-brand-600 sm:text-base"
        >
          <PhoneIcon />
          <span className="whitespace-nowrap">{phone.localLabel || phone.label}</span>
          <span className="hidden min-[430px]:contents">
            <Arrow />
          </span>
        </a>
        <a
          href={quoteHref}
          className="flex h-14 min-w-0 flex-auto items-center justify-center gap-2 rounded-2xl border-2 border-brand bg-white px-2 text-sm font-bold text-brand transition-colors hover:bg-brand/[0.06] sm:text-base"
        >
          <DocIcon />
          <span className="truncate">{quoteLabel}</span>
          <span className="hidden min-[430px]:contents">
            <Arrow />
          </span>
        </a>
      </div>
    </div>
  );
}

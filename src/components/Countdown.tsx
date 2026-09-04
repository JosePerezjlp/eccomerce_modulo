'use client';

import { useEffect, useState } from 'react';

export default function Countdown({ expiresAt }: { expiresAt: string }) {
  const [msLeft, setMsLeft] = useState<number | null>(null);

  useEffect(() => {
    const target = new Date(expiresAt).getTime();
    const tick = () => setMsLeft(Math.max(0, target - Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [expiresAt]);

  if (msLeft === null) return null;

  if (msLeft <= 0) {
    return <span className="font-bold text-red-500">El ticket venció</span>;
  }

  const h = Math.floor(msLeft / 3_600_000);
  const m = Math.floor((msLeft % 3_600_000) / 60_000);
  const s = Math.floor((msLeft % 60_000) / 1000);

  return (
    <span className="font-mono text-2xl font-extrabold text-brand-500">
      {String(h).padStart(2, '0')}:{String(m).padStart(2, '0')}:{String(s).padStart(2, '0')}
    </span>
  );
}

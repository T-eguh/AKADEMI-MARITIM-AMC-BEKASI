/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import * as LucideIcons from 'lucide-react';
import { StatItem } from '../types';

interface StatsProps {
  stats: StatItem[];
}

interface CounterProps {
  end: number;
  suffix: string;
  duration?: number;
}

function AnimatedCounter({ end, suffix, duration = 1500 }: CounterProps) {
  const [count, setCount] = useState(0);
  const countRef = useRef(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (hasAnimated.current) return;
    hasAnimated.current = true;

    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const currentVal = Math.floor(progress * end);
      setCount(currentVal);
      countRef.current = currentVal;
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setCount(end);
      }
    };
    window.requestAnimationFrame(step);
  }, [end, duration]);

  return (
    <span className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl tracking-tight">
      {count.toLocaleString('id-ID')}
      <span className="text-gold-500 ml-0.5">{suffix}</span>
    </span>
  );
}

export default function Stats({ stats }: StatsProps) {
  return (
    <section className="relative py-16 bg-navy-950 text-white overflow-hidden">
      {/* Decorative background grid and blurs */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-80 h-80 bg-gold-500/10 rounded-full filter blur-[100px]" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-80 h-80 bg-navy-500/20 rounded-full filter blur-[120px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat) => {
            // Dynamically resolve icon if it exists in Lucide
            const IconComponent = (LucideIcons as any)[stat.icon] || LucideIcons.Anchor;
            
            return (
              <div
                key={stat.id}
                className="flex flex-col items-center text-center p-6 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm shadow-xl hover:border-gold-500/30 hover:bg-white/10 transition-all duration-300"
              >
                <div className="p-3 bg-gold-500/15 border border-gold-500/30 rounded-xl text-gold-500 mb-4">
                  <IconComponent className="h-6 w-6" />
                </div>
                <div className="mb-2">
                  <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                </div>
                <p className="font-sans text-xs sm:text-sm font-semibold text-gray-300 tracking-wider uppercase">
                  {stat.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

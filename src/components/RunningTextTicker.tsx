/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { RunningTextConfig } from '../types';

interface RunningTextTickerProps {
  configs: RunningTextConfig[];
}

export default function RunningTextTicker({ configs }: RunningTextTickerProps) {
  const activeTexts = configs.filter(c => c.isActive).map(c => c.text);
  if (activeTexts.length === 0) return null;

  // Join active texts with a custom spacer
  const combinedText = activeTexts.join('   •   ');

  return (
    <div id="running-text-ticker" className="relative w-full overflow-hidden bg-navy-950 py-2.5 border-b border-gold-500/30 flex items-center select-none z-40">
      {/* Left fixed badge */}
      <div className="absolute left-0 top-0 bottom-0 px-4 bg-navy-900 border-r border-gold-500/50 flex items-center z-50 shadow-[4px_0_10px_rgba(0,0,0,0.5)]">
        <span className="text-xs font-bold uppercase tracking-wider text-gold-500 animate-pulse flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-gold-500"></span> Info Terbaru
        </span>
      </div>

      {/* Ticker scrolling track */}
      <div className="w-full pl-36 overflow-hidden flex items-center">
        <div className="inline-block whitespace-nowrap animate-ticker text-xs font-medium text-slate-100 hover:[animation-play-state:paused] cursor-pointer">
          {combinedText} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {combinedText}
        </div>
      </div>
    </div>
  );
}

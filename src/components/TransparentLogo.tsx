import { useEffect, useState } from 'react';

interface TransparentLogoProps {
  src: string;
  alt: string;
  className?: string;
}

export default function TransparentLogo({ src, alt, className = '' }: TransparentLogoProps) {
  const [processedSrc, setProcessedSrc] = useState<string>(src);

  useEffect(() => {
    if (!src) {
      setProcessedSrc('');
      return;
    }

    let isMounted = true;
    const img = new Image();
    
    // Enable CORS to allow reading pixel data via Canvas
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      try {
        // Set maximum dimension for fast processing
        const MAX_DIM = 300;
        let width = img.naturalWidth || img.width;
        let height = img.naturalHeight || img.height;

        if (width > MAX_DIM || height > MAX_DIM) {
          const ratio = Math.min(MAX_DIM / width, MAX_DIM / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          if (isMounted) setProcessedSrc(src);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const imgData = ctx.getImageData(0, 0, width, height);
        const data = imgData.data;

        // Visited map for flood fill
        const visited = new Uint8Array(width * height);
        const queue: [number, number][] = [];

        // Helper to check if pixel is near-white (R, G, B all > 200)
        const isWhite = (x: number, y: number): boolean => {
          const idx = (y * width + x) * 4;
          const r = data[idx];
          const g = data[idx + 1];
          const b = data[idx + 2];
          const a = data[idx + 3];
          if (a < 15) return false; // already transparent
          
          // Match white/off-white background
          return r > 195 && g > 195 && b > 195;
        };

        // Seed corner pixels for flood fill
        const seeds = [
          [0, 0],
          [width - 1, 0],
          [0, height - 1],
          [width - 1, height - 1],
          [Math.floor(width / 2), 0],
          [0, Math.floor(height / 2)],
          [width - 1, Math.floor(height / 2)],
          [Math.floor(width / 2), height - 1]
        ];

        for (const [sx, sy] of seeds) {
          if (sx >= 0 && sx < width && sy >= 0 && sy < height) {
            if (isWhite(sx, sy)) {
              queue.push([sx, sy]);
              visited[sy * width + sx] = 1;
            }
          }
        }

        // BFS Flood fill
        let head = 0;
        while (head < queue.length) {
          const [x, y] = queue[head++];
          const idx = (y * width + x) * 4;
          
          // Set alpha to 0 (make transparent)
          data[idx + 3] = 0;

          // Check 4-way neighbors
          const neighbors = [
            [x + 1, y],
            [x - 1, y],
            [x, y + 1],
            [x, y - 1]
          ];

          for (const [nx, ny] of neighbors) {
            if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
              const vIdx = ny * width + nx;
              if (visited[vIdx] === 0 && isWhite(nx, ny)) {
                visited[vIdx] = 1;
                queue.push([nx, ny]);
              }
            }
          }
        }

        ctx.putImageData(imgData, 0, 0);
        const dataUrl = canvas.toDataURL('image/png');
        if (isMounted) setProcessedSrc(dataUrl);
      } catch (err) {
        console.warn('Canvas background removal failed (possibly CORS). Falling back to original src.', err);
        if (isMounted) setProcessedSrc(src);
      }
    };

    img.onerror = () => {
      if (isMounted) setProcessedSrc(src);
    };

    img.src = src;

    return () => {
      isMounted = false;
    };
  }, [src]);

  return (
    <img
      src={processedSrc || src}
      alt={alt}
      referrerPolicy="no-referrer"
      className={className}
    />
  );
}

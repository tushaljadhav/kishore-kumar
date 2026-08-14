import React, { useRef, useEffect } from 'react';

export default function VisualizerCanvas({
  analyser,
  isPlaying,
  height = 40,
  barCount = 28,
  className = ''
}) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const animationFrameIdRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let width = container.clientWidth || 240;
    let ch = height || 40;
    let dpr = Math.min(window.devicePixelRatio || 1, 3);

    const resizeCanvas = () => {
      if (!container || !canvas) return;
      width = container.clientWidth || 240;
      ch = container.clientHeight || height || 40;
      dpr = Math.min(window.devicePixelRatio || 1, 3);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(ch * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${ch}px`;
    };

    resizeCanvas();

    const resizeObserver = new ResizeObserver(() => {
      resizeCanvas();
    });
    resizeObserver.observe(container);

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Allocate audio frequency array
    const bufferLength = analyser ? analyser.frequencyBinCount : 64;
    const rawDataArray = new Uint8Array(bufferLength);

    const render = () => {
      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, ch);

      // Dynamically calculate visible bars according to available width
      const activeBarCount = Math.min(barCount, Math.max(12, Math.floor(width / 9)));
      const barSpacing = Math.max(2, Math.floor(width / (activeBarCount * 6)));
      const totalSpacing = (activeBarCount - 1) * barSpacing;
      const barWidth = Math.max(2, (width - totalSpacing) / activeBarCount);

      if (analyser && isPlaying) {
        analyser.getByteFrequencyData(rawDataArray);
      }

      const time = Date.now() * 0.002;

      for (let i = 0; i < activeBarCount; i++) {
        let percent = 0;

        if (analyser && isPlaying) {
          // Sample logarithmically weighted frequency index for musical bass/mid balance
          const freqIndex = Math.min(
            bufferLength - 1,
            Math.floor(Math.pow(i / activeBarCount, 1.2) * (bufferLength * 0.75))
          );
          const val = rawDataArray[freqIndex] || 0;
          percent = val / 255;
        } else {
          // Resting ambient motion when paused (or flat if reduced motion)
          if (prefersReducedMotion) {
            percent = 0.12;
          } else {
            percent = (Math.sin(time + i * 0.35) * 0.15 + 0.22);
          }
        }

        const barHeight = Math.max(3, percent * ch * 0.88);
        const x = i * (barWidth + barSpacing);
        const y = ch - barHeight;

        // Warm Kishore Gold Gradient
        const gradient = ctx.createLinearGradient(0, ch, 0, y);
        gradient.addColorStop(0, '#C87925');
        gradient.addColorStop(0.65, '#D49A32');
        gradient.addColorStop(1, '#FFF0D4');

        ctx.fillStyle = gradient;

        // Rounded bar cap
        ctx.beginPath();
        const radius = Math.min(barWidth / 2, 2.5);
        ctx.roundRect(x, y, barWidth, barHeight, [radius, radius, 0, 0]);
        ctx.fill();

        // Glow tip on active peaks
        if (isPlaying && percent > 0.45) {
          ctx.fillStyle = '#FFFFFF';
          ctx.shadowColor = '#D49A32';
          ctx.shadowBlur = 6;
          ctx.beginPath();
          ctx.arc(x + barWidth / 2, Math.max(2, y + 1.5), Math.min(barWidth / 3, 1.5), 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }

      ctx.restore();

      animationFrameIdRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
      resizeObserver.disconnect();
    };
  }, [analyser, isPlaying, height, barCount]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden flex items-center justify-center ${className}`}
      style={{ height: `${height}px` }}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block opacity-90 transition-opacity duration-300"
      />
    </div>
  );
}

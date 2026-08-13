import React, { useRef, useEffect } from 'react';

export default function VisualizerCanvas({ analyser, isPlaying, height = 50, barCount = 28 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const dataArray = new Uint8Array(barCount);

    const render = () => {
      const width = canvas.width;
      const ch = canvas.height;

      ctx.clearRect(0, 0, width, ch);

      if (analyser && isPlaying) {
        analyser.getByteFrequencyData(dataArray);
      } else {
        // Subtle resting animation when paused
        const time = Date.now() * 0.002;
        for (let i = 0; i < barCount; i++) {
          dataArray[i] = Math.max(8, Math.sin(time + i * 0.4) * 18 + 20);
        }
      }

      const barWidth = (width / barCount) - 3;
      
      for (let i = 0; i < barCount; i++) {
        const value = dataArray[i] || 0;
        const percent = value / 255;
        const barHeight = Math.max(4, percent * ch * 0.85);
        const x = i * (barWidth + 3);
        const y = ch - barHeight;

        // Warm golden gradient
        const gradient = ctx.createLinearGradient(0, ch, 0, y);
        gradient.addColorStop(0, '#C87925');
        gradient.addColorStop(0.6, '#D49A32');
        gradient.addColorStop(1, '#FFF0D4');

        ctx.fillStyle = gradient;
        
        // Rounded bar tops
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, [3, 3, 0, 0]);
        ctx.fill();

        // Glow tip when active
        if (isPlaying && percent > 0.4) {
          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.arc(x + barWidth / 2, y + 2, 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [analyser, isPlaying, barCount]);

  return (
    <canvas
      ref={canvasRef}
      width={320}
      height={height}
      className="w-full max-w-[280px] h-[40px] opacity-90"
    />
  );
}

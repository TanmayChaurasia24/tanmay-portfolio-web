import React, { useEffect, useState, useRef } from "react";

const GlobeWidget: React.FC = () => {
  const [timeStr, setTimeStr] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Update live clock
    const updateTime = () => {
      const now = new Date();
      // Format in IST (India Standard Time)
      const options: Intl.DateTimeFormatOptions = {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      };
      setTimeStr(new Intl.DateTimeFormat("en-GB", options).format(now));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Mini rotating wireframe dotted globe
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let rot = 0;
    let animId: number;

    const size = 52;
    canvas.width = size * 2;
    canvas.height = size * 2;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      rot += 0.012;

      const r = size * 0.85;
      const cx = size;
      const cy = size;

      // Outer globe boundary ring
      ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();

      // Meridians (Longitudes)
      for (let i = 0; i < 6; i++) {
        const angle = rot + (i * Math.PI) / 3;
        const xRadius = Math.abs(Math.cos(angle) * r);
        ctx.strokeStyle = "rgba(255, 255, 255, 0.22)";
        ctx.beginPath();
        ctx.ellipse(cx, cy, xRadius, r, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Parallels (Latitudes)
      for (let lat = -2; lat <= 2; lat++) {
        const yOffset = (lat * r) / 3.2;
        const latRadius = Math.sqrt(Math.max(0, r * r - yOffset * yOffset));
        ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
        ctx.beginPath();
        ctx.ellipse(cx, cy + yOffset, latRadius, latRadius * 0.25, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      // India location marker dot
      const markerAngle = rot + 1.2;
      const markerX = cx + Math.sin(markerAngle) * (r * 0.7);
      const markerY = cy - r * 0.25;

      // Only draw marker when on front-facing hemisphere
      if (Math.cos(markerAngle) > -0.2) {
        ctx.fillStyle = "#6366f1"; // vibrant indigo
        ctx.beginPath();
        ctx.arc(markerX, markerY, 2.8, 0, Math.PI * 2);
        ctx.fill();

        // Pulsing radar ring
        ctx.strokeStyle = "rgba(99, 102, 241, 0.5)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(markerX, markerY, 5.5, 0, Math.PI * 2);
        ctx.stroke();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animId) cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div className="inline-flex items-center gap-3 select-none">
      <div className="relative w-12 h-12 flex items-center justify-center">
        <canvas
          ref={canvasRef}
          className="w-12 h-12 block"
          style={{ width: "48px", height: "48px" }}
        />
      </div>
      <div className="text-left font-mono">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-foreground tracking-tight">
            India
          </span>
          <span className="text-xs text-muted-foreground font-medium">
            {timeStr || "IST"}
          </span>
        </div>
        <p className="text-[10px] text-muted-foreground/80 tracking-tight">
          UTC+5:30 · Working Worldwide
        </p>
      </div>
    </div>
  );
};

export default GlobeWidget;

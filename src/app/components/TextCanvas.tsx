"use client";

import { useEffect, useRef } from "react";

interface TextCanvasProps {
  text: string;
  width?: number;
  height?: number;
}

export default function TextCanvas({
  text,
  width = 410,
  height = 240,
}: TextCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = (tileImage?: HTMLImageElement) => {
      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // Optional background image
      if (tileImage) {
        ctx.drawImage(tileImage, 0, 0, width, height);
      }

      const fontSize = text === "?" ? 230 : 52;
      // Set font to Bahnschrift
      ctx.font = `${fontSize}px "Bahnschrift", Arial, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // Measure text
      const textMetrics = ctx.measureText(text);
      const textWidth = textMetrics.width;
      const textHeight = 24; // Approximate height for the font size

      // Calculate positions
      const centerX = width / 2;
      const centerY = height / 2;

      // Draw text
      ctx.fillStyle = "#143159"; // Dark blue text
      const lines = text.split("\n");
      const lineHeight = text === "?" ? 230 : textHeight * 2.6; // Add some spacing between lines
      const totalHeight = lineHeight * lines.length;
      const startY = centerY - totalHeight / 2 + lineHeight / 2;

      if (text === "?") {
        ctx.fillText("?", centerX, centerY + 10);
        return;
      }

      lines.forEach((line, index) => {
        const y = startY + index * lineHeight;
        ctx.fillText(line, centerX, y);
      });
    };

    const loadTileImage = () =>
      new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = "/tile_410x240.png"; // from public/
      });

    const loadAndDraw = async () => {
      let tileImage: HTMLImageElement | undefined;
      try {
        if (document.fonts && document.fonts.load) {
          await document.fonts.load('24px "Bahnschrift"');
        }
      } catch {
        // Ignore font loading errors; fallback will draw with default font
      }
      try {
        tileImage = await loadTileImage();
      } catch {
        // If image fails to load, continue without it
      }
      draw(tileImage);
    };

    loadAndDraw();
    canvas.toBlob((blob) => {
      if (blob) {
        (globalThis as unknown as { myBlob: Blob }).myBlob = blob;
      }
    });
  }, [text, width, height]);

  return (
    <canvas ref={canvasRef} width={width} height={height} className="w-full" />
  );
}

/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useRef, useState } from "react";

interface MusicCanvasProps {
  width?: number;
  height?: number;
}

export default function MusicCanvas({
  width = 410,
  height = 240,
}: MusicCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = async (tileImage?: HTMLImageElement) => {
      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // Optional background image
      if (tileImage) {
        ctx.drawImage(tileImage, 0, 0, width, height);
      }

      canvas.toBlob((blob) => {
        if (blob) {
          setObjectUrl(URL.createObjectURL(blob));
          (globalThis as unknown as Record<"Music", Blob>).Music = blob;
        }
      });
    };

    const loadTileImage = () =>
      new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = "/music_410x240.png"; // from public/
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
  }, [width, height]);
  const [objectUrl, setObjectUrl] = useState<string>("/music_410x240.png");

  return (
    <>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="sr-only"
      />
      <img
        alt="Only Connect Tile"
        id="canvas"
        width={width}
        height={height}
        src={objectUrl}
        className="w-full"
      />
    </>
  );
}

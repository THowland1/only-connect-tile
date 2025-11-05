/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useRef, useState } from "react";

interface PictureCanvasProps {
  image: HTMLImageElement | null;
  fitOrCover?: "fit" | "cover";
  width?: number;
  height?: number;
}

export default function PictureCanvas({
  image,
  fitOrCover = "cover",
  width = 410,
  height = 240,
}: PictureCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = async (
      tileImage?: HTMLImageElement,
      testCardImage?: HTMLImageElement
    ) => {
      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // Optional background image
      if (tileImage) {
        ctx.drawImage(tileImage, 0, 0, width, height);
      }
      if (testCardImage) {
        // testCardImage
        const width = 380;
        const height = 210;
        const originX = 15;
        const originY = 11;
        const padding = 3;
        const x = originX + padding;
        const y = originY + padding;
        const w = width - padding * 2;
        const h = height - padding * 2;
        ctx.save();
        ctx.imageSmoothingEnabled = Boolean(true);
        roundedRectPath(ctx, x, y, w, h, 8);
        ctx.clip();

        // Takes in fitOrCover: "fit" for object-fit: contain, "cover" for object-fit: cover
        // Default to "cover" if not provided

        const bgAspectRatio = w / h;
        const imageAspectRatio = testCardImage.width / testCardImage.height;

        if (fitOrCover === "cover") {
          // "cover" logic: fill area while cropping as necessary
          let drawWidth, drawHeight, sx, sy, sWidth, sHeight;
          if (imageAspectRatio > bgAspectRatio) {
            // Image is wider -- crop horizontally
            drawHeight = testCardImage.height;
            drawWidth = drawHeight * bgAspectRatio;
            sx = (testCardImage.width - drawWidth) / 2;
            sy = 0;
            sWidth = drawWidth;
            sHeight = drawHeight;
          } else {
            // Image is taller -- crop vertically
            drawWidth = testCardImage.width;
            drawHeight = drawWidth / bgAspectRatio;
            sx = 0;
            sy = (testCardImage.height - drawHeight) / 2;
            sWidth = drawWidth;
            sHeight = drawHeight;
          }
          ctx.drawImage(testCardImage, sx, sy, sWidth, sHeight, x, y, w, h);
        } else {
          // "fit" logic: fit entire image, add letterbox/pillarbox if needed (object-fit: contain)
          let dw, dh, offsetX, offsetY;
          if (imageAspectRatio > bgAspectRatio) {
            // Image is wider -- constrain by width
            dw = w;
            dh = w / imageAspectRatio;
            offsetX = 0;
            offsetY = (h - dh) / 2;
          } else {
            // Image is taller -- constrain by height
            dh = h;
            dw = h * imageAspectRatio;
            offsetX = (w - dw) / 2;
            offsetY = 0;
          }
          ctx.drawImage(testCardImage, x + offsetX, y + offsetY, dw, dh);
        }

        ctx.restore();
      }

      canvas.toBlob((blob) => {
        if (blob) {
          setObjectUrl(URL.createObjectURL(blob));
          (globalThis as unknown as Record<"Picture", Blob>).Picture = blob;
        }
      });
    };

    const loadTileImage = () =>
      new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = "/default-picture_410x240.png"; // from public/
      });

    const loadAndDraw = async () => {
      let tileImage: HTMLImageElement | undefined;

      try {
        tileImage = await loadTileImage();
      } catch {
        // If image fails to load, continue without it
      }
      if (image) {
        draw(tileImage, image);
      }
    };

    loadAndDraw();
  }, [image, width, height, fitOrCover]);
  const [objectUrl, setObjectUrl] = useState<string>(
    "/default-picture_410x240.png"
  );

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

function roundedRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  const min = Math.min(w, h);
  if (r <= 0) {
    ctx.rect(x, y, w, h);
    return;
  }
  r = Math.min(r, min / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

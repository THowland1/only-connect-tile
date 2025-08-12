"use client";

import { useState } from "react";
import TextCanvas from "./components/TextCanvas";

export default function Home() {
  const [text, setText] = useState("Hello World");

  return (
    <div className="min-h-screen bg-[#CCE7FA] py-8 px-4 text-[#143159]">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold  mb-8 text-center">
          Only Connect Tile Generator
        </h1>

        <div className="bg-white rounded-lg shadow-lg p-6 pb-4 mb-6">
          <label
            htmlFor="text-input"
            className="block text-sm font-medium mb-2"
          >
            Enter your text:
          </label>
          <textarea
            id="text-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full text-black px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Type your text here..."
          />
          <p className="opacity-50 text-xs leading-none">
            You can type &quot;?&quot; for a connections round tile.
          </p>
        </div>
        <div className="flex justify-center flex-wrap gap-4">
          <TextCanvas text={text} width={410} height={240} />
        </div>
        <div className="flex justify-center">
          <button
            onClick={async (e) => {
              const canvas = document.querySelector("canvas");
              if (!canvas) return;
              try {
                const btn = e.currentTarget;
                console.log("hello");

                await navigator.clipboard.write([
                  new ClipboardItem({
                    "image/png": (globalThis as unknown as { myBlob: Blob })
                      .myBlob,
                  }),
                ]);
                const originalText = btn.textContent;
                btn.textContent = "Copied!";
                setTimeout(() => {
                  btn.textContent = originalText;
                }, 2000);
              } catch (err) {
                console.error("Failed to copy image:", err);
              }
            }}
            className="mt-4 px-4 py-2 ring-offset-[#CCE7FA] bg-[#036299] text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Copy to Clipboard
          </button>
          <button
            onClick={async () => {
              const canvas = document.querySelector("canvas");
              if (!canvas) return;

              try {
                const dataUrl = canvas.toDataURL("image/png");
                const link = document.createElement("a");
                link.download = "onlyconnect-tile.png";
                link.href = dataUrl;
                link.click();
              } catch (err) {
                console.error("Failed to download image:", err);
              }
            }}
            className="mt-4 ml-2 px-4 py-2 ring-offset-[#CCE7FA] bg-[#036299] text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Download
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import PictureCanvas from "./components/PictureCanvas";
import TextCanvas from "./components/TextCanvas";

export default function Home() {
  const [text, setText] = useState("Hello World");
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [mode, setMode] = useState<"Text" | "Picture">("Text");
  return (
    <div className="min-h-screen bg-[#CCE7FA] py-8 px-4 text-[#143159]">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold  mb-8 text-center">
          Only Connect Tile Generator
        </h1>

        <div className="flex overflow-hidden">
          {(["Text", "Picture"] as const).map((modeOption) => (
            <button
              key={modeOption}
              data-active={mode === modeOption}
              className="bg-white rounded-t-xl flex items-center gap-1.5 shadow-lg py-2 px-4 data-[active=true]:opacity-100 data-[active=false]:opacity-50"
              onClick={() => setMode(modeOption)}
            >
              {modeOption}
              {modeOption === "Picture" && (
                <span className="text-xs uppercase bg-blue-500 text-white rounded-full px-1.5 py-0.5 -mr-1">
                  Beta
                </span>
              )}
            </button>
          ))}
        </div>
        <div className="bg-white/50">
          <div
            data-mode={mode}
            className="bg-white rounded-lg shadow-lg p-6 pb-4 mb-6 data-[mode=Text]:rounded-tl-none min-h-[157.5px]"
          >
            {mode === "Text" && (
              <>
                <div className="mb-2">
                  <label htmlFor="text-input" className="text-sm font-medium">
                    Enter your text:
                  </label>
                </div>
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
              </>
            )}
            {mode === "Picture" && (
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={async (e) => {
                  e.preventDefault();
                  const file = e.dataTransfer.files?.[0];
                  if (!file) return;
                  const image = await fileToImage(file);
                  setImage(image);
                }}
              >
                <div className="mb-2">
                  <label htmlFor="file-input" className="text-sm font-medium">
                    Choose your picture:
                  </label>
                </div>
                <div className="grid">
                  <input
                    type="file"
                    id="file-input"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      try {
                        const image = await fileToImage(file);
                        setImage(image);
                      } catch {
                        alert("Failed to load image");
                      }
                    }}
                    className="col-span-full row-span-full w-full text-transparent px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    accept="image/*"
                  />
                  <div className="col-span-full row-span-full  flex items-center flex-wrap pointer-events-none p-2 gap-2">
                    <label
                      className="pointer-events-auto  min-w-fit text-xs px-2 py-1 ring-offset-[#CCE7FA] bg-[#036299] text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      htmlFor="file-input"
                    >
                      Choose file
                    </label>
                    {navigator.clipboard && !!navigator.clipboard.read && (
                      <button
                        onClick={async (e) => {
                          const btn = e.currentTarget;
                          const clipboardImage = await clipboardToImage();
                          if (clipboardImage instanceof HTMLImageElement) {
                            setImage(clipboardImage);
                          } else {
                            const originalText = btn.textContent;
                            btn.textContent = clipboardImage;
                            btn.dataset.error = "true";
                            setTimeout(() => {
                              btn.textContent = originalText;
                              delete btn.dataset.error;
                            }, 2000);
                          }
                        }}
                        className="pointer-events-auto min-w-fit text-xs px-2 py-1 ring-offset-[#CCE7FA] bg-[#036299] data-[error=true]:bg-red-700 data-[error=true]:focus:ring-red-500 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      >
                        Paste from clipboard
                      </button>
                    )}
                    <span
                      className="pointer-events-auto text-xs border border-dashed border-gray-400 rounded-md px-2 py-1"
                      contentEditable
                      suppressContentEditableWarning
                      onFocus={(e) => {
                        const range = document.createRange();
                        range.selectNodeContents(e.target);
                        const selection = window.getSelection();
                        if (selection) {
                          selection.removeAllRanges();
                          selection.addRange(range);
                        }
                      }}
                      onPaste={async (e) => {
                        e.preventDefault();
                        const file = e.clipboardData.files?.[0];
                        if (!file) return;
                        const image = await fileToImage(file);
                        setImage(image);
                      }}
                    >
                      or paste in here
                    </span>

                    <span className="text-xs text-black/60">
                      or drop to upload
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-center flex-wrap gap-4">
          {mode === "Text" && (
            <TextCanvas text={text} width={410} height={240} />
          )}
          {mode === "Picture" && (
            <PictureCanvas image={image} width={410} height={240} />
          )}
        </div>
        <div className="flex justify-center">
          <button
            onClick={async (e) => {
              const canvas = document.querySelector("canvas");
              if (!canvas) return;
              try {
                const btn = e.currentTarget;

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

function fileToImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

async function clipboardToImage(): Promise<HTMLImageElement | string> {
  const hasPermission = await navigator.permissions
    .query({ name: "clipboard-read" as PermissionName })
    .then((result) => result.state === "granted" || result.state === "prompt");
  if (!hasPermission) {
    return "Permission not given!";
  }
  const clipboard = await navigator.clipboard.read();
  const firstItem = clipboard[0];
  if (!firstItem) {
    return "Clipboard empty!";
  }
  const image = await firstItem.getType("image/*");
  if (!image) {
    return "No image in clipboard!";
  }
  return fileToImage(new File([image], "clipboard.png"));
}

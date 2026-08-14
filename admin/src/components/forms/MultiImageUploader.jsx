import React, { useRef, useState } from "react";
import { Upload, Loader2 } from "lucide-react";

// Multi-file picker used for gallery batches. Validation mirrors ImageUploader.
const MAX_SIZE_MB = 8;
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/gif"];

const MultiImageUploader = ({ onUpload }) => {
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFiles = async (fileList) => {
    const files = Array.from(fileList);
    const invalid = files.find((f) => !ALLOWED.includes(f.type) || f.size > MAX_SIZE_MB * 1024 * 1024);
    if (invalid) {
      setError(`"${invalid.name}" is invalid. Use JPG/PNG/WEBP/GIF under ${MAX_SIZE_MB}MB.`);
      return;
    }
    setError("");
    setUploading(true);
    try {
      await onUpload(files);
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed. Try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <div
        className={`flex h-32 w-full items-center justify-center rounded-lg border-2 border-dashed transition ${
          dragOver ? "border-accent bg-orange-50" : "border-line bg-zinc-50"
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files);
        }}
      >
        {uploading ? (
          <Loader2 className="animate-spin text-muted" size={22} />
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex flex-col items-center gap-2 text-muted"
          >
            <Upload size={20} />
            <span className="text-xs">+ Add Images — drag & drop or click</span>
          </button>
        )}
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={ALLOWED.join(",")}
          className="hidden"
          onChange={(e) => e.target.files.length && handleFiles(e.target.files)}
        />
      </div>
      {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
    </div>
  );
};

export default MultiImageUploader;

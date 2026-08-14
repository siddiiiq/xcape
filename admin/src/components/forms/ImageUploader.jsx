import React, { useRef, useState } from "react";
import { Upload, X, Loader2 } from "lucide-react";

// Single-image uploader: drag & drop or click to pick, shows a live preview,
// and reports upload progress/errors. `onUpload` receives the raw File and
// should return a promise (the caller owns the actual API call).
const ImageUploader = ({ currentUrl, onUpload, onRemove, label = "Image", aspect = "aspect-video" }) => {
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState(null);

  const MAX_SIZE_MB = 8;
  const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/gif"];

  const validate = (file) => {
    if (!ALLOWED.includes(file.type)) return "Unsupported format. Use JPG, PNG, WEBP or GIF.";
    if (file.size > MAX_SIZE_MB * 1024 * 1024) return `File too large. Max ${MAX_SIZE_MB}MB.`;
    return null;
  };

  const handleFile = async (file) => {
    const validationError = validate(file);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError("");
    setPreview(URL.createObjectURL(file));
    setUploading(true);
    try {
      await onUpload(file);
    } catch (err) {
      // Clear the optimistic local preview on failure — otherwise the box
      // keeps showing the picked file and looks like the upload succeeded
      // even though nothing was actually saved to the server.
      setPreview(null);
      setError(err.response?.data?.message || err.message || "Upload failed. Try again.");
    } finally {
      setUploading(false);
    }
  };

  const displayUrl = preview || currentUrl;

  return (
    <div>
      {label && <p className="label">{label}</p>}
      <div
        className={`relative flex ${aspect} w-full items-center justify-center overflow-hidden rounded-lg border-2 border-dashed transition ${
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
          if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
        }}
      >
        {displayUrl ? (
          <img src={displayUrl} alt="Preview" className="h-full w-full object-cover" />
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex flex-col items-center gap-2 text-muted"
          >
            <Upload size={22} />
            <span className="text-xs">Drag & drop or click to upload</span>
          </button>
        )}

        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <Loader2 className="animate-spin text-white" size={24} />
          </div>
        )}

        {displayUrl && !uploading && (
          <div className="absolute right-2 top-2 flex gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="rounded-full bg-white/90 px-3 py-1 text-xs font-medium shadow hover:bg-white"
            >
              Replace
            </button>
            {onRemove && (
              <button
                type="button"
                onClick={() => {
                  setPreview(null);
                  onRemove();
                }}
                className="rounded-full bg-white/90 p-1.5 shadow hover:bg-white"
                aria-label="Remove image"
              >
                <X size={14} />
              </button>
            )}
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          accept={ALLOWED.join(",")}
          className="hidden"
          onChange={(e) => e.target.files[0] && handleFile(e.target.files[0])}
        />
      </div>
      {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
    </div>
  );
};

export default ImageUploader;

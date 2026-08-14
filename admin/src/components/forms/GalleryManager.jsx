import React, { useState } from "react";
import { ChevronUp, ChevronDown, Trash2, Star, Instagram } from "lucide-react";
import MultiImageUploader from "./MultiImageUploader.jsx";
import ConfirmDialog from "../common/ConfirmDialog.jsx";

// CMS-style gallery editor: upload, reorder (up/down — simpler and just as
// functional as drag-and-drop for admin use), edit per-image metadata,
// set-as-cover, and delete (which also removes the Cloudinary asset server-side).
const GalleryManager = ({
  images = [],
  onUpload,
  onUpdateImage,
  onReorder,
  onDelete,
  onSetCover,
}) => {
  const [pendingDelete, setPendingDelete] = useState(null);
  const sorted = [...images].sort((a, b) => a.order - b.order);

  const move = (index, direction) => {
    const next = [...sorted];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    onReorder(next.map((img) => img._id));
  };

  return (
    <div>
      <MultiImageUploader onUpload={onUpload} />

      <div className="mt-4 space-y-3">
        {sorted.map((image, index) => (
          <div key={image._id} className="flex gap-4 rounded-lg border border-line p-3">
            <img src={image.url} alt={image.title || ""} className="h-20 w-20 shrink-0 rounded-md object-cover" />

            <div className="flex-1 space-y-2">
              <input
                className="input"
                placeholder="Title"
                value={image.title || ""}
                onChange={(e) => onUpdateImage(image._id, { title: e.target.value })}
              />
              <div className="flex gap-2">
                <input
                  className="input"
                  placeholder="Description"
                  value={image.description || ""}
                  onChange={(e) => onUpdateImage(image._id, { description: e.target.value })}
                />
                <div className="relative flex-1">
                  <Instagram size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                  <input
                    className="input pl-8"
                    placeholder="Instagram URL"
                    value={image.instagramUrl || ""}
                    onChange={(e) => onUpdateImage(image._id, { instagramUrl: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="flex shrink-0 flex-col items-center justify-between gap-1">
              <div className="flex flex-col gap-0.5">
                <button
                  type="button"
                  onClick={() => move(index, -1)}
                  disabled={index === 0}
                  className="rounded p-1 text-muted hover:bg-zinc-100 disabled:opacity-30"
                  aria-label="Move up"
                >
                  <ChevronUp size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => move(index, 1)}
                  disabled={index === sorted.length - 1}
                  className="rounded p-1 text-muted hover:bg-zinc-100 disabled:opacity-30"
                  aria-label="Move down"
                >
                  <ChevronDown size={16} />
                </button>
              </div>
              <button
                type="button"
                onClick={() => onSetCover(image)}
                className="rounded p-1.5 text-muted hover:bg-amber-50 hover:text-amber-600"
                title="Set as cover"
              >
                <Star size={16} />
              </button>
              <button
                type="button"
                onClick={() => setPendingDelete(image._id)}
                className="rounded p-1.5 text-muted hover:bg-red-50 hover:text-red-600"
                title="Delete image"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete this image?"
        description="This also removes the file from Cloudinary. This can't be undone."
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          onDelete(pendingDelete);
          setPendingDelete(null);
        }}
      />
    </div>
  );
};

export default GalleryManager;

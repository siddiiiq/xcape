import React, { useState } from "react";
import { Search, Trash2, Copy } from "lucide-react";
import PageHeader from "../components/layout/PageHeader.jsx";
import Loader from "../components/common/Loader.jsx";
import EmptyState from "../components/common/EmptyState.jsx";
import ErrorState from "../components/common/ErrorState.jsx";
import ConfirmDialog from "../components/common/ConfirmDialog.jsx";
import { useToast } from "../components/common/Toast.jsx";
import { useFetch } from "../hooks/useFetch.js";
import { listMedia, deleteMedia } from "../api/mediaApi.js";

const FOLDERS = [
  { value: "", label: "All folders" },
  { value: "places", label: "Places" },
  { value: "founders", label: "Founders" },
  { value: "reels", label: "Reels" },
  { value: "youtube", label: "YouTube" },
  { value: "stories", label: "Stories" },
];

// Reads directly from Cloudinary (see backend/mediaController) rather than a
// separate DB table, so this always reflects exactly what's actually stored.
const Media = () => {
  const [folder, setFolder] = useState("");
  const [search, setSearch] = useState("");
  const { data, loading, error, refetch } = useFetch(() => listMedia({ folder, search }), [folder, search]);
  const { showToast } = useToast();
  const [pendingDelete, setPendingDelete] = useState(null);

  const handleDelete = async () => {
    try {
      await deleteMedia(pendingDelete.publicId, pendingDelete.resourceType);
      showToast("Asset deleted");
      setPendingDelete(null);
      refetch();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to delete", "error");
    }
  };

  const copyUrl = (url) => {
    navigator.clipboard.writeText(url);
    showToast("URL copied");
  };

  return (
    <div>
      <PageHeader title="Media Library" description="Every image and video uploaded through the admin, backed by Cloudinary." />

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <div className="relative w-full sm:min-w-[220px] sm:flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input className="input pl-8" placeholder="Search by filename..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select className="input w-full sm:w-auto" value={folder} onChange={(e) => setFolder(e.target.value)}>
          {FOLDERS.map((f) => (
            <option key={f.value} value={f.value}>
              {f.label}
            </option>
          ))}
        </select>
      </div>

      {loading && <Loader label="Loading media..." />}
      {error && <ErrorState message={error} onRetry={refetch} />}
      {!loading && !error && data?.configured === false && (
        <EmptyState title="Cloudinary isn't configured yet." action={<p className="text-xs text-muted">Add CLOUDINARY_* vars to backend/.env</p>} />
      )}
      {!loading && !error && data?.configured && data.resources.length === 0 && <EmptyState title="No media uploaded yet." />}
      {!loading && !error && data?.resources?.length > 0 && (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 sm:gap-4 lg:grid-cols-6">
          {data.resources.map((asset) => (
            <div key={asset.publicId} className="group relative aspect-square overflow-hidden rounded-lg border border-line">
              {asset.resourceType === "video" ? (
                <video src={asset.url} className="h-full w-full object-cover" muted />
              ) : (
                <img src={asset.url} alt="" className="h-full w-full object-cover" />
              )}
              {/* Full-cover hover reveal for mouse users (desktop only —
                  :hover doesn't fire reliably on touch). */}
              <div className="absolute inset-0 hidden flex-col items-center justify-center gap-2 bg-black/60 sm:group-hover:flex">
                <button onClick={() => copyUrl(asset.url)} className="rounded-full bg-white/90 p-2" title="Copy URL">
                  <Copy size={14} />
                </button>
                <button onClick={() => setPendingDelete(asset)} className="rounded-full bg-white/90 p-2 text-red-600" title="Delete">
                  <Trash2 size={14} />
                </button>
              </div>
              {/* Always-visible corner buttons so the same actions are
                  reachable by tap on mobile. */}
              <div className="absolute right-1 top-1 flex gap-1 sm:hidden">
                <button onClick={() => copyUrl(asset.url)} className="rounded-full bg-black/60 p-1.5 text-white" aria-label="Copy URL">
                  <Copy size={12} />
                </button>
                <button onClick={() => setPendingDelete(asset)} className="rounded-full bg-black/60 p-1.5 text-white" aria-label="Delete">
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete this asset?"
        description="This permanently removes it from Cloudinary. Any place/founder/reel still referencing it will show a broken image."
        onCancel={() => setPendingDelete(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default Media;

import React, { useState } from "react";
import { Plus, Pencil, Trash2, ExternalLink } from "lucide-react";
import PageHeader from "../components/layout/PageHeader.jsx";
import DataTable from "../components/tables/DataTable.jsx";
import Loader from "../components/common/Loader.jsx";
import EmptyState from "../components/common/EmptyState.jsx";
import ErrorState from "../components/common/ErrorState.jsx";
import ConfirmDialog from "../components/common/ConfirmDialog.jsx";
import Modal from "../components/common/Modal.jsx";
import ImageUploader from "../components/forms/ImageUploader.jsx";
import { useToast } from "../components/common/Toast.jsx";
import { useFetch } from "../hooks/useFetch.js";
import { listYouTubeVideos, createYouTubeVideo, updateYouTubeVideo, deleteYouTubeVideo, uploadYouTubeThumbnail } from "../api/youtubeApi.js";

const emptyVideo = { title: "", youtubeUrl: "", description: "", published: true, order: 0 };

const YouTube = () => {
  const { data, loading, error, refetch } = useFetch(listYouTubeVideos, []);
  const { showToast } = useToast();
  const [editing, setEditing] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!editing.title || !editing.youtubeUrl) {
      showToast("Title and YouTube URL are required", "error");
      return;
    }
    setSaving(true);
    try {
      if (editing._id) {
        await updateYouTubeVideo(editing._id, editing);
        if (editing._thumbFile) await uploadYouTubeThumbnail(editing._id, editing._thumbFile);
        showToast("Video saved");
      } else {
        const res = await createYouTubeVideo(editing);
        if (editing._thumbFile) await uploadYouTubeThumbnail(res.video._id, editing._thumbFile);
        showToast("Video created");
      }
      setEditing(null);
      refetch();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to save", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteYouTubeVideo(pendingDelete._id);
      showToast("Video deleted");
      setPendingDelete(null);
      refetch();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to delete", "error");
    }
  };

  const columns = [
    {
      key: "title",
      label: "Video",
      render: (row) => (
        <div className="flex items-center gap-3">
          {row.thumbnail?.url && <img src={row.thumbnail.url} alt="" className="h-10 w-16 rounded-md object-cover" />}
          <p className="font-medium">{row.title}</p>
        </div>
      ),
    },
    {
      key: "youtubeUrl",
      label: "Link",
      render: (row) => (
        <a href={row.youtubeUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-accent hover:underline">
          View <ExternalLink size={12} />
        </a>
      ),
    },
    {
      key: "published",
      label: "Status",
      render: (row) => (
        <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${row.published ? "bg-green-100 text-green-700" : "bg-zinc-100 text-zinc-600"}`}>
          {row.published ? "Published" : "Draft"}
        </span>
      ),
    },
    {
      key: "actions",
      label: "",
      render: (row) => (
        <div className="flex justify-end gap-2">
          <button onClick={() => setEditing({ ...row })} className="rounded p-2 hover:bg-zinc-100">
            <Pencil size={14} />
          </button>
          <button onClick={() => setPendingDelete(row)} className="rounded p-2 hover:bg-red-50 hover:text-red-600">
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="YouTube"
        description="Longer-form videos shown on the public site."
        action={
          <button onClick={() => setEditing({ ...emptyVideo })} className="btn-primary flex items-center gap-2">
            <Plus size={16} /> New Video
          </button>
        }
      />

      {loading && <Loader label="Loading videos..." />}
      {error && <ErrorState message={error} onRetry={refetch} />}
      {!loading && !error && data?.videos?.length === 0 && <EmptyState title="No videos yet." />}
      {!loading && !error && data?.videos?.length > 0 && <DataTable columns={columns} rows={data.videos} />}

      <Modal open={Boolean(editing)} title={editing?._id ? "Edit Video" : "New Video"} onClose={() => setEditing(null)}>
        {editing && (
          <div className="space-y-4">
            <ImageUploader
              label="Thumbnail (optional — falls back to the YouTube thumbnail)"
              currentUrl={editing.thumbnail?.url}
              onUpload={async (file) => setEditing((v) => ({ ...v, _thumbFile: file }))}
            />
            <div>
              <label className="label">Title</label>
              <input className="input" value={editing.title} onChange={(e) => setEditing((v) => ({ ...v, title: e.target.value }))} />
            </div>
            <div>
              <label className="label">YouTube URL</label>
              <input className="input" value={editing.youtubeUrl} onChange={(e) => setEditing((v) => ({ ...v, youtubeUrl: e.target.value }))} />
            </div>
            <div>
              <label className="label">Description</label>
              <textarea rows={2} className="input" value={editing.description} onChange={(e) => setEditing((v) => ({ ...v, description: e.target.value }))} />
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={editing.published} onChange={(e) => setEditing((v) => ({ ...v, published: e.target.checked }))} />
                Published
              </label>
              <div className="w-24">
                <label className="label">Order</label>
                <input type="number" className="input" value={editing.order} onChange={(e) => setEditing((v) => ({ ...v, order: Number(e.target.value) }))} />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setEditing(null)} className="btn-secondary">
                Cancel
              </button>
              <button onClick={handleSave} disabled={saving} className="btn-primary">
                {saving ? "Saving..." : "Save Video"}
              </button>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog open={Boolean(pendingDelete)} title={`Delete "${pendingDelete?.title}"?`} onCancel={() => setPendingDelete(null)} onConfirm={handleDelete} />
    </div>
  );
};

export default YouTube;

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
import { listReels, createReel, updateReel, deleteReel, uploadReelThumbnail } from "../api/reelsApi.js";

const emptyReel = { title: "", instagramUrl: "", description: "", published: true, order: 0 };

const Reels = () => {
  const { data, loading, error, refetch } = useFetch(listReels, []);
  const { showToast } = useToast();
  const [editing, setEditing] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!editing.title || !editing.instagramUrl) {
      showToast("Title and Instagram URL are required", "error");
      return;
    }
    setSaving(true);
    try {
      if (editing._id) {
        await updateReel(editing._id, editing);
        if (editing._thumbFile) await uploadReelThumbnail(editing._id, editing._thumbFile);
        showToast("Reel saved");
      } else {
        const res = await createReel(editing);
        if (editing._thumbFile) await uploadReelThumbnail(res.reel._id, editing._thumbFile);
        showToast("Reel created");
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
      await deleteReel(pendingDelete._id);
      showToast("Reel deleted");
      setPendingDelete(null);
      refetch();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to delete", "error");
    }
  };

  const columns = [
    {
      key: "title",
      label: "Reel",
      render: (row) => (
        <div className="flex items-center gap-3">
          {row.thumbnail?.url && <img src={row.thumbnail.url} alt="" className="h-10 w-10 rounded-md object-cover" />}
          <p className="font-medium">{row.title}</p>
        </div>
      ),
    },
    {
      key: "instagramUrl",
      label: "Instagram",
      render: (row) => (
        <a href={row.instagramUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-accent hover:underline">
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
          <button onClick={() => setEditing({ ...row })} className="rounded-lg p-2.5 hover:bg-zinc-100">
            <Pencil size={14} />
          </button>
          <button onClick={() => setPendingDelete(row)} className="rounded-lg p-2.5 hover:bg-red-50 hover:text-red-600">
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Reels"
        description="Instagram Reel previews shown on the public site."
        action={
          <button onClick={() => setEditing({ ...emptyReel })} className="btn-primary flex items-center gap-2">
            <Plus size={16} /> New Reel
          </button>
        }
      />

      {loading && <Loader label="Loading reels..." />}
      {error && <ErrorState message={error} onRetry={refetch} />}
      {!loading && !error && data?.reels?.length === 0 && <EmptyState title="No reels yet." />}
      {!loading && !error && data?.reels?.length > 0 && <DataTable columns={columns} rows={data.reels} />}

      <Modal open={Boolean(editing)} title={editing?._id ? "Edit Reel" : "New Reel"} onClose={() => setEditing(null)}>
        {editing && (
          <div className="space-y-4">
            <ImageUploader
              label="Thumbnail"
              currentUrl={editing.thumbnail?.url}
              aspect="aspect-[9/16]"
              onUpload={async (file) => setEditing((r) => ({ ...r, _thumbFile: file }))}
            />
            <div>
              <label className="label">Title</label>
              <input className="input" value={editing.title} onChange={(e) => setEditing((r) => ({ ...r, title: e.target.value }))} />
            </div>
            <div>
              <label className="label">Instagram URL</label>
              <input className="input" value={editing.instagramUrl} onChange={(e) => setEditing((r) => ({ ...r, instagramUrl: e.target.value }))} />
            </div>
            <div>
              <label className="label">Description</label>
              <textarea rows={2} className="input" value={editing.description} onChange={(e) => setEditing((r) => ({ ...r, description: e.target.value }))} />
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={editing.published} onChange={(e) => setEditing((r) => ({ ...r, published: e.target.checked }))} />
                Published
              </label>
              <div className="w-full sm:w-24">
                <label className="label">Order</label>
                <input type="number" className="input" value={editing.order} onChange={(e) => setEditing((r) => ({ ...r, order: Number(e.target.value) }))} />
              </div>
            </div>
            <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end sm:gap-3">
              <button onClick={() => setEditing(null)} className="btn-secondary w-full sm:w-auto">
                Cancel
              </button>
              <button onClick={handleSave} disabled={saving} className="btn-primary w-full sm:w-auto">
                {saving ? "Saving..." : "Save Reel"}
              </button>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog open={Boolean(pendingDelete)} title={`Delete "${pendingDelete?.title}"?`} onCancel={() => setPendingDelete(null)} onConfirm={handleDelete} />
    </div>
  );
};

export default Reels;

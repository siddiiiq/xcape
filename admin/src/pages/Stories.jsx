import React, { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
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
import { listStories, createStory, updateStory, deleteStory, uploadStoryCover } from "../api/storiesApi.js";
import { listPlaces } from "../api/placesApi.js";

const emptyStory = { title: "", excerpt: "", content: "", place: "", published: false, featured: false, order: 0 };

const Stories = () => {
  const { data, loading, error, refetch } = useFetch(listStories, []);
  const { data: placesData } = useFetch(listPlaces, []);
  const { showToast } = useToast();

  const [editing, setEditing] = useState(null); // story object or {} for new
  const [pendingDelete, setPendingDelete] = useState(null);
  const [saving, setSaving] = useState(false);

  const openNew = () => setEditing({ ...emptyStory });
  const openEdit = (story) => setEditing({ ...story, place: story.place?._id || story.place || "" });

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editing._id) {
        const res = await updateStory(editing._id, editing);
        if (editing._coverFile) {
          const up = await uploadStoryCover(editing._id, editing._coverFile);
          res.story.coverImage = up.coverImage;
        }
        showToast("Story saved");
      } else {
        const res = await createStory(editing);
        if (editing._coverFile) {
          await uploadStoryCover(res.story._id, editing._coverFile);
        }
        showToast("Story created");
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
      await deleteStory(pendingDelete._id);
      showToast("Story deleted");
      setPendingDelete(null);
      refetch();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to delete", "error");
    }
  };

  const columns = [
    { key: "title", label: "Title", render: (row) => <p className="font-medium">{row.title}</p> },
    { key: "place", label: "Place", render: (row) => row.place?.title || "—" },
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
          <button onClick={() => openEdit(row)} className="rounded-lg p-2.5 hover:bg-zinc-100">
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
        title="Stories"
        description="Long-form stories tied to a place."
        action={
          <button onClick={openNew} className="btn-primary flex items-center gap-2">
            <Plus size={16} /> New Story
          </button>
        }
      />

      {loading && <Loader label="Loading stories..." />}
      {error && <ErrorState message={error} onRetry={refetch} />}
      {!loading && !error && data?.stories?.length === 0 && <EmptyState title="No stories yet." />}
      {!loading && !error && data?.stories?.length > 0 && <DataTable columns={columns} rows={data.stories} />}

      <Modal open={Boolean(editing)} title={editing?._id ? "Edit Story" : "New Story"} onClose={() => setEditing(null)} wide>
        {editing && (
          <div className="space-y-4">
            <ImageUploader
              label="Cover Image"
              currentUrl={editing.coverImage?.url}
              onUpload={async (file) => setEditing((s) => ({ ...s, _coverFile: file }))}
            />
            <div>
              <label className="label">Title</label>
              <input className="input" value={editing.title} onChange={(e) => setEditing((s) => ({ ...s, title: e.target.value }))} />
            </div>
            <div>
              <label className="label">Excerpt</label>
              <textarea rows={2} className="input" value={editing.excerpt} onChange={(e) => setEditing((s) => ({ ...s, excerpt: e.target.value }))} />
            </div>
            <div>
              <label className="label">Content</label>
              <textarea rows={8} className="input" value={editing.content} onChange={(e) => setEditing((s) => ({ ...s, content: e.target.value }))} />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="label">Associated Place</label>
                <select className="input" value={editing.place} onChange={(e) => setEditing((s) => ({ ...s, place: e.target.value }))}>
                  <option value="">— None —</option>
                  {placesData?.places?.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.title}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Display Order</label>
                <input type="number" className="input" value={editing.order} onChange={(e) => setEditing((s) => ({ ...s, order: Number(e.target.value) }))} />
              </div>
            </div>
            <div className="flex flex-wrap gap-4 sm:gap-6">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={editing.published} onChange={(e) => setEditing((s) => ({ ...s, published: e.target.checked }))} />
                Published
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={editing.featured} onChange={(e) => setEditing((s) => ({ ...s, featured: e.target.checked }))} />
                Featured
              </label>
            </div>
            <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end sm:gap-3">
              <button onClick={() => setEditing(null)} className="btn-secondary w-full sm:w-auto">
                Cancel
              </button>
              <button onClick={handleSave} disabled={saving} className="btn-primary w-full sm:w-auto">
                {saving ? "Saving..." : "Save Story"}
              </button>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title={`Delete "${pendingDelete?.title}"?`}
        onCancel={() => setPendingDelete(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default Stories;

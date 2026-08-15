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
import MultiImageUploader from "../components/forms/MultiImageUploader.jsx";
import { useToast } from "../components/common/Toast.jsx";
import { useFetch } from "../hooks/useFetch.js";
import {
  listFounders,
  createFounder,
  updateFounder,
  deleteFounder,
  uploadFounderProfileImage,
  uploadFounderGallery,
  deleteFounderGalleryImage,
} from "../api/foundersApi.js";

const emptyFounder = {
  name: "",
  role: "",
  bio: "",
  longBio: "",
  instagramUrl: "",
  youtubeUrl: "",
  published: true,
  order: 0,
  gallery: [],
};

const Founders = () => {
  const { data, loading, error, refetch } = useFetch(listFounders, []);
  const { showToast } = useToast();
  const [editing, setEditing] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!editing.name) {
      showToast("Name is required", "error");
      return;
    }
    setSaving(true);
    try {
      let id = editing._id;
      if (id) {
        await updateFounder(id, editing);
        showToast("Founder saved");
      } else {
        const res = await createFounder(editing);
        id = res.founder._id;
        showToast("Founder created");
      }
      if (editing._profileFile) {
        await uploadFounderProfileImage(id, editing._profileFile);
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
      await deleteFounder(pendingDelete._id);
      showToast("Founder deleted");
      setPendingDelete(null);
      refetch();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to delete", "error");
    }
  };

  const columns = [
    {
      key: "name",
      label: "Founder",
      render: (row) => (
        <div className="flex items-center gap-3">
          {row.profileImage?.url && <img src={row.profileImage.url} alt="" className="h-10 w-10 rounded-full object-cover" />}
          <div>
            <p className="font-medium">{row.name}</p>
            <p className="text-xs text-muted">{row.role}</p>
          </div>
        </div>
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
        title="Founders"
        description="The people behind the journey."
        action={
          <button onClick={() => setEditing({ ...emptyFounder })} className="btn-primary flex items-center gap-2">
            <Plus size={16} /> New Founder
          </button>
        }
      />

      {loading && <Loader label="Loading founders..." />}
      {error && <ErrorState message={error} onRetry={refetch} />}
      {!loading && !error && data?.founders?.length === 0 && <EmptyState title="No founders yet." />}
      {!loading && !error && data?.founders?.length > 0 && <DataTable columns={columns} rows={data.founders} />}

      <Modal open={Boolean(editing)} title={editing?._id ? "Edit Founder" : "New Founder"} onClose={() => setEditing(null)} wide>
        {editing && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-[160px_1fr]">
              <ImageUploader
                label="Profile Photo"
                aspect="aspect-square"
                currentUrl={editing.profileImage?.url}
                onUpload={async (file) => setEditing((f) => ({ ...f, _profileFile: file }))}
              />
              <div className="space-y-4">
                <div>
                  <label className="label">Name</label>
                  <input className="input" value={editing.name} onChange={(e) => setEditing((f) => ({ ...f, name: e.target.value }))} />
                </div>
                <div>
                  <label className="label">Role</label>
                  <input className="input" value={editing.role} onChange={(e) => setEditing((f) => ({ ...f, role: e.target.value }))} />
                </div>
              </div>
            </div>

            <div>
              <label className="label">Short Bio</label>
              <textarea rows={2} className="input" value={editing.bio} onChange={(e) => setEditing((f) => ({ ...f, bio: e.target.value }))} />
            </div>
            <div>
              <label className="label">Full Biography</label>
              <textarea rows={5} className="input" value={editing.longBio} onChange={(e) => setEditing((f) => ({ ...f, longBio: e.target.value }))} />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="label">Instagram URL</label>
                <input className="input" value={editing.instagramUrl} onChange={(e) => setEditing((f) => ({ ...f, instagramUrl: e.target.value }))} />
              </div>
              <div>
                <label className="label">YouTube URL</label>
                <input className="input" value={editing.youtubeUrl} onChange={(e) => setEditing((f) => ({ ...f, youtubeUrl: e.target.value }))} />
              </div>
            </div>

            {editing._id && (
              <div>
                <label className="label">Gallery</label>
                <MultiImageUploader
                  onUpload={async (files) => {
                    const res = await uploadFounderGallery(editing._id, files);
                    setEditing((f) => ({ ...f, gallery: res.gallery }));
                    showToast("Images uploaded");
                  }}
                />
                {editing.gallery?.length > 0 && (
                  <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {editing.gallery.map((img) => (
                      <div key={img._id} className="group relative aspect-square overflow-hidden rounded-md">
                        <img src={img.url} alt="" className="h-full w-full object-cover" />
                        {/* Full-cover hover reveal for mouse users (desktop only —
                            :hover doesn't fire reliably on touch). */}
                        <button
                          onClick={async () => {
                            const res = await deleteFounderGalleryImage(editing._id, img._id);
                            setEditing((f) => ({ ...f, gallery: res.gallery }));
                          }}
                          className="absolute inset-0 hidden items-center justify-center bg-black/50 text-white sm:group-hover:flex"
                          aria-label="Delete image"
                        >
                          <Trash2 size={16} />
                        </button>
                        {/* Always-visible corner button so the same action is
                            reachable by tap on mobile. */}
                        <button
                          onClick={async () => {
                            const res = await deleteFounderGalleryImage(editing._id, img._id);
                            setEditing((f) => ({ ...f, gallery: res.gallery }));
                          }}
                          className="absolute right-1 top-1 rounded-full bg-black/60 p-1.5 text-white sm:hidden"
                          aria-label="Delete image"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={editing.published} onChange={(e) => setEditing((f) => ({ ...f, published: e.target.checked }))} />
                Published
              </label>
              <div className="w-full sm:w-24">
                <label className="label">Order</label>
                <input type="number" className="input" value={editing.order} onChange={(e) => setEditing((f) => ({ ...f, order: Number(e.target.value) }))} />
              </div>
            </div>

            <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end sm:gap-3">
              <button onClick={() => setEditing(null)} className="btn-secondary w-full sm:w-auto">
                Cancel
              </button>
              <button onClick={handleSave} disabled={saving} className="btn-primary w-full sm:w-auto">
                {saving ? "Saving..." : "Save Founder"}
              </button>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog open={Boolean(pendingDelete)} title={`Delete "${pendingDelete?.name}"?`} onCancel={() => setPendingDelete(null)} onConfirm={handleDelete} />
    </div>
  );
};

export default Founders;

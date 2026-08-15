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
import { listTrips, createTrip, updateTrip, deleteTrip, uploadTripCover } from "../api/tripsApi.js";

const toDateInput = (d) => (d ? new Date(d).toISOString().slice(0, 10) : "");

const emptyTrip = {
  title: "",
  destination: "",
  location: "",
  description: "",
  startDate: "",
  endDate: "",
  price: "",
  capacity: "",
  published: false,
  isCampaign: false,
  order: 0,
};

const Trips = () => {
  const { data, loading, error, refetch } = useFetch(listTrips, []);
  const { showToast } = useToast();
  const [editing, setEditing] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [saving, setSaving] = useState(false);

  const openNew = () => setEditing({ ...emptyTrip });
  const openEdit = (trip) =>
    setEditing({ ...trip, startDate: toDateInput(trip.startDate), endDate: toDateInput(trip.endDate) });

  const handleSave = async () => {
    if (!editing.title || !editing.destination || !editing.startDate || !editing.endDate || !editing.price || !editing.capacity) {
      showToast("Title, destination, dates, price and capacity are required", "error");
      return;
    }
    setSaving(true);
    try {
      const payload = { ...editing, price: Number(editing.price), capacity: Number(editing.capacity) };
      let id = editing._id;
      if (id) {
        await updateTrip(id, payload);
        showToast("Trip saved");
      } else {
        const res = await createTrip(payload);
        id = res.trip._id;
        showToast("Trip created");
      }
      if (editing._coverFile) {
        await uploadTripCover(id, editing._coverFile);
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
      await deleteTrip(pendingDelete._id);
      showToast("Trip deleted");
      setPendingDelete(null);
      refetch();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to delete", "error");
    }
  };

  const columns = [
    {
      key: "title",
      label: "Trip",
      render: (row) => (
        <div className="flex items-center gap-3">
          {row.coverImage?.url && <img src={row.coverImage.url} alt="" className="h-10 w-10 rounded-md object-cover" />}
          <div>
            <p className="font-medium">{row.title}</p>
            <p className="text-xs text-muted">{row.destination}</p>
          </div>
        </div>
      ),
    },
    { key: "price", label: "Price", render: (row) => `₹${row.price}` },
    { key: "seats", label: "Seats", render: (row) => `${row.availableSeats} / ${row.capacity}` },
    {
      key: "published",
      label: "Status",
      render: (row) => (
        <div className="flex flex-wrap gap-1.5">
          <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${row.published ? "bg-green-100 text-green-700" : "bg-zinc-100 text-zinc-600"}`}>
            {row.published ? "Published" : "Draft"}
          </span>
          {row.isCampaign && <span className="rounded-full bg-orange-100 px-2.5 py-1 text-xs font-medium text-orange-700">Campaign</span>}
        </div>
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
        title="Trips"
        description="Trips customers can browse and book."
        action={
          <button onClick={openNew} className="btn-primary flex items-center gap-2">
            <Plus size={16} /> New Trip
          </button>
        }
      />

      {loading && <Loader label="Loading trips..." />}
      {error && <ErrorState message={error} onRetry={refetch} />}
      {!loading && !error && data?.trips?.length === 0 && <EmptyState title="No trips yet." />}
      {!loading && !error && data?.trips?.length > 0 && <DataTable columns={columns} rows={data.trips} />}

      <Modal open={Boolean(editing)} title={editing?._id ? "Edit Trip" : "New Trip"} onClose={() => setEditing(null)} wide>
        {editing && (
          <div className="space-y-4">
            <ImageUploader
              label="Cover Image"
              currentUrl={editing.coverImage?.url}
              onUpload={async (file) => setEditing((t) => ({ ...t, _coverFile: file }))}
            />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="label">Trip Name</label>
                <input className="input" value={editing.title} onChange={(e) => setEditing((t) => ({ ...t, title: e.target.value }))} />
              </div>
              <div>
                <label className="label">Destination</label>
                <input className="input" value={editing.destination} onChange={(e) => setEditing((t) => ({ ...t, destination: e.target.value }))} />
              </div>
            </div>
            <div>
              <label className="label">Location</label>
              <input className="input" value={editing.location} onChange={(e) => setEditing((t) => ({ ...t, location: e.target.value }))} />
            </div>
            <div>
              <label className="label">Description</label>
              <textarea rows={4} className="input" value={editing.description} onChange={(e) => setEditing((t) => ({ ...t, description: e.target.value }))} />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="label">Start Date</label>
                <input type="date" className="input" value={editing.startDate} onChange={(e) => setEditing((t) => ({ ...t, startDate: e.target.value }))} />
              </div>
              <div>
                <label className="label">End Date</label>
                <input type="date" className="input" value={editing.endDate} onChange={(e) => setEditing((t) => ({ ...t, endDate: e.target.value }))} />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="label">Price (₹)</label>
                <input type="number" min="0" className="input" value={editing.price} onChange={(e) => setEditing((t) => ({ ...t, price: e.target.value }))} />
              </div>
              <div>
                <label className="label">Capacity (seats)</label>
                <input type="number" min="1" className="input" value={editing.capacity} onChange={(e) => setEditing((t) => ({ ...t, capacity: e.target.value }))} />
              </div>
            </div>
            {editing._id && (
              <p className="text-xs text-muted">
                Seats currently available: <strong>{editing.availableSeats}</strong> (raising capacity extends this; it can't be lowered below seats already booked).
              </p>
            )}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={editing.published} onChange={(e) => setEditing((t) => ({ ...t, published: e.target.checked }))} />
                Published
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={editing.isCampaign} onChange={(e) => setEditing((t) => ({ ...t, isCampaign: e.target.checked }))} />
                Active Campaign (featured on homepage)
              </label>
              <div className="w-full sm:w-24">
                <label className="label">Order</label>
                <input type="number" className="input" value={editing.order} onChange={(e) => setEditing((t) => ({ ...t, order: Number(e.target.value) }))} />
              </div>
            </div>
            <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end sm:gap-3">
              <button onClick={() => setEditing(null)} className="btn-secondary w-full sm:w-auto">
                Cancel
              </button>
              <button onClick={handleSave} disabled={saving} className="btn-primary w-full sm:w-auto">
                {saving ? "Saving..." : "Save Trip"}
              </button>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title={`Delete "${pendingDelete?.title}"?`}
        description="This removes the trip and its cover image from Cloudinary. Existing bookings are preserved for historical records."
        onCancel={() => setPendingDelete(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default Trips;

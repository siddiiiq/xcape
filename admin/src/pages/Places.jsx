import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Pencil, Trash2 } from "lucide-react";
import PageHeader from "../components/layout/PageHeader.jsx";
import DataTable from "../components/tables/DataTable.jsx";
import Loader from "../components/common/Loader.jsx";
import EmptyState from "../components/common/EmptyState.jsx";
import ErrorState from "../components/common/ErrorState.jsx";
import ConfirmDialog from "../components/common/ConfirmDialog.jsx";
import { useToast } from "../components/common/Toast.jsx";
import { useFetch } from "../hooks/useFetch.js";
import { listPlaces, deletePlace } from "../api/placesApi.js";

const Places = () => {
  const { data, loading, error, refetch } = useFetch(listPlaces, []);
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [pendingDelete, setPendingDelete] = useState(null);

  const handleDelete = async () => {
    try {
      await deletePlace(pendingDelete._id);
      showToast("Place deleted");
      setPendingDelete(null);
      refetch();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to delete", "error");
    }
  };

  const columns = [
    {
      key: "title",
      label: "Place",
      render: (row) => (
        <div className="flex items-center gap-3">
          {row.coverImage?.url && <img src={row.coverImage.url} alt="" className="h-10 w-10 rounded-md object-cover" />}
          <div>
            <p className="font-medium">{row.title}</p>
            <p className="text-xs text-muted">{row.location}</p>
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
    { key: "order", label: "Order" },
    {
      key: "actions",
      label: "",
      render: (row) => (
        <div className="flex justify-end gap-2">
          <Link to={`/admin/places/${row._id}/edit`} onClick={(e) => e.stopPropagation()} className="rounded-lg p-2.5 hover:bg-zinc-100">
            <Pencil size={14} />
          </Link>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setPendingDelete(row);
            }}
            className="rounded-lg p-2.5 hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Places"
        description="Every destination the crew has gotten lost in."
        action={
          <Link to="/admin/places/new" className="btn-primary flex items-center gap-2">
            <Plus size={16} /> New Place
          </Link>
        }
      />

      {loading && <Loader label="Loading places..." />}
      {error && <ErrorState message={error} onRetry={refetch} />}
      {!loading && !error && data?.places?.length === 0 && (
        <EmptyState
          title="No places yet."
          action={
            <Link to="/admin/places/new" className="btn-primary">
              Create your first place
            </Link>
          }
        />
      )}
      {!loading && !error && data?.places?.length > 0 && (
        <DataTable columns={columns} rows={data.places} onRowClick={(row) => navigate(`/admin/places/${row._id}/edit`)} />
      )}

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title={`Delete "${pendingDelete?.title}"?`}
        description="This removes the place and all its images from Cloudinary. This can't be undone."
        onCancel={() => setPendingDelete(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default Places;

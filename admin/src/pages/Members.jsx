import React, { useState } from "react";
import { Search, Trash2 } from "lucide-react";
import PageHeader from "../components/layout/PageHeader.jsx";
import DataTable from "../components/tables/DataTable.jsx";
import Loader from "../components/common/Loader.jsx";
import EmptyState from "../components/common/EmptyState.jsx";
import ErrorState from "../components/common/ErrorState.jsx";
import ConfirmDialog from "../components/common/ConfirmDialog.jsx";
import { useToast } from "../components/common/Toast.jsx";
import { useFetch } from "../hooks/useFetch.js";
import { listMembers, updateMember, deleteMember } from "../api/membersApi.js";

const STATUSES = ["new", "contacted", "approved", "rejected"];

const Members = () => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const { data, loading, error, refetch } = useFetch(
    () => listMembers({ search, status, page, limit: 15 }),
    [search, status, page]
  );
  const { showToast } = useToast();
  const [pendingDelete, setPendingDelete] = useState(null);

  const handleStatusChange = async (member, newStatus) => {
    try {
      await updateMember(member._id, { status: newStatus });
      showToast("Status updated");
      refetch();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to update", "error");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteMember(pendingDelete._id);
      showToast("Member deleted");
      setPendingDelete(null);
      refetch();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to delete", "error");
    }
  };

  const columns = [
    {
      key: "fullName",
      label: "Name",
      render: (row) => (
        <div>
          <p className="font-medium">{row.fullName}</p>
          <p className="text-xs text-muted">{row.email}</p>
        </div>
      ),
    },
    { key: "city", label: "City" },
    { key: "instagramUsername", label: "Instagram" },
    {
      key: "createdAt",
      label: "Joined",
      render: (row) => new Date(row.createdAt).toLocaleDateString(),
    },
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <select
          value={row.status}
          onChange={(e) => handleStatusChange(row, e.target.value)}
          className="rounded-md border border-line bg-white px-2 py-1 text-xs capitalize"
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      ),
    },
    {
      key: "actions",
      label: "",
      render: (row) => (
        <button onClick={() => setPendingDelete(row)} className="rounded-lg p-2.5 hover:bg-red-50 hover:text-red-600">
          <Trash2 size={14} />
        </button>
      ),
    },
  ];

  return (
    <div>
      <PageHeader title="Members" description="People who applied to join the crew." />

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <div className="relative w-full sm:min-w-[220px] sm:flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            className="input pl-8"
            placeholder="Search name, email, city, Instagram..."
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
          />
        </div>
        <select
          className="input w-full sm:w-auto"
          value={status}
          onChange={(e) => {
            setPage(1);
            setStatus(e.target.value);
          }}
        >
          <option value="">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s} className="capitalize">
              {s}
            </option>
          ))}
        </select>
      </div>

      {loading && <Loader label="Loading members..." />}
      {error && <ErrorState message={error} onRetry={refetch} />}
      {!loading && !error && data?.members?.length === 0 && <EmptyState title="No members found." />}
      {!loading && !error && data?.members?.length > 0 && (
        <>
          <DataTable columns={columns} rows={data.members} />
          {data.pagination?.pages > 1 && (
            <div className="mt-4 flex items-center justify-center gap-3 text-sm">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="btn-secondary disabled:opacity-40"
              >
                Previous
              </button>
              <span className="text-muted">
                Page {data.pagination.page} of {data.pagination.pages}
              </span>
              <button
                disabled={page >= data.pagination.pages}
                onClick={() => setPage((p) => p + 1)}
                className="btn-secondary disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title={`Delete "${pendingDelete?.fullName}"?`}
        onCancel={() => setPendingDelete(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default Members;

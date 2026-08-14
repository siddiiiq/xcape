import React, { useState } from "react";
import { Search, Trash2 } from "lucide-react";
import PageHeader from "../components/layout/PageHeader.jsx";
import DataTable from "../components/tables/DataTable.jsx";
import Loader from "../components/common/Loader.jsx";
import EmptyState from "../components/common/EmptyState.jsx";
import ErrorState from "../components/common/ErrorState.jsx";
import Modal from "../components/common/Modal.jsx";
import ConfirmDialog from "../components/common/ConfirmDialog.jsx";
import { useToast } from "../components/common/Toast.jsx";
import { useFetch } from "../hooks/useFetch.js";
import { listCustomers, getCustomer, deleteCustomer } from "../api/customersApi.js";

const Customers = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const { data, loading, error, refetch } = useFetch(() => listCustomers({ search, page, limit: 15 }), [search, page]);
  const [viewingId, setViewingId] = useState(null);
  const { data: detail, loading: detailLoading } = useFetch(
    () => (viewingId ? getCustomer(viewingId) : Promise.resolve(null)),
    [viewingId]
  );
  const { showToast } = useToast();
  const [pendingDelete, setPendingDelete] = useState(null);

  const handleDelete = async () => {
    try {
      await deleteCustomer(pendingDelete.id || pendingDelete._id);
      showToast("Customer deleted");
      setPendingDelete(null);
      if (viewingId === (pendingDelete.id || pendingDelete._id)) setViewingId(null);
      refetch();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to delete", "error");
    }
  };

  const columns = [
    {
      key: "name",
      label: "Customer",
      render: (row) => (
        <div>
          <p className="font-medium">{row.name}</p>
          <p className="text-xs text-muted">{row.email}</p>
        </div>
      ),
    },
    { key: "phone", label: "Phone", render: (row) => row.phone || "-" },
    { key: "bookingCount", label: "Bookings" },
    { key: "totalSpent", label: "Total Spent", render: (row) => `₹${row.totalSpent}` },
    { key: "createdAt", label: "Joined", render: (row) => new Date(row.createdAt).toLocaleDateString() },
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${row.status === "active" ? "bg-green-100 text-green-700" : "bg-zinc-100 text-zinc-600"}`}>
          {row.status}
        </span>
      ),
    },
    {
      key: "actions",
      label: "",
      render: (row) => (
        <div className="flex justify-end">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setPendingDelete(row);
            }}
            className="rounded p-2 hover:bg-red-50 hover:text-red-600"
            aria-label="Delete customer"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader title="Customers" description="Everyone with an account — community members and travelers." />

      <div className="relative mb-5 max-w-sm">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
        <input
          className="input pl-8"
          placeholder="Search name, email, phone..."
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
        />
      </div>

      {loading && <Loader label="Loading customers..." />}
      {error && <ErrorState message={error} onRetry={refetch} />}
      {!loading && !error && data?.customers?.length === 0 && <EmptyState title="No customers yet." />}
      {!loading && !error && data?.customers?.length > 0 && (
        <>
          <DataTable columns={columns} rows={data.customers} onRowClick={(row) => setViewingId(row.id || row._id)} />
          {data.pagination?.pages > 1 && (
            <div className="mt-4 flex items-center justify-center gap-3 text-sm">
              <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="btn-secondary disabled:opacity-40">
                Previous
              </button>
              <span className="text-muted">Page {data.pagination.page} of {data.pagination.pages}</span>
              <button disabled={page >= data.pagination.pages} onClick={() => setPage((p) => p + 1)} className="btn-secondary disabled:opacity-40">
                Next
              </button>
            </div>
          )}
        </>
      )}

      <Modal open={Boolean(viewingId)} title={detail?.customer?.name || "Customer"} onClose={() => setViewingId(null)} wide>
        {detailLoading && <Loader label="Loading..." />}
        {detail?.customer && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs text-muted">Email</p>
                <p className="font-medium">{detail.customer.email}</p>
              </div>
              <div>
                <p className="text-xs text-muted">Phone</p>
                <p className="font-medium">{detail.customer.phone || "-"}</p>
              </div>
              <div>
                <p className="text-xs text-muted">Joined</p>
                <p className="font-medium">{new Date(detail.customer.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-xs text-muted">Community Info</p>
                <p className="font-medium">{detail.customer.member?.city || "-"}</p>
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">Bookings ({detail.bookings?.length || 0})</p>
              {detail.bookings?.length ? (
                <div className="space-y-2">
                  {detail.bookings.map((b) => (
                    <div key={b._id} className="flex items-center justify-between rounded-lg border border-line p-3 text-sm">
                      <div>
                        <p className="font-medium">{b.trip?.title || "Trip deleted"}</p>
                        <p className="text-xs text-muted">{b.bookingReference}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">₹{b.totalAmount}</p>
                        <p className="text-xs text-muted">{b.paymentStatus} · {b.bookingStatus}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted">No bookings yet.</p>
              )}
            </div>

            <div className="flex justify-end border-t border-line pt-4">
              <button
                onClick={() => setPendingDelete(detail.customer)}
                className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <Trash2 size={14} /> Delete Customer
              </button>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title={`Delete "${pendingDelete?.name}"?`}
        description="This permanently removes the customer's account from the database. This can't be undone."
        onCancel={() => setPendingDelete(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default Customers;

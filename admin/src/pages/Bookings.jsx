import React, { useState } from "react";
import { Search, CheckCircle2, XCircle } from "lucide-react";
import PageHeader from "../components/layout/PageHeader.jsx";
import DataTable from "../components/tables/DataTable.jsx";
import Loader from "../components/common/Loader.jsx";
import EmptyState from "../components/common/EmptyState.jsx";
import ErrorState from "../components/common/ErrorState.jsx";
import Modal from "../components/common/Modal.jsx";
import { useToast } from "../components/common/Toast.jsx";
import { useFetch } from "../hooks/useFetch.js";
import { listBookings, updateBookingStatus } from "../api/bookingsApi.js";

const PAYMENT_STATUSES = ["PENDING", "PAID", "FAILED"];
const BOOKING_STATUSES = ["PENDING", "CONFIRMED", "CANCELLED"];

const Badge = ({ label, tone }) => {
  const tones = {
    green: "bg-green-100 text-green-700",
    amber: "bg-amber-100 text-amber-700",
    red: "bg-red-100 text-red-700",
    zinc: "bg-zinc-100 text-zinc-600",
  };
  return <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${tones[tone] || tones.zinc}`}>{label}</span>;
};

const paymentTone = { PAID: "green", PENDING: "amber", FAILED: "red" };
const bookingTone = { CONFIRMED: "green", PENDING: "amber", CANCELLED: "red" };

const Bookings = () => {
  const [search, setSearch] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [bookingStatus, setBookingStatus] = useState("");
  const [page, setPage] = useState(1);
  const { data, loading, error, refetch } = useFetch(
    () => listBookings({ search, paymentStatus, bookingStatus, page, limit: 15 }),
    [search, paymentStatus, bookingStatus, page]
  );
  const { showToast } = useToast();
  const [viewing, setViewing] = useState(null);

  const markCodPaid = async (booking) => {
    try {
      await updateBookingStatus(booking._id, { paymentStatus: "PAID" });
      showToast("Marked as paid");
      setViewing(null);
      refetch();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to update", "error");
    }
  };

  const cancelBooking = async (booking) => {
    try {
      await updateBookingStatus(booking._id, { bookingStatus: "CANCELLED" });
      showToast("Booking cancelled — seats released");
      setViewing(null);
      refetch();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to update", "error");
    }
  };

  const columns = [
    {
      key: "bookingReference",
      label: "Booking",
      render: (row) => (
        <div>
          <p className="font-medium">{row.bookingReference}</p>
          <p className="text-xs text-muted">{row.trip?.title || "Trip deleted"}</p>
        </div>
      ),
    },
    {
      key: "customer",
      label: "Customer",
      render: (row) => (
        <div>
          <p className="font-medium">{row.customerSnapshot?.name || row.customer?.name}</p>
          <p className="text-xs text-muted">{row.customerSnapshot?.email || row.customer?.email}</p>
        </div>
      ),
    },
    { key: "seats", label: "Seats" },
    { key: "totalAmount", label: "Total", render: (row) => `₹${row.totalAmount}` },
    { key: "paymentMethod", label: "Method" },
    { key: "paymentStatus", label: "Payment", render: (row) => <Badge label={row.paymentStatus} tone={paymentTone[row.paymentStatus]} /> },
    { key: "bookingStatus", label: "Status", render: (row) => <Badge label={row.bookingStatus} tone={bookingTone[row.bookingStatus]} /> },
  ];

  return (
    <div>
      <PageHeader title="Bookings" description="Every trip booking, with payment and status." />

      <div className="mb-5 flex flex-wrap gap-3">
        <div className="relative min-w-[220px] flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            className="input pl-8"
            placeholder="Search reference, customer name, email..."
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
          />
        </div>
        <select className="input w-auto" value={paymentStatus} onChange={(e) => { setPage(1); setPaymentStatus(e.target.value); }}>
          <option value="">All payment statuses</option>
          {PAYMENT_STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <select className="input w-auto" value={bookingStatus} onChange={(e) => { setPage(1); setBookingStatus(e.target.value); }}>
          <option value="">All booking statuses</option>
          {BOOKING_STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {loading && <Loader label="Loading bookings..." />}
      {error && <ErrorState message={error} onRetry={refetch} />}
      {!loading && !error && data?.bookings?.length === 0 && <EmptyState title="No bookings found." />}
      {!loading && !error && data?.bookings?.length > 0 && (
        <>
          <DataTable columns={columns} rows={data.bookings} onRowClick={(row) => setViewing(row)} />
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

      <Modal open={Boolean(viewing)} title={viewing?.bookingReference} onClose={() => setViewing(null)}>
        {viewing && (
          <div className="space-y-3 text-sm">
            <div className="flex justify-between border-b border-line pb-2">
              <span className="text-muted">Customer</span>
              <span className="font-medium">{viewing.customerSnapshot?.name} ({viewing.customerSnapshot?.email})</span>
            </div>
            <div className="flex justify-between border-b border-line pb-2">
              <span className="text-muted">Phone</span>
              <span>{viewing.customerSnapshot?.phone || "-"}</span>
            </div>
            <div className="flex justify-between border-b border-line pb-2">
              <span className="text-muted">Trip</span>
              <span>{viewing.trip?.title || "Trip deleted"} — {viewing.trip?.destination}</span>
            </div>
            <div className="flex justify-between border-b border-line pb-2">
              <span className="text-muted">Seats</span>
              <span>{viewing.seats}</span>
            </div>
            <div className="flex justify-between border-b border-line pb-2">
              <span className="text-muted">Total Amount</span>
              <span className="font-semibold">₹{viewing.totalAmount}</span>
            </div>
            <div className="flex justify-between border-b border-line pb-2">
              <span className="text-muted">Payment Method</span>
              <span>{viewing.paymentMethod}</span>
            </div>
            <div className="flex justify-between border-b border-line pb-2">
              <span className="text-muted">Payment Status</span>
              <Badge label={viewing.paymentStatus} tone={paymentTone[viewing.paymentStatus]} />
            </div>
            <div className="flex justify-between border-b border-line pb-2">
              <span className="text-muted">Booking Status</span>
              <Badge label={viewing.bookingStatus} tone={bookingTone[viewing.bookingStatus]} />
            </div>
            {viewing.paymentOrderId && (
              <div className="flex justify-between border-b border-line pb-2">
                <span className="text-muted">Order Reference</span>
                <span className="text-xs">{viewing.paymentOrderId}</span>
              </div>
            )}
            {viewing.paymentTransactionId && (
              <div className="flex justify-between border-b border-line pb-2">
                <span className="text-muted">Transaction ID</span>
                <span className="text-xs">{viewing.paymentTransactionId}</span>
              </div>
            )}

            <div className="flex flex-wrap justify-end gap-3 pt-3">
              {viewing.paymentMethod === "COD" && viewing.paymentStatus === "PENDING" && (
                <button onClick={() => markCodPaid(viewing)} className="btn-primary flex items-center gap-2">
                  <CheckCircle2 size={14} /> Mark COD as Paid
                </button>
              )}
              {viewing.bookingStatus !== "CANCELLED" && (
                <button onClick={() => cancelBooking(viewing)} className="btn-danger flex items-center gap-2">
                  <XCircle size={14} /> Cancel Booking
                </button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Bookings;

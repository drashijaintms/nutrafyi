import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import API from "../services/api";
import DataTable from "../components/DataTable";
import { Eye, FileDown } from "lucide-react";
import { downloadInvoice } from "../utils/invoiceDownloader";

export default function Orders() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [page, setPage] = useState(1);

  const { data: ordersData, isLoading } = useQuery({
    queryKey: ["orders", search, status, paymentStatus, page],
    queryFn: async () => {
      const res = await API.get("/orders", {
        params: {
          search,
          status,
          paymentStatus,
          page,
          limit: 10,
        },
      });
      return res.data;
    },
  });

  const columns = [
    {
      header: "Order ID",
      render: (row) => (
        <Link to={`/orders/${row._id}`} className="font-bold text-indigo-600 hover:text-indigo-800 transition-colors">
          #{row.orderId}
        </Link>
      ),
    },
    {
      header: "Customer",
      render: (row) => (
        <div>
          <span className="font-semibold text-slate-800 text-sm">{row.customer.name}</span>
          <span className="block text-xs text-slate-400 mt-0.5">{row.customer.email}</span>
        </div>
      ),
    },
    {
      header: "Date",
      render: (row) => <span>{new Date(row.createdAt).toLocaleDateString()}</span>,
    },
    {
      header: "Amount",
      render: (row) => <span className="font-semibold text-slate-800">{row.currencySymbol || "$"}{row.amount.total.toFixed(2)}</span>,
    },
    {
      header: "Payment Status",
      render: (row) => {
        const payStatus = row.paymentDetails?.status || "Pending";
        const color =
          payStatus === "Paid"
            ? "bg-emerald-50 text-emerald-600"
            : payStatus === "Failed"
            ? "bg-rose-50 text-rose-600"
            : "bg-amber-50 text-amber-600";
        return (
          <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${color}`}>
            {payStatus}
          </span>
        );
      },
    },
    {
      header: "Order Status",
      render: (row) => {
        const orderStatus = row.status;
        let color = "bg-amber-50 text-amber-600";
        if (orderStatus === "Delivered") color = "bg-emerald-50 text-emerald-600";
        else if (orderStatus === "Cancelled" || orderStatus === "Refunded")
          color = "bg-rose-50 text-rose-600";
        else if (orderStatus === "Shipped" || orderStatus === "Confirmed")
          color = "bg-sky-50 text-sky-600";

        return (
          <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${color}`}>
            {orderStatus}
          </span>
        );
      },
    },
    {
      header: "Actions",
      render: (row) => (
        <div className="flex items-center gap-1.5">
          <Link
            to={`/orders/${row._id}`}
            className="p-1.5 rounded-lg border border-slate-100 bg-white text-indigo-600 hover:bg-indigo-50 hover:border-indigo-100 transition-all"
          >
            <Eye className="w-4 h-4" />
          </Link>
          <button
            onClick={() => downloadInvoice(row._id, row.orderId)}
            className="p-1.5 rounded-lg border border-slate-100 bg-white text-slate-500 hover:bg-slate-50 hover:border-slate-200 transition-all"
          >
            <FileDown className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-800">Orders</h1>
        <p className="text-xs text-slate-400 mt-0.5">Manage customer purchase transactions, checkout invoices, and shipping states.</p>
      </div>

      {/* Orders List Table */}
      <DataTable
        columns={columns}
        data={ordersData?.orders || []}
        loading={isLoading}
        pagination={{
          page: ordersData?.page || 1,
          pages: ordersData?.pages || 1,
          onPageChange: (newPage) => setPage(newPage),
        }}
        search={{
          value: search,
          onChange: (val) => {
            setSearch(val);
            setPage(1);
          },
          placeholder: "Search by ID, name or email...",
        }}
        filters={[
          {
            label: "All Statuses",
            accessor: "status",
            value: status,
            onChange: (val) => {
              setStatus(val);
              setPage(1);
            },
            options: [
              { label: "Pending", value: "Pending" },
              { label: "Processing", value: "Processing" },
              { label: "Confirmed", value: "Confirmed" },
              { label: "Shipped", value: "Shipped" },
              { label: "Delivered", value: "Delivered" },
              { label: "Cancelled", value: "Cancelled" },
              { label: "Refunded", value: "Refunded" },
            ],
          },
          {
            label: "All Payments",
            accessor: "paymentStatus",
            value: paymentStatus,
            onChange: (val) => {
              setPaymentStatus(val);
              setPage(1);
            },
            options: [
              { label: "Pending", value: "Pending" },
              { label: "Paid", value: "Paid" },
              { label: "Failed", value: "Failed" },
              { label: "Refunded", value: "Refunded" },
            ],
          },
        ]}
      />
    </div>
  );
}

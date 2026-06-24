import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import API from "../services/api";
import DataTable from "../components/DataTable";
import { Eye } from "lucide-react";

export default function Customers() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { data: customersData, isLoading } = useQuery({
    queryKey: ["customers", search, page],
    queryFn: async () => {
      const res = await API.get("/customers", {
        params: { search, page, limit: 10 },
      });
      return res.data;
    },
  });

  const columns = [
    {
      header: "Name",
      render: (row) => <span className="font-bold text-slate-800 text-sm">{row.name}</span>,
    },
    {
      header: "Email",
      accessor: "email",
    },
    {
      header: "Phone",
      accessor: "phone",
      render: (row) => <span>{row.phone || "—"}</span>,
    },
    {
      header: "Total Orders",
      accessor: "totalOrders",
      render: (row) => <span className="font-semibold">{row.totalOrders || 0} orders</span>,
    },
    {
      header: "Total Spending",
      accessor: "totalSpending",
      render: (row) => (
        <span className="font-bold text-slate-800">${(row.totalSpending || 0).toFixed(2)}</span>
      ),
    },
    {
      header: "Joined Date",
      render: (row) => <span>{new Date(row.createdAt).toLocaleDateString()}</span>,
    },
    {
      header: "Actions",
      render: (row) => (
        <Link
          to={`/customers/${row._id}`}
          className="p-1.5 rounded-lg border border-slate-100 bg-white text-indigo-600 hover:bg-indigo-50 hover:border-indigo-100 transition-all inline-block"
        >
          <Eye className="w-4 h-4" />
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-800">Customers</h1>
        <p className="text-xs text-slate-400 mt-0.5">View user accounts, address books, and purchase summary stats.</p>
      </div>

      <DataTable
        columns={columns}
        data={customersData?.customers || []}
        loading={isLoading}
        pagination={{
          page: customersData?.page || 1,
          pages: customersData?.pages || 1,
          onPageChange: (newPage) => setPage(newPage),
        }}
        search={{
          value: search,
          onChange: (val) => {
            setSearch(val);
            setPage(1);
          },
          placeholder: "Search customers by name, email or phone...",
        }}
      />
    </div>
  );
}

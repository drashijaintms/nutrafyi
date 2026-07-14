import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import API from "../services/api";
import Loader from "../components/Loader";
import Modal from "../components/Modal";
import toast from "react-hot-toast";
import { Eye, Trash2, Mail, Calendar, User, FileText } from "lucide-react";

export default function Contacts() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedContact, setSelectedContact] = useState(null);

  // Fetch all contact messages
  const { data: contacts = [], isLoading } = useQuery({
    queryKey: ["contacts"],
    queryFn: async () => {
      const res = await API.get("/contacts");
      return res.data;
    },
  });

  // Delete message mutation
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await API.delete(`/contacts/${id}`);
    },
    onSuccess: () => {
      toast.success("Message deleted successfully");
      queryClient.invalidateQueries(["contacts"]);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to delete message");
    },
  });

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      deleteMutation.mutate(id);
    }
  };

  // Filter messages based on search term
  const filteredContacts = contacts.filter((c) => {
    const term = searchTerm.toLowerCase();
    return (
      c.name?.toLowerCase().includes(term) ||
      c.email?.toLowerCase().includes(term) ||
      c.subject?.toLowerCase().includes(term) ||
      c.message?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Contact Messages</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            View, search, and manage incoming messages from the contact form.
          </p>
        </div>

        {/* Search */}
        <div className="w-full md:w-72">
          <input
            type="text"
            placeholder="Search messages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-10 px-4 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#147a3f] focus:ring-1 focus:ring-[#147a3f] bg-white transition-all duration-200"
          />
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="py-12">
            <Loader />
          </div>
        ) : filteredContacts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/75 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Subject</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-600">
                {filteredContacts.map((contact) => (
                  <tr key={contact._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-500">
                      {new Date(contact.createdAt).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-800">{contact.name}</td>
                    <td className="px-6 py-4">
                      <a
                        href={`mailto:${contact.email}`}
                        className="inline-flex items-center gap-1.5 text-[#147a3f] hover:underline"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        {contact.email}
                      </a>
                    </td>
                    <td className="px-6 py-4 max-w-xs truncate font-medium text-slate-700">
                      {contact.subject}
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedContact(contact)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-[#147a3f] hover:bg-[#147a3f]/5 transition-colors"
                          title="View Message"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(contact._id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Delete Message"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <span className="text-2xl mb-2">📥</span>
            <p className="font-bold text-slate-700">No messages found</p>
            <p className="text-slate-400 text-xs mt-0.5">
              Messages submitted on the Contact form will appear here.
            </p>
          </div>
        )}
      </div>

      {/* Message Details Modal */}
      <Modal
        isOpen={!!selectedContact}
        onClose={() => setSelectedContact(null)}
        title="Message Details"
      >
        {selectedContact && (
          <div className="space-y-6 text-sm font-['Poppins']">
            {/* Meta Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-white border border-slate-200 text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">
                    From
                  </p>
                  <p className="font-bold text-slate-800">{selectedContact.name}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-white border border-slate-200 text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">
                    Email Address
                  </p>
                  <a
                    href={`mailto:${selectedContact.email}`}
                    className="font-bold text-[#147a3f] hover:underline"
                  >
                    {selectedContact.email}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-white border border-slate-200 text-slate-400">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">
                    Subject
                  </p>
                  <p className="font-bold text-slate-800">{selectedContact.subject}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-white border border-slate-200 text-slate-400">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">
                    Received Date
                  </p>
                  <p className="font-bold text-slate-800">
                    {new Date(selectedContact.createdAt).toLocaleString(undefined, {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Message Body */}
            <div>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-2">
                Message Body
              </p>
              <div className="bg-slate-50 border border-slate-100 p-5 rounded-xl text-slate-700 whitespace-pre-wrap leading-relaxed">
                {selectedContact.message}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedContact(null)}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl transition text-xs"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

import API from "../services/api";
import toast from "react-hot-toast";

/**
 * Downloads the order invoice PDF using an authenticated GET request.
 * @param {string} orderId - The mongoose _id of the order.
 * @param {string} orderDisplayId - The display ID of the order (e.g. ORD-123456).
 */
export const downloadInvoice = async (orderId, orderDisplayId) => {
  const toastId = toast.loading("Generating and downloading invoice...");
  try {
    const response = await API.get(`/orders/${orderId}/invoice`, {
      responseType: "blob",
    });

    const url = window.URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Invoice-${orderDisplayId}.pdf`);
    document.body.appendChild(link);
    link.click();

    // Cleanup
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    toast.success("Invoice downloaded successfully!", { id: toastId });
  } catch (err) {
    console.error("Invoice download error:", err);
    toast.error("Failed to download invoice. Please try again.", { id: toastId });
  }
};

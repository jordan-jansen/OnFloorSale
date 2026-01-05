import { useState } from "react";
import { useCart } from "../cartContext.jsx";
import Barcode from "react-barcode";

function isToday(isoString) {
  if (!isoString) return false;
  const d = new Date(isoString);

  const today = new Date();
  return (
    d.getFullYear() === today.getFullYear() &&
    d.getMonth() === today.getMonth() &&
    d.getDate() === today.getDate()
  );
}

export default function TodaysOrders() {
  const { orders } = useCart();

  const todaysOrders = orders.filter((o) => isToday(o.createdAt));

  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  function openModal(order) {
    setSelectedOrder(order);
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setSelectedOrder(null);
  }

  if (todaysOrders.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Today's Orders</h2>
          <p>No orders for today yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-5xl bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Today's Orders</h2>

        <table className="min-w-full text-sm border">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left">Time</th>
              <th className="px-4 py-2 text-left">Ref No</th>
              <th className="px-4 py-2 text-left">Store</th>
              <th className="px-4 py-2 text-right">Items</th>
              <th className="px-4 py-2 text-right">Total (AED)</th>
              <th className="px-4 py-2 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {todaysOrders.map((order) => {
              const date = new Date(order.createdAt);
              const timeStr = date.toLocaleTimeString("en-GB", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              });

              return (
                <tr key={order.id} className="border-t">
                  <td className="px-4 py-2">{timeStr}</td>
                  <td className="px-4 py-2">{order.refNo}</td>
                  <td className="px-4 py-2">{order.store || "-"}</td>
                  <td className="px-4 py-2 text-right">
                    {order.itemCount ?? order.items?.length ?? 0}
                  </td>
                  <td className="px-4 py-2 text-right">
                    {order.total?.toFixed
                      ? order.total.toFixed(2)
                      : Number(order.total || 0).toFixed(2)}
                  </td>
                  <td className="px-4 py-2 text-center">
                    <button
                      onClick={() => openModal(order)}
                      className="text-blue-600 hover:underline"
                    >
                      View
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Modal – reuse the PrintOrder layout but driven by selectedOrder */}
        {showModal && selectedOrder && (
          <div className="modal-overlay">
            <div className="modal-card">
              <OrderDetailsModal order={selectedOrder} onClose={closeModal} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// This component mimics your PrintOrder.jsx layout but uses the selected order data
function OrderDetailsModal({ order, onClose }) {
  const {
    refNo,
    barcode,
    store,
    username,
    customerMobile,
    total,
    createdAt,
  } = order;

  const dateObj = createdAt ? new Date(createdAt) : new Date();
  const foNo = "1212";
  const mobNo = customerMobile || "N/A";
  const storeCode = store || "N/A";
  const currency = "AED";

  const dateStr = dateObj.toLocaleDateString("en-GB");
  const timeStr = dateObj.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="bg-white border rounded-lg shadow-sm p-6 w-[380px]">
      <h2 className="text-center font-semibold mb-4">
        Grandiose Floor Order Print
      </h2>

      <hr className="mb-3" />

      <div className="text-sm">
        <div className="flex justify-between mb-1">
          <span>
            <span className="font-medium">FO No</span> {foNo}
          </span>
          <span>
            <span className="font-medium">Date</span> {dateStr}
          </span>
        </div>

        <div className="flex justify-between mb-1">
          <span>
            <span className="font-medium">Mob No</span> {mobNo}
          </span>
          <span>
            <span className="font-medium">Time</span> {timeStr}
          </span>
        </div>

        <div className="flex justify-between mb-1">
          <span>
            <span className="font-medium">Ref No</span> {refNo}
          </span>
          <span>
            <span className="font-medium">Store</span> {storeCode}
          </span>
        </div>

        {username && (
          <div className="mt-1">
            <span className="font-medium">User</span> {username}
          </div>
        )}

        <div className="mt-1">
          <span className="font-medium">Amount</span>{" "}
          {currency}{" "}
          {total?.toFixed
            ? total.toFixed(2)
            : Number(total || 0).toFixed(2)}
        </div>
      </div>

      <div className="mt-6 flex justify-center">
        <div className="inline-flex flex-col items-center">
          <Barcode
            value={String(barcode || refNo || "000000000000")}
            displayValue={true}
            fontSize={12}
            height={60}
            width={1.5}
          />
          <div className="mt-1 text-xs">Ref: {refNo}</div>
        </div>
      </div>

      <div className="mt-6 flex justify-center">
        <button
          onClick={onClose}
          className="px-4 py-2 text-sm border rounded-md hover:bg-gray-100"
        >
          Close
        </button>
      </div>
    </div>
  );
}

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../cartContext.jsx";

export default function Product() {
  const navigate = useNavigate();
  const { items, addItem, removeItem } = useCart();

  const [showModal, setShowModal] = useState(false);
  const [barcode, setBarcode] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  function openModal() {
    setBarcode("");
    setQuantity(1);
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
  }

  async function handleModalSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5181/api/product/by-barcode",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ barcode }),
        }
      );

      if (!response.ok) throw new Error("Product not found");

      const product = await response.json();

      addItem({
        name: product.itemNo,
        description: product.description,
        price: parseFloat(product.price),
        currency: "AED",
        barcode,
        quantity: Number(quantity),
      });

      setShowModal(false);
    } catch (err) {
      alert("Failed to add item.");
    } finally {
      setLoading(false);
    }
  }

  function handleDelete(lineId) {
    if (items.length === 0) {
      alert("There are no items added");
      return;
    }
    removeItem(lineId);
  }

  function goCart() {
    navigate("/cart");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-5xl bg-white shadow rounded-lg p-6">

        <h1 className="text-lg font-semibold mb-4">Products</h1>

        <table className="min-w-full text-sm border">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2">Item No</th>
              <th className="px-4 py-2">Description</th>
              <th className="px-4 py-2">Price</th>
              <th className="px-4 py-2">Qty</th>
              <th className="px-4 py-2">Barcode</th>
              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>

          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-4 text-gray-400">
                  No items added
                </td>
              </tr>
            ) : (
              items.map(item => (
                <tr key={item.lineId} className="border-t">
                  <td className="px-4 py-2">{item.name}</td>
                  <td className="px-4 py-2">{item.description}</td>
                  <td className="px-4 py-2">{item.price}</td>
                  <td className="px-4 py-2">{item.quantity}</td>
                  <td className="px-4 py-2">{item.barcode}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleDelete(item.lineId)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div className="mt-6 flex gap-4">
          <button onClick={openModal} className="border px-4 py-2">
            Add to Cart
          </button>
          <button onClick={goCart} className="bg-blue-600 text-white px-4 py-2">
            Go to Cart
          </button>
        </div>

        {showModal && (
          <div className="modal-overlay">
            <div className="modal-card">
              <form onSubmit={handleModalSubmit} className="space-y-4">
                <input
                  value={barcode}
                  onChange={(e) => setBarcode(e.target.value)}
                  placeholder="Barcode"
                  required
                />
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  required
                />
                <button type="submit" disabled={loading}>
                  {loading ? "Fetching..." : "Add"}
                </button>
                <button type="button" onClick={closeModal}>
                  Cancel
                </button>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

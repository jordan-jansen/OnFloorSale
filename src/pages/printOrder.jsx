import { useNavigate } from "react-router-dom";
import { useCart } from "../cartContext.jsx";

export default function PrintOrder() {
  const navigate = useNavigate();
  const { items, store, username,customerMobile } = useCart();
  
  const now = new Date();
  const foNo = "1212";
  const mobNo = customerMobile || "N/A";

  // 🔹 use store from context, fallback to something if empty
  const storeCode = store || "N/A";

  const refNo = items[0]?.barcode || "000000000000";

  const amount = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const currency = items[0]?.currency || "AED";

  const dateStr = now.toLocaleDateString("en-GB");
  const timeStr = now.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });

  function backHome() {
    navigate("/product");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
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

          {/* If you also want to show username somewhere */}
          {username && (
            <div className="mt-1">
              <span className="font-medium">User</span> {username}
            </div>
          )}

          <div className="mt-1">
            <span className="font-medium">Amount</span>{" "}
            {currency} {amount.toFixed(2)}
          </div>
        </div>

        {/* barcode + button as you already had... */}
        <div className="mt-6 flex justify-center">
          <div className="inline-flex flex-col items-center">
            <div className="w-52 h-20 border bg-gray-50 flex items-center justify-center text-xs">
              (Barcode for {refNo})
            </div>
            <div className="mt-1 text-xs tracking-[0.2em]">
              {refNo}
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <button
            onClick={backHome}
            className="px-4 py-2 text-sm border rounded-md hover:bg-gray-100"
          >
            Back to Products
          </button>
        </div>
      </div>
    </div>
  );
}

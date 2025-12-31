import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../cartContext.jsx";

export default function FoStart() {
  const [mobile, setMobile] = useState("");
  const [floorOrder, setFloorOrder] = useState("");
  const navigate = useNavigate();
  const { setCustomerMobile } = useCart();

  function handleCreateFO() {
    if (!mobile.trim()) {
      alert("Please enter customer mobile number");
     return;
    }
    setCustomerMobile(mobile);
    navigate("/product"); 
  }
  

  function handleSearch() {
    if (floorOrder.length > 0 && mobile.length == 0){
      alert("The search order: " + floorOrder + " cannot be found")
    }

    setFloorOrder(floorOrder);
   
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6 border">

        {/* Logo Area */}
        <div className="flex justify-end text-gray-700 font-semibold mb-4">
          Logo
        </div>

        {/* Title */}
        <h1 className="text-center text-xl font-bold mb-6">
          Grandiose Floor Order
        </h1>

        {/* Mobile Input */}
        <input
          type="text"
          placeholder="Enter Customer mob no"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          className="w-full border rounded-md px-3 py-2 mb-6 text-center"
          required
        />

        {/* Buttons */}
        <button 
          onClick={handleCreateFO}
          className="w-full border rounded-md px-4 py-2 mb-4 hover:bg-gray-100"
        >
          Create new FO
        </button>
        <br/>
        <input 
        type="text"
        placeholder="Enter FO Number"
        value={floorOrder}
        onChange={(e) => setFloorOrder(e.target.value)}
        className="w-full border rounded-md px-3 py-2 mb-6 text-center"
        
        />
        <br/>
        <button
          onClick={handleSearch}
          className="w-full border rounded-md px-4 py-2 hover:bg-gray-100"
        >
          Search FO
        </button>

      </div>
    </div>
  );
}

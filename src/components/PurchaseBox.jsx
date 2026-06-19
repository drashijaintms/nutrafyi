function PurchaseBox({ price }) {
  return (
    <div
      className="
        border
        border-[#e5e5e5]
        rounded-xl
        p-6
        bg-white
        sticky
        top-6
      "
    >

      {/* Price */}
      <div className="mb-6">

        <h3 className="text-gray-500 text-sm uppercase">
          Price
        </h3>

        <div
          className="
            text-[38px]
            font-bold
            text-[#147a3f]
          "
        >
          {price}
        </div>

      </div>

      {/* Quantity */}
      <div className="mb-6">

        <label
          className="
            block
            font-semibold
            mb-2
          "
        >
          Quantity
        </label>

        <input
          type="number"
          defaultValue="1"
          min="1"
          className="
            w-full
            border
            border-[#ddd]
            rounded-md
            px-4
            py-3
          "
        />

      </div>

      {/* Add To Cart */}
      <button
        className="
          w-full
          bg-[#147a3f]
          hover:bg-[#0f6630]
          text-white
          py-4
          rounded-lg
          font-semibold
          mb-3
          transition
        "
      >
        ADD TO CART
      </button>

      {/* Buy Now */}
      <button
        className="
          w-full
          border
          border-[#147a3f]
          text-[#147a3f]
          py-4
          rounded-lg
          font-semibold
          mb-6
          transition
          hover:bg-[#147a3f]
          hover:text-white
        "
      >
        BUY NOW
      </button>

      {/* Benefits */}
      <div className="space-y-4 text-sm">

        <div>
          ✓ Secure Checkout
        </div>

        <div>
          ✓ Fast Shipping
        </div>

        <div>
          ✓ Satisfaction Guaranteed
        </div>

        <div>
          ✓ Premium Quality Product
        </div>

      </div>

    </div>
  );
}

export default PurchaseBox;
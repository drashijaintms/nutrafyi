function ProductInfo({
  title,
  price,
  description,
  specifications,
  aboutItems,
  rating,
  reviews,
}) {


  return (
    <div>
      {/* Product Title */}
<h1
  className="
    text-[36px]
    font-bold
    leading-tight
    mb-4
  "
>
  {title}
</h1>
      {/* Description */}
      <p className="text-[20px] leading-9 text-[#222] mb-4">
        {description}
      </p>


{/* Rating */}
<div className="flex items-center gap-2 mb-4">

  <span className="text-[#f6a400] text-lg">
    {"★".repeat(rating)}
  </span>

  <span className="text-[#555] text-sm">
    ({reviews})
  </span>

</div>

      {/* Price */}
      <div className="flex items-center gap-3 mb-6">
        <span className="text-red-500 text-[22px]">
          -5%
        </span>

        <span className="text-[32px] font-semibold">
          {price}
        </span>
      </div>

      {/* Specifications */}
      <div className="border-t border-[#ddd] pt-5">

        <div className="grid grid-cols-2 gap-x-10 gap-y-3 text-[13px]">

          {specifications?.map((spec, index) => (
  <div
    key={index}
    className="contents"
  >
    <div className="font-bold uppercase">
      {spec.label}
    </div>

    <div className="text-[#333]">
      {spec.value}
    </div>
  </div>
))}

        </div>

      </div>

      {/* About This Item */}
      <div className="border-t border-[#ddd] mt-8 pt-6">

        <h3 className="font-bold text-[20px] mb-4 uppercase">
          About This Item
        </h3>

        <ul className="list-disc pl-5 space-y-2 text-[14px] leading-7 text-[#444]">
{aboutItems?.map((item, index) => (
  <li key={index}>
    {item}
  </li>
))}
        </ul>

      </div>

    </div>
  );
}

export default ProductInfo;
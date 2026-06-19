import { useState, useEffect } from "react";

function ProductGallery({ images }) {
  const [selectedImage, setSelectedImage] = useState(
    images?.[0]
  );

  useEffect(() => {
    setSelectedImage(images?.[0]);
  }, [images]);

  return (

    <div>

      {/* Main Image */}
      <div
        className="
          border
          border-[#e5e5e5]
          rounded-xl
          p-8
          bg-white
          mb-4
        "
      >
        <img
          src={selectedImage}
          alt=""
          className="
            w-full
            h-[350px]
            object-contain
          "
        />
      </div>

      {/* Thumbnails */}
      <div className="flex gap-3">

        {images?.map((image, index) => (
          <button
            key={index}
            onClick={() =>
              setSelectedImage(image)
            }
            className="
              border
              border-[#ddd]
              rounded-md
              p-2
              hover:border-[#147a3f]
            "
          >
            <img
              src={image}
              alt=""
              className="
                w-16
                h-16
                object-contain
              "
            />
          </button>
        ))}

      </div>

    </div>
  );
}

export default ProductGallery;
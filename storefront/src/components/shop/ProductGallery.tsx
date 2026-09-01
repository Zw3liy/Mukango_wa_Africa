import React, { useState } from "react";
import { Product } from "../../types/product";
import { ZoomIn } from "lucide-react";
import { Modal } from "../common/Modal";

interface ProductGalleryProps {
  product: Product;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({ product }) => {
  const images = [
    { src: product.images.hero, label: "Hero View", alt: product.images.alt },
    { src: product.images.detail, label: "Carving Detail", alt: `${product.name} hand-carved ${product.timber} detail` },
    ...(product.images.inSitu ? [{ src: product.images.inSitu, label: "In Situ Room", alt: `${product.name} handcrafted African furniture in an interior setting` }] : []),
    ...(product.images.workshop ? [{ src: product.images.workshop, label: "Workshop Masterpiece", alt: `${product.name} artisan provenance in the Lusaka workshop` }] : []),
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  const activeImage = images[activeIndex] || images[0];

  return (
    <div className="space-y-4">
      {/* Main Large Image */}
      <div className="relative aspect-4/3 sm:aspect-square bg-stone-100 rounded overflow-hidden border border-[#D4B896]/40 shadow-xs group">
        <img
          src={activeImage.src}
          alt={activeImage.alt}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Zoom Trigger Button */}
        <button
          onClick={() => setIsZoomOpen(true)}
          className="absolute bottom-4 right-4 p-2.5 rounded-full bg-white/90 text-[#4F2607] hover:bg-white shadow-md transition"
          aria-label="Enlarge image preview"
        >
          <ZoomIn className="w-5 h-5" />
        </button>

        {/* Caption */}
        <div className="absolute bottom-4 left-4 px-3 py-1 bg-[#2D2A26]/80 text-[#FAF9F6] text-xs rounded backdrop-blur-xs">
          {activeImage.label}
        </div>
      </div>

      {/* Thumbnail Strip */}
      {images.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2">
          {images.map((img, index) => {
            const isCurrent = activeIndex === index;
            return (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`relative w-20 h-20 rounded overflow-hidden shrink-0 border-2 transition ${
                  isCurrent
                    ? "border-[#4F2607] shadow-sm ring-2 ring-[#8B6F47]/30"
                    : "border-[#D4B896]/40 opacity-70 hover:opacity-100"
                }`}
                aria-label={`Switch to ${img.label}`}
              >
                <img src={img.src} alt={img.alt} className="w-full h-full object-cover" />
              </button>
            );
          })}
        </div>
      )}

      {/* High-Res Image Lightbox Modal */}
      <Modal isOpen={isZoomOpen} onClose={() => setIsZoomOpen(false)} title={product.name} maxWidth="2xl">
        <div className="aspect-square sm:aspect-16/10 w-full overflow-hidden bg-stone-900 rounded">
          <img
            src={activeImage.src}
            alt={activeImage.alt}
            className="w-full h-full object-contain"
          />
        </div>
      </Modal>
    </div>
  );
};

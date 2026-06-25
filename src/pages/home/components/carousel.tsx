import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { carouselImages } from "@/utils/constant";

const Carousel: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
  }, []);

  const handlePrev = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + carouselImages.length) % carouselImages.length
    );
  };

  useEffect(() => {
    const interval = setInterval(handleNext, 3000);
    return () => clearInterval(interval);
  }, [handleNext]);

  return (
    <div
      id="default-carousel"
      className="relative w-full"
      data-carousel="slide"
    >
      {/* Carousel wrapper */}
      <div className="relative h-56 overflow-hidden rounded-lg md:h-96">
        {carouselImages.map((slide, index) => (
          <div
            key={index}
            className={`absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 transition-opacity duration-700 ease-in-out relative ${
              currentSlide === index ? "opacity-100" : "opacity-0"
            }`}
            data-carousel-item
          >
            <Image
              src={slide}
              alt={`Slide ${index + 1}`}
              fill
              unoptimized
              className="object-cover"
            />
          </div>
        ))}
      </div>
      {/* Slider indicators */}
      <div className="absolute z-30 flex -translate-x-1/2 bottom-5 left-1/2 space-x-3 rtl:space-x-reverse">
        {carouselImages.map((_, slide) => (
          <button
            key={slide}
            type="button"
            className={`w-3 h-3 rounded-full ${
              currentSlide === slide ? "bg-blue-600" : "bg-gray-300"
            }`}
            aria-current={currentSlide === slide ? "true" : "false"}
            aria-label={`Slide ${slide + 1}`}
            onClick={() => setCurrentSlide(slide)}
          />
        ))}
      </div>
      {/* Slider controls */}
      <button
        type="button"
        className="absolute top-0 start-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
        onClick={handlePrev}
      >
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 group-hover:bg-white/50 group-focus:ring-4 group-focus:ring-white focus:outline-none">
          <svg
            className="w-4 h-4 text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 6 10"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 1 1 5l4 4"
            />
          </svg>
          <span className="sr-only">Previous</span>
        </span>
      </button>
      <button
        type="button"
        className="absolute top-0 end-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
        onClick={handleNext}
      >
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 group-hover:bg-white/50 group-focus:ring-4 group-focus:ring-white focus:outline-none">
          <svg
            className="w-4 h-4 text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 6 10"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m1 9 4-4-4-4"
            />
          </svg>
          <span className="sr-only">Next</span>
        </span>
      </button>
    </div>
  );
};

export default Carousel;

import Image from "next/image";

const FeatureCard = () => {
  return (
    <section className="bg-[#FAF3EA] py-[80px]">
      <div className="container mx-auto flex flex-col sm:flex-row sm:flex-wrap justify-center sm:justify-between space-y-8 sm:space-y-0 items-center">
        <div className="flex flex-col items-center space-y-4 w-full sm:w-1/2 lg:w-auto">
          <Image
            src="/assets/icons/Group.svg"
            alt="High Quality"
            width={64}
            height={64}
            unoptimized
            className="w-16 h-16"
          />
          <div className="text-center">
            <p className="font-semibold text-lg text-gray-800">High Quality</p>
            <span className="text-gray-500 text-sm">
              crafted from top materials
            </span>
          </div>
        </div>

        <div className="flex flex-col items-center space-y-4 w-full sm:w-1/2 lg:w-auto">
          <Image
            src="/assets/icons/Vector.svg"
            alt="Warranty Protection"
            width={64}
            height={64}
            unoptimized
            className="w-16 h-16"
          />
          <div className="text-center">
            <p className="font-semibold text-lg text-gray-800">
              Warranty Protection
            </p>
            <span className="text-gray-500 text-sm">Over 2 years</span>
          </div>
        </div>

        <div className="flex flex-col items-center space-y-4 w-full sm:w-1/2 lg:w-auto">
          <Image
            src="/assets/icons/shipping.svg"
            alt="Free Shipping"
            width={64}
            height={64}
            unoptimized
            className="w-16 h-16"
          />
          <div className="text-center">
            <p className="font-semibold text-lg text-gray-800">Free Shipping</p>
            <span className="text-gray-500 text-sm">Order over 150$</span>
          </div>
        </div>

        <div className="flex flex-col items-center space-y-4 w-full sm:w-1/2 lg:w-auto">
          <Image
            src="/assets/icons/customer-support.svg"
            alt="24/7 Support"
            width={64}
            height={64}
            unoptimized
            className="w-16 h-16"
          />
          <div className="text-center">
            <p className="font-semibold text-lg text-gray-800">24/7 Support</p>
            <span className="text-gray-500 text-sm">Dedicated support</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureCard;

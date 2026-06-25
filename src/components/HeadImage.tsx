import Image from "next/image";
import { FC } from "react";
interface IHeadImageProps {
  title: string;
  link: string;
}
const HeadImage: FC<IHeadImageProps> = ({ title }) => {
  return (
    <>
      <div className="relative">
        <Image
          src="/assets/images/overlay.png"
          alt=""
          width={1440}
          height={316}
          unoptimized
          className="w-full block object-contain"
        />

        <div className="absolute items-center space-y-2 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <h1 className="font-bold lg:text-5xl text-3xl">{title}</h1>
          {/* <p className="lg:text-base sm:text-sm">{link}</p> */}
        </div>
      </div>
    </>
  );
};

export default HeadImage;

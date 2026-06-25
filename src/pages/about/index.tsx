import HeadImage from "@/components/HeadImage";
import Header from "../layouts/Header";
import Footer from "../layouts/Footer";
import Image from "next/image";

const AboutPage = () => {
  return (
    <>
      <Header />
      <HeadImage title={"About"} link={"About"} />
      <section className="bg-[#FAF3EA] py-[80px]">
        <div className="container mx-auto flex flex-col ">
          <div className="flex lg:flex-row flex-col mt-10">
            {/* Our Mission Section */}
            <div className="lg:w-1/2 text-center lg:text-left">
              <h1 className="font-bold text-3xl">Our Mission</h1>
              <p className="mt-6">
                We are a team develop from VN founded in 2024.
              </p>
              <p className="mt-6 font-bold">Challenges are opportunities.</p>
              <p className="mt-6">
                That’s why we don’t just promise great business outcomes–we are
                accountable for them. As part of the strongest network of
                merchant brands that rely on our accurate machine learning
                approach, you can shift fraud chargeback liability and optimize
                performance according to your risk tolerance and business goals.
                Instead of feeling uncertain, you gain confidence and an
                accountable partner to your success. Take risk off the table
                with <span className="font-bold">Furino</span>, and put your
                business on the sure path to growth and profitability.
              </p>
            </div>
            <div className="lg:w-1/2">
              <Image
                src={"/assets/images/our-mission.png"}
                width={320}
                height={320}
                unoptimized
                alt="Our Mission"
                className="lg:float-right mx-auto"
              />
            </div>
          </div>

          {/* Our Story Section */}
          <div className="flex lg:flex-row flex-col mt-10">
            <div className="lg:w-1/2">
              <Image
                src={"/assets/images/about.jpg"}
                width={420}
                height={320}
                unoptimized
                alt="About Us"
                className="object-cover"
              />
            </div>
            <div className="lg:w-1/2 text-center lg:text-left">
              <h1 className="text-3xl font-bold">Our Story</h1>
              <p className="mt-6">
                In 2024, to be ready for business, we have been planned and
                established.
              </p>
              <p className="mt-6 font-bold">
                We believe risk should never keep you from growing your business
                with confidence.
              </p>
              <p className="mt-6">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Provident fuga earum blanditiis tempora, odit esse quam quo ut
                sunt aut impedit quibusdam iusto distinctio? Animi in aliquid
                expedita eveniet magnam.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className="bg-white py-12">
          <h2 className="text-3xl font-bold text-center mb-8">Technologies</h2>
          <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <Image
                src={"/assets/images/taildwindcss.jpg"}
                width={200}
                height={200}
                unoptimized
                alt=""
                className="object-cover mx-auto"
              />
            </div>
            <div>
              <Image
                src={"/assets/images/materialui.jpg"}
                width={200}
                height={200}
                unoptimized
                alt=""
                className="object-cover mx-auto"
              />
            </div>
            <div>
              <Image
                src={"/assets/images/nextjs.svg"}
                width={160}
                height={160}
                unoptimized
                alt=""
                className="object-cover mx-auto"
              />
            </div>
            <div>
              <Image
                src={"/assets/images/nestjs.png"}
                width={175}
                height={175}
                unoptimized
                alt=""
                className="object-cover mx-auto"
              />
            </div>
            <div>
              <Image
                src={"/assets/images/postgresql.png"}
                width={175}
                height={175}
                unoptimized
                alt=""
                className="object-cover mx-auto"
              />
            </div>
            <div>
              <Image
                src={"/assets/images/docker.webp"}
                width={175}
                height={175}
                unoptimized
                alt=""
                className="object-cover mx-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Additional Section */}
      <section>
        <div className="bg-green-900 text-white py-12">
          <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <h3 className="text-lg font-semibold uppercase">Funding</h3>
              <p className="text-3xl font-bold">$216+ M</p>
              <p className="text-sm text-blue-300">Series C Announcement</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold uppercase">Founded</h3>
              <p className="text-3xl font-bold">2023</p>
              <p className="text-sm text-blue-300">Wheels Up!</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold uppercase">Headquarters</h3>
              <p className="text-3xl font-bold">DA NANG, VN</p>
              <p className="text-sm text-blue-300">Built in Vietnam</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold uppercase">Press</h3>
              <p className="text-3xl font-bold">In the News</p>
              <p className="text-sm text-blue-300">What the media is saying</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold uppercase">Purpose</h3>
              <p className="text-3xl font-bold">Better Care</p>
              <p className="text-sm text-blue-300">A word from our CEO</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold uppercase">Culture</h3>
              <p className="text-3xl font-bold">Values</p>
              <p className="text-sm text-blue-300">Our DNA</p>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default AboutPage;

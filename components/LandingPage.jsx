import React from "react";
import NavBar from "./common/NavBar";
import Image from "next/image";
import { Passion_One } from "next/font/google";
import { Montserrat } from "next/font/google";
import { BadgeCheck, HandHeart, Store } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
const passionOne = Passion_One({ subsets: ["latin"], weight: "400" });
const montserrat = Montserrat({ subsets: ["latin"], weight: "400" });

const LandingPage = () => {
  return (
    <div>
      <div className="h-screen relative">
        <NavBar />
        <section
          className={`${montserrat.className} absolute flex max-lg:flex-col justify-center left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 xl:max-w-[100rem] w-full px-4`}
        >
          <div className={`mt-12 lg:w-1/2`}>
            <h1 className={`${passionOne.className} text-5xl font-bold`}>Community stores made easy!</h1>
            <p className={`text-lg`}>
              Discover a place to sell whatever it is you love, connecting you with your community directly. Whether
              it's food, pet services, or art, we've got you covered. Our goal is to enable you to more easily connect
              with community members, so you can focus on the important stuff.
            </p>
            <h2 className="font-semibold mt-4 ">(kinda like a lemonade stall)</h2>
          </div>
          <div className="w-10 xl:w-40" />
          <Image
            src={"/bags.webp"}
            alt="bags"
            width={600}
            height={400}
            className="md:rounded-[3rem] transform skew-y-1 rounded-xl max-lg:mt-8 mx-auto"
          />
        </section>
      </div>

      <section className={`${montserrat.className} flex flex-col mx-auto xl:max-w-[100rem] px-4`}>
        <h2 className={`${passionOne.className} font-bold md:text-6xl text-5xl mx-auto`}>How does it work?</h2>
        <div className="flex max-lg:flex-col xl:gap-64 md:gap-40 gap-20 items-start md:mt-40 mt-24 mx-auto">
          <div className="flex flex-col justify-center items-center gap-4 w-40">
            <div className="bg-green-600 rounded-full p-12">
              <Store size={130} color="white" />
            </div>
            <h4 className="font-semibold text-lg">Create a Store</h4>
            <p className="text-center -mt-2">Fill out basic details about your store and what you sell</p>
          </div>
          <div className="flex flex-col justify-center items-center gap-4 w-40">
            <div className="bg-cyan-400 rounded-full p-12">
              <BadgeCheck size={130} color="white" />
            </div>
            <h4 className="font-semibold text-lg">Get Approved</h4>
            <p className="text-center -mt-2">Your store will be reviewed and it's authenticity confirmed</p>
          </div>
          <div className="flex flex-col justify-center items-center gap-4 w-40">
            <div className="bg-rose-500 rounded-full p-12">
              <HandHeart size={130} color="white" />
            </div>
            <h4 className="font-semibold text-lg">Start Selling!</h4>
            <p className="text-center -mt-2">Once approved, customers may start placing order on your store</p>
            <p></p>
          </div>
        </div>
      </section>

      <section className={`mx-auto xl:w-[60rem] md:my-72 my-40 ${montserrat.className}  px-4`}>
        <h2 className={`${passionOne.className} font-bold text-5xl text-center`}>Frequenly asked questions</h2>

        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger className="md:text-lg text-base text-left font-semibold">
              How long does it take to get approved
            </AccordionTrigger>
            <AccordionContent className="text-base max-md:text-sm">
              We try to get stores approved as soon as possible, and may typically take 1-2 days.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger className="md:text-lg text-base text-left font-semibold">
              What types of stores are allowed
            </AccordionTrigger>
            <AccordionContent className="text-base max-md:text-sm">
              Any type of store is allowed, as long as the products or services sold are within the legal limits.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger className="md:text-lg text-base text-left font-semibold">
              Do I have to live in the community to open a store
            </AccordionTrigger>
            <AccordionContent className="text-base max-md:text-sm">
              Yes, all stores must be relevant to the community that they are a part of.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger className="md:text-lg text-base text-left font-semibold">
              How much of the profit made do I get to keep
            </AccordionTrigger>
            <AccordionContent className="text-base max-md:text-sm">
              All profits go directly to sellers, and do not charge any additional fees.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>
    </div>
  );
};

export default LandingPage;

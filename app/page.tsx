import { About } from "@/components/sections/About";
import { Calculator } from "@/components/sections/Calculator";
import { Cases } from "@/components/sections/Cases";
import { Contact } from "@/components/sections/Contact";
import { Crew } from "@/components/sections/Crew";
import { Faq } from "@/components/sections/Faq";
import { Hero } from "@/components/sections/Hero";
import { Partners } from "@/components/sections/Partners";
import { Services } from "@/components/sections/Services";
import { Statement } from "@/components/sections/Statement";
import { Ticker } from "@/components/sections/Ticker";

/* Section order mirrors the reference recording:
   photo hero → statement → bento → stepper → stories → people →
   ticker → network → estimator → questions → closing banner. */

export default function Page() {
  return (
    <>
      <Hero />
      <Statement />
      <About />
      <Services />
      <Cases />
      <Crew />
      <Ticker />
      <Partners />
      <Calculator />
      <Faq />
      <Contact />
    </>
  );
}

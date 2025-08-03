
import { FaqSection } from "./sections/homepage/FaqSection";
import { TrustedBySection } from "./sections/homepage/TrustedBySection";
import { HomeIntroSection } from "./sections/homepage/HomeIntroSection";
import { CeremoniesSection } from "./sections/homepage/CeremoniesSection";

export default function Home() {


  return (
    <>
      <HomeIntroSection />
      <CeremoniesSection />
      <TrustedBySection />
      <FaqSection />
    </>
  );
}

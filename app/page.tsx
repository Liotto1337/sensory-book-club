import { CtaBand } from "@/components/landing/CtaBand";
import { FeaturedSets } from "@/components/landing/FeaturedSets";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Intro } from "@/components/landing/Intro";
import { MobileTestCta } from "@/components/landing/MobileTestCta";
import { ScentMarquee } from "@/components/landing/ScentMarquee";
import { Statement } from "@/components/landing/Statement";
import { Stats } from "@/components/landing/Stats";
import { sets } from "@/data/sets";
import { ReviewsRibbon } from "@/features/reviews/ReviewsRibbon";

const FEATURED_SET_IDS = ["set-1", "set-4", "set-11"];

export default function HomePage() {
  const featuredSets = sets.filter((set) => FEATURED_SET_IDS.includes(set.id));

  return (
    <>
      <Hero />
      <ScentMarquee />
      <Intro />
      <Stats />
      <HowItWorks />
      <FeaturedSets sets={featuredSets} />
      <ReviewsRibbon />
      <Statement />
      <CtaBand />
      <MobileTestCta />
    </>
  );
}

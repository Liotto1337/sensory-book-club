import { FeaturedSets } from "@/components/landing/FeaturedSets";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Intro } from "@/components/landing/Intro";
import { ScentMarquee } from "@/components/landing/ScentMarquee";
import { Stats } from "@/components/landing/Stats";
import { sets } from "@/data/sets";

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
    </>
  );
}

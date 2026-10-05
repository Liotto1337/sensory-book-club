import { FeaturedSets } from "@/components/landing/FeaturedSets";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { sets } from "@/data/sets";

const FEATURED_SET_IDS = ["set-1", "set-4", "set-11"];

export default function HomePage() {
  const featuredSets = sets.filter((set) => FEATURED_SET_IDS.includes(set.id));

  return (
    <>
      <Hero />
      <HowItWorks />
      <FeaturedSets sets={featuredSets} />
    </>
  );
}

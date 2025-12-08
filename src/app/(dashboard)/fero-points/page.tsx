import FeroJourney from "@/app/components/_dashboard/feroInstructions";
import FeroPointsCard from "@/app/components/_dashboard/feroPointsCard";
import React from "react";

const FeroPointPage = () => {
  const hasFeroPoint = false;
  return (
    <section className="w-full   bg-background transition-colors duration-300">
      <div>{hasFeroPoint ? <FeroPointsCard /> : <FeroJourney />}</div>
    </section>
  );
};

export default FeroPointPage;

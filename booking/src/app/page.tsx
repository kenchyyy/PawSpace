"use client";

// import ScreenSizeTool from "@/components/ScreenSizeTool";

// const Root = () => {
//   return (
//     <div>
//       landing page
//     </div>

//   );
// }
// export default Root;

import ServiceCard from "../components/Services/ServiceCard";
import { petServices } from "../components/Services/pet-services"; 

export default function ServicePage() {
  return (
    <main className="p-8">
      <h1 className="text-4xl font-bold text-center mb-8">Our Services</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {petServices.map((service, index) => (
          <ServiceCard key={index} service={service} />
        ))}
      </div>
    </main>
  );
}
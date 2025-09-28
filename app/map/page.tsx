// src/app/map/page.tsx

import { GovernmentHeader } from "@/components/government-header";
import { GovernmentFooter } from "@/components/government-footer";
import MapLoader from "@/components/MapLoader"; // Import our new client component

export default function MapPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <GovernmentHeader />

      <main className="flex-1 p-4">
        {/* Render the component that handles the client-side loading */}
        <MapLoader />
      </main>

      <GovernmentFooter />
    </div>
  );
}
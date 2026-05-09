import { Metadata } from "next"
import MapClient from "@/components/map/MapClient"
export const metadata: Metadata = {
  title: "Toilet Map — Find Clean Bathrooms Near You",
  description: "Interactive map showing rated and reviewed public toilets worldwide. Filter by adult changing stations, family bathrooms, gender neutral restrooms and more.",
}

export default function MapPage() {
  return <MapClient />
}

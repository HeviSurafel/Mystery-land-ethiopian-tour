import { Users, Landmark, TreePine, Mountain, MapPin, Compass } from "lucide-react";

export const destinationTypes = [
  { value: "cultural", label: "Cultural", icon: Users, color: "amber" },
  { value: "historical", label: "Historical", icon: Landmark, color: "blue" },
  { value: "nature", label: "Nature", icon: TreePine, color: "green" },
  { value: "adventure", label: "Adventure", icon: Mountain, color: "orange" },
  { value: "urban", label: "Urban", icon: MapPin, color: "purple" },
  { value: "religious", label: "Religious", icon: Compass, color: "red" }
];

export const regions = [
  "Northern Ethiopia",
  "Southern Ethiopia",
  "Eastern Ethiopia",
  "Western Ethiopia",
  "Central Ethiopia"
];

export const statuses = [
  { value: "active", label: "Active", color: "green" },
  { value: "inactive", label: "Inactive", color: "gray" },
  { value: "upcoming", label: "Upcoming", color: "blue" }
];
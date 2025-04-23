// these are just sample data for the pet services.
import { PetService } from "@/types/services-list";

export const petServices: PetService[] = [
  // ACCOMMODATIONS
  {
    id: "acc-small",
    name: "Cozy Corner",
    description: "For small pets (up to 5kg) with temperature control",
    price: 800,
    currency: "PHP",
    category: "accommodation",
    roomSize: "small",
    duration: "per night",
  },
  {
    id: "acc-medium",
    name: "Happy Den",
    description: "For medium pets (5-15kg) with play area",
    price: 1200,
    currency: "PHP",
    category: "accommodation",
    roomSize: "medium",
    duration: "per night"
  },
  {
    id: "acc-large",
    name: "Luxury Suite", 
    description: "Spacious for large pets (15+kg) with premium bedding",
    price: 1800,
    currency: "PHP",
    category: "accommodation",
    roomSize: "large",
    duration: "per night"
  },

  // GROOMING SERVICES
  {
    id: "groom-basic",
    name: "Basic Grooming",
    description: "Bath, brush, and nail trim",
    price: 450,
    currency: "PHP",
    category: "grooming",
    duration: "per session"
  },
  {
    id: "groom-premium",
    name: "Premium Spa",
    description: "Full grooming with blueberry facial and paw massage",
    price: 850,
    currency: "PHP",
    category: "grooming",
    duration: "per session"
  }
];
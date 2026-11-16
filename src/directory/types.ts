export type DirectoryCategoryTab =
  | "everything"
  | "events"
  | "food"
  | "beauty"
  | "stores"
  | "services";

export type BoroughFilter =
  | "all"
  | "Brooklyn"
  | "Manhattan"
  | "Queens"
  | "Bronx"
  | "Staten Island"
  | "New Jersey";

export type PlaceRecord = {
  id: string;
  source: "community_resources" | "nigerian_restaurants";
  slug: string;
  name: string;
  category: string;
  categoryGroup: DirectoryCategoryTab;
  borough: string | null;
  neighborhood: string | null;
  address: string | null;
  phone: string | null;
  website: string | null;
  description: string | null;
  imageUrl: string | null;
  rating: number | null;
  priceRange: string | null;
  cuisine: string | null;
  hours: string | null;
  isOpen: boolean | null;
  location: string | null;
};

export type EventRecord = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  startsAt: string;
  endsAt: string | null;
  venueName: string | null;
  city: string | null;
  location: string | null;
  imageUrl: string | null;
  url: string | null;
  ticketUrl: string | null;
  tags: string[];
  category: string | null;
  moderationStatus: string | null;
};

export type PartnerApplicantType =
  | "promoter"
  | "venue"
  | "student_society";

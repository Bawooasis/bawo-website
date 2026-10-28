import type { StorefrontCatalog, StorefrontItem, StorefrontPayoutSettings } from "./types";

type SeedItem = {
  name: string;
  category: string;
  price: number;
  description?: string;
  popular?: boolean;
};

export type FoundingStorefront = {
  id: string;
  name: string;
  handle: string;
  address: string;
  category: string;
  items: SeedItem[];
};

export const FOUNDING_STOREFRONTS: FoundingStorefront[] = [
  {
    id: "founding-buka-new-york",
    name: "BUKA New York",
    handle: "@bukanewyork",
    address: "1111 Fulton St, Brooklyn, NY 11238",
    category: "Nigerian Restaurant",
    items: [
      { name: "Jollof Rice", category: "Side", price: 7.84 },
      {
        name: "Jollof Suya / Shrimp / Croaker Combo",
        category: "Entrees",
        price: 20.16,
        popular: true,
      },
      {
        name: "Goat with Fufu & Egusi Sauce",
        category: "Entrees",
        price: 24.64,
        popular: true,
      },
      { name: "Mixed Meat with Fufu & Sauce", category: "Entrees", price: 24.64 },
      { name: "Goat Pepper Soup", category: "Soups", price: 22.4 },
      {
        name: "Suya (Spiced Grilled Lamb)",
        category: "Starters",
        price: 5.6,
        popular: true,
      },
      { name: "Moi Moi", category: "Starters", price: 6.72 },
      { name: "Akara", category: "Starters", price: 5.6 },
      { name: "Dodo (Fried Plantains)", category: "Sides", price: 5.6 },
      { name: "Nkwobi", category: "Specialties", price: 20.16 },
    ],
  },
  {
    id: "founding-small-mommi",
    name: "Small Mommi African Market",
    handle: "@small_mommi_africa_market",
    address: "939A Pennsylvania Ave, Brooklyn, NY 11207",
    category: "African Market",
    items: [
      {
        name: "Ijebu Garri (5 lb Bag)",
        category: "Pantry & Grains",
        price: 12.99,
        popular: true,
      },
      {
        name: "Poundo Yam Flour (4 lb)",
        category: "Pantry & Grains",
        price: 14.99,
        popular: true,
      },
      {
        name: "Whole Ground Egusi Seeds (16 oz)",
        category: "Spices & Cooking",
        price: 9.99,
      },
      {
        name: "Nigerian Snacks Pack (Speedy Biscuits, Cabin & Chin-Chin)",
        category: "Snacks & Drinks",
        price: 8.5,
        popular: true,
      },
      {
        name: "Suya Yaji Spice & Crayfish Bundle",
        category: "Spices & Cooking",
        price: 11.99,
      },
      {
        name: "Malta Guinness (6-Pack) & Peak Milk",
        category: "Snacks & Drinks",
        price: 13.5,
      },
      {
        name: "Dudu-Osun Black Soap & Unrefined Shea Butter",
        category: "Beauty & Wellness",
        price: 10.99,
      },
    ],
  },
  {
    id: "founding-laduns-chops",
    name: "Laduns Chops ~ Eat's Savory",
    handle: "@ladunschops",
    address: "Brooklyn & NYC Catering",
    category: "Catering",
    items: [
      {
        name: "Small Chops Party Bundle (3 lbs)",
        category: "Party Bundles",
        price: 100,
        popular: true,
        description: "Puff-puff, beef samosa, spring rolls & peppered meat",
      },
      {
        name: "Hot Food Bundle #1 (Jollof + Plantain + Peppered Fish)",
        category: "Hot Catering Trays",
        price: 110,
        popular: true,
      },
      {
        name: "Hot Food Bundle #2 (Jollof + Plantain + Peppered Turkey)",
        category: "Hot Catering Trays",
        price: 110,
      },
      {
        name: "Hot Food Bundle #3 (Jollof + Plantain + Suya Wings)",
        category: "Hot Catering Trays",
        price: 100,
        popular: true,
      },
      {
        name: "Solo Small Chops Box",
        category: "Individual Packs",
        price: 18,
      },
    ],
  },
  {
    id: "founding-owolabi-cafe",
    name: "Owolabi Cafe",
    handle: "@owolabicafe",
    address: "2123 Caton Ave, Brooklyn, NY 11226",
    category: "Nigerian Cafe",
    items: [
      {
        name: "Classic Suya Dinner",
        category: "Entrees",
        price: 22,
        popular: true,
      },
      {
        name: "Pounded Yam & Egusi Soup",
        category: "Entrees",
        price: 20,
        popular: true,
      },
      {
        name: "Amarachi's Oxtails with Jollof & Plantain",
        category: "Entrees",
        price: 23,
        popular: true,
      },
      { name: "Beef Suya Skewers", category: "Starters", price: 16 },
      { name: "Chicken Suya Skewers", category: "Starters", price: 14 },
      { name: "Rice & Assorted Meat Stew", category: "Entrees", price: 16 },
      { name: "Hibiscus & Ginger Zobo Punch", category: "Drinks", price: 6 },
    ],
  },
  {
    id: "founding-chukas-kitchen",
    name: "Chuka's Kitchen",
    handle: "@chukas_kitchen",
    address: "150-46 Shore Ave, Jamaica, NY 11433",
    category: "Nigerian Restaurant",
    items: [
      {
        name: "Signature Spicy Nkwobi Bowl",
        category: "Specialties",
        price: 22,
        popular: true,
      },
      {
        name: "Assorted Goat Meat Pepper Soup",
        category: "Pepper Soups",
        price: 20,
        popular: true,
      },
      {
        name: "Home-Style Jollof Rice & Grilled Chicken",
        category: "Entrees",
        price: 19,
        popular: true,
      },
      {
        name: "Egusi Soup & Pounded Yam",
        category: "Swallows & Soups",
        price: 21,
      },
    ],
  },
  {
    id: "founding-leilas-hair",
    name: "Leila's Hair Braiding",
    handle: "@leilas_hairbraiding",
    address: "Bronx, NY",
    category: "Salon & Braiding",
    items: [
      {
        name: "Medium Knotless Box Braids (Mid-Back)",
        category: "Knotless Braids",
        price: 180,
        popular: true,
      },
      {
        name: "Boho / Goddess Knotless Braids",
        category: "Knotless Braids",
        price: 220,
        popular: true,
      },
      {
        name: "Stitch Feed-In Cornrows (6–8 Braids)",
        category: "Cornrows",
        price: 110,
      },
      {
        name: "Soft Faux Locs / Butterfly Locs",
        category: "Locs & Twists",
        price: 200,
      },
    ],
  },
];

export const DEFAULT_PAYOUT_SETTINGS: StorefrontPayoutSettings = {
  platform_fee_pct: 10,
  accepts_pickup: true,
  accepts_delivery: false,
  accepts_instore_booking: true,
  delivery_fee: 0,
  min_order_amount: 0,
  payouts_requested: false,
  stripe_connect_status: "not_started",
};

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function seedCatalogFromFounding(
  storefront: FoundingStorefront,
): StorefrontCatalog {
  const categories = Array.from(
    new Set(storefront.items.map((item) => item.category)),
  ).map((name, index) => ({
    id: `${storefront.id}-cat-${slugify(name)}`,
    name,
    sort_order: index,
  }));

  const items: StorefrontItem[] = storefront.items.map((item, index) => {
    const category = categories.find((entry) => entry.name === item.category);
    return {
      id: `${storefront.id}-item-${slugify(item.name)}-${index}`,
      restaurant_id: storefront.id,
      category_id: category?.id || null,
      category_name: item.category,
      name: item.name,
      description: item.description || null,
      price: item.price,
      image_url: null,
      is_popular: Boolean(item.popular),
      is_available: true,
      sort_order: index,
    };
  });

  return {
    restaurantId: storefront.id,
    source: "local",
    categories,
    items,
    payouts: { ...DEFAULT_PAYOUT_SETTINGS },
  };
}

// @/lib/item-helpers.js
// import itemsBase from "@/data/items/items-base.json";
// import items from "@/data/items/items.json";
// import magicVariants from "@/data/items/magicvariants.json";
import equipment from "@/data/items/equipment-2014.json";
import magicItems from "@/data/items/magic-items-2014.json";

// Combine all items into one searchable array
const allItems = [...equipment, ...magicItems];

// Fuzzy search function
export const searchItems = (searchTerm) => {
  if (!searchTerm) return [];
  const term = searchTerm.toLowerCase();
  return allItems
    .filter(
      (item) =>
        item.name.toLowerCase().includes(term) ||
        (item.description && item.description.toLowerCase().includes(term))
    )
    .slice(0, 5); // Return top 5 matches
};

// Get complete item data by name
export const getItemData = (itemName) => {
  return allItems.find(
    (item) => item.name.toLowerCase() === itemName.toLowerCase()
  );
};

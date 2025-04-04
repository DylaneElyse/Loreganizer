// utils/dndApi.js
export async function fetchDndData(url) {
  try {
    const response = await fetch(url);

    if (response.ok) {
      return await response.json();
    } else if (response.status === 404) {
      return null;
    } else {
      throw new Error(`Failed to fetch ${url}: ${response.status}`);
    }
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    return null;
  }
}

export async function searchDndItems(query) {
  const magicUrl = `https://www.dnd5eapi.co/api/2014/magic-items/${query}`;
  const equipmentUrl = `https://www.dnd5eapi.co/api/2014/equipment/${query}`;

  const [magicData, equipmentData] = await Promise.all([
    fetchDndData(magicUrl),
    fetchDndData(equipmentUrl),
  ]);

  return {
    magicItem: magicData,
    equipment: equipmentData,
  };
}

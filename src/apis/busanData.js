// Simple loader for Busan_data JSON files
export async function loadPlaces() {
  // Example: import static JSON file from Busan_data folder
  // Adjust path as needed. Files already exist in project under Busan_data
  try {
    const resp = await fetch('/Busan_data/부산_관광지.json')
    return await resp.json()
  } catch (e) {
    console.error('Failed to load Busan data', e)
    return []
  }
}

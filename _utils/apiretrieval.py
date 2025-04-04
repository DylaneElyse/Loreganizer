import requests
import json

def fetch_and_combine_dnd_data():
    """
    Fetches magic items and equipment from the D&D 5e API and combines them into a single JSON.
    """
    magic_items_url = "https://www.dnd5eapi.co/api/magic-items/"
    equipment_url = "https://www.dnd5eapi.co/api/equipment/"

    try:
        magic_items_response = requests.get(magic_items_url)
        magic_items_response.raise_for_status()  # Raise HTTPError for bad responses (4xx or 5xx)
        magic_items_data = magic_items_response.json()

        equipment_response = requests.get(equipment_url)
        equipment_response.raise_for_status()
        equipment_data = equipment_response.json()

        magic_items_details = []
        for item in magic_items_data['results']:
            item_detail_response = requests.get("https://www.dnd5eapi.co" + item['url'])
            item_detail_response.raise_for_status()
            magic_items_details.append(item_detail_response.json())

        equipment_details = []
        for item in equipment_data['results']:
            item_detail_response = requests.get("https://www.dnd5eapi.co" + item['url'])
            item_detail_response.raise_for_status()
            equipment_details.append(item_detail_response.json())

        combined_data = {
            "magic_items": magic_items_details,
            "equipment": equipment_details
        }

        return json.dumps(combined_data, indent=4)

    except requests.exceptions.RequestException as e:
        return f"Error fetching data: {e}"
    except json.JSONDecodeError as e:
        return f"Error decoding JSON: {e}"

# Fetch and print the combined data
combined_json = fetch_and_combine_dnd_data()
print(combined_json)
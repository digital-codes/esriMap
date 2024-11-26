import os
import sys
import requests
import mercantile
from concurrent.futures import ThreadPoolExecutor, as_completed
from tqdm import tqdm

# Configuration
zoom = [14,15,16]
zoom = [15]
#min_lon, min_lat = -122.55, 37.70  # Southwest corner
#max_lon, max_lat = -122.35, 37.82  # Northeast corner

# KA 
# top left 49.0790/8.2919
# bottom right 48.9250/8.5398
min_lon, min_lat = 8.29, 48.92  # Southwest corner
max_lon, max_lat = 8.54, 49.07  # Northeast corner

# Tile Server URL Template
#tile_url_template = "https://basemaps.arcgis.com/arcgis/rest/services/World_Basemap_v2/VectorTileServer/tile/{z}/{y}/{x}.pbf"

tile_url_template = "https://geoportal.karlsruhe.de/server/rest/services/Hosted/Regiokarte_farbig_Vektor/VectorTileServer/tile/{z}/{y}/{x}.pbf"

# Output Directory
output_dir = "tiles"
os.makedirs(output_dir, exist_ok=True)

# Authentication Cookie (if required)
# Replace with your actual cookie string
cookie_string = "AGS_ROLES=419jqfa+uOZgYod4xPOQ8Q=="

# Headers with Cookie
headers = {
    #"Cookie": cookie_string
}

# Function to download a single tile
def download_tile(z, x, y):
    url = tile_url_template.format(z=z, x=x, y=y)
    response = requests.get(url, headers=headers, timeout=10)
    if response.status_code == 200:
        # Define the path to save the tile
        tile_path = os.path.join(output_dir, str(z), str(y))
        os.makedirs(tile_path, exist_ok=True)
        file_path = os.path.join(tile_path, f"{x}.pbf")
        with open(file_path, 'wb') as f:
            f.write(response.content)
        return f"Downloaded tile {z}/{y}/{x}.pbf"
    else:
        return f"Failed to download tile {z}/{y}/{x}.pbf - Status Code: {response.status_code}"

# Calculate tile ranges
tiles = mercantile.tiles(min_lon, min_lat, max_lon, max_lat, zooms=zoom)
tile_list = list(tiles)

print(f"Downloading {len(tile_list)} tiles",tile_list)
#print(tile_list)
sys.exit()


# Prepare list of tile coordinates
tile_coords = [(tile.z, tile.x, tile.y) for tile in tile_list]

# Number of worker threads
max_workers = 10  # Adjust based on your internet speed and system capabilities

# Download tiles concurrently
with ThreadPoolExecutor(max_workers=max_workers) as executor:
    # Use tqdm for progress bar
    future_to_tile = {executor.submit(download_tile, z, x, y): (z, x, y) for z, x, y in tile_coords}
    for future in tqdm(as_completed(future_to_tile), total=len(future_to_tile), desc="Downloading tiles"):
        result = future.result()
        # Optionally, handle the result (print or log)
        print(result)

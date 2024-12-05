import geopandas as gpd
import sys

# Load GeoJSON file into GeoDataFrame
if len(sys.argv) > 1:
    input_file = sys.argv[1]
else:
    print("Usage: python simplifyFeatures.py <input_file>")
    sys.exit(1)
    
gdf = gpd.read_file(input_file)

# Simplify polygons
# The 'tolerance' controls the level of simplification (lower = less simplified)
simplified_gdf = gdf.copy()
simplified_gdf['geometry'] = gdf['geometry'].simplify(tolerance=0.0001, preserve_topology=True)

# Save simplified GeoJSON
output_file = input_file.split(".geojson")[0] + "_simplified.geojson"
simplified_gdf.to_file(output_file, driver="GeoJSON")

print(f"Simplified GeoJSON saved to {output_file}")


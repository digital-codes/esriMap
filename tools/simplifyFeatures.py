import geopandas as gpd

# Load GeoJSON file into GeoDataFrame
input_file = "wasser.geojson"
gdf = gpd.read_file(input_file)

# Simplify polygons
# The 'tolerance' controls the level of simplification (lower = less simplified)
simplified_gdf = gdf.copy()
simplified_gdf['geometry'] = gdf['geometry'].simplify(tolerance=0.0001, preserve_topology=True)

# Save simplified GeoJSON
output_file = "wasser_simplified.geojson"
simplified_gdf.to_file(output_file, driver="GeoJSON")

print(f"Simplified GeoJSON saved to {output_file}")


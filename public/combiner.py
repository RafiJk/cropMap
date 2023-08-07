# import geopandas as gpd
# import pandas as pd
# import requests
# from io import BytesIO

# urlD = "https://raw.githubusercontent.com/deldersveld/topojson/master/countries/us-states/DE-10-delaware-counties.json"
# gdf_delaware = gpd.read_file(urlD)

# urlM = "https://raw.githubusercontent.com/deldersveld/topojson/master/countries/us-states/MD-24-maryland-counties.json"
# gdf_maryland = gpd.read_file(urlM)



# combined_gdf = gpd.GeoDataFrame(pd.concat([gdf_delaware, gdf_maryland], ignore_index=True))
# combined_gdf.to_file("combined.json", driver="GeoJSON")


import folium
import json

# Load the GeoJSON data
with open('/Users/rjkigner/projects/pest-map/public/TheGreatStateOfMaryland.json', 'r') as f:
    geojson_data = json.load(f)

# Create a Folium map centered at a specific location (e.g., latitude and longitude)
map_center = [46.8, -90.5]
zoom_level = 7
mymap = folium.Map(location=map_center, zoom_start=zoom_level)

# Create a GeoJson object with the GeoJSON data
geojson_layer = folium.GeoJson(geojson_data)

# Add the GeoJson object to the map
mymap.add_child(geojson_layer)

# Display the map
mymap.save('rendered_map.html')

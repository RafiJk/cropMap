// mergeGeoJSON.js

function mergeGeoJSON(geoJson1, geoJson2) {
  // Step 1: Create a new GeoJSON object with the combined features array
  const combinedGeoJson = {
    // Preserve the "type" and "transform" from one of the GeoJSON objects
    type: geoJson1.type,
    transform: geoJson1.transform,

    // Combine the "arcs" arrays from both GeoJSON objects
    arcs: geoJson1.arcs.concat(geoJson2.arcs),

    // Combine the "objects" from both GeoJSON objects
    objects: {
      ...geoJson1.objects,
      ...geoJson2.objects,
    },
  };

  // If you want to combine the "features" array within the "objects" property:
  const combinedFeatures = geoJson1.objects.cb_2015_delaware_county_20m.geometries.concat(
    geoJson2.objects.cb_2015_maryland_county_20m.geometries
  );
  combinedGeoJson.objects.cb_2015_delaware_county_20m.geometries = combinedFeatures;

  return combinedGeoJson;
}

export default mergeGeoJSON;

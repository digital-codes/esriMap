import "./esri.css";

import "@arcgis/map-components/dist/components/arcgis-map";
import "@arcgis/map-components/dist/components/arcgis-legend";

import { defineCustomElements as defineMapElements } from "@arcgis/map-components/dist/loader";

import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import VectorTileLayer from "@arcgis/core/layers/VectorTileLayer";

// in esri.css
// import "@esri/calcite-components/dist/calcite/calcite.css";


import esriConfig from "@arcgis/core/config.js";
import { setAssetPath as setCalciteAssetPath } from "@esri/calcite-components/dist/components";
import { setArcgisAssetPath as setCodingAssetPath } from "@arcgis/coding-components/dist/components";

// Set assets path for @arcgis/core, @esri/calcite-components and @arcgis/coding-components
const assetPathUrl = `${location.href}assets`;
console.log("assetPathUrl", assetPathUrl);

//setMapAssetPath("./public/assets");
//setMapAssetPath(assetPathUrl);
esriConfig.assetsPath = assetPathUrl;
// esriConfig.assetsPath = "./public/assets";
setCalciteAssetPath(`${assetPathUrl}/components/assets`);
setCodingAssetPath(assetPathUrl);

console.log("esriConfig.assetsPath", esriConfig.assetsPath);

// Individual imports for each component used
import "@arcgis/coding-components/dist/components/arcgis-arcade-editor";
import "@esri/calcite-components/dist/components/calcite-scrim";


export function setupMap(element) {
   console.log("setupMap", element);
  const map = new Map();

  // Make map view and bind it to the map
  const view = new MapView({
    container: element.id,
    map: map,
    center: [8.4,49.01],
    zoom: 15
  });
  const tileLayer = new VectorTileLayer({
    url:
     "https://basemaps.arcgis.com/arcgis/rest/services/World_Basemap_v2/VectorTileServer/"
    //  "https://basemaps.arcgis.com/arcgis/rest/services/World_Basemap_v2/VectorTileServer/tile/{z}/{x}/{y}.pbf"
    // "https://jsapi.maps.arcgis.com/sharing/rest/content/items/75f4dfdff19e445395653121a95a85db/resources/styles/root.json"
  });
  map.add(tileLayer);


}

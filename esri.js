import "./esri.css";

import "@arcgis/map-components/dist/components/arcgis-map";
import "@arcgis/map-components/dist/components/arcgis-legend";

//import { defineCustomElements as defineMapElements } from "@arcgis/map-components/dist/loader";

import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import VectorTileLayer from "@arcgis/core/layers/VectorTileLayer";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import Point from "@arcgis/core/geometry/Point";
import Graphic from "@arcgis/core/Graphic";
import PopupTemplate from "@arcgis/core/PopupTemplate";
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol";
import SimpleRenderer from "@arcgis/core/renderers/SimpleRenderer";
import { SimpleFillSymbol, SimpleLineSymbol } from "@arcgis/core/symbols";



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

// Individual imports for each component used ... not needed for basic vector map
//import "@arcgis/coding-components/dist/components/arcgis-arcade-editor";
//import "@esri/calcite-components/dist/components/calcite-scrim";

//const vectorUrl = "https://basemaps.arcgis.com/arcgis/rest/services/World_Basemap_v2/VectorTileServer"
const vectorUrl = "https://geoportal.karlsruhe.de/server/rest/services/Hosted/Regiokarte_farbig_Vektor/VectorTileServer"

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
    url: vectorUrl,
    title: "Karlsruhe",
    copyright: "©Stadt Karlsruhe, OK Lab Karlsruhe"
  });
  console.log("tileLayer loaded", tileLayer);
  map.add(tileLayer);


}

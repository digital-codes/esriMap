import "./esri.css";

import "@arcgis/map-components/dist/components/arcgis-map";
import "@arcgis/map-components/dist/components/arcgis-legend";

//import { defineCustomElements as defineMapElements } from "@arcgis/map-components/dist/loader";

import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import VectorTileLayer from "@arcgis/core/layers/VectorTileLayer";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import Point from "@arcgis/core/geometry/Point";
import Graphic from "@arcgis/core/Graphic";
import PopupTemplate from "@arcgis/core/PopupTemplate";
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol";
import PictureMarkerSymbol from "@arcgis/core/symbols/PictureMarkerSymbol";
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
    zoom: 13,
    minzoom: 13,
    maxzoom: 18
  });
  const tileLayer = new VectorTileLayer({
    url: vectorUrl,
    title: "Karlsruhe",
    copyright: "©Stadt Karlsruhe, OK Lab Karlsruhe"
  });
  console.log("tileLayer loaded", tileLayer);
  map.add(tileLayer);

  // Create a GraphicsLayer to hold markers
  var graphicsLayer = new GraphicsLayer();
  map.add(graphicsLayer);

  // Define marker symbols and popups
  function addMarker(longitude, latitude, title, content) {
    var point = {
        type: "point", // autocasts as new Point()
        longitude: longitude,
        latitude: latitude
    };
    /*
    var markerSymbol = {
        type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
        color: [226, 119, 40],  // Orange
        outline: {
            color: [255, 255, 255],
            width: 2
        }
    };
    */
    var markerSymbol = new PictureMarkerSymbol({
      url: "assets/custom/icons/github-mark.svg", // Path to your custom icon
      width: "32px", // Adjust size as needed
      height: "32px",
      // Optionally, set an anchor point to position the icon correctly
      yoffset: 16 // Moves the icon up by half its height
    });

    var pointGraphic = new Graphic({
        geometry: point,
        symbol: markerSymbol,
        popupTemplate: { // autocasts as new PopupTemplate()
            title: title,
            content: content
        }
    });

    graphicsLayer.add(pointGraphic);
  }

  // img not working without full http path
  //const mk1Pop = "<div class='popup-content'><h4>This is the very first marker.</h4><img src='/assets/custom/images/support.png' alt='Supported' style='width: 100px;'><p>xxx</p></div>"
  const imgUrl = assetPathUrl + "/custom/images/support.png";
  const mk1Pop = `<div class='popup-content'><h4>This is the very first marker.</h4><img src="${imgUrl}" alt='Supported' style='width: 100px;'><p>xxx</p></div>`
    

    // Add sample markers
    const mk1 = addMarker(8.4, 49.01, "Marker 1",mk1Pop);
    const mk2 = addMarker(8.405, 49.015, "Marker 2", "This is the second marker.");
    const mk3 = addMarker(8.395, 49.005, "Marker 3", "This is the third marker.");    
    console.log("Markers added",mk1,mk2,mk3);


}

import "./esri.css";

// maybe not needed
//import "@arcgis/map-components/dist/components/arcgis-map";
//import "@arcgis/map-components/dist/components/arcgis-legend";

//import { defineCustomElements as defineMapElements } from "@arcgis/map-components/dist/loader";

/* dynmaic bundlin below seems to save about 500kB. not very much .... to be confimed */
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
/* */
import VectorTileLayer from "@arcgis/core/layers/VectorTileLayer";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import Graphic from "@arcgis/core/Graphic";
import PictureMarkerSymbol from "@arcgis/core/symbols/PictureMarkerSymbol";

import FeatureLayer from "@arcgis/core/layers/FeatureLayer";

import Polyline from "@arcgis/core/geometry/Polyline";
import { SimpleLineSymbol } from "@arcgis/core/symbols";

import PopupTemplate from "@arcgis/core/PopupTemplate";

import LayerList  from "@arcgis/core/widgets/LayerList";
import Home  from "@arcgis/core/widgets/Home";
import Expand  from "@arcgis/core/widgets/Expand";
import Legend from "@arcgis/core/widgets/Legend";

const withGraphics = false;


/*
import Point from "@arcgis/core/geometry/Point";
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol";
import SimpleRenderer from "@arcgis/core/renderers/SimpleRenderer";
import { SimpleFillSymbol } from "@arcgis/core/symbols";
*/

// vite default bundling options don't load csv or geojson
import points from "./src/data/points.json";
import tracks from "./src/data/tracks.json";


// in esri.css
// import "@esri/calcite-components/dist/calcite/calcite.css";


import esriConfig from "@arcgis/core/config.js";
import { setAssetPath as setCalciteAssetPath } from "@esri/calcite-components/dist/components";
import { setArcgisAssetPath as setCodingAssetPath } from "@arcgis/coding-components/dist/components";
//import { LanguageDefaultsBase } from "@arcgis/coding-components/dist/types/utils/language-defaults-base";

import * as intl from "@arcgis/core/intl.js";

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

const vectorUrlBase = "https://basemaps.arcgis.com/arcgis/rest/services/World_Basemap_v2/VectorTileServer"
//const vectorUrl = "https://geoportal.karlsruhe.de/server/rest/services/Hosted/Regiokarte_farbig_Vektor/VectorTileServer"

// regiokarte_farbig_reduziert
const vectorUrl = "https://geoportal.karlsruhe.de/ags04/rest/services/Hosted/Regiokarte_farbig_reduziert/VectorTileServer"
//const vectorUrlBase = "/tiles/base"
//const vectorUrl = "/tiles/ka"


// low zoom level
//	https://geoportal.karlsruhe.de/server/rest/services/Hosted/Regiokarte_farbig_Vektor/VectorTileServer/tile/11/703/1071.pbf

export async function setupMap(element) {
  // dynamic import ... ? maybe
  /*
  const [{ default: Map }, { default: MapView }] = await Promise.all([
    import("@arcgis/core/Map"),
    import("@arcgis/core/views/MapView")
  ]);
  */

  console.log("setupMap", element);
  const map = new Map();

  intl.setLocale("de");
  console.log("locale", intl.getLocale());
  /*
  const body = document.querySelector("body");
  body.style["--esri-calcite-mode-name"] = "dark!important";
  */
 
  // for dark mode see https://developers.arcgis.com/calcite-design-system/tutorials/build-a-dark-mode-switch/
  // https://community.esri.com/t5/arcgis-javascript-maps-sdk-questions/toggling-light-dark-theme-programmatically-api-4-x/td-p/1124885
  // and https://developers.arcgis.com/calcite-design-system/guide/theming/

  // Make map view and bind it to the map
  const view = new MapView({
    container: element.id,
    map: map,
    center: [8.4, 49.01],
    zoom: 13,
    minzoom: 13,
    maxzoom: 18
  });


  const layerList = new LayerList({
    view: view
  });
  const xContainer = document.getElementById("x");

  //view.ui.add(layerList, "top-right");
  const llExpand = new Expand({
    //view: view,
    container: document.createElement("div"),
    content: layerList,
    // placement: "bottom",
    expanded: false
  })
  view.ui.add(llExpand, "top-right");  
  /*
  const legend = new Legend({
    view: view
  });
  view.ui.add(legend, "bottom-right");
  */
  const homeWidget = new Home({
    view: view
  });
  view.ui.add(homeWidget, 'top-left')

  view.ui.add("logoDiv", "bottom-right");


  const baseLayer = new VectorTileLayer({
    url: vectorUrlBase,
    title: "Base"
  });
  console.log("tileLayer loaded", baseLayer);
  map.add(baseLayer);




  const tileLayer = new VectorTileLayer({
    url: vectorUrl,
    title: "Karlsruhe",
    copyright: "©Stadt Karlsruhe, OK Lab Karlsruhe"
  });
  console.log("tileLayer loaded", tileLayer);
  map.add(tileLayer);

  // Create a GraphicsLayer to hold markers
  if (withGraphics) {
    var graphicsLayer = new GraphicsLayer();
    map.add(graphicsLayer);

    // Define marker symbols and popups
    const addMarker = async (longitude, latitude, title, content) => {
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
      /*
       var markerSymbol = new PictureMarkerSymbol({
         url: "assets/custom/icons/github-mark.svg", // Path to your custom icon
         width: "32px", // Adjust size as needed
         height: "32px",
         // Optionally, set an anchor point to position the icon correctly
         yoffset: 16 // Moves the icon up by half its height
       });
       */
      var markerSymbol = new PictureMarkerSymbol({
        url: "assets/custom/icons/marker-icon-2x.png",  // Path to your custom icon
        width: "32px", // Adjust size as needed
        height: "50px",
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

    points.forEach(point => {
      let content = point.NAME;
      if (point.IMGURL && point.IMGURL.length > 0) {
        if (point.IMGURL.startsWith("http")) {
          content = `<div class='popup-content'><h4>${point.NAME}</h4><img src="${point.IMGURL}" alt='Supported' style='width: 100px;'><p>xxx</p></div>`
        } else {
          content = `<div class='popup-content'><h4>${point.NAME}</h4><img src="${assetPathUrl}/${point.IMGURL}" alt='Supported' style='width: 100px;'><p>xxx</p></div>`
        }
      }
      addMarker(point.LAT, point.LON, point.OBJECTID, content);
    });

    // add points from fetched data
    let dynamicPoints = [];
    let req
    req = await fetch("/data/weatherPois.json")
    if (req.ok) {
      dynamicPoints = await req.json();
      console.log("dynamicPoints", dynamicPoints.features);
      dynamicPoints.features.forEach(point => {
        const coords = point.geometry.coordinates;
        const props = point.properties;
        let content = props.name;
        if (props.img && props.img.length > 0) {
          if (props.img.startsWith("http")) {
            content = `<div class='popup-content'><h4>${props.name}</h4><img src="${props.img}" alt='Supported' style='width: 100px;'><p>${props.attribution}</p></div>`
          } else {
            content = `<div class='popup-content'><h4>${props.name}</h4><img src="${assetPathUrl}/${props.img}" alt='Supported' style='width: 100px;'><p></p></div>`
          }
        }
        addMarker(coords[0], coords[1], null, content);
      });

    }

    /*
    //const mk1Pop = "<div class='popup-content'><h4>This is the very first marker.</h4><img src='/assets/custom/images/support.png' alt='Supported' style='width: 100px;'><p>xxx</p></div>"
    //const imgUrl = assetPathUrl + "/custom/images/support.png";
    // const mk1Pop = `<div class='popup-content'><h4>This is the very first marker.</h4><img src="${imgUrl}" alt='Supported' style='width: 100px;'><p>xxx</p></div>`
    // Add sample markers
    const mk1 = addMarker(8.4, 49.01, "Marker 1", mk1Pop);
    const mk2 = addMarker(8.405, 49.015, "Marker 2", "This is the second marker.");
    const mk3 = addMarker(8.395, 49.005, "Marker 3", "This is the third marker.");
    console.log("Markers added", mk1, mk2, mk3);
    */

    // polygon
    // ------------
    // Create a polygon geometry
    const polygon = {
      type: "polygon",
      rings: [
        [8.42, 49.011], //Longitude, latitude
        [8.44, 49.013], //Longitude, latitude
        [8.45, 49.016], //Longitude, latitude
        [8.43, 49.014], //Longitude, latitude
        [8.41, 49.012], //Longitude, latitude
      ]
    };

    const simpleFillSymbol = {
      type: "simple-fill",
      color: [227, 139, 79, 0.8], // Orange, opacity 80%
      outline: {
        color: [255, 255, 255],
        width: 1
      }
    };
    const polyPop = {
      title: "{Name}",
      content: "{Description}"
    };
    const attributes = {
      Name: "Graphic",
      Description: "I am a polygon"
    };

    const polygonGraphic = new Graphic({
      geometry: polygon,
      symbol: simpleFillSymbol,
      attributes: attributes,
      popupTemplate: polyPop
    });
    graphicsLayer.add(polygonGraphic);

    // dynamically remove items from graphics layer
    let symTgl = false
    // make the polygon fill toggle
    const tglFill = () => {
      console.log("toggle", symTgl)
      const color = symTgl ? [227, 139, 79, 0.8] : [20, 150, 227, 0.8]
      polygonGraphic.symbol =
      {
        type: "simple-fill",
        color: color,
        outline: {
          color: [255, 255, 255], // white outline
          width: 2
        }
      }
      symTgl = !symTgl
      //
      const items = graphicsLayer.graphics.length
      console.log("Items:", items)
      for (let i = 0; i < items; i++) {
        console.log("item:", graphicsLayer.graphics.getItemAt(i))
      }
      if (items > 1) {
        const g = graphicsLayer.graphics.getItemAt(items - 1)
        graphicsLayer.remove(g)
      }
      //
      setTimeout(tglFill, 2000)
    }
    // larger delay on first call
    setTimeout(tglFill, 8000)

    // tracks
    const popupTracks = new PopupTemplate({
      title: "Trail Name: {TRL_NAME}",
      content: `
        <div class='popup-content'>
          <p><strong>Trail ID:</strong> {TRL_ID}</p>
          <p><strong>Property:</strong> {PROP}</p>
          <p><strong>Usage:</strong> {USE}</p>
        </div>
      `
    });

    /**
     * Converts an array of GeoJSON-like features into Esri Graphic objects.
     *
     * @param {Array} geoFeatures - Array of GeoJSON-like feature objects.
     * @returns {Array} - Array of Esri Graphic objects.
     */
    const createTrackGraphics = (geoFeatures) => {
      return geoFeatures.map(feature => {
        // Destructure necessary properties from the feature
        const {
          geometry: { coordinates, type },
          properties: { OBJECTID, TRL_NAME, TRL_ID, PROP, USE }
        } = feature;

        // Ensure the geometry type is LineString
        if (type !== "LineString") {
          console.warn(`Unsupported geometry type: ${type}. Only LineString is supported.`);
          return null;
        }

        // Create a Polyline geometry
        const polyline = new Polyline({
          paths: [coordinates], // Esri expects an array of paths
          spatialReference: { wkid: 4326 } // WGS84
        });
        console.log("track coords", coordinates);

        // Define the symbol for the track line
        const symbol = new SimpleLineSymbol({
          color: [0, 128, 0, 0.8], // Green color with 80% opacity
          width: 4,
          style: "dash" // Options: "solid", "dash", "dot", etc.
        });

        // Create the Graphic
        console.log("Graphic", TRL_NAME);
        const graphic = new Graphic({
          geometry: polyline,
          symbol: symbol,
          attributes: {
            /*
            ObjectID: OBJECTID,
            TrailName: TRL_NAME,
            TrailID: TRL_ID,
            Property: PROP,
            Usage: USE
            */
            // don't rename fields
            OBJECTID: OBJECTID,
            TRL_NAME: TRL_NAME,
            TRL_ID: TRL_ID,
            PROP: PROP,
            USE: USE
          },
          // popups in feature layer
        });
        console.log("track graphic", graphic);
        return graphic;
      }).filter(graphic => graphic !== null); // Remove any null entries due to unsupported geometries
    }

    // Create graphics from GeoJSON features
    const trackGraphics = createTrackGraphics(tracks.features);


    // Initialize the FeatureLayer with the graphics
    const trackLayer = new FeatureLayer({
      source: trackGraphics, // Array of Graphic objects
      fields: [
        // make sure fields not renamed in graphics attributes  
        { name: "TRL_NAME", type: "string" },
        { name: "TRL_ID", type: "string" },
        { name: "PROP", type: "integer" },
        { name: "USE", type: "string" }
      ],
      objectIdField: "OBJECTID",
      //geometryType: "polyline",
      spatialReference: { wkid: 4326 },
      renderer:
      {
        type: "simple",
        symbol: new SimpleLineSymbol({
          color: [0, 128, 255, 0.8],
          width: 3,
          style: "solid"
        })
      },
      popupEnabled: true,
      // outFields: ["*"],
      outFields: ["TRL_NAME", "TRL_ID", "PROP", "USE"],
      popupTemplate: popupTracks,
      title: "Track Lines"
    });

    // Add the FeatureLayer to the map
    map.add(trackLayer);
  }


  // plz layer
  const req2 = await fetch("/data/plz.geojson")
  if (req2.ok) {
    const plzGraphics = await req2.json();
    console.log("plz geojson features", plzGraphics.features);
    // Convert GeoJSON Features to FeatureLayer Source
    const plzFeatures = plzGraphics.features.map((feature, index) => {
      return {
        geometry: {
          type: feature.geometry.type.toLowerCase(), // e.g., "polygon"
          rings: feature.geometry.coordinates[0], // Coordinates for polygon
        },
        attributes: {
          ...feature.properties,
          OBJECTID: index + 1, // Generate OBJECTID for Esri FeatureLayer
        },
      };
    });

    // Define the fields for the FeatureLayer
    const plzFields = [
      {
        name: "OBJECTID",
        alias: "Object ID",
        type: "oid",
      },
      {
        name: "PLZ",
        alias: "Postal Code",
        type: "string",
      },
      {
        name: "SHAPE_Area",
        alias: "Shape Area",
        type: "double",
      },
    ];

    // Define color mapping for the PLZs
    const colorMap = {
      "76131": [255, 0, 0, 0.1],    // Red
      "76133": [0, 255, 0, 0.1],    // Green
      "76135": [0, 0, 255, 0.1],    // Blue
      "76137": [255, 255, 0, 0.1],  // Yellow
      "76139": [255, 0, 255, 0.1],  // Magenta
      "76141": [0, 255, 255, 0.1],  // Cyan
      "76149": [128, 0, 128, 0.1],  // Purple
      "76187": [255, 165, 0, 0.1],  // Orange
      "76199": [0, 128, 128, 0.1],  // Teal
      "76227": [128, 128, 0, 0.1],  // Olive
      "76228": [128, 0, 0, 0.1],    // Maroon
      "76229": [0, 128, 0, 0.1],    // Dark Green
      "76275": [0, 0, 128, 0.1],    // Navy
      "76297": [192, 192, 192, 0.1], // Silver
      "76307": [105, 105, 105, 0.1], // Dim Gray
      "76185": [105, 70, 105, 0.1], // 
      "76189": [60, 70, 135, 0.1], // 
    };

    // Create unique value renderer
    const uniqueValueInfos = Object.keys(colorMap).map((plz) => ({
      value: plz,
      symbol: {
        type: "simple-fill",
        color: colorMap[plz], // Color from the color map
        outline: {
          color: [0, 0, 0], // White outline
          width: 2,
        },
      },
      label: `PLZ: ${plz}`,
    }));

    const renderer = {
      type: "unique-value",
      field: "PLZ", // Field to match
      uniqueValueInfos: uniqueValueInfos,
      defaultSymbol: {
        type: "simple-fill",
        color: [200, 200, 200, 0.4], // Default gray for unmatched
        outline: {
          color: [255, 255, 255],
          width: 1,
        },
      },
      defaultLabel: "Other PLZs",
    };

    // Create the FeatureLayer
    const plzFeatureLayer = new FeatureLayer({
      title: "PLZ",
      visible: false, // start invisible
      source: plzFeatures, // GeoJSON features as Esri Graphics
      fields: plzFields,
      objectIdField: "OBJECTID", // Required for Esri FeatureLayer
      geometryType: "polygon", // Geometry type
      renderer: renderer, // Unique value renderer
      /*
      renderer: {
        type: "simple", // Simple renderer
        symbol: {
          type: "simple-fill",
          color: [0, 0, 0, 0.2], // Fill color with transparency
          outline: {
            color: [255, 255, 255],
            width: 1,
          },
        },
      },
      */
      popupTemplate: {
        title: "PLZ: {PLZ}",
        content: `
                        <ul>
                            <li><b>Fläche:</b> {SHAPE_Area} m²</li>
                        </ul>
                    `,
      },
    });
    map.add(plzFeatureLayer);
   
    
  }

}

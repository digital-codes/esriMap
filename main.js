import './style.css'
import { setupMap } from './esri.js'


window.addEventListener('DOMContentLoaded', function() {
  console.log("Loaded")
  const map = document.querySelector("#app")
  console.log(map)
  setupMap(map)
})


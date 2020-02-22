const Scene = require("Scene");
// const FaceTracking = require('FaceTracking');
const Time = require("Time");
const Diagnostics = require ("Diagnostics");

Diagnostics.log('Starting script');

const plane = Scene.root.find('plane0');

function showPlane() {
  Diagnostics.log('Showing plane');
  plane.hidden = false;

  Time.setTimeout(hidePlane, 3000);
}

function hidePlane() {
  Diagnostics.log('Hiding plane');
  plane.hidden = true;
  Time.setTimeout(showPlane, 2000);
}

hidePlane();

Diagnostics.log('Ending script');

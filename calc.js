// Declare constants and variables
const calcSubmit = document.getElementById('submit');
const bearingInput = document.getElementById('bearing');
const deflectionInput = document.getElementById('deflection');
const output = document.getElementById('output');
const distanceInput = document.getElementById('inDist');
const inUnitsInput = document.getElementById('inUnits');
const outUnitsInput = document.getElementById('outUnits');
const outDist = document.getElementById('outDist');
const msg = document.getElementById('messages');
const bg = document.getElementById('bg');
var check = 0;

// Function to prepend messages area with supplied message string
function setError(message) {
  msg.insertAdjacentHTML("beforeend", "<p>" + message);
  msg.className = "show";
  setTimeout(function(){ msg.className = msg.className.replace("show", ""); }, 3000);
  setTimeout(function(){ msg.innerHTML = 'Error!';}, 3000);
};

// See if bearing string follows appropriate format and values fall w/in correct range
function checkBearing() {
  let bearingArr = bearingInput.value.split('-');
  if( bearingArr.length != 4 ){
    setError("Invalid Bearing Format");
  } else{
    check += 1;
  };
  if( Number(bearingArr[3]) > 4 || Number(bearingArr[3] ) < 1 ) {
    setError("Invalid Quadrant");
  } else{
    check += 1;
  };
  if( Number(bearingArr[0]) < 0 || Number(bearingArr[0] ) > 90 ) {
    setError("Invalid Bearing Degrees")
  } else{
    check += 1;
  };
    if( Number(bearingArr[1]) < 0 || Number(bearingArr[1] ) > 59 ) {
    setError("Invalid Bearing Minutes")
  } else{
    check += 1;
  };
    if( Number(bearingArr[2]) < 0 || Number(bearingArr[2] ) > 59 ) {
    setError("Invalid Bearing Seconds")
  } else{
    check += 1;
  };
};

// See if deflection string follows appropriate format
function checkDeflection() {
  let defl = deflectionInput.value;
  if( defl.charAt(0) === '-' ){
    defl = defl.slice(1)
  };
  let deflectionArr = defl.split('-')
  if( deflectionArr.length != 3 ){
    setError("Invalid Deflection Format")
  } else{
    check += 1;
  };
  if( Number(deflectionArr[0] > 359) || Number(deflectionArr[0]) < 0 ) {
    setError("Invalid Deflection Degrees")
  } else{
    check += 1;
  };
  if( Number(deflectionArr[1] > 59) || Number(deflectionArr[1]) < 0 ) {
    setError("Invalid Deflection Minutes")
  } else{
    check += 1;
  };
  if( Number(deflectionArr[2] > 59) || Number(deflectionArr[2]) < 0 ) {
    setError("Invalid Deflection Seconds")
  } else{
    check += 1;
  };
};

// Calculate the new bearing based on inputs
function calcBearing() {
  
  // Set error checksum to 0
  check = 0;
  
  // Run bearing and deflection checks, proceed if okay
  checkBearing();
  checkDeflection();
  
  if( check === 9 ){
    
    // Split quadrant bearing string to individual numbers
    let bearingArr = bearingInput.value.split('-');
    let iDeg = Number(bearingArr[0]);
    let iMin = Number(bearingArr[1]);
    let iSec = Number(bearingArr[2]);
    let iQuad = Number(bearingArr[3]);

    // Convert to azimuth value
    let iDecDeg = iSec/3600 + iMin/60 + iDeg;

    // Use quadrant to add/subtract as needed
    let azimuthIn;
    if( iQuad === 1 ){
      azimuthIn = iDecDeg;
    } else if( iQuad === 2 ){
      azimuthIn = 180.00 - iDecDeg;
    } else if( iQuad === 3 ){
      azimuthIn = 180.00 + iDecDeg;
    } else if( iQuad === 4 ){
      azimuthIn = 360.00 - iDecDeg;
    };
    
    // Determine if clockwise or counterclockwise
    let deflectionValue = deflectionInput.value;
    let operator = 'plus'
    if( deflectionValue.charAt(0) === '-' ){
      deflectionValue = deflectionValue.slice(1);
      operator = 'minus';
    };
    let deflectionArr = deflectionValue.split('-');
    
    // Split deflection bearing into individual numbers
    let defDeg = Number(deflectionArr[0]);
    let defMin = Number(deflectionArr[1]);
    let defSec = Number(deflectionArr[2]);
    
    // Convert to decimal degrees
    let defDecDeg = defSec/3600 + defMin/60 + defDeg;
    
    // Get the output azimuth
    let azimuthOut;
    if( operator === 'plus' ){
      azimuthOut = azimuthIn + defDecDeg;
    } else {
      azimuthOut = azimuthIn - defDecDeg;
    };
    
    // Add 180 to get the "lookback" angle, then reduce value to w/in 0-359
    azimuthOut = ( azimuthOut + 180 ) % 360;
    let oDecDeg = azimuthOut % 90;
    
    // Calculate new quadrant. Flip angle on even quadrants.
    let oQuad;
    if( azimuthOut <= 90 ){
      oQuad = 1;
    } else if( azimuthOut <= 180 ){
      oQuad = 2;
      oDecDeg = 90 - oDecDeg;
    } else if( azimuthOut <= 270 ){
      oQuad = 3;
    } else {
      oQuad = 4;
      oDecDeg = 90 - oDecDeg;
    };
    
    // Convert decimal degrees back to quadrant bearing.
    let oDeg = Math.floor(oDecDeg);
    let oMin = Math.floor((oDecDeg - oDeg) * 60);
    let oSec = Math.round((((oDecDeg - oDeg) * 60) - oMin) * 60);
    
    // Populate new bearing, copy
    output.value = oDeg + '-' + oMin + '-' + oSec + '-' + oQuad;
  } else {
    output.value = 'ERROR 😓'
  };
};

// Distance conversion calculation
function calcDist() {
  outDist.value = (distanceInput.value * inUnitsInput.value / outUnitsInput.value).toFixed(2);
};

// Change focus to next field when pressing enter.
bearingInput.addEventListener("keyup", function(event) {
  // Number 13 is the "Enter" key on the keyboard
  if( event.keyCode === 13 ) {
    // Cancel the default action, if needed
    event.preventDefault();
    // Trigger the button element with a click
    deflectionInput.focus();
    deflectionInput.select();
  }
});

// Run calculation when pressing enter.
deflectionInput.addEventListener("keyup", function(event) {
  // Number 13 is the "Enter" key on the keyboard
  if( event.keyCode === 13 ) {
    // Cancel the default action, if needed
    event.preventDefault();
    // Trigger the button element with a click
    calcBearing();
    output.focus();
    output.select();
    document.execCommand("copy");
  }
});

// Change focus to next field when pressing enter.
distanceInput.addEventListener("keyup", function(event) {
  // Number 13 is the "Enter" key on the keyboard
  if( event.keyCode === 13 ) {
    // Cancel the default action, if needed
    event.preventDefault();
    // Trigger the button element with a click
    outDist.select();
    document.execCommand("copy");
  }
});

// Jump back to distance input when enter is hit on output
outDist.addEventListener("keyup", function(event) {
  // Number 13 is the "Enter" key on the keyboard
  if( event.keyCode === 13 ) {
    // Cancel the default action, if needed
    event.preventDefault();
    // Trigger the button element with a click
    distanceInput.select();
  }
});

// When inputs are changed, run the calculations.
bearingInput.addEventListener('change', calcBearing);
deflectionInput.addEventListener('change', calcBearing);
distanceInput.addEventListener('change', calcDist);
inUnitsInput.addEventListener('change', calcDist);
outUnitsInput.addEventListener('change', calcDist);

// If the bg is clicked, focus on input
bg.addEventListener('click', function(){bearingInput.focus(); bearingInput.select();})

// If output distance is clicked, copy text
outDist.addEventListener('click', function(){outDist.select(); document.execCommand("copy");});

// If distance is clicked, focus and select
distanceInput.addEventListener('click', function(){distanceInput.select()});

var clicked = 0;
var map;
// Default username is random.
var username = Math.random().toString(36).substr(2, 5);

function getLocation() {
  const x = document.getElementById("location");
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    x.textContent = "Geolocation is not supported by this browser.";
  }
}

function showPosition(position) {
  // x.inner is used to display this string in the paragraph with id location.

  const lat = document.getElementById("lat");
  const lng = document.getElementById("lng");
  latitude = position.coords.latitude;
  longitude = position.coords.longitude;
  lat.textContent = "Latitude: " + latitude;
  lng.textContent = "Longitude: " + longitude;

  const mapLink = document.querySelector("#map-link");

  mapLink.textContent = "";

  mapLink.href = `https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`;

  mapLink.textContent = `Latitude: ${latitude} °, Longitude: ${longitude} °`;
  // These are the co-ordinates of the client.
  console.log("Lat: ", latitude);
  console.log("Lng: ", longitude);

  // Encapsulating the data in a json object.
  const data = { username, latitude, longitude };
  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };

  // Create a map that shows just the location of this user.
  createMap({ lat: latitude, lng: longitude });
  const removeMapBtn = document.querySelector("#remove");
  removeMapBtn.style.display = "block";
  // Now we need to send these to the server
  fetch("/api", options);

  const latLng = getData();
  latLng.then(function (result) {
    // Result consists of the array of latitudes and longitudes.
    for (each of result) {
      console.log(each);
      // Add one marker for each of the entries in the database.
      createMarker(each);
    }
  });
}

async function getData() {
  const response = await fetch("/data");
  const data = await response.json();
  console.log(data);
  return data;
}

function createMarker(latLng) {
  // map is the global varibale that was created.
  console.log(map);
  var marker = new google.maps.Marker({
    position: latLng,
    draggable: false,
    map: map,
    animation: google.maps.Animation.DROP,
  });
}

function addMapDiv() {
  // create a new div element
  var mapDiv = document.getElementById("insert-map-here");
  mapDiv.style.height = "100%";
  mapDiv.style.width = "100%";
  // add the newly created element and its content into the DOM.
  if (document.getElementById("map") == null) {
    var newMapDiv = document.createElement("div");
    newMapDiv.setAttribute("id", "map");
    mapDiv.appendChild(newMapDiv);
  }
}

function createMap(myLatLng) {
  // var myLatLng = { lat: -25.363, lng: 131.044 };
  // The parameter of the function gives the location to be plotted.
  // Adding the map div dynamically.

  addMapDiv();

  // Very Important can't use var map here as that will result in a new global variable map and the map for the markers will stay undefined at top. To use this map in some other function we have to declare it at top and then
  // Modify it rather than declaring a new var map.

  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 17,
    center: myLatLng,
  });

  var marker = new google.maps.Marker({
    position: myLatLng,
    map: map,
    draggable: false,
    animation: google.maps.Animation.DROP,
  });
  google.maps.event.addListener(marker, "click", function () {
    infowindow.open(map.map, marker);
  });
  marker.addListener("click", toggleBounce);
  if (clicked == 0) {
    loopLocation();
    clicked = 1;
  }
}

function toggleBounce() {
  if (marker.getAnimation() !== null) {
    markr.setAnimation(null);
  } else {
    marker.setAnimation(google.maps.Animation.BOUNCE);
  }
}

function removeMap() {
  var mapDiv = document.getElementById("insert-map-here");
  mapDiv.style.height = "0%";
}
// Refresh the location every 5seconds.
function loopLocation() {
  var time = setInterval(getLocation, 100000);
}

function submitQuiz() {
  username = document.getElementById("fname").value;
  let ans1 = document.getElementById("q1").value;
  let ans2 = document.getElementById("q2").value;
  let yes = "yes";

  console.log(ans1.localeCompare("yes"), ans2.localeCompare("yes"));
  if (ans1.localeCompare("yes") == 1 && ans2.localeCompare("yes") == 1) {
    alert(
      "Quiz submitted, please click on ADD MY CO-ORDINATES, and give the map 5 seconds to load up."
    );
  } else {
    alert(
      "Quiz submitted, please click on SHOW MAP ONLY, and give the map 5 seconds to load up."
    );
  }

  // alert(
  //   "Quiz submitted, please check the map near you, and give it 5 seconds to load up."
  // );
}

function showLocation() {
  // Just show the current map with the locations from databse.
  const latLng = getData();

  // Need to check if map has been created or not.
  createMap(latLng[0]);
  latLng.then(function (result) {
    // Result consists of the array of latitudes and longitudes.
    createMap(result[0]);
    const removeMapBtn = document.querySelector("#remove");
    removeMapBtn.style.display = "block";
    for (each of result) {
      console.log(each);
      // Add one marker for each of the entries in the database.
      createMarker(each);
    }
  });
}

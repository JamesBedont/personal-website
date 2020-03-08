---
title: Introduction to Google Maps API Featuring ES6 Promises
date: 03/23/2016
description: Introduction to Google Maps API Featuring ES6 Promises
---

The Google Maps API has a multitude of services that need to be sown together to accomplish anything meaningful and can be initially intimidating. This post will walk through the creation of a location finder app powered by Google Maps and Google Places while shedding light on the most important services and their functionality. ES6 Promises will be used throughout this post; for those reading this without a complete understanding of promises refer to this fantastic blog post: [JavaScript Promises There and back again](http://www.html5rocks.com/en/tutorials/es6/promises/) by Jake Archibald. Familiarity with Q or jQuery's promises will transfer over. For those who haven't fully grasped asynchronous JavaScript programming I would highly recommend [Are you bad, good, better or best with Async JS? JS Tutorial: Callbacks, Promises, Generators](https://www.youtube.com/watch?v=obaSQBBWZLk) by LearnCode.academy on Youtube.

**outline**

1. Terms explained.
1. Initial Setup.
1. Geocode a location.
1. RadarSearch for Places within a given radius surrounding a location.
1. GetDetails for each Place found within a radius.
1. Create map markers for each Place while extending the bounds of the map.
1. Full Code GIST

### Terms Explained

**Geocoding** is the process of converting addresses into geographic coordinates. A user will enter a location string (Just like they would into google maps itself) and the geocoder will convert the string into a `LatLng` object. In future requests a LatLng object will be passed as the location parameter instead of a location string. [documentation](https://developers.google.com/maps/documentation/javascript/geocoding#Geocoding)

**Radar Search** is a search under the Places service and through the `radarSearch()` method returns a large list of place within a specified search radius. This is the only search that can be done through the places services allowing specification of an exact radius. The downside is twofold: the search does not return rich data about each Place found essentially only returning the `place_id` and `LatLng` of each Place; meaning additional API calls are needed to get more data on each Place. Secondly the radar search has a maximum of 50,000 meters or about 30 miles. [documentation](https://developers.google.com/maps/documentation/javascript/places#radar_search_requests)

**Place Detail** is also under the Places service and through the `getDetails()` method returns detailed information about a specific place such as: complete address, phone number, ratings, reviews, etc. Because the radar search doesn't return this kind of data a call will need to be made through the GetDetails() method for each Place found by the radar search. [documentation](https://developers.google.com/maps/documentation/javascript/places#place_details)

**Map Marker** is the little red pointer icon used to draw attention to a specific point on the map. Markers should be placed on a map for each Place found during the radar search.

**Bounds** represent the viewport of the map object. Users will only see what is inside of the bounds of the map and will have to scroll/zoom to see more. Its important for the Bounds of the map to encompass all the Places/Markers.

**InfoWindow** is a bubble looking overlay often connected to a Marker that can display information about the Place represented by said Marker.

### Initial Setup

Firstly visit the [Google Maps JavaScript API Product Page](https://developers.google.com/maps/documentation/javascript/) and go through the process of getting an API key.

Next include the following script tag into your HTML file as the last element in the body

```html
<script
  src="https://maps.googleapis.com/maps/api/js?key=YOURKEYHERE&libraries=places&callback=initMap"
  async
  defer
></script>
```

`async defer` lets the API load asynchronously; Once the API is loaded the function `initMap()` will be called. Also note that the places library is needed on top of the standard Google Maps API so `&libraries=places` was included in the url. if more libraries are needed they can be added to the libraries url parameter separated by a comma.

Next add an empty `div` as a placeholder for where the Google Map will appear on the page.

```html
<div id="map" style="height:500px;"></div>
```

Note that a height must be specified on the map div in order to appear correctly on the page. Inline styles may be used in code snippets throughout this post for ease or reading sake but should be moved to an external style sheet in a real environment.

Next create a `initMap()` function inside your javascript file that will be called when the API is loaded.

```javascript line-numbers
var map, geocoder, service, markers, bounds, infoWindow;
function initMap() {
  // create map inside the #map div
  map = new google.maps.Map(document.getElementById('map'), {
    // LatLng object used as center property value
    center: { lat: -34.397, lng: 150.644 },
    zoom: 8
  });
  // initialize classes
  geocoder = new google.maps.Geocoder();
  service = new google.maps.places.PlacesService(map);
  infoWindow = new google.maps.InfoWindow();
  // initialize array to hold map markers
  markers = [];
}
```

The goal of the initMap function will be to load the Google Map centered upon an initial location and to initialize various classes for future use. Creating the map involves a center property which needs a `LatLng` object and zoom which needs a int value 1 - 20.

- 1: world
- 5: Landmass/continent
- 10 City
- 15 Streets
- 20 Buildings
- hint: each mouse scroll increments the zoom by 1. If a map is set to zoom 5 and the user scrolls in twice they will be at zoom 8.

Navigating to [google.com/maps](https://www.google.com/maps) typing in a city and looking at the URL is a good way to find Lat and Lng. For example upon typing in `chicago` the URL changed to:

```none
/maps/place/Chicago,+IL/41.8339037,-87.8722387
```

at the end of the URL are the Lat and Lng values for chicago that can be placed into a `LatLng` object as seen above.

Finally create a user interface and a click event listener:

```html
<div class="container">
  <div class="col-md-10">
    <div class="form-inline inputs">
      <div class="form-group">
        <label for="location">Starting Location:</label>
        <input type="text" id="location" value="UCF" class="form-control" />
      </div>
      <div class="form-group">
        <label for="searchTerm">Store:</label>
        <input type="text" id="searchTerm" value="WAWA" class="form-control" />
      </div>
      <div class="form-group">
        <label for="miles">Radius in Miles:</label>
        <input type="text" id="miles" value="5" class="form-control" />
      </div>
      <button type="button" id="find" class="btn btn-success">Go!</button>
    </div>
    <div id="map"></div>
  </div>
</div>
```

```javascript
document.getElementById('find').addEventListener('click', function() {
  clearLocations();
  // grab user input values
  var searchTerm = document.getElementById('searchTerm').value;
  var address = document.getElementById('location').value;
  var rad = document.getElementById('miles').value;

  //TODO geocode address
});
```

### Geocoding a Location

The first thing to do when the user presses the find button is to geocode whatever location they entered into the `#location` input.

**Call geoCodeAddress() within click event**

```javascript
document.getElementById('find').addEventListener('click', function() {
  clearLocations();
  // grab user input values
  var searchTerm = document.getElementById('searchTerm').value;
  var address = document.getElementById('location').value;
  var rad = document.getElementById('miles').value;

  // call geocoder passing in address from user input #location
  geoCodeAddress(address)
    // geocoder returns a "then-able" promise with results
    // .then only runs after the promise resolves
    .then(function(results) {
      // when geocoder is done log the results in console
      console.log(results);
    })
    // .catch only runs when promise is rejected
    .catch(function(status) {
      alert(status);
    });
});
```

**Create geoCodeAddress()**

```javascript
function geoCodeAddress(address) {
  // return a Promise
  return new Promise(function(resolve, reject) {
    geocoder.geocode({ address: address }, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        // resolve results upon a successful status
        resolve(results);
      } else {
        // reject status upon un-successful status
        reject(status);
      }
    });
  });
}
```

lets say a user inputs `UCF` within the `#location` input. the following would be in the console.

**Console Results**

```javascript
address_components: Array[7]
formatted_address: "University of Central Florida Arboretum, Wildflower Loop, Orlando, FL 32826, USA"
geometry: Object
bounds: Object
location: Object
Lat: function()
Lng: function()
partial_match: true
place_id: "ChIJDw-mn1Bo54gRQTEvgGNznb4"
types: Array[1]
```

Recalling the outline the next step is to do a radar search based on the location the user gave us. So far we have taken `UCF` and geocoded it. We now need the `latLng` object of `UCF` to feed into the radar search. this object is located at: `results.geometry.location` found on line 5 of the response above.

### Radar Search

We now need to create a radarSearch function that uses the Places service `radarSearch()` method. the function will return a promise that resolves an array of Place objects within a given radius `#miles` of the `#searchTerm`.

On line `9` we are specifying to google maps we are looking for places with a `name` of what the user inputs. Note that the following fields could be used depending on the situation.

> keyword (optional) — A term to be matched against all available fields, including but not limited to name, type, and address, as well as customer reviews and other third-party content.
>
> name (optional) — A term to be matched against the names of places. Results will be restricted to those containing the passed name value. Note that a place may have additional names associated with it, beyond its listed name. The API will try to match the passed name value against all of these names; as a result, places may be returned in the results whose listed names do not match the search term, but whose associated names do.
>
> type — Restricts the results to places matching the specified type. Only one type may be specified (if more than one type is provided, all types following the first entry are ignored). See the list of supported types.

**Create radarSearch() function**

```javascript
// radarSearch() needs a LatLng location, radius, and user's search term.
function radarSearch(location, rad, searchTerm) {
  // setup request object
  var request = {
    // location is a LatLng object
    location: location,
    // user enters radius in miles be sure to convert to meters before sending request
    radius: rad * 1609.34,
    name: searchTerm
  };
  // return promise
  return new Promise(function(resolve, reject) {
    service.radarSearch(request, function(results, status) {
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        // resolve promise with results on OK status
        resolve(results);
      } else {
        // reject promise otherwise
        reject(status);
      }
    });
  });
}
```

We need to call the `radarSearch()` function _after_ the `geoCodeAddress()` is finished on line `14` below. The results of `radarSearch()` (a promise) needs to be returned allowing us to add another `.then` to our chain on line `17`. Anything within line 17's `.then` method will be ran after the `Geocoder` **and** the `radarSearch` have completed successfully.

**Call radarSearch() after geoCodeAddress() resolves**

```javascript
document.getElementById('find').addEventListener('click', function() {
  clearLocations();
  // grab user input values
  var searchTerm = document.getElementById('searchTerm').value;
  var address = document.getElementById('location').value;
  var rad = document.getElementById('miles').value;

  // call geocoder passing in address from user input #location
  geoCodeAddress(address)
    // geocoder returns a "then-able" promise with results
    // .then only runs after the promise resolves
    .then(function(results) {
      // when geocoder is done call radarSearch()
      return radarSearch(results.geometry.location, rad, searchTerm);
    })
    // radarSearch returns a then-able promise
    .then(function(results) {
      // upon radarSearch completion log results
      console.log(results);
    })
    // .catch only runs when promise is rejected
    .catch(function(status) {
      alert(status);
    });
});
```

Lets say the user inputs `UCF` within `#location` input, `2` within `#miles` input, and `WAWA` within `#searchTerm` input. The following would be logged to the console.

**Console Results**

```javascript
0: Object
geometry: Object
location: Object
id: "16ccdc45848d5b1f8e74b75608687b93573d6dfe"
place_id: "ChIJpZKBVwdp54gRYDqmdK5r6Zg"
1: Object
etc...
etc...
```

As you can see an array of objects containing summarized Place data is returned for every place within 2 miles of UCF with the name WAWA. Notice that we don't actually have much information about the Place itself; we will need to pass the `place_id` value of each Place into the `getDetails()` method on the Places Class next.

### Get Place Details

The `getDetails` method of the Places service returns full details of a Place given a `place_id`. This service can only be called for one place at a time; meaning we must iterate through the results array sending an api request for each Place object. Lets start by simply defining a `findDetail()` function that will use the `getDetails` method.

**Create findDetail() function**

```javascript
// findDetail() takes in a place object
function findDetail(place) {
  // return promise
  return new Promise(function(resolve, reject) {
    // use getDetails method to retrieve Place data via the Place's place_id property
    service.getDetails({ placeId: place.place_id }, function(place, status) {
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        // upon successful request resolve place
        resolve(place);
      } else {
        // else reject with status
        reject(status);
      }
    });
  });
}
```

Now we must call `findDetail()` for every Place object in `results` array after the `radarSearch` is finished on line `17` below. There we will utilize `Promise.all()`.

> Promise.all takes an array of promises and creates a promise that fulfills when all of them successfully complete. You get an array of results (whatever the promises fulfilled to) in the same order as the promises you passed in. - Jake Archibald

> The array.map() method creates a new array with the results of calling a provided function on every element in this array. - MDN

In reference to line 19 `results` is an array of Place objects we want to get more detail on. Because `findDetail` returns a promise if we run the `findDetail()` function on each element in the array using `.map()` we will then have an array of promises. `Promise.all()` will fulfill when all the promises in our new array resolve. Meaning we can send one request to the API at a time but only move on when all of the requests complete!

**Call findDetail() after radarSearch is done**

```javascript
document.getElementById('find').addEventListener('click', function() {
  clearLocations();
  // grab user input values
  var searchTerm = document.getElementById('searchTerm').value;
  var address = document.getElementById('location').value;
  var rad = document.getElementById('miles').value;

  // call geocoder passing in address from user input #location
  geoCodeAddress(address)
    // geocoder returns a "then-able" promise with results
    // .then only runs after the promise resolves
    .then(function(results) {
      // when geocoder is done call radarSearch()
      return radarSearch(results.geometry.location, rad, searchTerm);
    })
    // radarSearch returns a then-able promise
    .then(function(results) {
      //send each Place to findDetail() building an array of promises with .map()
      return Promise.all(results.map(findDetail));
    })
    .then(function(results) {
      // when .all() is fulfilled log results
      console.log(results);
    })
    // .catch only runs when promise is rejected
    .catch(function(status) {
      alert(status);
    });
});
```

Lets say the user inputs `UCF` within `#location` input, `2` within `#miles` input, and `WAWA` within `#searchTerm` input. The following would be logged to the console on line 25.

**Console Results**

```javascript
0: Object
address_components: Array[6]
formatted_address: "3000 Alafaya Trail, Oviedo, FL 32765, United States"
formatted_phone_number: "(407) 359-0144"
geometry: Object
html_attributions: Array[0]
id: "16ccdc45848d5b1f8e74b75608687b93573d6dfe"
international_phone_number: "+1 407-359-0144"
name: "Wawa"
opening_hours: Object
etc...
1: Object
etc..
```

`results` on line 25 contains **full detail place objects** for each WAWA Place. For a full understanding of everything that the detailed place object contains [refer to the documentation](https://developers.google.com/maps/documentation/javascript/places#place_details_responses) at this point we have lots of great data.

### Create Map Markers that open infoWindow when clicked

This is the home stretch. At last we have all the data we could possibly want to present the user; all that is left to be done is to add map markers that when clicked display an `infoWindow`.

Creating these functions is pretty self explanatory the only interaction that isn't super obvious has to do with `infoWindow`. Users will expect that clicking a marker opens an infoWindow and clicking another marker opens a new infoWindow while closing the old one. A good trick is to only define one `infoWindow` (like we did in the init() function) because the content and the position of the `infoWindow` will override itself on each time the click event fires.

**Create createMarker() and clearLoctions() functions**

```javascript
function createMarker(element, index, array) {
  // setup HTML to be displayed in infoWindow
  var html = '<b>' + element.name + '</b> <br/>' + element.formatted_address;
  // create map marker object
  var marker = new google.maps.Marker({
    map: map,
    position: element.geometry.location
  });
  // add listener for marker that opens an infoWindow with pre-defined HTML
  google.maps.event.addListener(marker, 'click', function() {
    infoWindow.setContent(html);
    infoWindow.open(map, marker);
  });
  // extend the bounds to accommodate each marker
  bounds.extend(element.geometry.location);
  // add each marker to the markers array
  markers.push(marker);
}

function clearLocations() {
  // set the map reference for each marker to null to erase from map
  markers.forEach(function(element, index, array) {
    element.setMap(null);
  });
  // empty markers array
  markers = [];
}
```

Now we can actually call our new functions. `clearLoctions()` should be the first thing called when the user clicks `#find` so we are starting with a clean slate. Remember that in `createMarker()` we are extending the bounds object for each marker position. Once all the markers are placed and the bounds are extended we simply make the `map` fit the new bounds object on line `30`.

**Add map markers and adjust map bounds**

```javascript
document.getElementById('find').addEventListener('click', function() {
  clearLocations();
  // grab user input values
  var searchTerm = document.getElementById('searchTerm').value;
  var address = document.getElementById('location').value;
  var rad = document.getElementById('miles').value;

  // call geocoder passing in address from user input #location
  geoCodeAddress(address)
    // geocoder returns a "then-able" promise with results
    // .then only runs after the promise resolves
    .then(function(results) {
      // when geocoder is done call radarSearch()
      return radarSearch(results.geometry.location, rad, searchTerm);
    })
    // radarSearch returns a then-able promise
    .then(function(results) {
      return Promise.all(results.map(findDetail));
    })
    .then(function(results) {
      // At this point full place objects are contained within results array

      // create new bounds
      bounds = new google.maps.LatLngBounds();
      // call createMarker() for each Place in array
      results.forEach(createMarker);
      // Adjust map with final bounds
      map.fitBounds(bounds);
    })
    // .catch only runs when promise is rejected
    .catch(function(status) {
      alert(status);
    });
});
```

Done! An optional step would be to take all this great data and build a UI outside of the google map so the user has a nice results list to reference.

### Full Code + HTML

[Github Gist](https://gist.github.com/JamesBedont/31fb39532a8b5b425aaf)

$(document).ready(function() {

  var log = console.log;
  var map, infoWindow;

  /**
 * Here is an simple implementation using javascript which is based on the conversion of latitude degree to kms where 1 degree latitude ~ 111.2 km.
  I am calculating bounds of the map from a given latitude and longitude with X width.
 */
  function getBoundsFromLatLng(lat, lng){
    
    lat = Number(lat);
    lng = Number(lng);

    var height = (111.2/5);
    var width = 10;

    var lat_change = width / height;
    var lon_change = Math.abs( Math.cos( lat * (Math.PI / 180) ));

    var bounds = { 
      south:  lat - lat_change,
      west :  lng - lon_change,
      north:  lat + lat_change,
      east:   lng + lon_change
    };

    return bounds;
  }

  function getCityInfo(params){
    
    let p = new URLSearchParams(params);

    let data = { 
      username: 'yoTest',
      maxRows: 4,
      orderby: "relevance",
      name: p.get("city") 
    };

    $.ajax({ 
      type: 'GET', 
      url: 'https://secure.geonames.org/searchJSON?', 
      data: data, 
      
      dataType: 'json',
      success: function (data) { 
        log(data);
        getEarthquakesInfo(data)
      }
    });
  }


  function getEarthquakesInfo(data){
    
    var city = data.geonames[0];
    var boundingBox = getBoundsFromLatLng(city.lat, city.lng); 
    log(boundingBox)
    $.ajax({ 
      type: 'GET', 
      url: 'https://secure.geonames.org/earthquakesJSON?', 
      data: { 
        username: 'yoTest',
        north:  boundingBox.north,
        south:  boundingBox.south,
        east: boundingBox.east,
        west: boundingBox.west,
      }, 
      dataType: 'json',
      
      success: function (data) { 

        initMap(city.lat, city.lng, `${city.countryName} - ${city.adminName1} - ${city.name}`);
        
        if(data.earthquakes.length){
          setMarkers(map, data);
        }
        
      }
    });

  }

  $('.search').submit(function(e) {
    e.preventDefault();
    getCityInfo($(this).serialize())
  });
  
  function initMap(lat, lng, title) {

    lat = parseFloat(lat);
    lng = parseFloat(lng);

    map = new google.maps.Map(document.getElementById('map'), {
      center: { lat, lng },
      zoom:13
    });

    var marker = new google.maps.Marker({
      position:  { lat, lng },
      map: map,
      title: title
    });

    var rectangle = new google.maps.Rectangle({
      strokeColor: '#FF0000',
      strokeOpacity: 0.5,
      strokeWeight: 2,
      fillColor: '#FF0000',
      fillOpacity: 0.1,
      map: map,
      bounds: getBoundsFromLatLng(lat, lng)
    });

    infoWindow = new google.maps.InfoWindow;
  }

  
  function setMarkers(map, locations) {

    let infowindow = new google.maps.InfoWindow();
    
    var image = new google.maps.MarkerImage('images/earthquake.png',
      new google.maps.Size(33, 33),
      new google.maps.Point(0,0),
      new google.maps.Point(0, 32));

    var shape = {
      coord: [1, 1, 1, 20, 18, 20, 18 , 1],
      type: 'poly'
    };

    let bounds = new google.maps.LatLngBounds();

    locations.earthquakes.forEach((element, index) => {

      var myLatLng = new google.maps.LatLng(element.lat, element.lng);

      var marker = new google.maps.Marker({
        position: myLatLng,
        map: map,
        icon: image,
        shape: shape,
        title: element.eqid,
        zIndex: index
      });

      google.maps.event.addListener(marker, 'click', function() {

        infowindow.setContent('<div>' +
          '<strong>latitude: </strong>'   + element.lat       + '<br>' +
          '<strong>longitude: </strong>'  + element.lng       + '<br>' +
          '<strong>Datetime: </strong>'   + element.datetime  + '<br>' +
          '<strong>Depth: </strong>'      + element.depth     + '<br>' +
          '<strong>Magnitude: </strong>'  + element.magnitude + '<br>' +
          '<strong>eqid: </strong>'       + element.eqid      + '<br>' +
        '</div>');

        infowindow.open(map, this);
      });

      bounds.extend(myLatLng);

    });

    map.fitBounds(bounds);
  }
  
  function getLargestQuakes() {

    //  We can see that the world goes from -180 to 180 degrees west to east, and -90 to 90 south to north.  
    //  So if we want to search for all earthquakes in the entire world we need to use these coordinates.
    //  Date needs to be called in 'yyyy-MM-dd' format.

    var today   = new Date();
    var dd      = today.getDate();
    var mm      = today.getMonth() + 1;  // January is 0.
    var yyyy    = today.getFullYear();
    var today   = yyyy + '-' + mm + '-' + dd;
   
    $.getJSON("https://secure.geonames.org/earthquakesJSON?north=90&south=-90&east=180&west=-180&date=" + today + "&minMagnitude=4.5&maxRows=500&username=yoTest", function(res){
      sortQuakes(res.earthquakes);
    });

  }

  function sortQuakes(data) {

    //  Sort the array by magnitude
    data.sort((a, b) => {
      return b.magnitude - a.magnitude;
    });

    //  Add the quakes to the web page
    for (var j = 0; j < 10; j++) {

      $("#top-10").append(`
        <li class="list-group-item d-flex justify-content-between lh-condensed">
          <div>
            <h6 class="my-0">${data[j].datetime} </h6>
            <small class="text-muted">latitude: ${data[j].lat}</small> / 
            <small class="text-muted">longitude:${data[j].lng}</small><br>
          </div>
          <span class="text-magnitude">${data[j].magnitude}</span>
        </li>
      `);

    }
  }

  getLargestQuakes();
  initMap(0, 0, "")
 
});

var map = L.map('map',{
    center:[50, -100],
    zoom: 4,
    // layers : [tileLayer,satellite_layer]
  });

var earthquakes = new L.LayerGroup();
var tplates = new L.LayerGroup();
  
var tileLayer = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY
})


var satellite_layer = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.satellite",
  accessToken: API_KEY
})
tileLayer.addTo(map);

var baselayers = {
  tileLayer : tileLayer,
  satellite_layer : satellite_layer

}

var overlays = {
  "Techtonic Plates" : tplates,
  "Earthquakes" : earthquakes

}
L.control.layers(baselayers,overlays).addTo(map)
// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";


// Perform a GET request to the query URL

function getColor(i) {
  return i > 5 ? '#F30' :
  i > 4  ? '#F60' :
  i > 3  ? '#F90' :
  i > 2  ? '#FC0' :
  i > 1   ? '#FF0' :
            '#9F3';
};

// function markersize(i){
//   return i*4 ;


// }
d3.json(queryUrl, function(data){
  

  L.geoJson(data,{
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng, {
        // radius: markersize(feature.properties.mag),
        radius: (feature.properties.mag)*4,
        fillColor: getColor(feature.properties.mag),
        color: "#000",
        weight: .5,
        opacity: 1,
        fillOpacity: 0.8
      })
      },  
    onEachFeature:function (feature, layer) {
          layer.bindPopup("<h3>" + feature.properties.place +
            "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
            console.log(feature)},        
  })
  .addTo(earthquakes);

  earthquakes.addTo(map)

  var legend = L.control({position: 'bottomright'});

    legend.onAdd = function (map) {

      var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 1, 2, 3, 4, 5]

      // loop through our density intervals and generate a label with a colored square for each interval
      for (var i = 0; i < grades.length; i++) {
          div.innerHTML +=
              '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
              grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
    };

  legend.addTo(map);

  d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json", 
    function(data){

      L.geoJson(data,{

      }).addTo(tplates);
        

      tplates.addTo(map);
    });
  });

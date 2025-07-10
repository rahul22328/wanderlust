
mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
  container: 'map',                                // id of <div>
  style: 'mapbox://styles/mapbox/streets-v11',      // any Mapbox style
  center:listing.geometry.coordinates,                    // [lng, lat] ✅ note comma
  zoom: 9
});

const marker1 = new mapboxgl.Marker({color:"red"})
    .setLngLat(listing.geometry.coordinates)  // NOT [coordinates](coordinates)
    .setPopup(new mapboxgl.Popup({offset:25})
    .setHTML(`<h4${listing.location}</h4><p>Exact Location provided after boooking</p>`))
    .addTo(map);

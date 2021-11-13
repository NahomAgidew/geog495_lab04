mapboxgl.accessToken = 'pk.eyJ1IjoibmFob21hIiwiYSI6ImNrdmN1M2VqdjNwc2MycW1zcGdxNmlqeWEifQ.xLWKVeuyBVIhSID2bxYl6A';
const map = new mapboxgl.Map({
  container: 'map', // container ID
  style: 'mapbox://styles/mapbox/light-v10', // style URL
  zoom: 6, // starting zoom
  center: [-120.861, 47.927] // starting center
});

async function geojsonFetch() {
  let response = await fetch('assets/wa-covid-data-102521.geojson');
  let covidData = await response.json();

  map.on('load', function loadingData() {
    map.addSource('covidData', {
      type: 'geojson',
      data: covidData
    });

    map.addLayer({
      'id': 'covidData-layer',
      'type': 'fill',
      'source': 'covidData',
      'paint': {
        'fill-color': [
          'step',
          ['get', 'fullyVaxPer10k'],

          '#dbfac0', // stop_output_1
          4000, // stop_input_1

          '#bef594', // stop_output_2
          5000, // stop_input_2

          '#abf277', // stop_output_3
          5500, // stop_input_3

          '#92ee53', // stop_output_4
          6000, // stop_input_4

          "#72ea18" // stop_output_7
        ],
        'fill-outline-color': '#BBBBBB',
        'fill-opacity': 0.8,
      }
    });

    map.on('mousemove', ({
      point
    }) => {
      const county = map.queryRenderedFeatures(point, {
        layers: ['covidData-layer']
      });
      document.getElementById('text-description').innerHTML = county.length ?
        `<h3>${county[0].properties.name}</h3><p><strong><em>${county[0].properties.fullyVaxPer10k}</strong> per 10k people</em></p>` :
        `<p>Hover over a county!</p>`;
    });
  });
};

geojsonFetch();

const layers = [
  '0-3999',
  '4000-4999',
  '5000-5499',
  '5500-5999',
  '6000 and more'
];
const colors = [
  '#dbfac080',
  '#bef59480',
  '#abf27780',
  '#92ee5380',
  '#72ea1880'
];

const legend = document.getElementById('legend');
legend.innerHTML = "<b>Fully vaccinated rate<br>(per 10k people)</b><br><br>";

layers.forEach((layer, i) => {
  const color = colors[i];
  const item = document.createElement('div');
  const key = document.createElement('span');
  key.className = 'legend-key';
  key.style.backgroundColor = color;

  const value = document.createElement('span');
  value.innerHTML = `${layer}`;
  item.appendChild(key);
  item.appendChild(value);
  legend.appendChild(item);
});
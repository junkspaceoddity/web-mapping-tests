const LAYERS = {
  coastline: {
    file: 'data/coastlines.geojson',
    name: 'Coastlines',
    color: 'rgba(255, 255, 255, 0.5)',
    stroke: 1.0,
    altitude: 0.002,
    visible: true
  },
  cable: {
    file: 'data/Global_Submarine_Cables.geojson',
    name: 'Submarine Cables',
    color: 'rgba(0, 255, 0, 0.85)',
    stroke: 0.5,
    altitude: 0.004,
    visible: true
  },
  flights: {
    file: 'data/flights_small.geojson',
    name: 'Flights',
    color: 'rgba(255, 0, 0, 0.85)',
    stroke: 0.1,
    altitude: 0.004,
    visible: true
  }
};

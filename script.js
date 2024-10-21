// Kochi Metro Station Data
const stations = [
  { id: 1, name: "Aluva", lat: 10.1076, lon: 76.3516 },
  { id: 2, name: "Ambattukavu", lat: 10.0672, lon: 76.3242 },
  { id: 3, name: "Changampuzha Park", lat: 10.0269, lon: 76.3087 },
  { id: 4, name: "Cochin University (CUSAT)", lat: 10.0505, lon: 76.3343 },
  { id: 5, name: "Companypady", lat: 10.0833, lon: 76.3456 },
  { id: 6, name: "Edappally", lat: 10.0284, lon: 76.3068 },
  { id: 7, name: "Elamkulam", lat: 9.9713, lon: 76.3003 },
  { id: 8, name: "Ernakulam South", lat: 9.9751, lon: 76.2997 },
  { id: 9, name: "JLN Stadium", lat: 10.0037, lon: 76.3128 },
  { id: 10, name: "Kadavanthra", lat: 9.9638, lon: 76.3024 },
  { id: 11, name: "Kalamassery Town", lat: 10.0461, lon: 76.3285 },
  { id: 12, name: "Kaloor", lat: 10.0023, lon: 76.3063 },
  { id: 13, name: "Maharajas College", lat: 9.9751, lon: 76.2975 },
  { id: 14, name: "MG Road", lat: 9.9816, lon: 76.2845 },
  { id: 15, name: "Muttom", lat: 10.0918, lon: 76.3513 },
  { id: 16, name: "Pathadipalam", lat: 10.0408, lon: 76.3313 },
  { id: 17, name: "Palarivattom", lat: 10.0059, lon: 76.3147 },
  { id: 18, name: "Petta", lat: 9.9582, lon: 76.3035 },
  { id: 19, name: "Pulinchodu", lat: 10.0942, lon: 76.3563 },
  { id: 20, name: "SN Junction", lat: 9.9514, lon: 76.3067 },
  { id: 21, name: "Thykoodam", lat: 9.9605, lon: 76.3065 },
  { id: 22, name: "Town Hall", lat: 10.0405, lon: 76.3356 },
  { id: 23, name: "Tripunithura Terminal", lat: 9.9489, lon: 76.3092 },
  { id: 24, name: "Vadakkekotta", lat: 9.9535, lon: 76.3105 },
  { id: 25, name: "Vyttila", lat: 9.9573, lon: 76.3064 }
];

// Connection Data
const connections = [
  { source: 1, target: 5, distance: 2.5 },
  { source: 5, target: 19, distance: 1.0 },
  { source: 19, target: 15, distance: 3.0 },
  { source: 15, target: 16, distance: 1.5 },
  { source: 16, target: 11, distance: 2.0 },
  { source: 11, target: 4, distance: 1.8 },
  { source: 4, target: 2, distance: 2.2 },
  { source: 2, target: 12, distance: 2.0 },
  { source: 12, target: 3, distance: 1.2 },
  { source: 3, target: 6, distance: 0.5 },
  { source: 6, target: 17, distance: 1.0 },
  { source: 17, target: 9, distance: 2.3 },
  { source: 9, target: 14, distance: 1.5 },
  { source: 14, target: 13, distance: 2.0 },
  { source: 13, target: 8, distance: 1.8 },
  { source: 8, target: 10, distance: 0.9 },
  { source: 10, target: 7, distance: 1.0 },
  { source: 7, target: 18, distance: 2.0 },
  { source: 18, target: 21, distance: 1.2 },
  { source: 21, target: 20, distance: 1.0 },
  { source: 20, target: 24, distance: 1.0 },
  { source: 24, target: 23, distance: 1.0 }
];

// Populate source and destination dropdowns
function populateStations() {
  const sourceSelect = document.getElementById("source");
  const destinationSelect = document.getElementById("destination");

  stations.forEach(station => {
    const option1 = new Option(station.name, station.id);
    const option2 = new Option(station.name, station.id);
    sourceSelect.add(option1);
    destinationSelect.add(option2);
  });
}

// Draw the map with stations and connections using D3.js
function drawMap() {
  const svg = d3.select("#map").append("svg")
    .attr("width", "100%")
    .attr("height", "500px");

  // Draw stations
  stations.forEach(station => {
    svg.append("circle")
      .attr("cx", station.lon * 5000)
      .attr("cy", -station.lat * 5000)
      .attr("r", 10)
      .attr("fill", "blue");

    svg.append("text")
      .attr("x", station.lon * 5000 + 15)
      .attr("y", -station.lat * 5000 + 5)
      .text(station.name)
      .attr("font-size", "12px")
      .attr("fill", "#333");
  });

  // Draw connections
  connections.forEach(connection => {
    const sourceStation = stations.find(station => station.id === connection.source);
    const targetStation = stations.find(station => station.id === connection.target);

    svg.append("line")
      .attr("x1", sourceStation.lon * 5000)
      .attr("y1", -sourceStation.lat * 5000)
      .attr("x2", targetStation.lon * 5000)
      .attr("y2", -targetStation.lat * 5000)
      .attr("stroke", "black")
      .attr("stroke-width", 2);
  });
}

// Dijkstra's Algorithm to find the shortest path
function dijkstra(source, target) {
  const distances = {};
  const visited = {};
  const previous = {};
  let path = [];

  // Initialize distances and previous nodes
  stations.forEach(station => {
    distances[station.id] = Infinity;
    previous[station.id] = null;
  });

  distances[source] = 0;

  while (true) {
    let closestStation = null;
    let closestDistance = Infinity;

    // Find the unvisited station with the smallest distance
    for (let stationId in distances) {
      if (!visited[stationId] && distances[stationId] < closestDistance) {
        closestStation = parseInt(stationId);
        closestDistance = distances[stationId];
      }
    }

    // If no unvisited station is found or the target is reached, stop
    if (closestStation === null || closestStation === target) {
      break;
    }

    visited[closestStation] = true;

    // Get the neighbors of the current station
    const neighbors = connections.filter(conn => conn.source === closestStation || conn.target === closestStation);
    
    neighbors.forEach(neighbor => {
      const otherStation = neighbor.source === closestStation ? neighbor.target : neighbor.source;
      const totalDistance = distances[closestStation] + neighbor.distance;

      // Update distance to the neighbor if a shorter path is found
      if (totalDistance < distances[otherStation]) {
        distances[otherStation] = totalDistance;
        previous[otherStation] = closestStation;
      }
    });
  }

  // Build the shortest path
  let current = target;
  while (current !== null) {
    path.unshift(current);
    current = previous[current];
  }

  return {
    path,
    distance: distances[target]
  };
}

// Function to draw the graph using Vis.js
function drawGraph(result) {
  const nodes = result.path.map(id => {
    const station = stations.find(s => s.id === id);
    return { id, label: station.name };
  });

  const edges = [];
  for (let i = 0; i < result.path.length - 1; i++) {
    const source = result.path[i];
    const target = result.path[i + 1];
    const connection = connections.find(conn =>
      (conn.source === source && conn.target === target) ||
      (conn.source === target && conn.target === source)
    );
    edges.push({ from: source, to: target, label: `${connection.distance} km` });
  }

  const container = document.getElementById("graph");
  const data = {
    nodes: new vis.DataSet(nodes),
    edges: new vis.DataSet(edges)
  };
  const options = {
    edges: {
      arrows: {
        to: { enabled: true }
      }
    }
  };
  new vis.Network(container, data, options);
}

// Handle finding and displaying the shortest path
function findPath() {
  const source = parseInt(document.getElementById("source").value);
  const destination = parseInt(document.getElementById("destination").value);
  const result = dijkstra(source, destination);

  const pathNames = result.path.map(id => stations.find(station => station.id === id).name).join(" -> ");
  document.getElementById("path-result").textContent = `Path: ${pathNames}`;
  document.getElementById("distance-result").textContent = `Distance: ${result.distance} km`;

  // Draw the path graph
  drawGraph(result);
}

// Event listeners
document.getElementById("find-path-btn").addEventListener("click", findPath);

// Initialize station dropdowns and map
populateStations();
drawMap();

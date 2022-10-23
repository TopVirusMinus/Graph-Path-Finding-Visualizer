let MAX_ID = 5;

let nodes = new vis.DataSet([
  { id: 1, label: "Node 1" },
  { id: 2, label: "Node 2" },
  { id: 3, label: "Node 3" },
  { id: 4, label: "Node 4" },
  { id: 5, label: "Node 5" },
]);

// create an array with edges
let edges = new vis.DataSet([
  { from: 1, to: 3 },
  { from: 1, to: 2 },
  { from: 2, to: 4 },
  { from: 2, to: 5 },
  { from: 3, to: 3 },
]);

let container = document.getElementById("mynetwork");
let data = {
  nodes: nodes,
  edges: edges,
};

var options = {};
var network = new vis.Network(container, data, options);

network.on("click", function (params) {
  if (params.nodes.length == 0 && params.edges.length == 0) {
    console.log("add new node!");
    MAX_ID += 1;
    var updatedIds = nodes.add([
      {
        label: `Node ${MAX_ID}`,
        x: params.pointer.canvas.x,
        y: params.pointer.canvas.y,
      },
    ]);
    network.selectNodes([updatedIds[0]]);
    network.editNode();
  }
});

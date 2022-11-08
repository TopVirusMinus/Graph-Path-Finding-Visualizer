// create an array with nodes
var nodes = new vis.DataSet([
  { id: 1, label: "Start" },
  { id: 2, label: "Node 1" },
  { id: 3, label: "Node 2" },
  { id: 4, label: "Node 3" },
  { id: 5, label: "end" },
]);

// create an array with edges
var edges = new vis.DataSet([
  { from: 1, to: 2, label: "2" },
  { from: 1, to: 3, label: "5" },
  { from: 2, to: 3, label: "3" },
  { from: 2, to: 4, label: "1" },
  { from: 3, to: 4, label: "3" },
  { from: 4, to: 5, label: "2" },
]);

var selectednode = 0;
var lastNodeNum = 3;
let hoveredNode = "";
// create a network
var container = document.getElementById("mynetwork");
var data = {
  nodes: nodes,
  edges: edges,
};

var options = {
  interaction: { hover: true },
  manipulation: {
    enabled: true,
    addNode: function (nodeData, callback) {
      lastNodeNum += 1;
      nodeData.label = `Node ${lastNodeNum}`;
      callback(nodeData);
    },
    addEdge: function (edgeData, callback) {
      if (edgeData.from === edgeData.to) {
        var r = confirm("Do you want to connect the node to itself?");
        if (r === true) {
          callback(edgeData);
        }
      } else {
        callback(edgeData);
      }
    },
  },
};

document.getElementById("visualize").addEventListener("click", async () => {
  axios
    .post("http://localhost:8000/receiveInfo/", {
      nodes: nodes.get(),
      edges: edges.get(),
    })
    .then((res) => console.log(res))
    .catch((err) => console.log(err));
});

var network = new vis.Network(container, data, options);
var ct = 0;

network.on("click", function (params) {
  params.event = "[original event]";
  document.getElementById("eventSpanHeading").innerText = "Click event:";
  document.getElementById("eventSpanContent").innerText = JSON.stringify(
    params,
    null,
    4
  );

  console.log("nodes: ", data.nodes.get());
  console.log("edges: ", data.edges.get());

  console.log(
    "click event, getNodeAt returns: " + this.getNodeAt(params.pointer.DOM)
  );
  selectednode = this.getNodeAt(params.pointer.DOM);
  if (ct % 2 == 0) {
    startnode = this.getNodeAt(params.pointer.DOM);
  } else {
    endnode = this.getNodeAt(params.pointer.DOM);
  }
  ct++;
  //   console.log(selectednode);
  //   console.log(nodes.get());
  //   console.log(edges.get());
  // nodes.update({ id: 2, label: "item 2 (new)" });
});

network.on("doubleClick", function (params) {
  // var edgesIDs = properties.edges;
  // clickedEdges = edges.get(edgesIDs);
  // console.log(clickedEdges + "000000000000000000");
  params.event = "[original event]";
  document.getElementById("eventSpanHeading").innerText = "doubleClick event:";
  document.getElementById("eventSpanContent").innerText = JSON.stringify(
    params,
    null,
    4
  );
  endnode = this.getNodeAt(params.pointer.DOM);
});

network.on("click", (params) => {
  if (params.nodes.length == 0 && params.edges.length == 0) {
    console.log("add new node!");
    lastNodeNum += 1;
    var updatedIds = nodes.add([
      {
        label: `Node ${lastNodeNum}`,
        x: params.pointer.canvas.x,
        y: params.pointer.canvas.y,
      },
    ]);
  }
});
var counter = 1;
function updateedge() {
  var cost = document.getElementById("cost").value;
  console.log(heu);
  edges.add([{ id: counter, from: startnode, to: endnode, label: cost }]);
  counter++;
}
network.on("oncontext", function (params) {
  params.event = "[original event]";
  document.getElementById("eventSpanHeading").innerText =
    "oncontext (right click) event:";
  document.getElementById("eventSpanContent").innerText = JSON.stringify(
    params,
    null,
    4
  );
});
var startnode = 0;
var endnode = 0;
network.on("dragStart", function (params) {
  // There's no point in displaying this event on screen, it gets immediately overwritten
  params.event = "[original event]";
  console.log("dragStart Event:", params);
  console.log(
    "dragStart event, getNodeAt returns: " + this.getNodeAt(params.pointer.DOM)
  );
});

network.on("dragging", function (params) {
  params.event = "[original event]";
  document.getElementById("eventSpanHeading").innerText = "dragging event:";
  document.getElementById("eventSpanContent").innerText = JSON.stringify(
    params,
    null,
    4
  );
});

function updatenode() {
  var txt = document.getElementById("nname").value;
  var heu = document.getElementById("heu").value;
  console.log(heu);
  nodes.updateOnly({ id: selectednode, label: txt, title: heu });
}

network.on("dragEnd", function (params) {
  params.event = "[original event]";
  document.getElementById("eventSpanHeading").innerText = "dragEnd event:";
  document.getElementById("eventSpanContent").innerText = JSON.stringify(
    params,
    null,
    4
  );
  //console.log("dragEnd Event:", params);
  //console.log(
  //"dragEnd event, getNodeAt returns: " + this.getNodeAt(params.pointer.DOM)
  //);
});

network.on("controlNodeDragging", function (params) {
  params.event = "[original event]";
  document.getElementById("eventSpanHeading").innerText =
    "control node dragging event:";
  document.getElementById("eventSpanContent").innerText = JSON.stringify(
    params,
    null,
    4
  );
});

network.on("controlNodeDragEnd", function (params) {
  params.event = "[original event]";
  document.getElementById("eventSpanHeading").innerText =
    "control node drag end event:";
  document.getElementById("eventSpanContent").innerText = JSON.stringify(
    params,
    null,
    4
  );
  //console.log("controlNodeDragEnd Event:", params);
});

network.on("zoom", function (params) {
  // document.getElementById("eventSpanHeading").innerText = "zoom event:";
  //document.getElementById("eventSpanContent").innerText = JSON.stringify(
  //   params,
  //  null,
  // 4
  //);
});

// network.on("showPopup", function (params) {
//     document.getElementById("eventSpanHeading").innerText = "showPopup event: ";
//     document.getElementById("eventSpanContent").innerText = JSON.stringify(
//         params,
//         null,
//         4
//     );
// });

instructions = {
  Delete: () => network.deleteSelected(),
  Enter: () => {
    !selectededge && "";
    let cost = prompt("Enter Cost");
    edges.updateOnly({ id: selectededge, label: cost, title: heu });
    console.log(`edit edge cost ${selectededge}`);
  },
  r: () => {
    let newName = prompt("Enter New Name");
    nodes.updateOnly({ id: selectednode, label: newName, title: heu });
  },
  R: () => {
    let newName = prompt("Enter New Name");
    nodes.updateOnly({ id: selectednode, label: newName, title: heu });
  },
  Control: () => {
    network.body.data.edges.add({ from: selectednode, to: hoveredNode });
  },
};

container.addEventListener("keydown", (e) => {
  console.log(e.key);
  instructions[e.key]();
});

network.on("hidePopup", function () {
  //console.log("hidePopup Event");
});
network.on("select", function (params) {
  //console.log("select Event:", params);1
});
network.on("selectNode", function (params) {
  selectednode = params.nodes[0];
  console.log(selectednode);
  var node = network.body.nodes[selectednode];
});
network.on("selectEdge", function (params) {
  console.log("selectEdge Event:", params);
  selectededge = this.getEdgeAt(params.pointer.DOM);
});
network.on("deselectNode", function (params) {
  //console.log("deselectNode Event:", params);
});
network.on("deselectEdge", function (params) {
  //console.log("deselectEdge Event:", params);
});
network.on("hoverNode", function (params) {
  //console.log("hoverNode Event:", params);
  hoveredNode = params.node;
  console.log(hoveredNode);
});
network.on("hoverEdge", function (params) {
  //console.log("hoverEdge Event:", params);
});
network.on("blurNode", function (params) {
  //console.log("blurNode Event:", params);
});
network.on("blurEdge", function (params) {
  //console.log("blurEdge Event:", params);
});

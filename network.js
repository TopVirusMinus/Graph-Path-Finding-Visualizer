// create an array with nodes
var nodes = new vis.DataSet([
  { id: 1, label: "S", title: "5" },
  { id: 2, label: "A", title: "7" },
  { id: 3, label: "D", title: "6" },
  { id: 4, label: "B", title: "3" },
  { id: 5, label: "C", title: "4" },
  { id: 6, label: "E", title: "5" },
  { id: 7, label: "G1", title: "0" },
  { id: 8, label: "G2", title: "0" },
  { id: 9, label: "F", title: "6" },
  { id: 10, label: "G3", title: "0" },
]);

nodes.forEach((node) => {
  nodes.updateOnly({
    id: node.id,
    label: `${node.label} (${node.title})`,
  });
});
var shortestpath, visited, fringe
// create an array with edges
var edges = new vis.DataSet([
  { from: 1, to: 2, label: "5" },
  { from: 1, to: 4, label: "9" },
  { from: 1, to: 3, label: "6" },
  { from: 3, to: 1, label: "1" },
  { from: 5, to: 1, label: "6" },
  { from: 2, to: 4, label: "3" },
  { from: 3, to: 5, label: "2" },
  { from: 4, to: 5, label: "1" },
  { from: 4, to: 2, label: "2" },
  { from: 2, to: 7, label: "9" },
  { from: 3, to: 6, label: "2" },
  { from: 6, to: 10, label: "7" },
  { from: 5, to: 8, label: "5" },
  { from: 5, to: 9, label: "7" },
  { from: 9, to: 3, label: "2" },
  { from: 9, to: 10, label: "8" },
]);

let clear = document
  .getElementById("clear")
  .addEventListener("click", () => { });

var selectedNode = 0;
var prevSelectedNode = 0;

var source = -1;
var destination = [];

var lastNodeNum = 5;
let hoveredNode = "";
let algorithm = "bfs";

var modal = document.querySelector("#modal");
var modalOverlay = document.querySelector("#modal-overlay");
var closeButton = document.querySelector("#modal-done");
var modalInput = document.getElementById("modal-input");
var modalTitle = document.getElementById("modal-title");

modalInput.addEventListener("keyup", (e) => {
  e.preventDefault();
  if (e.key === "Enter") {
    closeButton.click();
  }
});

closeButton.addEventListener("click", function () {
  modal.classList.toggle("closed");
  modalOverlay.classList.toggle("closed");
});

{
  /* <div class="modal" id="modal">
          <div class="modal-overlay" id="modal-overlay">
            <h1 id="modal-title">Enter Cost</h1>
            <input type="text" name="" id="modal-input" autofocus />
            <button id="modal-done">Done</button>
          </div> */
}

// openButton.addEventListener("click", function () {
//   modal.classList.toggle("closed");
//   modalOverlay.classList.toggle("closed");
// });

document.getElementById("Algorithm").addEventListener("change", () => {
  algorithm = document.getElementById("Algorithm").value;
});
// create a network
var container = document.getElementById("mynetwork");
var data = {
  nodes: nodes,
  edges: edges,
};

var options = {
  interaction: { hover: true },
  edges: {
    arrows: {
      to: {
        enabled: true,
        scaleFactor: 1,
        type: "arrow",
      },
    },
  },
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
function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}
document.getElementById("visualize").addEventListener("click", async () => {
  console.log(source, destination);
  axios
    .post("http://localhost:8000/receiveInfo/", {
      nodes: nodes.get(),
      edges: edges.get(),
      algorithm,
      source,
      destination,
    })
    .then((res) => console.log(res))
    .then(async () => {
      let path = await axios.get("http://localhost:8000/computePath/");
      console.log(path.data);
      [shortestpath, fringe, visited] = path.data
      console.log("hello")
      for (var i = 0; i < fringe.length; i++) {
        document.getElementById("fringe").innerHTML += fringe[i] + "<br>"
      }
      document.getElementById("fringeh1").innerHTML = "Fringe:"


    })
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
  selectedNode = this.getNodeAt(params.pointer.DOM);
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
        label: `Node ${lastNodeNum} (-1)`,
        title: "-1",
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
  nodes.updateOnly({ id: selectedNode, label: txt, title: heu });
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
var time = 0
instructions = {
  Delete: () => network.deleteSelected(),
  Enter: () => {
    !selectededge && "";

    // modal.classList.toggle("closed");
    // modalOverlay.classList.toggle("closed");
    // modalTitle.innerHTML = "Enter Cost";
    let cost = prompt("Enter Cost");
    // let cost = modalInput.value;
    // console.log(modalInput.value);
    edges.updateOnly({ id: selectededge, label: cost, title: heu });
    console.log(`edit edge cost ${selectededge}`);
  },
  r: () => {
    let newName = prompt("Enter New Name");
    let NODE = 0;
    nodes.forEach((node) => {
      if (node.id === selectedNode) {
        NODE = node;
        return;
      }
    });
    nodes.updateOnly({
      id: selectedNode,
      label: `${newName} (${NODE.title})`,
    });
  },
  R: () => {
    let newName = prompt("Enter New Name");
    let NODE = 0;
    nodes.forEach((node) => {
      if (node.id === selectedNode) {
        NODE = node;
        return;
      }
    });
    nodes.updateOnly({
      id: selectedNode,
      label: `${newName} (${NODE.title})`,
    });
  },
  Control: () => {
    network.body.data.edges.add({
      from: selectedNode,
      to: hoveredNode,
      label: "0",
    });
  },
  h: () => {
    let heuristic = prompt("Enter Heuristic");
    let NODE = 0;
    nodes.forEach((node) => {
      if (node.id === selectedNode) {
        NODE = node;
        return;
      }
    });

    let oldName = NODE.label;
    oldName = oldName.split("(");
    oldName = oldName[0];

    nodes.updateOnly({
      id: selectedNode,
      label: `${oldName} (${heuristic})`,
      title: heuristic,
    });
  },
  H: () => {
    let heuristic = prompt("Enter Heuristic");
    let NODE = 0;
    nodes.forEach((node) => {
      if (node.id === selectedNode) {
        NODE = node;
        return;
      }
    });

    let oldName = NODE.label;
    oldName = oldName.split("(");
    oldName = oldName[0];

    nodes.updateOnly({
      id: selectedNode,
      label: `${oldName} (${heuristic})`,
      title: heuristic,
    });
  },
  s: () => {
    source = selectedNode;
    console.log(source);
    nodes.forEach((n) => {
      if ("color" in n && n.color.background === "#00ff00") {
        nodes.updateOnly({
          id: n.id,
          color: { background: "#97c2fc" },
          font: { color: "#333" },
        });
      }
    });
    nodes.updateOnly({
      id: selectedNode,
      color: { background: "#00ff00" },
      font: { color: "#333" },
    });
  },
  S: () => {
    source = selectedNode;
    nodes.forEach((n) => {
      if ("color" in n && n.color.background === "#00ff00") {
        nodes.updateOnly({
          id: n.id,
          color: { background: "#97c2fc" },
          font: { color: "#333" },
        });
      }
    });
    nodes.updateOnly({
      id: selectedNode,
      color: { background: "#00ff00" },
      font: { color: "#333" },
    });
  },
  ArrowRight: () => {
    var vl = visited.length;
    nodes.forEach((n) => {

      nodes.updateOnly({
        id: n.id,
        color: { background: "#97c2fc" },
        font: { color: "#333" },
      });

    });
    if (time > 0 && time <= visited.length) {
      for (var i = 0; i < time; i++) {
        nodes.updateOnly({
          id: visited[i],
          color: { background: "#fbcf23" },
          font: { color: "#333" },
        });
      }
    }
    else {
      if (time >= vl && time - visited.length < shortestpath.length) {
        for (var i = 0; i <= time - visited.length; i++) {
          nodes.updateOnly({
            id: shortestpath[i],
            color: { background: "#EE432F" },
            font: { color: "#333" },
          });
        }
      }
    }
    if (time < visited.length + shortestpath.length)
      time++;
  },
  p: () => {

    nodes.forEach((n) => {

      nodes.updateOnly({
        id: n.id,
        color: { background: "#97c2fc" },
        font: { color: "#333" },
      });

    });
    for (var i = 0; i < shortestpath.length; i++) {
      nodes.updateOnly({
        id: shortestpath[i],
        color: { background: "#EE432F" },
        font: { color: "#333" },
      });
    }

  },
  ArrowLeft: () => {
    if (time > 0) {
      time--;
    }
    var vl = visited.length;
    nodes.forEach((n) => {

      nodes.updateOnly({
        id: n.id,
        color: { background: "#97c2fc" },
        font: { color: "#333" },
      });

    });
    if (time > 0 && time < visited.length) {
      for (var i = 0; i < time; i++) {
        nodes.updateOnly({
          id: visited[i],
          color: { background: "#fbcf23" },
          font: { color: "#333" },
        });
      }
    }
    else {
      if (time >= vl && time - visited.length < shortestpath.length) {
        for (var i = 0; i <= time - visited.length; i++) {
          nodes.updateOnly({
            id: shortestpath[i],
            color: { background: "#EE432F" },
            font: { color: "#333" },
          });
        }
      }
    }

  },
  g: () => {
    console.log(destination);
    let same = false;
    if (destination.includes(selectedNode)) {
      console.log(same);
      nodes.updateOnly({
        id: selectedNode,
        color: { background: "#97c2fc" },
        font: { color: "#333" },
      });
      same = true;
      destination.pop(destination.indexOf(selectedNode));
    }
    if (!same) {
      destination.push(selectedNode);
      nodes.updateOnly({
        id: selectedNode,
        color: { background: "#FF0000" },
        font: { color: "#333" },
      });
    }
  },
  G: () => {
    let same = false;
    if (destination.includes(selectedNode)) {
      console.log(same);
      nodes.updateOnly({
        id: selectedNode,
        color: { background: "#97c2fc" },
        font: { color: "#333" },
      });
      same = true;
      destination.pop(destination.indexOf(selectedNode));
    }
    if (!same) {
      destination.push(selectedNode);
      nodes.updateOnly({
        id: selectedNode,
        color: { background: "#FF0000" },
        font: { color: "#333" },
      });
    }
    console.log(destination);
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
  prevSelectedNode = selectedNode;
  selectedNode = params.nodes[0];
  prevSelectedNode === 0 ? (prevSelectedNode = selectedNode) : prevSelectedNode;
  console.log(prevSelectedNode, selectedNode);
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
  //console.log(hoveredNode);
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

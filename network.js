// create an array with nodes
var nodes = new vis.DataSet([
    { id: 1, label: "Node 1", }
]);

// create an array with edges
var edges = new vis.DataSet([
]);
var selectednode = 0;
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
    },
};

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
    console.log(selectednode);
    console.log(nodes.get());
    console.log(edges.get());
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
var counter = 1;
function updateedge() {

    var cost = document.getElementById("cost").value;
    console.log(heu);
    edges.add([{ id: counter, from: startnode, to: endnode, label: cost }])
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
    console.log("dragEnd Event:", params);
    console.log(
        "dragEnd event, getNodeAt returns: " + this.getNodeAt(params.pointer.DOM)
    );

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
    console.log("controlNodeDragEnd Event:", params);
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
network.on("hidePopup", function () {
    console.log("hidePopup Event");
});
network.on("select", function (params) {
    console.log("select Event:", params);
});
network.on("selectNode", function (params) {
    console.log("selectNode Event:", params);
});
network.on("selectEdge", function (params) {
    console.log("selectEdge Event:", params);
    selectededge = this.getEdgeAt(params.pointer.DOM);
});
network.on("deselectNode", function (params) {
    console.log("deselectNode Event:", params);
});
network.on("deselectEdge", function (params) {
    console.log("deselectEdge Event:", params);
});
network.on("hoverNode", function (params) {
    console.log("hoverNode Event:", params);
});
network.on("hoverEdge", function (params) {
    console.log("hoverEdge Event:", params);
});
network.on("blurNode", function (params) {
    console.log("blurNode Event:", params);
});
network.on("blurEdge", function (params) {
    console.log("blurEdge Event:", params);
});

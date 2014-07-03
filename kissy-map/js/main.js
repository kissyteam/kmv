/**
 *
 */
(function() {

//    var sample_data = [
//        {"name": "alpha", "size": 10},
//        {"name": "beta", "size": 12},
//        {"name": "gamma", "size": 30},
//        {"name": "delta", "size": 26},
//        {"name": "epsilon", "size": 12},
//        {"name": "zeta", "size": 26},
//        {"name": "theta", "size": 11},
//        {"name": "eta", "size": 24}
//    ]
//
//    var connections = [
//        {"source": "alpha", "target": "beta"},
//        {"source": "alpha", "target": "gamma"},
//        {"source": "beta", "target": "delta"},
//        {"source": "beta", "target": "epsilon"},
//        {"source": "zeta", "target": "gamma"},
//        {"source": "theta", "target": "gamma"},
//        {"source": "eta", "target": "gamma"}
//    ]
//
//    var visualization = d3plus.viz()
//        .container("#viz")
//        .type("network")
//        .data(sample_data)
//        .edges(connections)
//        .edges({"arrows": true})
//        .size("size")
//        .id("name")
//        .draw();

    chrome.runtime.sendMessage({"src": "ready"}, function(response) {
        console.log(response);
        if (req.src == "ready") {
            console.log(response.kissyMods);
        }
    });

})();


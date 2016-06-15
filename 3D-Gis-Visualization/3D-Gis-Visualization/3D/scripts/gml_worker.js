
/*
Worker version of script
Input: GML response

Output: model, a
*/
importScripts('../threejs/three.min.js');

onmessage = function (e) {
    //Data Posting from page is accepting here
    var e = e.data;
    //ADD YOUR SERVICE URL HERE     var ServiceUrl = host + "/GetUpdate?eMailId=" + data.email;
    var scale = e[0];
    var length = e[1];
    var i = e[2];
    var cords = e[3];
    var widthP = e[4];
    var heightP = e[5];
    var column = e[6];
    var row = e[7];
    var xmax = e[8];
    var ymax = e[9];
    var factorX = e[10];
    var factorY = e[11];
    var z = -999;
    length--;



    var points = [];
    var xs = [];
    var ys = [];
   
    for (var j = 0; j < cords.length; j++) {
        var xyz = cords[j].split(",");
        var x = xyz[0];
        var y = xyz[1];
        z = xyz[2];

        var ptx = (widthP * (column) / 2) - (((xmax - x) * factorX));
        var pty = (heightP * (row) / 2) - (((ymax - y) * factorY));

        var point = new THREE.Vector3(ptx, pty, z);
        points.push(point);
        xs.push(x);
        ys.push(y);
    }
    /*if (attributes[i] != undefined) {
        var gmlAttributes = attributes[i].getElementsByTagName("*");
        app.project.layers[index].a[i] = {};
        for (var k = 0; k < gmlAttributes.length; k++) {
            var key = String(gmlAttributes[k].nodeName);
            var key = key.replace(/kms:|gml:/gi, "");
            var value = gmlAttributes[k].innerHTML;
            app.project.layers[index].a[i][key] = value;
        } */



    var shape = new THREE.Shape(points);

    var extrudeSettings = {
        amount: 1,
        steps: 2,
        bevelEnabled: false,
    };

    var color = 0xff0000;
    var material = new THREE.MeshPhongMaterial({
        color: color,
        polygonOffset: true,
        polygonOffsetFactor: -0.2,
        polygonOffsetUnits: -1.0
    });


    var geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    var mesh = new THREE.Mesh(geometry, material);
    
   
    //Compute the center coordinate of the box that bounds the object:
    var xminMap = Math.min.apply(null, xs);
    var xmaxMap = Math.max.apply(null, xs);
    var yminMap = Math.min.apply(null, ys);
    var ymaxMap = Math.max.apply(null, ys);

    //The coordinate will be
    var xCorMap = xminMap + ((xmaxMap - xminMap) / 2);
    var yCorMap = yminMap + ((ymaxMap - yminMap) / 2);
    mesh.mapcoords = [xCorMap, yCorMap];


    var geo = new THREE.Geometry();
    geo.vertices = geometry.vertices;
    geo.faces = geometry.faces;

   

    if (z > 0) {
        //console.log((z * scale) / 2);
        geo.scale(1, 1, (z * scale) / 2);
    } else {
        geo.scale(1, 1, scale * 8);
    }
    mesh.geometry = geo;

   

    var result = mesh.toJSON();
    var resultJSON = JSON.stringify(result);





    postMessage([resultJSON, i,xCorMap,yCorMap]);





    function GetData() {
        var xml = new XMLHttpRequest();
        var url = data;

        //console.log("Trying to call: " + data);
        xml.responseType = 'document';
        xml.overrideMimeType('text/xml');
        xml.onreadystatechange = function () {
            if (xml.readyState == 4 && xml.status == 200) {
                //Good result / success


                xmlDoc = (new DOMParser()).parseFromString(xml.responseText, 'text/xml');

                var coordinates = xmlDoxc.getElementsByTagName("coordinates");


                postMessage(coordinates);

            }
        };
        xml.open("GET", data, false);
        xml.setRequestHeader("Content-Type", "text/xml");
        xml.send();
    }


}
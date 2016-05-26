Q3D.gui = {

  type: "dat-gui",

  parameters: {
    lyr: [],
    cp: {
      c: "#ffffff",
      d: 0,
      o: 1,
      l: false
    },
    cmd: {         // commands for touch screen devices
      rot: false,  // auto rotation
      wf: false    // wireframe mode
    },
    i: Q3D.application.showInfo,
    FOTsearch: '0000000000',
    Source: 'https://dl.dropboxusercontent.com/s/88vgr6io5q63cjg/energimaerke.csv',
    getParseResult: getAllData,
    getParseSources: getSources,
    getbounds: "http://wfs-kbhkort.kk.dk/k101/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=k101:karre&outputFormat=json",
    layers: [],
    opacity: 1.0,
    color: "#445566",
    height: 5,
    random: false,
    getGML: function () { },
    showColor: false,
    addressWash: function () { },
    colorBuilding: 'Aavej 9',
    generateScene: 'Aavej 9',
    selected: '[Select Data Type]',
    dataLoaded: false,
    saveProject: 'Type Project Name Here',
    enabled: true,

  },
  
  // initialize gui
  // - setupDefaultItems: default is true
  init: function (setupDefaultItems) {
    this.gui = new dat.GUI();
    this.gui.domElement.parentElement.style.zIndex = 1000;   // display the panel on the front of labels
    if (setupDefaultItems === undefined || setupDefaultItems == true) {
      this.addLayersFolder();
      //this.addCustomPlaneFolder();
      this.addFunctionsFolder();
      //this.addCustomLayers();
      if (Q3D.isTouchDevice) this.addCommandsFolder();
      this.addHelpButton();
    }
  },

  addLoadingButtons: function () {
      var dataFolder = this.gui.addFolder('Data Management');
      dataFolder.add('Load');
      /*
      dataFolder.add(parameters.lyr[i], 'Load').name('Load').onChange(function (value) {
          var file = File("./randdata.csv");
          Papa.parse(file, {
              complete: function (results) {
                  console.log(results);
              }
          });
      }); */
  },

  addLayersFolder: function () {
    var parameters = this.parameters;
    var layersFolder = this.gui.addFolder('Layers');

    var visibleChanged = function (value) { project.layers[this.object.i].setVisible(value); };
    var opacityChanged = function (value) { project.layers[this.object.i].setOpacity(value); };
    var sideVisibleChanged = function (value) { project.layers[this.object.i].setSideVisibility(value); };

    project.layers.forEach(function (layer, i) {
            parameters.lyr[i] = { i: i, v: layer.visible, o: layer.opacity };
      var folder = layersFolder.addFolder(layer.name);
      folder.add(parameters.lyr[i], 'v').name('Visible').onChange(visibleChanged);

      if (layer.type == Q3D.LayerType.DEM) {
        var itemName = '';
        if (layer.blocks[0].sides) itemName = 'Sides and bottom';
        else if (layer.blocks[0].frame) itemName = 'Frame';

        if (itemName) {
          parameters.lyr[i].sv = true;
          folder.add(parameters.lyr[i], 'sv').name(itemName).onChange(sideVisibleChanged);
        }
      }
      else if (layer.type == Q3D.LayerType.Polygon && layer.objType == 'Overlay') {
        var j, f = layer.f, m = f.length;
        for (j = 0; j < m; j++) {
          if (f[j].mb === undefined) continue;
          parameters.lyr[i].border = true;
          folder.add(parameters.lyr[i], 'border').name('Borders').onChange(function (value) {
            project.layers[this.object.i].setBorderVisibility(value);
          });
          break;
        }

        for (j = 0; j < m; j++) {
          if (f[j].ms === undefined) continue;
          parameters.lyr[i].side = true;
          folder.add(parameters.lyr[i], 'side').name('Sides').onChange(function (value) {
            project.layers[this.object.i].setSideVisibility(value);
          });
          break;
        }
      }

      folder.add(parameters.lyr[i], 'o').min(0).max(1).name('Opacity').onChange(opacityChanged);

    });
  },

  addCustomPlaneFolder: function () {
    var customPlane;
    var parameters = this.parameters;
    var addPlane = function (color) {
      // Add a new plane in the current scene
      var geometry = new THREE.PlaneBufferGeometry(project.width, project.height, 1, 1),
                material = new THREE.MeshLambertMaterial({ color: color, transparent: true });
      if (!Q3D.isIE) material.side = THREE.DoubleSide;
      customPlane = new THREE.Mesh(geometry, material);
      Q3D.application.scene.add(customPlane);
    };

    // Min/Max value for the plane
    var zMin = (project.layers[0].type == Q3D.LayerType.DEM) ? project.layers[0].stats.min - 500 : 0,
        zMax = (project.layers[0].type == Q3D.LayerType.DEM) ? project.layers[0].stats.max + 1000 : 9000;
    parameters.cp.d = zMin;

    // Create Custom Plane folder
    var folder = this.gui.addFolder('Custom Plane');

    // Plane color
    folder.addColor(parameters.cp, 'c').name('Color').onChange(function (value) {
      if (customPlane === undefined) addPlane(parameters.cp.c);
      customPlane.material.color.setStyle(value);
    });

    // Plane height
    folder.add(parameters.cp, 'd').min(zMin).max(zMax).name('Plane height').onChange(function (value) {
      if (customPlane === undefined) addPlane(parameters.cp.c);
      customPlane.position.z = (value + project.zShift) * project.zScale;
      customPlane.updateMatrixWorld();
    });

    // Plane opacity
    folder.add(parameters.cp, 'o').min(0).max(1).name('Opacity (0-1)').onChange(function (value) {
      if (customPlane === undefined) addPlane(parameters.cp.c);
      customPlane.material.opacity = value;
    });

    // Enlarge plane option
    folder.add(parameters.cp, 'l').name('Enlarge').onChange(function (value) {
      if (customPlane === undefined) addPlane(parameters.cp.c);
      if (value) customPlane.scale.set(10, 10, 1);
      else customPlane.scale.set(1, 1, 1);
      customPlane.updateMatrixWorld();
    });
  },

  // add commands folder for touch screen devices
  addCommandsFolder: function () {
    var folder = this.gui.addFolder('Commands');
    if (Q3D.Controls.type == "OrbitControls") {
      folder.add(this.parameters.cmd, 'rot').name('Auto Rotation').onChange(function (value) {
        Q3D.application.controls.autoRotate = value;
      });
    }
    folder.add(this.parameters.cmd, 'wf').name('Wireframe Mode').onChange(Q3D.application.setWireframeMode);
  },

  addFunctionsFolder: function () {
      var parameters = this.parameters;
      var funcFolder = this.gui.addFolder('Functions');


      funcFolder.add(this.parameters, 'FOTsearch').name('Search for FOT').onFinishChange(function (value) {
          Q3D.application.searchBuilding(value); //Kalder til qgis2threejs.js med værdien fra feltet
      });
      
      funcFolder.add(this.parameters, 'getbounds').name('Get Bounds!').onFinishChange(function (value) { Q3D.application.getbounds(value) }); //Kalder til qgis2threejs.js med værdien fra feltet

      funcFolder.add(this.parameters, 'saveProject').name('Save Project').onFinishChange(function (value) { Q3D.application.saveProject(value) }); //Kalder til qgis2threejs.js med værdien fra feltet

      
      funcFolder.add(this.parameters, 'Source').name('Select Data Source').onFinishChange(function (value) {
          $.getJSON({
              type: 'GET',
              url: 'http://localhost:8081/getData',
              data: { 'targetURL': value },
              contentType: "application/json; charset=utf-8",
              header: { 'Access-Control-Allow-Origin': '*' },

              success: function (jsonData) {
                  var properties = jsonData.pop();
                  var numAttribs = [];
                  for (var key in properties) {
                      if (properties[key].property != null) {
                          numAttribs.push(properties[key].parameter);
                      }
                  }

                  //var keys = Object.keys(jsonData[0]);
                  funcFolder.add(parameters, 'selected', numAttribs).onFinishChange(function (param) {
                      console.log(param);

                      var hit = false;
                      for (var i = 0; i < parameters.layers.model.length; i++) {
                          for (var j = 0; j < jsonData.length; j++){
                              if (parameters.layers.a[i]["Adresse"].toLowerCase() == jsonData[j].dawa.toLowerCase()) {
                                  //Change structure of properties, temp hack solution:

                                  var maxminObj;
                                  for (var element in properties) {
                                      if (properties[element].parameter == param){
                                          maxminObj = properties[element];
                                          break;
                                      }
                                  }
                                  if (maxminObj != undefined){
                                  var x = (jsonData[j][param] - maxminObj.min) / (maxminObj.min - maxminObj.max);
                                  //console.log(x);
                                  /*if (!hit) {
                                    console.log(parameters.layers.a[i]["Adresse"]);
                                    console.log(jsonData[j].dawa);
                                    hit = true;
                                } */

                                  var rgb = canvas.getContext('2d').getImageData(((x * 100) | 0), 10, 1, 1).data; // [R, G, B, A]
                                  console.log(rgb);
                                  parameters.layers.model[i].material.color.setRGB(rgb[0], rgb[1], rgb[2]);
                              }
                              }
                          }
                      }
                      /*
                      for each building
                        if address match
                            

                      */
                  });
              },

              error: function (error) {
                  console.log(error);
                  alert('Error loading source');
              }
          });
      }),

      funcFolder.add(this.parameters, 'getParseResult').name('Retrieve Data');
      funcFolder.add(this.parameters, 'getParseSources').name('Retrive Sources').onChange(function () { console.log(getSources()) });
      funcFolder.add(this.parameters, 'getGML').name('Get FOT Buildings').onChange(function () { app.getBuildings() });
      funcFolder.add(this.parameters, 'addressWash').name('Build Address Entires').onChange(function () {
          if (app.wmsready) {
              console.log("Building those addresses!");
              for (var i = 0; i < app.project.layers[0].model.length; i++) {
                  
                  app.getAddress(i);
              }

              console.log("Done building addresses");
          }
      });


      //Color a building with the given address
      funcFolder.add(parameters, 'colorBuilding').name('Color a building by address').onFinishChange(function (address) {
          for (var i = 0; i < parameters.layers[0].model.length; i++) {
              if (parameters.layers.a[i]["Adresse"] == address) {
                  parameters.layers.model[i].material.color.setHex(0xff0000);

              }
          }
      });

      //Rebuild the entire scene from the input address
      funcFolder.add(parameters, 'generateScene').name('Generate a new scene area').onFinishChange(function (address) {
          var url = "http://dawa.aws.dk/datavask/adresser?betegnelse=" + address;

          $.ajax({
              url: url,
              dataType: "json",
          }).success(function (response) {
              console.log(response);
              $.ajax({
                  // url: "http://dawa.aws.dk/adresser/" + response.resultater[0].adresse.id,
                  url: "http://dawa.aws.dk/adgangsadresser?id="+response.resultater[0].adresse.adgangsadresseid+"&srid=25832",
                  dataType: "json",
              }).success(function (response) {
                  /*
                  CREATE A STOP RENDER INSTEAD OF 10 RUNTHROUGHS OF THIS
                  */
                  for (var i = 0; i < 10; i++){
                      app.scene.children.forEach(function (child) {
                          if (child instanceof THREE.Mesh) {
                              app.scene.remove(child);
                              app.octree.remove(child);
                          }
                      });
                  }
                  var x = response[0].adgangspunkt.koordinater[0];
                  var y = response[0].adgangspunkt.koordinater[1];
                  
                  app.project.origin.x = x;
                  app.project.origin.y = y;

                  var tilex = parseFloat((app.project.baseExtent[2] - app.project.baseExtent[0])/2);
                  var tiley = parseFloat((app.project.baseExtent[3] - app.project.baseExtent[1])/2);


                  var xmin = app.project.baseExtent[0] = x - tilex;
                  var ymin = app.project.baseExtent[1] = y - tiley;
                  var xmax = app.project.baseExtent[2] = x + tilex;
                  var ymax = app.project.baseExtent[3] = y + tiley;
                  app.calculatebbox(1);
                  var url = "http://services.kortforsyningen.dk/service?servicename=topo_geo_gml2&VERSION=1.0.0&SERVICE=WFS&REQUEST=GetFeature&TYPENAME=kms:Bygning&login=student134859&password=3dgis&maxfeatures=5000";
 


                  app.getBuildings(xmin, ymin, xmax, ymax, 0, 0, url, "FOT10",false);
                  

                 

                  app.project.layers = [];
              }).fail(function (error) {

                  console.log(error);
              })


          }).fail(function(error){ 
          
          
          });

      });

  },

    addCustomLayers: function (layer) {
        var parameters = this.parameters;
        parameters.layers = layer;
        console.log(parameters.layers);
        console.log("called");

        //Check that the folder does not exist already
        if (parameters.folderExists == false) {
            var wfsFolder = this.gui.addFolder('Custom Layers');
            parameters.folderExists = true;

        }
        
        project.layers.forEach(function (layer, i) {
      
            var folder = Q3D.gui.gui.__folders["Custom Layers"];
 
        //Change Opacity
            folder.add(parameters, 'opacity').name('Show Layer').min(0).max(1).name('Opacity (0-1)').onChange(function (opacityValue) {

            for (var i = 0; i < parameters.layers.model.length; i++) {
                console.log("Setting invisible");
                parameters.layers.model[i].material.transparent = true;
                parameters.layers.model[i].material.opacity = opacityValue;
            }
        });
        //Change Color
            folder.addColor(parameters, 'color').name('Color').onChange(function (color) {
            console.log(color);
            console.log(parameters.WFSlayer);
            for (var i = 0; i < parameters.layers.model.length; i++) {
                console.log("Setting invisible");
                color = color.replace('#', '0x');
                parameters.layers.model[i].material.color.setHex(color);

            }
        });
        //Change height
            folder.add(parameters, 'height').name('Height').min(1).max(15).onChange(function (height) {

            for (var i = 0; i < parameters.layers.model.length; i++) {
                parameters.layers.model[i].scale.set(1, 1, height);
            }
        });

        //Change Randomize Height
            folder.add(parameters, 'random').name('Random Height').onChange(function () {

            for (var i = 0; i < parameters.layers.model.length; i++) {
                parameters.layers.model[i].scale.set(1, 1, 2 * Math.random() + 1);
            }
        });
        });

       

  },

  addHelpButton: function () {
    this.gui.add(this.parameters, 'i').name('Help');
  }


};

//Extra functions. Refactor to seperate file.
function colorAll(parameter){
    console.log(color);
    console.log(parameters.WFSlayer);
    for (var i = 0; i < parameters.layers.model.length; i++) {
        console.log("Setting invisible");
        color = color.replace('#', '0x');
        parameters.layers.model[i].material.color.setHex(color);

    }
}

function add() {

}
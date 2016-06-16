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
    resolution: function () { }
  },
  
  // initialize gui
  // - setupDefaultItems: default is true
  init: function (setupDefaultItems) {
    this.gui = new dat.GUI();
    this.gui.domElement.parentElement.style.zIndex = 1000;   // display the panel on the front of labels
    if (setupDefaultItems === undefined || setupDefaultItems == true) {
      //this.addLayersFolder();
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

      funcFolder.add(this.parameters, 'resolution').name('New Scene').onFinishChange(function () { openStartMenu(); });
      funcFolder.add(this.parameters, 'resolution').name('Save Project').onChange(function (value) { openSaveMenu(); }); 
      funcFolder.add(this.parameters, 'resolution').name('Load Project').onChange(function (value) { openLoadMenu(); });

      funcFolder.add(this.parameters, 'resolution').name('Toggle Spectrum').onChange(function (value) { toggleSpectrum(); });
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

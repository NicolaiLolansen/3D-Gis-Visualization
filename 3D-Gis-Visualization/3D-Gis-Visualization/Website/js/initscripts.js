var initScene = function () {
    var url = 'https://api-geovizjs.rhcloud.com/loadScene/';
    var _scene = 'default.json'; //Name of default scene
    if (window.sessionStorage.userRole == "builder") {
        //Load default scene
    }
    else if (window.sessionStorage.userRole == "observer") {
        //Load scene chosen at login screen (window.sessionStorage.scene)
        _scene = window.sessionStorage.scene;
    }

    //EKSTERN LOAD
    url = url + '?scene=' + _scene;
    $.ajax({
        url: url,
        type: 'GET',
        success: function (json_scene) {
            var loader = document.getElementById('loader');
            loader.style.display = 'none';
            app.loadProject(JSON.parse(json_scene));
            app.start();
            app.addEventListeners();
        },
        error: function (err) {
            console.log(err);;
        }
    });
}

var initModal = function () {
    // Get the modals
    var modal1 = document.getElementById('modal-menu');
    var modal2 = document.getElementById('modal-viz')

    // Get the <span> element that closes the modals
    var spans = document.getElementsByClassName('close');

    // Get the loading circle
    var loader = document.getElementById('loader');

    // When the user clicks on <span> (x), close the modal
    spans[0].onclick = function () {
        clearSelectMenus();
        modal1.style.display = 'none';
    }
    spans[1].onclick = function () {
        modal2.style.display = 'none';
    }

    //--------------------------------------- TESTING FUNCTIONS ------------------------------------
    window.onkeyup = function (e) {
        var key = e.keyCode ? e.keyCode : e.which;

        if (key == 77) {
            openVizMenu();
        } 
    }

    //----------------------------------------------------------------------------------------------
   
}

var startCorrelation = function (sourceURL, tile_zip, callback) {
    var url = 'http://api-geovizjs.rhcloud.com/getSourceHeaders?sourceURL=' + sourceURL;
    clearSelectMenus();
    $.ajax({
        url: url,
        type: 'GET',
        dataType: 'json',
        success: function (json) {
            //Clear options from previous data loads
            fillSelectMenus(json);

            //Init button for starting construction
            var buildbtn = document.getElementById('build');
            buildbtn.onclick = function () {
                var street = document.getElementById('select_street');
                var num = document.getElementById('select_streetnum');
                var zip = document.getElementById('select_zip');

                var street_sel = street.options[street.selectedIndex].value;
                var num_sel = num.options[num.selectedIndex].value;
                var zip_sel = zip.options[zip.selectedIndex].value;

                if (street_sel == "default" || num_sel == "default" || zip_sel == "default") {
                    alert("Argument(s) missing");
                } else {
                    var block = {
                        street: street_sel,  //document.getElementById('select_street').value,
                        num: num_sel,        //document.getElementById('select_streetnum').value,
                        zip: zip_sel,         //document.getElementById('select_zip').value
                        sourceURL: sourceURL,
                        tile_zip: tile_zip
                    }
                    startBuild(block, callback);
                }
            }

            document.getElementById('modal-viz').style.display = 'none';
            //Init select menus for address construction
            var modal = document.getElementById('modal-menu');
            modal.style.display = "block";
        },
        error: function (err) {
            console.log('ERROR');
            console.log(err);
        }
    });
}
var startBuild = function (param_block, callback) {
    var url = 'http://localhost:8085/parseCSV'; //'http://api-geovizjs.rhcloud.com/parseCSV';
    document.getElementById("build").innerHTML = "Constructing Addresses";
    document.getElementById("loader").style.display = "block";

    $.ajax({
        url: url,
        type: 'GET',
        data: param_block,
        dataType: 'json',
        success: function (csv_as_json) {
            document.getElementById("build").innerHTML = "Construction Successful";
            document.getElementById("loader").style.display = "none";
            callback(csv_as_json);
        },
        error: function (err) {
            document.getElementById("build").innerHTML = "Construction Failed. Try Again?";
            document.getElementById("loader").style.display = "none";
            console.log(err);

        }
    });
}

var clearSelectMenus = function () {
    var street = document.getElementById('select_street');
    var num = document.getElementById('select_streetnum');
    var zip = document.getElementById('select_zip');

    street.options.length = 1;
    num.options.length = 1;
    zip.options.length = 1;
}

var fillSelectMenus = function (json) {
    console.log(json);
    //Address Builder Modal
    var street = document.getElementById('select_street');
    var num = document.getElementById('select_streetnum');
    var zip = document.getElementById('select_zip');

    //Data Visualizer Modal
    var colour = document.getElementById('colour_data');
    var height = document.getElementById('height_data');

    for (var key in json) {
        street.options.add(new Option(json[key], json[key]));
        num.options.add(new Option(json[key], json[key]));
        zip.options.add(new Option(json[key], json[key]));

        colour.options.add(new Option(json[key], json[key]));
        height.options.add(new Option(json[key], json[key]));
    }
};

var startViz = function (callback) {
    // avoid having two open modal menus at once
    document.getElementById('modal-menu').style.display = 'none';

    // Add button to begin visualization (created here to gain scope to callback)
    var vizButton = document.getElementById('start_viz');
    var loader = document.getElementById('loader');

    vizButton.onclick = function () {
        // Inform user that loading has begun
        vizButton.innerHTML = 'Loading Visualization';
        loader.style.display = 'block';


        var colour_data = document.getElementById('colour_data');
        var height_data = document.getElementById('height_data');

        var colour_selected = colour_data.options[colour_data.selectedIndex].value;
        var height_selected = height_data.options[height_data.selectedIndex].value;

        if (colour_selected == 'default' && height_selected == 'default') {
            alert('No data source selected');
        } else {
            callback(colour_selected, height_selected, function () {
                vizButton.innerHTML = 'Visualization Complete';
                loader.style.display = 'none';
                console.log('Finished Viz');
            });
        }
    }
    var modal = document.getElementById('modal-viz');
    modal.style.display = 'block';
}
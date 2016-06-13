/*
*  First function at application start
*  Loads a chosen scene if observer, starts init menu if builder
*/

var initScene = function () {
    //window.sessionStorage.userRole = 'builder'; //TODO: REMOVE ME MOTHERFUCKERS

    var url = 'https://api-geovizjs.rhcloud.com/loadScene/';
    var _scene = 'default.json'; //Name of default scene
    if (window.sessionStorage.userRole == "builder") {
        // Load default scene
        document.getElementById('loader').style.display = 'none';
        document.getElementById('start-modal').style.display = 'block';

    }
    else if (window.sessionStorage.userRole == "observer") {
        // Load scene chosen at login screen (window.sessionStorage.scene)
        _scene = window.sessionStorage.scene;

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
}

/*
*  Initializes static parts of modal menus and button functions
*/
var initGUI = function () {
    // Get the modals
    var modal1 = document.getElementById('modal-menu');
    var modal2 = document.getElementById('modal-viz')
    var modal3 = document.getElementById('start-modal');
    var modal4 = document.getElementById('save-modal');
    var modal5 = document.getElementById('load-modal');

    // Get the <span> element that closes the modals
    var spans = document.getElementsByClassName('close');

    // Get the loading circle
    var loader = document.getElementById('loader');

    // When the user clicks on <span> (x), close the modal
    spans[0].onclick = function () {
        //resetSelectMenu();
        clearSelectMenus();
        modal1.style.display = 'none';
    }
    spans[1].onclick = function () {
        //resetVizMenu();
        modal2.style.display = 'none';
    }
    spans[2].onclick = function () {
        resetStartMenu();
        modal3.style.display = 'none';
    }
    spans[3].onclick = function () {
        resetSaveMenu();
        modal4.style.display = 'none';
    }
    spans[4].onclick = function () {
        resetLoadMenu();
        modal5.style.display = 'none';
    }



    // init startmenu
    initStartMenu();
    initLoadMenu();

    //--------------------------------------- TESTING FUNCTIONS ------------------------------------
    window.onkeyup = function (e) {
        var key = e.keyCode ? e.keyCode : e.which;

        if (key == 77) {
            startViz();
        } else if (key == 220) {
            document.getElementById('loader').style.display = 'none';
        }
    }

    //----------------------------------------------------------------------------------------------
}
/*
*   Takes url of external .csv file, list of zip codes within tile, and a callback
*   And opens a modal menu from the headers of the CSV.
*/
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
                    document.getElementById("loader").style.display = "none";
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

/*
*   Takes parameters from the address construction modal
*   and parses csv while constructing addresses from chosen params.
*   then returns csv as json to the given callback
*/
var startBuild = function (param_block, callback) {
    var url = 'http://api-geovizjs.rhcloud.com/parseCSV';
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

/*
*   Removes all options except default from address-construction modal
*/
var clearSelectMenus = function () {
    var street = document.getElementById('select_street');
    var num = document.getElementById('select_streetnum');
    var zip = document.getElementById('select_zip');

    street.options.length = 1;
    num.options.length = 1;
    zip.options.length = 1;
}

/*
*
*/
var fillSelectMenus = function (json) {

    //Address Builder Modal
    var street = document.getElementById('select_street');
    var num = document.getElementById('select_streetnum');
    var zip = document.getElementById('select_zip');

    for (var key in json) {
        street.options.add(new Option(json[key], json[key]));
        num.options.add(new Option(json[key], json[key]));
        zip.options.add(new Option(json[key], json[key]));
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
    document.getElementById('modal-viz').style.display = 'block';
}

var fillVizOptions = function (maxminlist) {
    //Data Visualizer Modal
    var colour = document.getElementById('colour_data');
    var height = document.getElementById('height_data');

    for (var key in maxminlist) {

        colour.options.add(new Option(key, key));
        height.options.add(new Option(key, key));
    }
}

var initSaveList = function () {
    //Grab savedlist div
    var savedlist = document.getElementById('select-save');
    //Empty existing elements
    while (savedlist.firstChild) {
        savedlist.removeChild(savedlist.firstChild);
    }
    var selectMenu = document.createElement('select');

    $.getJSON({
        url: 'https://api-geovizjs.rhcloud.com/savesList/',
        type: 'GET',
        crossDomain: true,
        contentType: "application/json; charset=utf-8",
        header: { 'Access-Control-Allow-Origin': '*' },

        success: function (scene_list) {

            for (var scene in scene_list.saves) {
                var scene_name = scene_list.saves[scene];
                if ((typeof scene_name == 'string' && scene_name.match(/.json/gi))) {
                    var sel_name = scene_name.replace('.json', '');
                    selectMenu.options.add(new Option(sel_name, sel_name));
                }
            }
            savedlist.appendChild(selectMenu);
            var btn = document.getElementById('load-scene');
            btn.innerHTML = 'Select Scene From Menu Below';
        },
        error: function (err) {
            var btn = document.getElementById('load-scene');
            btn.innerHTML = 'No Saved Scenes';
        }
    });
};


var initTextfield = function () {
    var element = document.getElementById('enter-address');
    var textField = document.createElement('i')
}

var resetStartMenu = function () {
    document.getElementById('new-scene').disabled = false;
    document.getElementById('start-scene').disabled = true;
    document.getElementById('load-scene').style.display = 'block';
    document.getElementById('new-scene').style.display = 'block';
    document.getElementById('address-field').style.display = 'none';
}

var initStartMenu = function () {
    var btn_newScene  = document.getElementById('new-scene');
    var btn_loadScene = document.getElementById('load-scene');
    var address_div = document.getElementById('new-scene-div');
    var startScene = document.getElementById('start-scene');
    startScene.disabled = true;

    btn_newScene.onclick = function () {
        btn_loadScene.style.display = 'none';
        btn_newScene.style.display = 'none';
        btn_newScene.disabled = true;
        startScene.disabled = false;
    }

    btn_loadScene.onclick = function () {
        document.getElementById('start-modal').style.display = 'none';
        document.getElementById('load-modal').style.display = 'block';
    }
}

var resetLoadMenu = function () {

}

var initLoadMenu = function () {
    var uploader = document.getElementById('dropzone');
    var local_btn = document.getElementById('load-local');
    var remote_btn = document.getElementById('load-remote');

    uploader.style.display = 'none';
    local_btn.onclick = function () {
        local_btn.style.display = 'none';
        remote_btn.style.display = 'none';
        uploader.style.display = 'block';
    }

    Dropzone.options.myAwesomeDropzone = {
        paramName: "file", // The name that will be used to transfer the file
        maxFilesize: 25, // MB
        uploadMultiple: false,
        acceptedFiles: 'application/json', 
        accept: function (file, done) {
            if (file.name == "dtu.json") {
                done("Fuck you");
            }
            else { done(); }
        }
    };


}
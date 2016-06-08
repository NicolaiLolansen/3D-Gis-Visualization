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



    // Get the modal
    var modal = document.getElementById('modal-menu');

    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];

    // When the user clicks on <span> (x), close the modal
    span.onclick = function () {
        modal.style.display = "none";
    }

    //Hide the modal loader
    document.getElementById("loader").style.display = "none";

    //--------------------------------------- TESTING FUNCTIONS ------------------------------------
    window.onkeyup = function (e) {
        var key = e.keyCode ? e.keyCode : e.which;

        if (key == 77) {
            startCorrelation('https://dl.dropboxusercontent.com/s/88vgr6io5q63cjg/energimaerke.csv');
        } 
    }

    //----------------------------------------------------------------------------------------------
   
}
 
var startCorrelation = function (sourceURL, bbox, tile_zip, callback) {
    var url = 'http://api-geovizjs.rhcloud.com/getSourceHeaders?sourceURL=' + sourceURL;
    console.log(tile_zip);
    $.ajax({
        url: url,
        type: 'GET',
        dataType: 'json',
        success: function (json) {
            //Clear options from previous data loads
            clearSelectMenus();

            //Init select menus for address construction
            var modal = document.getElementById('modal-menu');
            var street = document.getElementById('select_street');
            var num = document.getElementById('select_streetnum');
            var zip = document.getElementById('select_zip');

            for (var key in json) {
                street.options.add(new Option(json[key], json[key]));
                num.options.add(new Option(json[key], json[key]));
                zip.options.add(new Option(json[key], json[key]));
            }

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
                        tile_zip: tile_zip,
                        bbox: bbox
                    }
                    startBuild(block, callback);
                }
            }


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
            console.log(csv_as_json);
            document.getElementById("build").innerHTML = "Construction Successful";
            document.getElementById("loader").style.display = "none";
            callback(csv_as_json);
        },
        error: function (err) {
            document.getElementById("build").innerHTML = "Construction Failed. Try Again?";
            document.getElementById("loader").style.display = "none";
            console.log('ERROR: ' + err);

        }
    });
}

var clearSelectMenus = function (){
    var street = document.getElementById('select_street');
    var num = document.getElementById('select_streetnum');
    var zip = document.getElementById('select_zip');

    var length = street.options.length;
    for (i = 0; i < length; i++) {
        street.options[i] = null;
        num.options[i]    = null;
        zip.options[i]    = null;
    }
}

dataToBuilding = function (json) {
    var maxminlist = json.pop();

}
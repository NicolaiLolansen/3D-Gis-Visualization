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
    
    var buildbtn = document.getElementById('build');
    buildbtn.onclick = function () {
        var street = document.getElementById('select_street');
        var num = document.getElementById('select_streetnum');
        var zip = document.getElementById('select_zip');

        var street_sel = street.options[street.selectedIndex].value;
        var num_sel = num.options[num.selectedIndex].value;
        var zip_sel = zip.options[zip.selectedIndex].value; 

        if (street_sel == "default" || num_sel == "default" || zip_sel == "default") {
            alert("Argument missing");
        } else {
            var block = {
                street: street_sel,  //document.getElementById('select_street').value,
                num: num_sel,        //document.getElementById('select_streetnum').value,
                zip: zip_sel         //document.getElementById('select_zip').value
            }
            setTimeout(function () {
                document.getElementById("loader").style.display = "none";
                //TODO: Handling of too long load times
            }, 3000);

            startBuild();
        }
    }
}

var startCorrelation = function (sourceURL, bbox, tile_zip) {
    var url = 'http://api-geovizjs.rhcloud.com/getSourceHeaders?sourceURL=' + sourceURL;
    $.ajax({
        url: url,
        type: 'GET',
        dataType: 'json',
        success: function (json) {
            console.log("SUCCESS");
            var modal = document.getElementById('modal-menu');
            var street = document.getElementById('select_street');
            var num = document.getElementById('select_streetnum');
            var zip = document.getElementById('select_zip');

            for (var key in json) {
                street.options.add(new Option(json[key], json[key]));
                num.options.add(new Option(json[key], json[key]));
                zip.options.add(new Option(json[key], json[key]));
            }
            modal.style.display = "block";
        },
        error: function (err) {
            console.log('ERROR');
            console.log(err);
        }
    });
}

var startBuild = function (sourceURL) {
    var url = 'http://api-geovizjs.rhcloud.com/parseCSV?sourceURL=' + sourceURL;
    document.getElementById("build").innerHTML = "Constructing Addresses";
    document.getElementById("loader").style.display = "block";
    //app.highlightPlane

    $.ajax({
        url: url,
        type: 'GET',
        dataType: 'json',
        success: function (csv_as_json) {
            document.getElementById("build").innerHTML = "Construction Successful";
            

        },
        error: function (err) {
            document.getElementById("build").innerHTML = "Construction Failed. Try Again?";
            console.log('ERROR: ' + err);
        }
    });
}
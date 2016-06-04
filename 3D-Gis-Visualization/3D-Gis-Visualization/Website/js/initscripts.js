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

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {

    }

    //--------------------------------------- TESTING FUNCTIONS ------------------------------------
    // Get the button that opens the modal
    var btn = document.getElementById("myBtn");

    // When the user clicks the button, open the modal
    btn.onclick = function () {
        startCorrelation('https://dl.dropboxusercontent.com/s/88vgr6io5q63cjg/energimaerke.csv'); //ONLY FOR TESTING
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
            console.log(block);
        }
    }
}

var startCorrelation = function (source_url) {
    var url = 'http://localhost:8085/getSourceHeaders?targetURL=' + source_url;
    console.log("performing get request");
    $.ajax({
        url: 'http://localhost:8085/getSourceHeaders/?targetURL=https://dl.dropboxusercontent.com/s/88vgr6io5q63cjg/energimaerke.csv',
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

var startBuild = function () {
    console.log("bygger")
    /*
    var x = document.getElementById("select_street").selectedIndex;
    var y = document.getElementById("select_streetnum").selectedIndex;
    var z = document.getElementById("select_zip").selectedIndex;
    
    var block = {
        street: $('select[name=select_street]').val(),  //document.getElementById('select_street').value,
        num: $('select[name=select_streetnum]').val(),  //document.getElementById('select_streetnum').value,
        zip: $('select[name=select_zip]').val()         //document.getElementById('select_zip').value
    }*/
}


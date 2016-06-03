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

    // Get the button that opens the modal
    var btn = document.getElementById("myBtn");

    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];

    // When the user clicks the button, open the modal
    btn.onclick = function () {
        startCorrelation('https://dl.dropboxusercontent.com/s/88vgr6io5q63cjg/energimaerke.csv'); //ONLY FOR TESTING
    }

    // When the user clicks on <span> (x), close the modal
    span.onclick = function () {
        modal.style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}

var startCorrelation = function (source_url) {
    var url = 'http://localhost:8085/getSourceHeaders?targetURL=' + source_url;
    console.log("performing get request");
    $.ajax({
        url: source_url,
        type: 'GET',
        dataType: 'json',
        success: function (headerList) {
            console.log(headerList);
            var modal = document.getElementById('modal-menu');
            var street = document.getElementById('select_street');
            var num = document.getElementById('select_streetnum');
            var zip = document.getElementById('select_zip');

            modal.style.display = "block";
        },
        error: function (err) {
            console.log('ERROR');
            console.log(err);
        }
    });
}
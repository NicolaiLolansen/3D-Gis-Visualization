initScene = function () {
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
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        header: { 'Access-Control-Allow-Origin': '*' },

        success: function (json_scene) {
            console.log(json_scene);
            app.loadProject(JSON.parse(json_scene));
            app.start();
            app.addEventListeners();
        },
        error: function (err) {
            console.log(err);;
        }
    });
}
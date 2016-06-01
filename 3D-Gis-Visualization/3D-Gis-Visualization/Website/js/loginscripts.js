function validate() {
    var input = document.getElementById("login-form");
    var form = {
        name: input.username.value,
        pass: input.password.value
    };
    console.log(form);
    
	$.ajax({
	    url: 'http://api-geovizjs.rhcloud.com/login/',
	    type: 'POST',
	    contentType: 'application/json',
	    dataType: 'text',
        data: JSON.stringify(form),
        
        success: function (result) {
            console.log("Success");
            console.log(result);
            window.sessionStorage.userRole = 'builder';
            window.location = '../3D/index.html';
        },
        error: function (err) {
            console.log("Failed")
            var l = 10;
            for (var i = 0; i < 10; i++)
                $("form").animate({
                    'margin-left': "+=" + (l = -l) + 'px',
                    'margin-right': "-=" + l + 'px'
                }, 40);
        }
	});
	console.log("Validation finished");
}

function getScenes() {
    var element = document.getElementById("button_panel");

    $.getJSON({
        url: 'https://api-geovizjs.rhcloud.com/savesList/',
        type: 'GET',
        crossDomain: true,
        contentType: "application/json; charset=utf-8",
        header: { 'Access-Control-Allow-Origin': '*' },

        success: function (scene_list) {
            console.log(scene_list);
            
            for (var scene in scene_list.saves) {
                var name = scene_list.saves[scene];
                var button = document.createElement('BUTTON');
                var text = document.createTextNode(name.replace('.json', ''));
                button.id = name;
                button.name = name;
                button.type = 'button';
                button.onclick = function () {
                    window.sessionStorage.scene = this.name;
                    window.sessionStorage.userRole = 'observer';
                    window.location = '../3D/index.html';
                };
                button.appendChild(text);
                element.appendChild(button);
            }
        },
        error: function (err) {
            var button = document.createElement('BUTTON');
            var text = document.createTextNode('No Saved Scenes');
            button.type = 'button';
            button.onclick = function () {
                window.location = '../Website/index.html';
            }
            button.appendChild(text);
            element.appendChild(button);
        }
    });
}
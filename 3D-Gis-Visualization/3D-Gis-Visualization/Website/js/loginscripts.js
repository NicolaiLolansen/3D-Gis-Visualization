function validate() {
    var form = {
        name: document.getElementById("username").value,
        pass: document.getElementById("password").value
    };

	$.ajax({
	    url: 'http://localhost:8085/login/',
	    type: 'POST',
        crossDomain: true,
	    dataType: 'text',
        data: JSON.stringify(form),

        success: function (result) {
            console.log("success");
            console.log(result);
            if (result) {
                console.log(result);
                window.location = '../Website/testpage.html';
            } else {
                alert("Unsuccesful login")
            }
        },
        error: function (err) {
            console.log("error:")
            console.log(err);
        }
	});
	console.log("Validation finished");
}

function getScenes() {
    var element = document.getElementById("button_panel");

    $.getJSON({
        url: 'http://localhost:8085/savesList/',
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
                    console.log(this.name);
                    window.location = '../3D/index.html';
                };
                button.appendChild(text);
                element.appendChild(button);
                console.log(button);
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
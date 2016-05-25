function validate() {
    var form = {
        name: document.getElementById("username").value,
        pass: document.getElementById("password").value
    };

	$.ajax({
	    url: 'http://localhost:8081/login/',
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
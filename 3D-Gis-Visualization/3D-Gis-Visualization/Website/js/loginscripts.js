function validate() {
    var form = {
        name: document.getElementById("username").value,
        pass: document.getElementById("password").value
    };

	$.ajax({
	    url: 'http://localhost:8081/login/',
	    type: 'POST',
	    dataType: JSON,
        data: JSON.stringify(form),

        success: function (result) {
            console.log(result);
            if (result) {
                window.location = '../testpage.html';
            } else {
                alert("Unsuccesful login")
            }
        }
	});
	console.log("Validation finished");
}
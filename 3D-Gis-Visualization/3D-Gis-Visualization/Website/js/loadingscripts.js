var initLoadTable = function () {
    var table = document.getElementById('btn-table');
    while (table.firstChild) {
        table.removeChild(table.firstChild);
    }

    $.getJSON({
        url: 'https://api-geovizjs.rhcloud.com/savesList/',
        type: 'GET',
        contentType: "application/json; charset=utf-8",
        header: { 'Access-Control-Allow-Origin': '*' },
        success: function (scene_list) {
            document.getElementById('empty-list').style.display = 'none';

            var count = 0;
            var row = document.createElement('tr');

            for (var scene in scene_list.saves) {
                var name = scene_list.saves[scene];
                var button = document.createElement('BUTTON');
                var text = document.createTextNode(name.replace('.json', ''));

                //Build button for a scene
                button.id = name;
                button.name = name;
                button.type = 'button';
                button.onclick = function () {
                    window.sessionStorage.scene = this.name;
                    window.sessionStorage.userRole = 'observer';
                    window.location = 'geoviz.html';
                };
                button.appendChild(text);
                var cell = document.createElement('td');
                cell.appendChild(button);
                row.appendChild(cell);
                count = (count + 1) % 3;
                if (count == 0) {
                    table.appendChild(row);
                    row = document.createElement('tr');
                }
            }
            table.appendChild(row);
        }

    });

}

// --------------------------------------- START D&D READER --------------------------------------------- 
// DRAG AND DROP FILEREADER. source: http://www.html5rocks.com/en/tutorials/file/dndfiles/
/*
var reader;

function abortRead() {
    reader.abort();
}

function errorHandler(evt) {
    switch (evt.target.error.code) {
        case evt.target.error.NOT_FOUND_ERR:
            alert('File Not Found!');
            break;
        case evt.target.error.NOT_READABLE_ERR:
            alert('File is not readable');
            break;
        case evt.target.error.ABORT_ERR:
            break; // noop
        default:
            alert('An error occurred reading this file.');
    };
}
var count = 0;
function updateProgress(evt) {
    var status = document.getElementById('status-message');
    // evt is an ProgressEvent.
    if (evt.lengthComputable) {
        var percentLoaded = Math.round((evt.loaded / evt.total) * 100);
        // Increase the progress bar length.
        if (percentLoaded < 100) {
            progress.style.width = percentLoaded + '%';
            progress.textContent = percentLoaded + '%';
            for (var i = 0; i <= count; i++) {
                status.innerHTML = status.innerHTML + '. ';
            }
            count = (count + 1) % 5;
            if (count == 0) {
                status.innerHTML = 'Loading';
            }
        }
    }
}

function handleFileSelect(evt) {
    // Reset progress indicator on new file selection.
    progress.style.width = '0%';
    progress.textContent = '0%';
    var status = document.getElementById('status-message');
    reader = new FileReader();
    reader.onerror = errorHandler;
    reader.onprogress = updateProgress;
    reader.onabort = function (e) {
        alert('File read cancelled');
    };
    reader.onloadstart = function (e) {
        status.innerHTML = 'Loading';
        document.getElementById('progress_bar').className = 'loading';
    };
    reader.onload = function (e) {
        // Ensure that the progress bar displays 100% at the end.
        progress.style.width = '100%';
        progress.textContent = '100%';
        var project = JSON.parse(e.target.result);
        var name = project.title;
        var block = {
            scene_name: name,
            scene: project
        };

        var saveBlock = JSON.stringify(block);


        $.ajax({
            type: 'POST',
            url: 'https://api-geovizjs.rhcloud.com/saveScene/',
            data: saveBlock,
            contentType: 'application/json',
            success: function (data) {
                alert("success");
                initLoadTable();
            },
            failure: function (errMsg) {
                alert("FAIL");
                console.log(errMsg);
            }
        });
    }

    // Read in the image file as a binary string.
    reader.readAsBinaryString(evt.target.files[0]);
}

document.getElementById('files').addEventListener('change', handleFileSelect, false);
*/
var progress = document.querySelector('.percent');

document.getElementById('files').addEventListener('change', function (e) {
    var status = document.getElementById('status-message');
    var file = this.files[0];
    var name = file.name;
    var reader = new FileReader();
    reader.onload = function (e) {
        status.innerHTML = 'Loading';
        document.getElementById('progress_bar').className = 'loading';
        var dot = true;
        var xhr = new XMLHttpRequest();

        // During Upload
        (xhr.upload || xhr).addEventListener('progress', function (e) {
            var done = e.position || e.loaded
            var total = e.totalSize || e.total;
            var percentLoaded = Math.round(done / total * 100);
            // Increase the progress bar length.
            if (percentLoaded < 100) {
                progress.style.width = percentLoaded + '%';
                progress.textContent = percentLoaded + '%';
                if (dot) {
                    status.innerHTML = 'Loading.'
                } else {
                    status.innerHTML = 'Loading'
                }
                dot = !dot;   
            }
        });

        // On finished upload
        xhr.addEventListener('load', function (e) {
            progress.style.width = '100%';
            progress.textContent = '100%';
            initLoadTable();
            status.innerHTML = 'Upload Complete';
            document.getElementById('progress_bar').className = 'nothing';
        });
        xhr.addEventListener('error', function (e) {
            document.getElementById('progress_bar').className = 'nothing';
            progress.style.width = '0%';
            progress.textContent = '0%';
            status.innerHTML = 'Error Occured During Upload';
            initLoadTable();
        });
        xhr.open('post', 'https://api-geovizjs.rhcloud.com/saveScene/', true);
        xhr.setRequestHeader("Content-type", "application/json");
        var project = e.target.result;
        var projectJSON = JSON.parse(project);
        var block = {
            scene_name: name,
            scene: projectJSON
        };
        var saveBlock = JSON.stringify(block);

        xhr.send(saveBlock);
    }
    reader.readAsText(file)
});

// --------------------------------------- END D&D READER --------------------------------------------- 
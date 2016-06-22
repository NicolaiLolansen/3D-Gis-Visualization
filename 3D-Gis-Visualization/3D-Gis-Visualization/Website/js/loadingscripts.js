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
        success: function (project_list) {
            document.getElementById('empty-list').style.display = 'none';

            var count = 0;
            var row = document.createElement('tr');

            for (var project in project_list.saves) {
                var name = project_list.saves[project];
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

//Upload tracker
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
        xhr.open('post', 'https://api-geovizjs.rhcloud.com/saveProject/', true);
        xhr.setRequestHeader("Content-type", "application/json");
        var project = e.target.result;
        var projectJSON = JSON.parse(project);
        var block = {
            project_name: name,
            project: projectJSON
        };
        var saveBlock = JSON.stringify(block);

        xhr.send(saveBlock);
    }
    reader.readAsText(file)
});

// --------------------------------------- END D&D READER --------------------------------------------- 
data = {
    sources: [],
    outputs: []
}


function getAllData() {

    //console.log(data.outputs);
    $.ajax({
        dataType: 'json',
        url: 'http://localhost:8081/getData',
        type: 'POST',
        data: 'http://dl.dropboxusercontent.com/s/8qyigf5hvqmty0z/csvtest1.csv?dl=1'
    }).success(function (res) {
        // we make a successful JSONP call!
        data.outputs = res;
        console.log(res);
    }).error(function (error){
        console.log(error);
    });

    //return data.outputs;
}

function getData(type) {
    var index = data.sources.indexOf(type);
    if (index > -1) {
        return data.sources.splice(index, 1);
    }
}

function getSources() {
    return data.sources;
}

Array.prototype.diff = function (a) {
    return this.filter(function (i) { return a.indexOf(i) < 0; });
};

function addSource(url) {
    $.ajaxSetup({
        data: {
            username: "sakura",
            password: "Hadoken!!!"
        },
        dataType: "jsonp"
    });

    var index = data.sources.indexOf(url);
    if (index == -1) {
        data.sources.push(url);
    }
}

function removeSource(url) {
    var index = data.sources.indexOf(url);
    if (index > -1) {
        data.sources.splice(index, 1);
    }
}

function singleParse(source) {
    Papa.parse(source, parseconfig);
}
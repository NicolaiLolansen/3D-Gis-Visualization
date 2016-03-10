parseconfig = {
        delimiter: "",
        newline: "",
        header: true,
        dynamicTyping: false,
        preview: 0,
        encoding: "",
        worker: false,
        comments: false,
        step: undefined,
        complete: parseComplete,
        error: undefined,
        download: true,
        skipEmptyLines: false,
        chunk: undefined,
        fastMode: undefined,
        beforeFirstChunk: undefined,
        withCredentials: undefined
}

data = {
    sources: [],
    outputs: []
}

function addSource(url) {
    data.sources.push(url);
}

function removeSource(url) {
    var index = data.sources.indexOf(url);
    if (index > -1) {
        data.sources.splice(index, 1);
    }
}

function parseComplete(results) {
    console.log("Parse Complete");
    data.outputs.push(results.data);
}

function startParse() {
    data.sources.forEach(function (entry) {
        singleParse(entry)
    });
}

function singleParse(source){
    Papa.parse(source, parseconfig);
}

function getAllData() {
    console.log(data.outputs);
    return data.outputs;
}

function getData(type) {
    var index = data.sources.indexOf(type);
    if (index > -1) {
        data.sources.splice(index, 1);
    }
}
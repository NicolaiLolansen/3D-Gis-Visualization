function test() {
    $.getJSON({
        
        type: 'GET',
        url: 'http://localhost:8081/getData',
        headers: { 'Access-Control-Allow-Origin': '*' },
        data: { 'targetURL': 'https://dl.dropboxusercontent.com/s/88vgr6io5q63cjg/energimaerke.csv' },
        contentType: "application/json; charset=utf-8",
        dataType: 'json',
        success: function (jsonData) {
            console.log(jsonData[0]);
        },
        error: function () {
            alert('Error loading');
        }
    });
}
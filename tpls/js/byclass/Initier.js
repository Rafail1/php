var fullData;
var words;
var Synonims;
var total;
var page = getPage(window.location.hash);
var pageSize = 100;


function initSynonims() {
    Synonims = [];
    for (var i in ServerSynonims) {
        var syn = i.trim().toLowerCase();
        for (var j in ServerSynonims[i]) {
            Synonims.push([ServerSynonims[i][j][0].trim().toLowerCase(), syn, ServerSynonims[i][j][1]]);
        }
    }
}

function initFullData() {
    fullData = [];
    words = {};
    total = 0;
    var usedIds = [];
    var id = 0;
    var itr_id = 0;
    var syn;
    var line;
    var arr;
    var SynonimsIds = [];
    var insyn = false;
    for (var i in jObject) {
        total += parseInt(jObject[i][1]);
        line = jObject[i][0].replace(",", " ");
        arr = line.split(' ');

        for (var j in arr) {
            if (arr[j].length < 4) {
                continue;
            }

            var str = arr[j].trim().toLowerCase();
            if (SynonimsIds[str]) {
                insyn = SynonimsIds[str];
            } else {
                insyn = in_synonims(str);
            }

            if (insyn) {
                id = parseInt(insyn[1]);
                SynonimsIds[str] = insyn;
                str = insyn[0].toHtmlEntities();
                if (usedIds.indexOf(id) === -1) {
                    usedIds.push(id);
                }

                syn = true;
            } else {
                do {
                    id = itr_id++;
                } while (usedIds.indexOf(id) !== -1)
                syn = false;
            }
            str = str.toHtmlEntities();
            if (!words[str]) {
                words[str] = [parseInt(jObject[i][1]), id, syn];
            } else {
                words[str][0] += parseInt(jObject[i][1]);
            }
        }
    }
    for (var i in words) {
        fullData.push({id: words[i][1], name: i, val: words[i][0], pc: words[i][0] / total * 100, syn: words[i][2]});
    }
    sortData(fullData);
}

function init() {
    initSynonims();
    initFullData();
}
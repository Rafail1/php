function setActiveArr(ids) {
    for (var i in fullData) {
        if (ids.indexOf(fullData[i]['id']) >= 0) {
            fullData[i].active = true;
        }
    }
}
function setActiveOnly(id) {
    for (var i in fullData) {
        if (parseInt(fullData[i]['id']) === parseInt(id)) {
            fullData[i].active = true;
        } else if (fullData[i].active) {
            fullData[i].active = false;
        }
    }
}
function setActive(id, active) {
    for (var i in fullData) {
        if (parseInt(fullData[i]['id']) === parseInt(id)) {
            fullData[i].active = active;
            break;
        }
    }
}


function getSynonims() {
    var text = "";
    for (var i in fullData) {
        if (fullData[i].active) {
            text += " " + fullData[i].name;
        }
    }
    return text.trim();
}
function addSynonim(syn, word, id) {
    if (!ServerSynonims[word]) {
        ServerSynonims[word] = [];
    }
    ServerSynonims[word].push([syn, id]);
}
function in_synonims(syn, word) {

    for (var i in Synonims) {
        if (Synonims[i][0] === syn || Synonims[i][1] === syn) {
            return [Synonims[i][1], Synonims[i][2]];
        } else if (word) {
            if (Synonims[i][0] === word || Synonims[i][1] === word) {
                return [Synonims[i][1], Synonims[i][2]];
            }
        }
    }
    return false;
}

function saveSynonyms() {
    var text = getSynonims();
    if (!text.length) {
        error("You need to select synonims!", $(".js-in-filter"));
        return;
    }
    var default_val = $("#filter_syn").val();
    var word = prompt("What word you wold like synonimize?", default_val);
    if (!word) {
        return;
    }
    word = word.trim().toLowerCase().toHtmlEntities();
    var data = {word: word, synonims: text, pid: pid};
    sendAjax("SaveSynonims", data, function (mess) {
        onSaveSynonims(word, mess.id);
        success(mess);
    });
}
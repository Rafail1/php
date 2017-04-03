/* global serverJSON, Mustache, pid */

var jObject = serverJSON.report ? serverJSON.report : [];
var ServerSynonims = serverJSON.synonims ? serverJSON.synonims : [];
/*Init*/
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
        if(jObject[i][0]) {
            try {
                line = jObject[i][0].toString().replace(",", " ");
                arr = line.split(' ');
            } catch(e){
                console.log(e);
            }
            
        }
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

            if (insyn && insyn[0] && insyn[1]) {
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
/*Helper*/

var RESTurl = "/stotik/logic/index.php";
// global functions
String.prototype.toHtmlEntities = function () {
    return this.replace(/[^a-zA-Zа-яА-Я0-9\-.]/gm, function (s) {
        return "&#" + s.charCodeAt(0) + ";";
    });
};
function showTemplate(tplName, tplData, el, callback) {
    if (!Mustache) {
        error("Mustache required!");
        return false;
    }
    $.ajax({
        url: '/stotik/tpls/js_tpls/' + tplName
    }).always(function (data) {
        var template = data;
        var html = Mustache.render(template, tplData);
        el.html(html);
        if (callback) {
            callback.call();
        }
    });
}
function sendAjax(action, data, callback) {
    data['action'] = action;
    $.ajax({
        url: RESTurl,
        data: data,
        type: "post"
    }).done(function (res) {
        try {
            res = JSON.parse(res);
        } catch (err) {
            res = {};
        }
        callback.call(this, res);
    }).fail(function (err) {
        error(err);
    });
}
function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}
function getPage(hash) {
    var page = 1;
    if (hash) {
        var parr = hash.match(/#page=([\d]*)/);
        if (parr[1] && isNumeric(parr[1])) {
            page = parseInt(parr[1]);
        }
    }
    return page;
}
function parseHtmlEntities(str) {
    return str.replace(/&#([0-9]{1,4});/gi, function (match, numStr) {
        var num = parseInt(numStr, 10);
        return String.fromCharCode(num);
    });
}
function sortData(data, by) {
    by = by ? by : 'val';
    data.sort(function (a, b) {
        if (a[by] === b[by]) {
            return 0;
        }
        return a[by] < b[by] ? 1 : -1;
    });
}
function error(mess, el) {
    alert(mess);
    el.addClass('error');
    setTimeout(function () {
        el.removeClass('error');
    }, 3000);
}
function success(mess) {
    if (mess.error) {
        alert(mess.error);
    } else {
        console.log('Ok');
    }

}
/*Renderer*/

function renderPage(tplData) {
    
    if (!tplData) {
        var pageCnt = Math.ceil(fullData.length / pageSize);
        if (pageCnt < page) {
            tplData = [];
        } else {
            tplData = fullData.slice(pageSize * page - pageSize, pageSize * page);
        }
    } else {
        $(".pagination").remove();
    }
    for (var i in tplData) {
        tplData[i].name = parseHtmlEntities(tplData[i].name);
    }
    showTemplate('tpl_list.html', {tplData: tplData}, $('#content'), function () {
        paginator(pageCnt);
        clickable();
    });
}

function showSyn(e) {
    if (e.classList.contains('activated')) {
        e.classList.remove('activated');
        renderPage();
    } else {
        var toRender = [];
        for (var i in fullData) {
            if (fullData[i]['syn']) {
                toRender.push(fullData[i]);
            }
        }
        e.classList.add('activated');
        renderPage(toRender);
    }
}

function paginator(pageCnt) {
    var data = [];
    for (var i = 1; i <= pageCnt; i++) {
        data.push({name: i, href: '#page=' + i, active: i === page});
    }
    showTemplate('pagination.html', {tplData: data}, $('#pager'), function () {
        clickable();
    });
}

function renderSynonims(tplData) {
    
    var data = {tplData: [], word: tplData[0][1], word_id: tplData[0][2]};
    var used = {};
    for(var i in tplData) {
        used[tplData[i][0]] = i;
    }
    var chk = "";
    for(var i in jObject) {
        chk = " "+jObject[i][0]+" ";
       for(var j in tplData) {
           if(chk.indexOf(" "+tplData[j][0]+" ") >= 0) {
               tplData[j][3] += jObject[i][1];
           }
       }
    }

    for (var i = 0; i < tplData.length; i++) {
        data['tplData'].push({synonim: tplData[i][0], val: tplData[i][3], pc: tplData[i][3]/total*100});
    }
    showTemplate('synonims.html', data, $('#synonims'), function () {
        onrenderSynonims();
    });
}

/* Handlers */
function onrenderSynonims() {
    $('#words').hide();
    $('#synonims').show();
    $(".hide_badges").on('click', function(){
        $('.badge').addClass('hidden');
    });
    $(".show_badges").on('click', function(){
        $('.badge').removeClass('hidden');
    });
    $(".js-remove").on("click", function () {
        var forRemove = [];
        var wid = $("#word").attr("data-id");
        var word = $("#word").val();
        $(".synonim:checked").each(function () {
            forRemove.push($(this).val());
            $(this).closest(".js-block").remove();
        });
        if (forRemove.length) {
            sendAjax("RemoveSynonims", {id: wid, synonims: forRemove.join(' '), pid: pid}, function (mess) {
                var newSS = [];
                for (var i = 0; i < ServerSynonims[word].length; i++) {
                    if (forRemove.indexOf(ServerSynonims[word][i][0]) === -1) {
                        newSS.push(ServerSynonims[word][i]);
                    }
                }
                ServerSynonims[word] = newSS.slice();
                init();
                success(mess);
            });
        }
    });
    $(".back").on('click', function () {
        $('#synonims').hide();
        $('#words').show();
        renderPage();
    });

}

function onSaveSynonims(word, id) {
    var insyn;
    if (!id) {
        insyn = in_synonims(word);
        if (insyn) {
            word = insyn[0];
            id = insyn[1];
        } else {
            for (var i = 0; i < fullData.length; i++) {
                if (fullData[i].name === word) {
                    id = fullData[i].id;
                    break;
                }
            }
        }
    }
    for (var i = 0; i < fullData.length; i++) {
        if (!fullData[i]) {
            console.log(i);
        }
        if (fullData[i].active || fullData[i].name === word) {
            if (fullData[i].name !== word && !in_synonims(fullData[i].name)) {
                addSynonim(fullData[i].name, word, id);
            }
        }
    }
    init();
    renderPage();
}
/*DataWorker*/

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
/* EventListeners*/
function filter_syn() {
    $("#filter_syn").on("keyup", function () {
        var toRender = [];
        if ($(this).val().length > 2) {
            var comparable = $(this).val().trim().toLowerCase().toHtmlEntities();
            for (var i in fullData) {
                if (fullData[i]['name'].indexOf(comparable) !== -1) {
                    toRender.push(fullData[i]);
                }
            }
            renderPage(toRender);
        } else {
            renderPage();
        }
    });
}

function clickable() {
    $(".clickable").unbind("click");
    $(".hide_badges").on('click', function(){
        $('.badge').addClass('hidden');
    });
    $(".show_badges").on('click', function(){
        $('.badge').removeClass('hidden');
    });
    $(".clickable").on("click", function (e) {
        var parent = $(this).parent("ul");

        if (e.ctrlKey) {
            $(this).toggleClass("active");
            var dataId = $(this).attr("data-id");
            setActive(dataId, $(this).hasClass("active"));
        } else if (e.shiftKey) {
            var childs = parent[0].getElementsByClassName("clickable");
            var to = 0;
            var from = 0;
            for (var i = 0; i < childs.length; i++) {
                if (childs[i] === e.target) {
                    from = i;
                }
            }
            var bot = from;
            var ptop = from;

            for (var i = from + 1; i < childs.length; i++) {
                if (childs[i].classList.contains('active')) {
                    bot = i;
                    break;
                }
            }

            for (var i = from - 1; i >= 0; i--) {
                if (childs[i].classList.contains('active')) {
                    ptop = i;
                    break;
                }
            }
            if (bot !== from && ptop !== from) {
                var near = from - bot > ptop - from ? ptop - from : bot - from;
                if (near < 0) {
                    to = from;
                    from = from + near;
                } else {
                    to = from + near;
                }
            } else if (bot === from) {
                to = ptop;
            } else if (ptop === from) {
                to = from;
                from = bot;
            }
            if (from > to) {
                var tmp = from;
                from = to;
                to = tmp;
            }
            var activeArr = [];
            for (var i = from; i <= to; i++) {
                if (childs[i].classList.contains('hidden')) {
                    continue;
                }
                activeArr.push(parseInt(childs[i].getAttribute('data-id')));
                childs[i].classList.add('active');
            }
            setActiveArr(activeArr);
        } else {
            parent.find(".clickable.active").each(function () {
                $(this).removeClass("active");
            });
            $(this).addClass("active");
            setActiveOnly($(this).attr('data-id'));
        }
    });
    $(".editSyn").unbind("click");
    $(".editSyn").on("click", function (e) {
        e.stopPropagation();
        e.preventDefault();
        var data = [];
        var id = parseInt($(this).closest("li").attr("data-id"));
        for (var i in Synonims) {
            if (parseInt(Synonims[i][2]) === id) {
                data.push([Synonims[i][0], Synonims[i][1], Synonims[i][2], 0, 0]);
            }
        }
        if (data.length) {
            renderSynonims(data);
        }
    });
    $(".pagination a").unbind("click");
    $(".pagination a").on("click", function () {
        $(".pagination li").removeClass('active');
        $(this).closest('li').addClass('active');
        page = getPage($(this).attr("href"));
        renderPage();
    });
}
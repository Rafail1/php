
/* global Mustache */

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
function getPageData(fullData, page, pageSize) {
    var pageCnt = Math.ceil(fullData.length / pageSize);
    var res;
    if (pageCnt < page) {
        res = [];
    } else {
        res = fullData.slice(pageSize * page - pageSize, pageSize * page);
    }
    return res;
}
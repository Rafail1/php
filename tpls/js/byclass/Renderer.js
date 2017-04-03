/* global pageSize, fullData */

function renderPage(data) {
    
    if (!data) {
        var page = getPage();
        var pageCnt = Math.ceil(fullData.length / pageSize);
        data = getPageData(fullData, page, pageSize);
    } else {
        var pageCnt = false;
        $(".pagination").remove();
    }
    for (var i in data) {
        data[i].name = parseHtmlEntities(data[i].name);
    }
    showTemplate('tpl_list.html', {tplData: data}, $('#content'), function () {
        if(pageCnt) {
            paginator(pageCnt);
        }
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
    var page = getPage();
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

    for (var i = 0; i < tplData.length; i++) {
        data['tplData'].push({synonim: tplData[i][0]});
    }
    showTemplate('synonims.html', data, $('#synonims'), function () {
        onrenderSynonims();
    });
}
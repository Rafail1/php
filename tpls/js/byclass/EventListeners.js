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
                data.push(Synonims[i]);
            }
        }
        if (data.length) {
            renderSynonims(data);
        }
    })
    $(".pagination a").unbind("click");
    $(".pagination a").on("click", function () {
        $(".pagination li").removeClass('active');
        $(this).closest('li').addClass('active');
        page = getPage($(this).attr("href"));
        renderPage();
    });
}
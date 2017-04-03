function onrenderSynonims() {
    $('#words').hide();
    $('#synonims').show();

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
    })
    $(".back").on('click', function () {
        $('#synonims').hide();
        $('#words').show();
        renderPage();
    })

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
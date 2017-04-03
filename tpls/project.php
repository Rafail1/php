<html>
    <head>
        <link rel="stylesheet" href="<?= MY_ROOT_DIR ?>/tpls/css/bootstrap.min.css" />
        <link rel="stylesheet" href="<?= MY_ROOT_DIR ?>/tpls/css/style.css" />
        <script src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"></script>
        <script src="<?= MY_ROOT_DIR ?>/tpls/js/bootstrap.min.js"></script>
        <script src="<?= MY_ROOT_DIR ?>/tpls/js/mustache.js"></script>

    </head>
    <body class="container">
        <div id="words">
            <div id="top" class="row">
                <div class="form-group col-sm-12">
                    <label for="filter">Filter:</label>
                    <input type="text" class="form-control" id="filter_syn">
                </div>

                <div class="form-group col-sm-12">
                    <button class="btn btn-danger" onclick="saveSynonyms();">save Synonyms!</button>
                    <button class="btn btn-danger" onclick="showSyn(this);">show Synonyms!</button>
                </div>
            </div>
            <div class="row">
                <div id="content" class="col-sm-12"></div>
                <div id="pager" class="col-sm-12"></div>
            </div>
        </div>
        <div id="synonims"></div>
        <script>
            var serverJSON = <?= $json ?>;
            var pid = <?= $pid ?>;
        </script>
        <script src="<?= MY_ROOT_DIR ?>/tpls/js/script.js"></script>

        <script> 
            init();
            $(function () {
                renderPage();
                filter_syn();
            });
        </script>
    </body>
</html>
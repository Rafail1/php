<html>
    <head>
        <link rel="stylesheet" href="<?= MY_ROOT_DIR ?>/tpls/css/bootstrap.min.css" />
        <link rel="stylesheet" href="<?= MY_ROOT_DIR ?>/tpls/css/style.css" />
        <script src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"></script>
        <script src="<?= MY_ROOT_DIR ?>/tpls/js/bootstrap.min.js"></script>
        <script src="<?= MY_ROOT_DIR ?>/tpls/js/mustache.js"></script>
        <script src="<?= MY_ROOT_DIR ?>/tpls/js/script.js"></script>

    </head>
    <body>
        <div id="top">
            <form enctype="multipart/form-data" action="?action=addProject" method="post">
                <input type="file" name="file">
                <button type="submit">Add</button>
            </form>
        </div>
        <div class="col-md-12">
            <div id="content"></div>
        </div>
        <script>
            var serverJSON = <?= $json ?>;
            var tplData = [];
            for (var i in serverJSON) {
                tplData.push(serverJSON[i]);
            }
            showTemplate('project_list.html', {tplData: tplData}, $("#content"));
        </script>
    </body>
</html>
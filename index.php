<?php
set_time_limit(0);
require_once $_SERVER['DOCUMENT_ROOT'] . '/libs/PHPExcel/PHPExcel.php';
require_once 'autoload.php';
$rh = new Logic\Helpers\ReportHelper();
if (filter_input(INPUT_GET, "action") == "addProject") {
    $rh->addReport();
    header("Location:".str_replace("action=addProject", "", $_SERVER["REQUEST_URI"]));
} else {
    $reports = $rh->getReports();
    $json = json_encode($reports);
    include_once ABS_ROOT_DIR . '/tpls/index.php';
}

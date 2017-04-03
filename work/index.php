<?php
set_time_limit(0);

require_once $_SERVER['DOCUMENT_ROOT'] . '/libs/PHPExcel/PHPExcel.php';
require_once $_SERVER['DOCUMENT_ROOT'] .'/stotik/autoload.php';

if ($pid = filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT)) {
    $rh = new Logic\Helpers\ReportHelper();
    $report = $rh->getReport($pid);
    $json = json_encode($report);
    include_once ABS_ROOT_DIR . '/tpls/project.php';
} else {
    header("Location:".MY_ROOT_DIR);
}
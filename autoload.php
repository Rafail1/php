<?php

define('ABS_ROOT_DIR', $_SERVER['DOCUMENT_ROOT'] . "/stotik");
define('PROJECTS_DIR', ABS_ROOT_DIR . "/projects");
define('CACHE_DIR', ABS_ROOT_DIR . "/cache");

define('MY_ROOT_DIR', "/stotik");

function _autoload($class) {
    $farr = explode("\\", $class);

    $findex = count($farr) - 1;
    for ($i = 0; $i < $findex; $i++) {
        $farr[$i] = strtolower($farr[$i]);
    }
    $fname = implode("/", $farr);

    if (strpos($class, "\\") === 0) {
        $fname = "/" . $fname;
    }

    require_once $fname . '.php';
}

spl_autoload_register('_autoload');

<?php

require_once $_SERVER["DOCUMENT_ROOT"] . '/stotik/autoload.php';

if (filter_input(INPUT_POST, "action") == "SaveSynonims" && filter_input(INPUT_POST, "pid", FILTER_VALIDATE_INT) > 0) {

    $EditSynonims = new \Logic\EditSynonims(filter_input(INPUT_POST, "pid", FILTER_VALIDATE_INT));
    
    $args = ['word' => FILTER_SANITIZE_STRING,
        'action' => FILTER_SANITIZE_STRING,
        'synonims' => FILTER_SANITIZE_STRING];
    
    $resp = $EditSynonims->execute(filter_input_array(INPUT_POST, $args));
    
    if ($resp) {
        $response = json_encode($resp);
    } else {
        $response = json_encode(['error' => 'wrong']);
    }
} elseif (filter_input(INPUT_POST, "action") == "RemoveSynonims" && filter_input(INPUT_POST, "pid", FILTER_VALIDATE_INT) > 0) {
    $EditSynonims = new \Logic\EditSynonims(filter_input(INPUT_POST, "pid", FILTER_VALIDATE_INT));

    $args = ['id' => FILTER_VALIDATE_INT,
        'action' => FILTER_SANITIZE_STRING,
        'synonims' => FILTER_SANITIZE_STRING];
    $resp = $EditSynonims->execute(filter_input_array(INPUT_POST, $args));
    if ($resp) {
        $response = json_encode($resp);
    } else {
        $response = json_encode(['error' => 'wrong']);
    }
} else {
    $response = json_encode(['error' => 'wrong']);
}
echo $response;

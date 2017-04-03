<?php

namespace Logic;

class Report {

    private $arr;

    function __construct($arr) {
        $this->unique($arr);
    }

    private function unique($arr) {
        $tmp = [];
        for ($i = 1; $i < count($arr); $i++) {
            $str = trim($arr[$i][0]);
            $cnt = intval($arr[$i][1]);
            if (!$str) {
                continue;
            }
            if (!$tmp[$str]) {
                $tmp[$str] = $cnt;
            } else {
                $tmp[$str]+= $cnt;
            }
        }
        foreach($tmp as $w => $v) {
            $this->arr[] = [$w, $v];
        }
    }
    
    function getReport() {
        return $this->arr;
    }

}

<?php
namespace Readers;

class CSVReader {
    
    function read($File) {
        $res = [];
        if (($handle = fopen($File, "r")) !== FALSE) {
            while (($data = fgetcsv($handle, 2000, ";")) !== FALSE) {
                $res[] = $data;
            }
            fclose($handle);
        }
        return $res;
    }
}



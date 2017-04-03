<?php
namespace Readers;

class XLSXReader {
    
    function read($File) {
        
        try {
            $Excel = \PHPExcel_IOFactory::load($File);
        } catch (\Exception $ex) {
            echo $ex->getMessage();
            die();
        }

        $rows = [];
        foreach ($Excel->getAllSheets() as $list => $sheet) {
            $rows = array_merge($sheet->toArray(), $rows);
        }

        return $rows;
    }
}

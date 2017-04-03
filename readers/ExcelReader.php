<?php
namespace Readers;

class ExcelReader {

    private function getReader($fname) {
        if (!file_exists($fname)) {
            throw new \Exception("No such file");
        }

        $this->fname = $fname;
        preg_match('/\.([^.\s]{3,4})$/', $fname, $matches);
        $extension = $matches[1];

        switch ($extension) {
            case "csv":
                return new CSVReader();
            case "xls":
                return new XLSReader();
            case "xlsx":
                return new XLSXReader();
            default:
                throw new \Exception("Not supported extension");
        }
    }

    function getArray($fname) {
        $reader = $this->getReader($fname);
        return $reader->read($fname);
    }

}

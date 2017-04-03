<?php

namespace Logic\Helpers;

class FileHelper {

    private static $instance;

    private function __construct() {
        
    }

    public static function getInstance() {
        if (self::$instance == null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    public function getFile($fname, $unser) {
        if (file_exists($fname)) {
            if ($unser) {
                return unserialize(file_get_contents($fname));
            } else {
                return file_get_contents($fname);
            }
        } else {
            return false;
        }
    }

    public function makeName($fname) {
        
        while (file_exists($fname)) {
            preg_match("#(\([\d*]\))\..{1,4}$#", $fname, $matches);
            if ($matches[1]) {
                $n = $matches[1] + 1;
                $fname = preg_replace("#(\([\d*]\))\..{1,4}$#", "($n)", $fname);
            } else {
                $n = 1;
                $fname = preg_replace("#(\..{1,4})$#", "($n)$1", $fname);
            }
        }
        return $fname;
    }

    public function addFile($fname, $content) {
        try {
            $fp = fopen($fname, "w");
            fwrite($fp, $content);
            fclose($fp);
        } catch (\Exception $ex) {
            echo $ex->getMessage();
            return false;
        }
        return true;
    }

}

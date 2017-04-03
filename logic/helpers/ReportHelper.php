<?php

namespace Logic\Helpers;

class ReportHelper {

    public function addReport() {
        if (!$_FILES['file']['name']) {
            return false;
        }
        $fh = \Logic\Helpers\FileHelper::getInstance(); // закинуть слова в базу данных

        $fname = $fh->makeName(PROJECTS_DIR . "/" . $_FILES['file']['name']);
        if (!file_exists(PROJECTS_DIR . "/" . $fname)) {
            if (!copy($_FILES['file']['tmp_name'], $fname)) {
                return false;
            }
        } else {
            return false;
        }

        $pdo = \Logic\Db\Database::getInstance()->getPdo();
        $q = "INSERT INTO projects (id, fname) VALUES (NULL, ?)";
        $stmt = $pdo->prepare($q);
        $stmt->execute([str_replace(PROJECTS_DIR . "/", '', $fname)]);
        return $pid;
    }

    public function readExcel($fname) {
        if (file_exists(PROJECTS_DIR . "/" . $fname)) {
            $reader = new \Readers\ExcelReader();
            return $reader->getArray(PROJECTS_DIR . "/" . $fname);
        } else {
            return false;
        }
    }

    public function getReport($id) {
        $pdo = \Logic\Db\Database::getInstance()->getPdo();
        $q = "SELECT id, fname FROM projects WHERE id = ?";

        $stmt = $pdo->prepare($q);
        try {
            $stmt->execute([$id]);
        } catch (\Exception $ex) {
            echo $ex->getMessage();
        }

        $res = $stmt->fetch();
        $fname = $res['fname'];

        $cacheFile = CACHE_DIR . "/" . $fname;
        $fh = FileHelper::getInstance();
        if (!file_exists($cacheFile)) {
            $report = new \Logic\Report($this->readExcel($fname));
            $fh->addFile($cacheFile, serialize($report)); // закинуть в БД пословно с указанием project_id;
        } else {
            $report = $fh->getFile($cacheFile, true);
        }
        $result['report'] = $report->getReport();

        $syn = new \Logic\GetSynonims($id);
        $result['synonims'] = $syn->getAll();
        return $result;
    }

    public function getReports() {
        $pdo = \Logic\Db\Database::getInstance()->getPdo();
        $q = "SELECT id, fname FROM projects";

        $stmt = $pdo->prepare($q);
        try {
            $stmt->execute();
        } catch (\Exception $ex) {
            echo $ex->getMessage();
        }
        return $stmt->fetchAll();
    }

}

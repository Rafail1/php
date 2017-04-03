<?php

namespace Logic;

class GetSynonims {

    private $table = "synonims";
    private $db;
    private $pid;

    public function __construct($id) {
        $this->db = Db\Database::getInstance()->getPdo();
        $this->pid = $id;
        
    }

    public function getAll() {
        $q = "SELECT s.synonim, w.word, s.word_id FROM {$this->table} s JOIN words w ON s.word_id = w.id WHERE w.project_id = ?";
        $stmt = $this->db->prepare($q);
        
        try {
            $stmt->execute([$this->pid]);
        } catch (\Exception $ex) {
            echo $ex->getMessage();
        }
        $rows = $stmt->fetchAll();
        foreach($rows as $row) {
            $res[$row['word']][] = [$row['synonim'], $row['word_id']];
        }
        return $res;
    }

}

<?php

namespace Logic;

class EditSynonims {

    private $db;
    private $table = "words";
    private $pid;

    public function __construct($id) {
        $db = Db\Database::getInstance();
        $this->db = $db->getPdo();
        $this->pid = $id;
    }

    public function checkExist($post) {
        $word = $post['word'];
        $q = "SELECT id FROM {$this->table} WHERE word = ? AND project_id = {$this->pid}";
         
        $stmt = $this->db->prepare($q);
        try {
            $stmt->execute([$word]);
        } catch (\Exception $ex) {
            echo $ex->getMessage();
            die();
        }

        $row = $stmt->fetch();
        
        if ($row) {
            return $row["id"];
        } else {
            
            $q = "SELECT w.id FROM synonims s JOIN {$this->table} w ON s.word_id = w.id WHERE s.synonim = ? AND w.project_id = ?";
            
            $stmt = $this->db->prepare($q);
            $stmt->execute([$word, $this->pid]);
          
            $row = $stmt->fetch();
                
            if ($row) {
                return $row["word_id"];
            }
           
            return false;
        }
    }

    public function update($word_id, $synonims) {
        $q = "SELECT id, synonim, word_id FROM synonims WHERE word_id = ?";
        $stmt = $this->db->prepare($q);
        
        try {
            $stmt->execute([$word_id]);
        } catch (\Exception $ex) {
            echo $ex->getMessage();
            die();
        }

        $rows = $stmt->fetchAll();

        
        $add = [];
        $word = $fields['word'];
        foreach ($rows as $row) {
            if (in_array($row["synonim"], $synonims) || $word == $row["synonim"]) {
                if ($word_id != $row['word_id']) {
                    $word_id = $row['word_id'];
                }
                unset($synonims[array_search($row["synonim"], $synonims)]);
            }
        }
        $add = $synonims;

        if (count($add) > 0) {
            $this->insertSynonims($word_id, $add);
        }
    }

    public function delete($word_id, $synonims) {
        $in = implode("', '", $synonims);
        $q = "DELETE FROM synonims WHERE synonim IN ('{$in}') AND word_id = ?;";
        $stmt = $this->db->prepare($q);
        $stmt->execute([$word_id]);
    }

    public function insertSynonims($word_id, $synonims) {
        $q = "INSERT INTO synonims (`id` ,`synonim` ,`word_id`) VALUES ";
        $f = true;
        foreach ($synonims as $k => $synonim) {
            if (!$f) {
                $q .= ",";
            } else {
                $f = false;
            }
            $q .= " (NULL ,  '{$synonim}',  '{$word_id}')";
        }

        $stmt = $this->db->prepare($q);
        $stmt->execute();
    }

    public function insert($fields) {
        $q = "INSERT INTO {$this->table} (`id`, `word`, `project_id`) VALUES (NULL, '{$fields["word"]}', {$this->pid});";
        try {
            $stmt = $this->db->prepare($q);
            echo $q;
            $stmt->execute();
        } catch (Exception $ex) {
            echo $q;
        }
        

        $this->insertSynonims($this->db->lastInsertId(), $fields['synonims']);
        return $this->db->lastInsertId();
    }

    private function preFilter($post) {
        $post['synonims'] = explode(' ', trim($post['synonims']));
        if ($post['word']) {
            $post['word'] = strtolower(trim($post['word']));
            foreach ($post['synonims'] as $k => &$word) {
                $word = strtolower(trim($word));
                if ($post['word'] == $word) {
                    unset($post['synonims'][$k]);
                }
            }
        }
        return $post;
    }

    public function execute($post) {
        $post = $this->preFilter($post);
        
        $res = [];
        if ($post['action'] == "SaveSynonims") {
            $id = $this->checkExist($post);
            if ($id !== false) {
               
                $this->update($id, $post['synonims']);
                $res = ['id' => $id];
            } else {
               
                $id = $this->insert($post);
                 
                $res = ['id' => $id];
            }
        } elseif ($post['action'] == "RemoveSynonims") {
            $this->delete($post['id'], $post['synonims']);
            $res = ['message' => 'Ok'];
        }
        return $res;
    }

}

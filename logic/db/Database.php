<?php

namespace Logic\Db;

class Database {

    private static $instance;
    private $pdo;

    private function __construct() {
        $dsn = "mysql:host=localhost;dbname=cattest_raf;charset=utf8";
        $opt = [\PDO::ATTR_ERRMODE => \PDO::ERRMODE_EXCEPTION,
            \PDO::ATTR_DEFAULT_FETCH_MODE => \PDO::FETCH_ASSOC
        ];
        $this->pdo = new \PDO($dsn, "cattest_raf", "5033655", $opt);
       
    }
    public static function getInstance() {
        if (self::$instance == null) {
            self::$instance = new self();
            
        }
        
        return self::$instance;
    }
    public function getPdo(){
        return $this->pdo;
    }

    

}

<?php
// Include the GlobalMethods class file
require_once "global.php";


class Get extends GlobalMethods
{
    private $pdo;

    public function __construct(\PDO $pdo)
    {
        $this->pdo = $pdo;
    }

    public function getTasks()
    {
        $stmt = $this->pdo->query("SELECT * FROM tasks");
        $tasks = $stmt->fetchAll(PDO::FETCH_ASSOC);
        return json_encode($tasks);
    }
}

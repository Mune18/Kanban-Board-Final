<?php
// POST Method

require_once "global.php";

class Post extends GlobalMethods
{
    private $pdo;

    public function __construct(\PDO $pdo)
    {
        $this->pdo = $pdo;
    }

    public function addTask()
    {
        $data = json_decode(file_get_contents('php://input'), true);
        $user = $this->checkAuth();
        $title = $data['title'];
        $status = 'todo';
        $stmt = $this->pdo->prepare("INSERT INTO tasks (user_id, title, status) VALUES (?, ?, ?)");
        $stmt->execute([$user['id'], $title, $status]);
        return json_encode(['id' => $this->pdo->lastInsertId(), 'title' => $title, 'status' => $status]);
    }

    public function updateTask()
    {
        $data = json_decode(file_get_contents('php://input'), true);
        $user = $this->checkAuth();
        $id = $data['id'];
        $title = $data['title'];
        $status = $data['status'];
        $stmt = $this->pdo->prepare("UPDATE tasks SET title = ?, status = ? WHERE id = ? AND user_id = ?");
        $stmt->execute([$title, $status, $id, $user['id']]);
        return json_encode(['id' => $id, 'title' => $title, 'status' => $status]);
    }

    public function register() {
        $data = json_decode(file_get_contents("php://input"), true);
        if (!isset($data['name'], $data['email'], $data['password'])) {
            echo json_encode(['status' => 'error', 'message' => 'Invalid input']);
            http_response_code(400);
            return;
        }
    
        $name = $data['name'];
        $email = $data['email'];
        $password = password_hash($data['password'], PASSWORD_DEFAULT);
    
        $stmt = $this->pdo->prepare("INSERT INTO users (username, email, password) VALUES (?, ?, ?)");
        if ($stmt->execute([$name, $email, $password])) {
            // Generate token
            $token = bin2hex(random_bytes(16));
            $userId = $this->pdo->lastInsertId();
    
            $tokenStmt = $this->pdo->prepare("UPDATE users SET token = ? WHERE id = ?");
            $tokenStmt->execute([$token, $userId]);
    
            echo json_encode(['status' => 'success', 'token' => $token]);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Registration failed']);
        }
    }
    
    public function login() {
        $data = json_decode(file_get_contents("php://input"), true);
        if (!isset($data['email'], $data['password'])) {
            echo json_encode(['status' => 'error', 'message' => 'Invalid input']);
            http_response_code(400);
            return;
        }
    
        $email = $data['email'];
        $password = $data['password'];
    
        $stmt = $this->pdo->prepare("SELECT * FROM users WHERE email = ?");
        $stmt->execute([$email]);
        $user = $stmt->fetch();
    
        if ($user && password_verify($password, $user['password'])) {
            // Generate token
            $token = bin2hex(random_bytes(16));
    
            $tokenStmt = $this->pdo->prepare("UPDATE users SET token = ? WHERE id = ?");
            $tokenStmt->execute([$token, $user['id']]);
    
            echo json_encode(['token' => $token]);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Invalid credentials']);
        }
    }    

    public function checkAuth() {
        $headers = getallheaders();
        if (!isset($headers['Authorization'])) {
            http_response_code(401);
            echo json_encode(['status' => 'unauthorized']);
            exit();
        }

        $token = $headers['Authorization'];
        $stmt = $this->pdo->prepare("SELECT * FROM users WHERE token = ?");
        $stmt->execute([$token]);
        $user = $stmt->fetch();

        if (!$user) {
            http_response_code(401);
            echo json_encode(['status' => 'unauthorized']);
            exit();
        }

        return $user;
    }
}
<?php
header("Content-Type: application/json");
$conn = new mysqli("localhost", "root", "", "web_prog_uas");

if ($conn->connect_error) {
  echo json_encode(["status" => "error", "message" => "Connection failed"]);
  exit;
}

if ($_SERVER["REQUEST_METHOD"] === "POST") {
  $data = json_decode(file_get_contents("php://input"), true);
  $username = $conn->real_escape_string($data["username"]);
  $password = $conn->real_escape_string($data["password"]);  // not hashed
  $nickname = $conn->real_escape_string($data["nickname"]);

  // Check if username already exists
  $check = $conn->query("SELECT * FROM users WHERE username = '$username'");
  if ($check && $check->num_rows > 0) {
    echo json_encode(["status" => "error", "message" => "Username already taken"]);
    exit;
  }

  // Insert user
  $sql = "INSERT INTO users (username, password, nickname) VALUES ('$username', '$password', '$nickname')";
  if ($conn->query($sql)) {
    echo json_encode(["status" => "success", "message" => "User registered successfully"]);
  } else {
    echo json_encode(["status" => "error", "message" => "Insert failed"]);
  }
}
?>

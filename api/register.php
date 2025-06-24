<?php
header("Content-Type: application/json");
$conn = new mysqli("localhost", "root", "", "web_prog_uas"); // adjust credentials

if ($_SERVER["REQUEST_METHOD"] === "POST") {
  $data = json_decode(file_get_contents("php://input"), true);
  $username = $conn->real_escape_string($data["username"]);
  $password = password_hash($data["password"], PASSWORD_DEFAULT);

  $sql = "INSERT INTO users (username, password) VALUES ('$username', '$password')";
  if ($conn->query($sql) === TRUE) {
    echo json_encode(["status" => "success", "message" => "User registered"]);
  } else {
    echo json_encode(["status" => "error", "message" => "Username may already exist"]);
  }
}
?>

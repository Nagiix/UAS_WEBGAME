<?php
header("Content-Type: application/json");
$conn = new mysqli("localhost", "root", "", "web_prog_uas"); // adjust credentials

if ($_SERVER["REQUEST_METHOD"] === "POST") {
  $data = json_decode(file_get_contents("php://input"), true);
  $username = $conn->real_escape_string($data["username"]);
  $password = $data["password"];

  $sql = "SELECT * FROM users WHERE username = '$username'";
  $result = $conn->query($sql);

  if ($result->num_rows === 1) {
    $user = $result->fetch_assoc();
    if ($password == $user["password"]) {
      echo json_encode(["status" => "success", "message" => "Login successful"]);
    } else {
      echo json_encode(["status" => "error", "message" => "Invalid password"]);
    }
  } else {
    echo json_encode(["status" => "error", "message" => "User not found"]);
  }
}
?>

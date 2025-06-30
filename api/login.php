<?php
header("Content-Type: application/json");

// Connect to the database
$conn = new mysqli("localhost", "root", "", "web_prog_uas");

if ($conn->connect_error) {
  echo json_encode(["status" => "error", "message" => "Connection failed"]);
  exit;
}

// Handle POST request
if ($_SERVER["REQUEST_METHOD"] === "POST") {
  $data = json_decode(file_get_contents("php://input"), true);
  $username = $conn->real_escape_string($data["username"]);
  $password = $data["password"];
  // Fetch user by username
  $sql = "SELECT * FROM users WHERE username = '$username'";
  $result = $conn->query($sql);

  if ($result && $result->num_rows === 1) {
    $user = $result->fetch_assoc();

    // Verify password
    if ($password == $user["password"]) {
      echo json_encode([
    "status" => "success",
    "message" => "Login successful",
    "nickname" => $user["nickname"] ?? ""
  ]);
    } else {
      echo json_encode(["status" => "error", "message" => "Invalid password"]);
    }
  } else {
    echo json_encode(["status" => "error", "message" => "User not found"]);
  }
}
?>

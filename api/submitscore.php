<?php
$conn = new mysqli("localhost", "root", "", "web_prog_uas");

$name = $_POST['name'];
$score = $_POST['score'];
$difficulty = $_POST['difficulty'];

$stmt = $conn->prepare("INSERT INTO scores (name, score, difficulty) VALUES (?, ?, ?)");
$stmt->bind_param("sis", $name, $score, $difficulty);

if ($stmt->execute()) {
    echo "Score submitted!";
} else {
    echo "Error: " . $stmt->error;
}
$stmt->close();
$conn->close();
?>

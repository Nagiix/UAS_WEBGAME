<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$host = 'localhost';
$dbname = 'web_prog_uas';
$user = 'root';
$pass = '';
$difficulty = $_GET['difficulty'] ?? '';

if (!$difficulty) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing difficulty']);
    exit;
}

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $user, $pass);

    // Fetch enemy
    $stmt = $pdo->prepare("SELECT * FROM enemies WHERE difficulty = ? ORDER BY RAND() LIMIT 1");
    $stmt->execute([$difficulty]);
    $enemy = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$enemy) {
        http_response_code(404);
        echo json_encode(['error' => 'No enemy found']);
        exit;
    }

    // Fetch moves
    $stmt = $pdo->prepare("SELECT move_name, min_dmg, max_dmg FROM enemy_moves WHERE enemy_id = ?");
    $stmt->execute([$enemy['id']]);
    $moves = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Fetch dialogues
    $stmt = $pdo->prepare("SELECT `trigger`, dialogue FROM enemy_dialogues WHERE enemy_id = ?");
    $stmt->execute([$enemy['id']]);
    $dialogues = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $enemy['moves'] = $moves;
    $enemy['dialogue'] = $dialogues;

    echo json_encode($enemy);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}

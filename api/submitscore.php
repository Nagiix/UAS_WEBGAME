<?php
/* ---------- DB CONFIG ---------- */
$host = 'localhost';
$db   = 'web_prog_uas';
$user = 'root';
$pass = '';
$charset = 'utf8mb4';
$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION];

/* ---------- JSON HELPER ---------- */
function jsonOut($data, $httpCode = 200) {
  http_response_code($httpCode);
  header('Content-Type: application/json; charset=utf-8');
  echo json_encode($data);
  exit;
}

try {
  $pdo = new PDO($dsn, $user, $pass, $options);

  /* =============================
     1) LIST SCORE  (GET ?mode=list)
     ============================= */
  if (isset($_GET['mode']) && $_GET['mode'] === 'list') {

    /* ambil 10 skor tertinggi & join username */
    $stmt = $pdo->query(
      "SELECT u.username AS name, s.Score AS score, s.difficulty
       FROM Scores s
       JOIN users  u ON u.id = s.UID
       ORDER BY s.Score DESC
       LIMIT 10"
    );
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
    jsonOut($rows);                        // ← frontend .json() sukses
  }

  /* =============================
     2) SUBMIT SCORE (POST)
     ============================= */
  if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    if (!isset($_POST['uid'], $_POST['score'], $_POST['difficulty'])) {
      jsonOut(["status"=>"error","message"=>"Missing uid, score, or difficulty"], 400);
    }

    $uid        = (int) $_POST['uid'];
    $score      = (int) $_POST['score'];
    $difficulty = $_POST['difficulty'];

    $validDifficulties = ['easy','normal','hard','impossible'];
    if (!in_array($difficulty, $validDifficulties, true)) {
      jsonOut(["status"=>"error","message"=>"Invalid difficulty"], 400);
    }

    /* cek UID ada */
    $stmt = $pdo->prepare("SELECT id FROM users WHERE id = ?");
    $stmt->execute([$uid]);
    if ($stmt->rowCount() === 0) {
      jsonOut(["status"=>"error","message"=>"User ID not found"], 404);
    }

    /* simpan skor */
    $stmt = $pdo->prepare(
      "INSERT INTO Scores (UID, Score, difficulty)
       VALUES (:uid, :score, :difficulty)"
    );
    $stmt->execute([
      ':uid'        => $uid,
      ':score'      => $score,
      ':difficulty' => $difficulty
    ]);

    jsonOut([
      "status" => "success",
      "message"=> "Score recorded",
      "uid"    => $uid,
      "score"  => $score,
      "difficulty" => $difficulty
    ]);
  }

  /* jika tidak GET list dan bukan POST */
  jsonOut(["status"=>"error","message"=>"Unsupported request"], 405);

} catch (Exception $e) {
  jsonOut(["status"=>"error","message"=>$e->getMessage()], 500);
}
?>

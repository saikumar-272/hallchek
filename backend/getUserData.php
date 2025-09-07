<?php
header("Access-Control-Allow-Origin: http://localhost:4200");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require_once('appConfig.php');


$data = json_decode(file_get_contents("php://input"));

$conn = getSqlConnection();

if (is_string($conn)) {
    echo json_encode(["status" => "error", "msg" => "Connection failed", "error" => $conn]);
    exit();
}

$mobileNumber = $data->mobileNumber ?? '';

if (empty($mobileNumber)) {
    echo json_encode(['status' => 'error', 'msg' => 'Missing credentials']);
    exit();
}

$sql = "SELECT * FROM signup_details where mobileNumber='$mobileNumber' ";
$result = mysqli_query($conn, $sql);

if ($result) {
    $data = [];
    while ($row = mysqli_fetch_assoc($result)) {
        $data[] = $row; // push each associative row to array
    }
    echo json_encode(["status" => "success", "data" => $data]);
} else {
    echo json_encode(["status" => "error", "msg" => "Query failed", "error" => mysqli_error($conn)]);
}

mysqli_close($conn);
?>

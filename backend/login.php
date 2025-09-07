<?php
header("Access-Control-Allow-Origin: http://localhost:4200");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Get DB connection
require_once('appConfig.php');
$conn = getSqlConnection();

if (is_string($conn)) {
    echo json_encode(['status' => 'error', 'msg' => 'DB connection failed']);
    exit();
}

// Get JSON input
$data = json_decode(file_get_contents("php://input"));

$mobileNumber = $data->mobileNumber ?? '';
$password = $data->password ?? '';

if (empty($mobileNumber) || empty($password)) {
    echo json_encode(['status' => 'error', 'msg' => 'Missing credentials']);
    exit();
}

// Prepare statement to get user by mobile number
$stmt = mysqli_prepare($conn, "SELECT `password`,user_type FROM signup_details WHERE mobileNumber = ?");
mysqli_stmt_bind_param($stmt, "s", $mobileNumber);
mysqli_stmt_execute($stmt);
mysqli_stmt_store_result($stmt);

if (mysqli_stmt_num_rows($stmt) === 0) {
    echo json_encode(['status' => 'error', 'msg' => 'Mobile number not registered']);
    exit();
}

mysqli_stmt_bind_result($stmt, $hashedPassword, $user_type);
mysqli_stmt_fetch($stmt);

if (password_verify($password, $hashedPassword)) {
            
        $sql = "SELECT * FROM signup_details where mobileNumber='$mobileNumber' ";
        $result = mysqli_query($conn, $sql);
$userData = [];
        if ($result) {
            
            while ($row = mysqli_fetch_assoc($result)) {
                $userData[] = $row; // push each associative row to array
            }
               echo json_encode(['status' => 'success', 'msg' => 'Login successful','user_type' =>$user_type ,'userData'=>$userData ]);
        } else {
            echo json_encode(["status" => "error", "msg" => "Query failed", "error" => mysqli_error($conn)]);
        }
    
 
} else {
    echo json_encode(['status' => 'error', 'msg' => 'Invalid password']);
}

mysqli_stmt_close($stmt);
mysqli_close($conn);
?>











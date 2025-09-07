<?php
header("Access-Control-Allow-Origin: http://localhost:4200");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
include('appConfig.php');
$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid input","status"=>'failed']);
    exit();
}

 $conn = getSqlConnection();

    if (is_string($conn)) {
        // It's an error message
        http_response_code(500);
         echo json_encode(["error" => "Connection failed: " . $conn,"status"=>'failed']);
        exit();
    }
// Sanitize and validate input
$fullName       = mysqli_real_escape_string($conn, $data['fullName'] ?? '');
$mobileNumber   = mysqli_real_escape_string($conn, $data['mobileNumber'] ?? '');
$gender         = mysqli_real_escape_string($conn, $data['gender'] ?? '');
$password       = mysqli_real_escape_string($conn, $data['password'] ?? '');
$hallname       = mysqli_real_escape_string($conn, $data['hallname'] ?? '');
$hallType       = mysqli_real_escape_string($conn, $data['hallType'] ?? '');
$hallCapacity   = mysqli_real_escape_string($conn, $data['hallCapacity'] ?? '');
$parkingArea    = mysqli_real_escape_string($conn, $data['parkingArea'] ?? '');
$hallAddress    = mysqli_real_escape_string($conn, $data['hallAddress'] ?? '');
$state    = mysqli_real_escape_string($conn, $data['state'] ?? '');
$district    = mysqli_real_escape_string($conn, $data['district'] ?? '');
$mandal    = mysqli_real_escape_string($conn, $data['mandal'] ?? '');
$pincode        = mysqli_real_escape_string($conn, $data['pincode'] ?? '');
$user_type   = '1';
// Hash the password before storing
$hashedPassword = password_hash($password, PASSWORD_BCRYPT);

// $sql = "INSERT INTO `signup_details` (`fullName`, `mobileNumber`, `gender`, `password`,`hallname`, `hallType`, `hallCapacity`, `parkingArea`,`hallAddress`, `pincode`) VALUES ('$fullName', '$mobileNumber', '$gender', '$hashedPassword', '$hallname', '$hallType', $hallCapacity, '$parkingArea', '$hallAddress', '$pincode')";

//   if (mysqli_query($conn, $sql)) {
//             http_response_code(200);

//             echo json_encode(["message" => "Signup successful"]);
//         } else {
//             http_response_code(500);
//             echo json_encode(["error" => mysqli_error($conn)]);
//         }
//         mysqli_close($conn);


// Prepare the query
$stmt = mysqli_prepare($conn, "INSERT INTO signup_details (
   user_type, fullName, mobileNumber, gender, password,
    hallname, hallType, hallCapacity, parkingArea,
    hallAddress,state,district,mandal, pincode
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?,?,?)");

if (!$stmt) {  
    http_response_code(500);
echo json_encode(["error" => mysqli_error($conn),"status"=>'failed']);
}

// Bind parameters: s = string, i = integer
mysqli_stmt_bind_param($stmt, "ssssssssssssss",
    $user_type,
    $fullName,
    $mobileNumber,
    $gender,
    $hashedPassword,
    $hallname,
    $hallType,
    $hallCapacity,
    $parkingArea,
    $hallAddress,$state,$district,$mandal,
    $pincode
);

// Execute the statement
if (mysqli_stmt_execute($stmt)) {
    http_response_code(200);
    echo json_encode(["msg" => "Signup successful!","status"=>'success']);
} else {
   
    http_response_code(500);
    echo json_encode(["error" => mysqli_stmt_error($stmt),"status"=>'failed']);

}

mysqli_stmt_close($stmt);
mysqli_close($conn);
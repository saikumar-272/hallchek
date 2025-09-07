<?php
header("Access-Control-Allow-Origin: http://localhost:4200");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include('appConfig.php');

$conn = getSqlConnection();
if (is_string($conn)) {
    http_response_code(500);
    echo json_encode(["error" => "Connection failed: " . $conn, "status" => 'failed']);
    exit();
}

$fullName = $_POST['fullName'] ?? '';
$mobileNumber = $_POST['mobileNumber'] ?? '';
$hallname = $_POST['hallname'] ?? '';
$hallType = $_POST['hallType'] ?? '';
$hallCapacity = $_POST['hallCapacity'] ?? '';
$parkingArea = $_POST['parkingArea'] ?? '';
$hallAddress = $_POST['hallAddress'] ?? '';

// File uploads
$acceptance_file = $_FILES['acceptFile'] ?? null;
$imageFile = $_FILES['HallImage'] ?? null;

$uploadDir = 'uploads/';
// Check if upload directory exists, if not create it
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

$pdfPath = '';
$imagePath = '';

if ($acceptance_file && $acceptance_file['error'] === UPLOAD_ERR_OK) {
    $extension = pathinfo($acceptance_file['name'], PATHINFO_EXTENSION);
    $pdfPath = $uploadDir .'AcceptDoc'.date('YmdHis').'.'.$extension;
    move_uploaded_file($acceptance_file['tmp_name'], $pdfPath);
}else{
    http_response_code(500);
    echo json_encode(["error" => "acceptance document not uploaded", "status" => 'failed']);
    exit();
}

if ($imageFile && $imageFile['error'] === UPLOAD_ERR_OK) {
    $extension = pathinfo($imageFile['name'], PATHINFO_EXTENSION);
    $imagePath = $uploadDir .'hallImage'.date('YmdHis').'.'.$extension;
    move_uploaded_file($imageFile['tmp_name'], $imagePath);
}else{
    http_response_code(500);
    echo json_encode(["error" => "Hall image not uploaded", "status" => 'failed']);
    exit();
}


$stmt = mysqli_prepare($conn, "UPDATE signup_details SET fullName=?, hallname=?, hallType=?, hallCapacity=?, parkingArea=?, hallAddress=?, acceptance_doc=?, hall_image=?,`status`=? WHERE mobileNumber=?");

if (!$stmt) {
    http_response_code(500);
    echo json_encode(["error" => mysqli_error($conn), "status" => 'failed']);   
    exit();
}
$status = 'active';

mysqli_stmt_bind_param($stmt, "ssssssssss", $fullName,  $hallname, $hallType, $hallCapacity, $parkingArea, $hallAddress, $pdfPath, $imagePath,$status, $mobileNumber);

if (mysqli_stmt_execute($stmt)) {
    if (mysqli_stmt_affected_rows($stmt) > 0) {
        http_response_code(200);
        echo json_encode(["msg" => "Updated successfuly", "status" => 'success']);
    } else {
        http_response_code(404);
        echo json_encode(["error" => "No record found for given mobile number.", "status" => 'failed']);
    }
} else {
    http_response_code(500);
    echo json_encode(["error" => mysqli_stmt_error($stmt), "status" => 'failed']);
}

mysqli_stmt_close($stmt);
mysqli_close($conn);
?>

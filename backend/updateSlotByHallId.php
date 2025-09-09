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
// Get JSON input
$data = json_decode(file_get_contents("php://input"));

$hall_id = $data->hall_id ?? '';
$slot_id = $data->slot_id ?? '';
$date = $data->date ?? '';
$statustoUpdate = $data -> statustoUpdate ?? 'booked';
$customerData = $data -> customerData;

if (empty($hall_id) || empty($slot_id) || empty($date) || empty($statustoUpdate) || empty($customerData) ) {
    echo json_encode(['status' => 'error', 'msg' => 'Missing credentials']);
    exit();
}


 $sql_qry = "SELECT * FROM `bookedslotstable` WHERE slot_id='$slot_id' AND hall_id='$hall_id' AND `date` ='$date' ";
$result = mysqli_query($conn, $sql_qry);

if ($result) {
    $data = [];
    while ($row = mysqli_fetch_assoc($result)) {
        $data[] = $row; // push each associative row to array
    }

    if(count($data)>0){

        if ($statustoUpdate =='booked'){

        $stmt = mysqli_prepare($conn, "UPDATE bookedslotstable SET booked_status=? , booked_data =?  WHERE slot_id=? AND hall_id=? AND `date`=?  ");

        }else{
            
        $stmt = mysqli_prepare($conn, "UPDATE bookedslotstable SET booked_status=?  WHERE slot_id=? AND hall_id=? AND `date`=?  ");

        }


        if (!$stmt) {
            http_response_code(500);
            echo json_encode(["error" => mysqli_error($conn), "status" => 'failed']);   
            exit();
        }


        if ($statustoUpdate =='booked'){                
            mysqli_stmt_bind_param($stmt, "sssss", $statustoUpdate, $customerData, $slot_id,  $hall_id, $date);
        }else{
            mysqli_stmt_bind_param($stmt, "ssss", $statustoUpdate, $slot_id,  $hall_id, $date);            
        }


        if (mysqli_stmt_execute($stmt)) {
            if (mysqli_stmt_affected_rows($stmt) > 0) {
                http_response_code(200);
                echo json_encode(["msg" => "Updated successfuly", "status" => 'success']);
            } else {
                http_response_code(404);
                echo json_encode(["error" => "No record found for given slot.", "status" => 'failed']);
            }
        } else {
            http_response_code(500);
            echo json_encode(["error" => mysqli_stmt_error($stmt), "status" => 'failed']);
        }




    }else{
        

    $stmt = mysqli_prepare($conn, "INSERT INTO `bookedslotstable`( `hall_id`,`booked_data`, `slot_id`, `date`) VALUES ( ?, ?, ?,?)");

    if (!$stmt) {
        http_response_code(500);
        echo json_encode(["error" => mysqli_error($conn), "status" => 'failed']);   
        exit();
    }

    mysqli_stmt_bind_param($stmt, "ssis", $hall_id, $customerData, $slot_id, $date );

    if (mysqli_stmt_execute($stmt)) {
        http_response_code(200);
        echo json_encode(["msg" => "Updated successfuly", "status" => 'success']);
    } else {
        http_response_code(500);
        echo json_encode(["error" => mysqli_stmt_error($stmt), "status" => 'failed']);
    }

    }
}else{
        

    $stmt = mysqli_prepare($conn, "INSERT INTO `bookedslotstable`( `hall_id`, `booked_data`, `slot_id`, `date`) VALUES ( ?, ?, ?, ?)");

    if (!$stmt) {
        http_response_code(500);
        echo json_encode(["error" => mysqli_error($conn), "status" => 'failed']);   
        exit();
    }

    mysqli_stmt_bind_param($stmt, "ssis", $hall_id,$customerData, $slot_id, $date );

    if (mysqli_stmt_execute($stmt)) {
        http_response_code(200);
        echo json_encode(["msg" => "Updated successfuly", "status" => 'success']);
    } else {
        http_response_code(500);
        echo json_encode(["error" => mysqli_stmt_error($stmt), "status" => 'failed']);
    }

    }

mysqli_stmt_close($stmt);
mysqli_close($conn);
?>

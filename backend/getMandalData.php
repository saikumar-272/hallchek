<?php
header("Access-Control-Allow-Origin: http://localhost:4200");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require_once('appConfig.php');
$district_code = isset($_REQUEST['district_code'])?$_REQUEST['district_code']:'';
if($district_code==''){
    echo json_encode(["status" => "402", "msg" => "Invalid Input Value", "error" => '403']);
     exit();
}


$conn = getSqlConnection();

if (is_string($conn)) {
    echo json_encode(["status" => "error", "msg" => "Connection failed", "error" => $conn]);
    exit();
}
$status ='active';
$sql = "SELECT DISTINCT `mandal_code` , `mandal_name` FROM `mandals_data_table`WHERE `district_code`='$district_code' ORDER BY `mandal_name` ASC ";
$result = mysqli_query($conn, $sql);

if ($result) {
    $data = [];
    while ($row = mysqli_fetch_assoc($result)) {
        $data[] = $row; // push each associative row to array
    }
    
    if(count($data)>0){
    echo json_encode(["status" => "success", "data" => $data]);

    }else{
    echo json_encode(["status" => "empty"]);

    }
} else {
    echo json_encode(["status" => "error", "msg" => "Query failed", "error" => mysqli_error($conn)]);
}

mysqli_close($conn);
?>

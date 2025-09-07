<?php
header("Access-Control-Allow-Origin: http://localhost:4200");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require_once('appConfig.php');

$conn = getSqlConnection();

if (is_string($conn)) {
    echo json_encode(["status" => "error", "msg" => "Connection failed", "error" => $conn]);
    exit();
}
$status ='active';
$sql = "SELECT DISTINCT state_code , state_name FROM `mandals_data_table` ORDER BY `mandals_data_table`.`state_name` ASC ";
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

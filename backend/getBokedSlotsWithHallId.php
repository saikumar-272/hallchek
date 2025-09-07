
<?php
header("Access-Control-Allow-Origin: http://localhost:4200");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require_once('appConfig.php');
$hall_id = isset($_REQUEST['hall_id'])?$_REQUEST['hall_id']:'';
if($hall_id==''){
    echo json_encode(["status" => "402", "msg" => "Hall Id Not Valid Not Given", "error" => '403']);

}

$conn = getSqlConnection();

if (is_string($conn)) {
    echo json_encode(["status" => "error", "msg" => "Connection failed", "error" => $conn]);
    exit();
}
$status ='pending';
$sql = "SELECT  * FROM `bookedslotstable` WHERE 1 AND hall_id='$hall_id' AND  `date` >= CURRENT_DATE AND booked_status='booked' ";
$result = mysqli_query($conn, $sql);

if ($result) {
    $data = [];
    while ($row = mysqli_fetch_assoc($result)) {
        $data[] = $row; // push each associative row to array
    }
    
    if(count($data)>0){

            $AssocData=array();
            foreach($data as $slot){

                $AssocData[$slot['date']][]=$slot;

            }


    echo json_encode(["status" => "success", "data" => $AssocData]);

    }else{
    echo json_encode(["status" => "empty"]);

    }
} else {
    echo json_encode(["status" => "error", "msg" => "Query failed", "error" => mysqli_error($conn)]);
}

mysqli_close($conn);
?>
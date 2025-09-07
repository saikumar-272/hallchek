
<?php
header("Access-Control-Allow-Origin: http://localhost:4200");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require_once('appConfig.php');

$hallId = isset($_REQUEST['hallId'])?$_REQUEST['hallId']:'';
$requiredDate = isset($_REQUEST['requiredDate'])?date($_REQUEST['requiredDate']):'';
$slot_id = isset($_REQUEST['slot_id'])?$_REQUEST['slot_id']:'';
$hallName = isset($_REQUEST['hallName'])?$_REQUEST['hallName']:'';



 $sql_qry = "SELECT `id`, `hallname`,`hall_image`, `hallAddress`,`pincode`,fullName,mobileNumber  FROM `signup_details` where `user_type`='1' AND status='active' AND  `id` NOT IN (select distinct `hall_id` from `bookedslotstable` where  1 AND `slot_id`='$slot_id' AND  `date` = '$requiredDate')  ORDER BY  CASE WHEN  id ='$hallId' THEN 1 when hallname LIKE'%$hallName%' then 2 when hallAddress  LIKE '%$hallName%' then 3   else 4 END ASC  ";

$conn = getSqlConnection();

if (is_string($conn)) {
    echo json_encode(["status" => "error", "msg" => "Connection failed", "error" => $conn]);
    exit();
}

$result = mysqli_query($conn, $sql_qry);

if ($result) {
    $data = [];
    while ($row = mysqli_fetch_assoc($result)) {
        $data[] = $row; // push each associative row to array
    }
    
    if(count($data)>0){

$DATA =array();
        foreach($data as $hall){
            $data_arr =array();
                    
            for($i=0;$i<7; $i++){
                
                $day_ar = [];
                $mrng_slot ='available';
                $evng_slot ='available';
                
                $weekdate =  date('Y-m-d', strtotime($requiredDate. ' + '.$i.' days'));
                $qry = " SELECT GROUP_CONCAT(DISTINCT `slot_id`) as bookedslots FROM `bookedslotstable` WHERE hall_id ='".$hall['id']."' AND `date`='$weekdate'  ";
              
                $hallSlots = mysqli_query($conn, $qry );

                if($hallSlots){

                    $hallSlots_ar = [];
                    while ($row = mysqli_fetch_assoc($hallSlots)) {
                        $hallSlots_ar[] = $row; // push each associative row to array
                    }

                    $slots_array = explode(',',$hallSlots_ar[0]['bookedslots']);  
                    // print_r( $slots_array);    

                    if(in_array('1',$slots_array)){  
                    $mrng_slot ='booked';
                    }

                    if(in_array('2',$slots_array)){  
                    $evng_slot ='booked';

                    }
                  
                
                }else {
                    
                    echo json_encode(["status" => "error", "msg" => "Query failed", "error" => mysqli_error($conn)]);
                }
                $slot_ar_1['slot_id']= '1';
                $slot_ar_1['slot_status']= $mrng_slot;

                $slot_ar_2['slot_id']= '2';
                $slot_ar_2['slot_status']= $evng_slot;
                    

                $day_ar[]=$slot_ar_1;
                $day_ar[]=$slot_ar_2;
            $data_arr['date'] = $weekdate;
            $data_arr['slots'] =$day_ar;
            $hall['week_slots'][] =$data_arr;
            }
           
            $DATA[] =$hall; 
            
        }

        echo json_encode(["status" => "success", "data" => $DATA]);

    }else{
    echo json_encode(["status" => "empty"]);

    }
} else {
    echo json_encode(["status" => "error", "msg" => "Query failed", "error" => mysqli_error($conn)]);
}

mysqli_close($conn);
?>
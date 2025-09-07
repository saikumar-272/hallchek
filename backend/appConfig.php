<?php


$host = 'localhost';
$username = 'root';
$password = '';
$database = 'hallchek';

function getSqlConnection() {
    // Declare globals to access the variables from the global scope
    global $host, $username, $password, $database;

    $conn = mysqli_connect($host, $username, $password, $database);

    // Check connection
    if (!$conn) {
        return mysqli_connect_error(); // return the error message as a string
    }

    return $conn; // return the connection object
}
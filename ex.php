<?php
$mysql = mysqli_connect($argv[1], $argv[2], $argv[3], $argv[4]);

if (mysqli_connect_errno($mysql)) {
    echo "DB 연결 실패:" . mysqli_connect_error(); 
} else {
    echo "DB 연결 성공" ;
}

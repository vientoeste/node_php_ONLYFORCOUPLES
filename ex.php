<?php
$mysql = mysqli_connect($argv[1]->$HOST, $argv[1]->$ID, $argv[1]->$PW, $argv[1]->$DB);
if (mysqli_connect_errno($mysql)){
    echo "DB 연결 실패:" . mysqli_connect_error(); 
}else{
    echo "DB 연결 성공" ;
}
<?php
$mysql = mysqli_connect($argv[1], $argv[2], $argv[3], $argv[4]);

if (mysqli_connect_errno($mysql)) {
  echo 10;
}
echo "calender router; just for debug";
?>

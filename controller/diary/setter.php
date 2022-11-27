<?php
$mysql = mysqli_connect($argv[1], $argv[2], $argv[3], $argv[4]);

if (mysqli_connect_errno($mysql)) {
  echo 10;
}

$username = $argv[5];
$category = $argv[6];
$contents = $argv[7];

$getUserIdQuery = "SELECT id FROM user WHERE username=$username";
$userId = mysqli_fetch_assoc(mysqli_query($mysql, $getUserIdQuery));

$insertQuery = "INSERT INTO diary (user_id, create_date, category, contents) VALUES ($userId, now(), $category, $contents)";

if (!$mysqli_query($mysql, $insertQuery)) {
  // Insert fail
  echo 11;
} else {
  $mysql->close();
  echo 1;
}
?>

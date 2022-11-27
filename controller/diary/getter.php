<?php
$mysql = mysqli_connect($argv[1], $argv[2], $argv[3], $argv[4]);

if (mysqli_connect_errno($mysql)) {
  echo 10;
}

// argv[5] for <requested>username
$queryBuilder = "SELECT d.id, d.user_id, d.create_date, d.category, d.contents FROM diary d JOIN user u ON d.user_id=u.id WHERE 1=1";
// argv[6] for search option, [7] for option value
if ($argv[6] == "userId") {
    $queryBuilder .= "AND u.id IN (".$argv[7].")";
} else {
    $queryBuilder .= "AND u.username=".$argv[5];
}
if ($argv[6] == "category") {
    $queryBuilder .= "AND d.category IN (".$argv[7].")";
}
if ($argv[6] == "date") {
    $queryBuilder .= "AND d.create_date >".$argv[7]."AND d.create_date <".$argv[8];
}
$result = mysqli_query($mysql, $queryBuilder);
print_r($result);
?>

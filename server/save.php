<?php

$myFile = "../public/datasets/dataset_Cx.json";
$fh = fopen($myFile, 'w') or die("can't open file");
$stringData = $_POST['content'];
fwrite($fh, $stringData);
fclose($fh);
?>


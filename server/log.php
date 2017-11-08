<?php
$txt = $_POST['content'];
$myfile = file_put_contents('urank_logs.txt', $txt.PHP_EOL , FILE_APPEND);
?>


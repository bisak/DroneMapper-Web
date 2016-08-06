<?php
    $dir = "uploader/server/php/files";
    $result = array();
    $files = scandir($dir);
    foreach($files as $file) {
        switch(ltrim(strstr($file, '.'), '.')) {
            case "jpg": case "jpeg":case "JPG":
                $result[] = $dir . "/" . $file;
        }
    }
    $resultJson = json_encode($result);
    echo($resultJson);
?>
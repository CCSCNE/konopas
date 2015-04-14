<?php
/**
 * taken from: http://php.net/manual/en/function.shell-exec.php
 */
function cmd_exec($cmd, &$stdout, &$stderr)
{
    $outfile = tempnam(".", "cmd");
    $errfile = tempnam(".", "cmd");
    $descriptorspec = array(
        0 => array("pipe", "r"),
        1 => array("file", $outfile, "w"),
        2 => array("file", $errfile, "w")
    );  
    $proc = proc_open($cmd, $descriptorspec, $pipes);

    if (!is_resource($proc)) return 255;

    fclose($pipes[0]);    //Don't really want to give any input

    $exit = proc_close($proc);
    $stdout = file($outfile);
    $stderr = file($errfile);

    unlink($outfile);
    unlink($errfile);
    return $exit;
}

function update()
{
    $cmd = "git pull";
    $exit_code = cmd_exec($cmd, $stdout, $stderr);
?><!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><title>Update</title></head>
<body>
<h1>Update</h1>
<h2>exit code</h2>
<pre><?php print($exit_code); ?></pre>
<h2>stdout</h2>
<pre><?php foreach($stdout as $line) { print($line); } ?></pre>
<h2>stderr</h2>
<pre><?php foreach($stderr as $line) { print($line); } ?></pre>
</body>
</html><?php
}

update();

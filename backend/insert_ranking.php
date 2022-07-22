<?php
$grade = $_POST['grade'];
$subject = $_POST['subject'];
$name = $_POST['name'];
$score = (int)$_POST['score'];

$db = parse_url(getenv("DATABASE_URL"));

try {
    $dbh = new PDO("pgsql:" . sprintf(
        "host=%s;port=%s;user=%s;password=%s;dbname=%s",
        $db["host"],
        $db["port"],
        $db["user"],
        $db["pass"],
        ltrim($db["path"], "/")
    ));

    $tables = array(
        'elem' => array(
            'math' => 'elem_math',
            'jpn' => 'elem_jpn',
            'eng' => 'elem_eng',
            'sci' => 'elem_sci',
            'social' => 'elem_social'
        ),
        'mid' => array(
            'math' => 'mid_math',
            'jpn' => 'mid_jpn',
            'eng' => 'mid_eng',
            'sci' => 'mid_sci',
            'social' => 'mid_social'
        ),
        'high' => array(
            'math' => 'high_math',
            'jpn' => 'high_jpn',
            'eng' => 'high_eng',
            'physics' => 'high_physics',
            'chem' => 'high_chem',
            'bio' => 'high_bio',
            'geology' => 'high_geology',
            'japanhis' => 'high_japanhis',
            'worldhis' => 'high_worldhis',
            'geography' => 'high_geography'
        )
    );

    $sql = 'select count(*) as records_count, min(score) as min_score from ' . $tables[$grade][$subject];
    $stmt = $dbh->prepare($sql);
    $stmt->execute();

    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    $records_count = $result['records_count'];
    $min_score = $result['min_score'];

    function insert_record()
    {
        global $dbh, $tables, $grade, $subject, $name, $score;
        $sql = 'insert into ' . $tables[$grade][$subject] . ' (name, score) values (?, ?)';
        $stmt = $dbh->prepare($sql);
        $stmt->execute(array($name, $score));
    }

    function delete_min_record()
    {
        global $dbh, $tables, $grade, $subject, $min_score;
        $sql = 'delete from ' . $tables[$grade][$subject] . ' where score = ?';
        $stmt = $dbh->prepare($sql);
        $stmt->execute(array($min_score));
    }

    if ($records_count < 100) {
        insert_record();
        echo 'ok';
    } else if ($score > $min_score) {
        delete_min_record();
        insert_record();
        echo 'ok';
    } else {
        echo 'already filled';
    }
    exit;
} catch (PDOException $e) {
    echo 'server error';
    exit;
}

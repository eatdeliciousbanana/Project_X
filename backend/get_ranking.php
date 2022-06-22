<?php
$dsn = 'mysql:dbname=ranking;host=localhost';
$user = 'ranking_user';
$password = 'password';

try {
    $dbh = new PDO($dsn, $user, $password);

    $tables = array(
        'elem_math',
        'elem_jpn',
        'elem_eng',
        'elem_sci',
        'elem_social',
        'mid_math',
        'mid_jpn',
        'mid_eng',
        'mid_sci',
        'mid_social',
        'high_math',
        'high_jpn',
        'high_eng',
        'high_physics',
        'high_chem',
        'high_bio',
        'high_geology',
        'high_japanhis',
        'high_worldhis',
        'high_geography'
    );

    $returnList = array();

    foreach ($tables as $table) {
        $sql = 'select name, score from ' . $table;
        $stmt = $dbh->prepare($sql);
        $stmt->execute();

        $returnList[$table] = array();

        while ($result = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $returnList[$table][] = array(
                'name' => $result['name'],
                'score' => $result['score']
            );
        }
    }

    header("Content-type: application/json; charset=UTF-8");
    echo json_encode($returnList);
    exit;
} catch (PDOException $e) {
    echo 'server error';
    exit;
}

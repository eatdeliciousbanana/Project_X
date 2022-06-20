<?php
$grade = $_GET['grade'];
$subject = $_GET['subject'];

$dsn = 'mysql:dbname=ranking;host=localhost';
$user = 'ranking_user';
$password = 'password';

try {
    $dbh = new PDO($dsn, $user, $password);

    switch ($grade) {
        case 'elem':
            switch ($subject) {
                case 'math':
                    $sql = 'select id, date, name, score from elem_math';
                    break;
                case 'jpn':
                    $sql = 'select id, date, name, score from elem_jpn';
                    break;
                case 'eng':
                    $sql = 'select id, date, name, score from elem_eng';
                    break;
                case 'sci':
                    $sql = 'select id, date, name, score from elem_sci';
                    break;
                case 'social':
                    $sql = 'select id, date, name, score from elem_social';
                    break;
                default:
                    break;
            }
            break;
        case 'mid':
            switch ($subject) {
                case 'math':
                    $sql = 'select id, date, name, score from mid_math';
                    break;
                case 'jpn':
                    $sql = 'select id, date, name, score from mid_jpn';
                    break;
                case 'eng':
                    $sql = 'select id, date, name, score from mid_eng';
                    break;
                case 'sci':
                    $sql = 'select id, date, name, score from mid_sci';
                    break;
                case 'social':
                    $sql = 'select id, date, name, score from mid_social';
                    break;
                default:
                    break;
            }
            break;
        case 'high':
            switch ($subject) {
                case 'math':
                    $sql = 'select id, date, name, score from high_math';
                    break;
                case 'jpn':
                    $sql = 'select id, date, name, score from high_jpn';
                    break;
                case 'eng':
                    $sql = 'select id, date, name, score from high_eng';
                    break;
                case 'physics':
                    $sql = 'select id, date, name, score from high_physics';
                    break;
                case 'chem':
                    $sql = 'select id, date, name, score from high_chem';
                    break;
                case 'bio':
                    $sql = 'select id, date, name, score from high_bio';
                    break;
                case 'geology':
                    $sql = 'select id, date, name, score from high_geology';
                    break;
                case 'japanhis':
                    $sql = 'select id, date, name, score from high_japanhis';
                    break;
                case 'worldhis':
                    $sql = 'select id, date, name, score from high_worldhis';
                    break;
                case 'geography':
                    $sql = 'select id, date, name, score from high_geography';
                    break;
                default:
                    break;
            }
            break;
        default:
            break;
    }

    $stmt = $dbh->prepare($sql);
    $stmt->execute();

    $returnList = array();
    while ($result = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $returnList[] = array(
            'id' => $result['id'],
            'date' => $result['date'],
            'name' => $result['name'],
            'score' => $result['score']
        );
    }

    header("Content-type: application/json; charset=UTF-8");
    echo json_encode($returnList);
    exit;
} catch (PDOException $e) {
    echo $e->getMessage();
    exit;
}

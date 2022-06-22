$(function () {
    let ranking = {};  // ランキング
    getRanking();
    setTimeout(function () {
        console.log(ranking);
    }, 1000);

    // 全教科のランキングを取得する関数
    function getRanking() {
        $.ajax({
            type: 'GET',
            url: '/backend/get_ranking.php'
        }).then(
            // 成功時
            function (data, textStatus, jqXHR) {
                if (typeof data !== 'object') {
                    console.log(data);
                    alert('ランキングの読み込みに失敗しました');
                    return;
                }
                for (let table in data) {
                    data[table].sort(function (first, second) {
                        if (first.score > second.score) {
                            return -1;
                        } else if (first.score < second.score) {
                            return 1;
                        } else {
                            return 0;
                        }
                    });
                }
                ranking = data;
            },
            // エラー発生時
            function (jqXHR, textStatus, errorThrown) {
                alert('ランキングの読み込みに失敗しました');
            }
        );
    }
});
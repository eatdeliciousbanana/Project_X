// $ = jQuery,$はjQueryのライブラリを示す
$(function () {

    let ranking = {};  // ランキング
    getRanking();

    // ランキングの読込みに時間がかかるために1秒後にランキングの要素にアクセス
    setTimeout(function () {
        console.log(ranking);
        writeHtml("elem_math", 5);
        writeHtml("elem_jpn", 5);
        writeHtml("elem_eng", 5);
        writeHtml("elem_sci", 5);
        writeHtml("elem_social", 5);

        writeHtml("mid_math", 5);
        writeHtml("mid_jpn", 5);
        writeHtml("mid_eng", 5);
        writeHtml("mid_sci", 5);
        writeHtml("mid_social", 5);

        writeHtml("high_math", 5);
        writeHtml("high_jpn", 5);
        writeHtml("high_eng", 5);
        writeHtml("high_chem", 5);
        writeHtml("high_physics", 5);
        writeHtml("high_geography", 5);
        writeHtml("high_bio", 5);
        writeHtml("high_worldhis", 5);
        writeHtml("high_japanhis", 5);
        writeHtml("high_geology", 5);
    }, 1000);

    function writeHtml(subj, range) {

        for(let i = 0;i < range; i++){
            if(typeof ranking[subj][i] === "undefined"){
                //  console.log("worning: Access violation in ranking '" + subj + "' array.")
                break;
            }
            $("ol." + subj + " > li").eq(i).html(ranking[subj][i]["name"] + " " + ranking[subj][i]["score"] + "点");  // 左から1番目の()は書き込みたいhtmlの要素、2番目のeq()でhtmlにおける要素の順番指定、3番目のhtml()でhtmlに書き込む文字列を指定
        }

    }

    // 全教科のランキングを取得する関数
    function getRanking() {

        // ランキングをデータベースから取得するphpを呼び出す
        $.ajax({
            type: 'GET',
            url: 'backend/get_ranking.php'
        }).then(        // ajax通信のリクエストの成功、失敗に実行される関数
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

// ランキングの小中高別の表示する関数
function high_school_show(){
    $("#ranking_elem_group").hide();
    $("#ranking_mid_group").hide();
    $("#ranking_high_group").show();
}

function mid_school_show(){
    $("#ranking_elem_group").hide();
    $("#ranking_high_group").hide();
    $("#ranking_mid_group").show();
}

function elem_school_show(){
    $("#ranking_mid_group").hide();
    $("#ranking_high_group").hide();
    $("#ranking_elem_group").show();
}
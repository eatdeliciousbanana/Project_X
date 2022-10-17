$(function () {
    let ranking = {};  // ランキング

    // ランキング読み込み
    getRanking().then((data) => {
        ranking = data;
        writeHtml();
        initPopover();
        $('.ranking_loading').each((i, elem) => {
            $(elem).hide();
        });
        $('.ranking_content').each((i, elem) => {
            $(elem).show();
        });
    });

    function writeHtml() {
        for (let subj in ranking) {
            for (let i = 0; i < ranking[subj].length; i++) {
                $(`.${subj}`).append(`<li style="width:fit-content;" data-bs-container="body" data-bs-toggle="popover" data-bs-placement="right" data-bs-content="${ranking[subj][i]['score']}点" data-bs-trigger="hover"> ${ranking[subj][i]['name']}</li>`);
            }
        }
    }

    function initPopover() {
        var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
        var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
            return new bootstrap.Popover(popoverTriggerEl)
        })
    }

    // 全教科のランキングを取得する関数
    async function getRanking() {
        try {
            const response = await fetch('/backend/get_ranking.php');
            if (response.ok) {
                let data = await response.json();
                if (Object.keys(data).length !== 20) {
                    console.log('server error');
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
                return data;
            } else {
                alert('ランキングの読み込みに失敗しました');
            }
        } catch (error) {
            alert('ランキングの読み込みに失敗しました');
        }
    }
});

// ランキングの小中高別の表示する関数
function high_school_show() {
    $("#ranking_elem_group").hide();
    $("#ranking_mid_group").hide();
    $("#ranking_high_group").show();
}

function mid_school_show() {
    $("#ranking_elem_group").hide();
    $("#ranking_high_group").hide();
    $("#ranking_mid_group").show();
}

function elem_school_show() {
    $("#ranking_mid_group").hide();
    $("#ranking_high_group").hide();
    $("#ranking_elem_group").show();
}
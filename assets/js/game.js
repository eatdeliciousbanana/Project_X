let typingWords = [];  // 文字

function typingGame() {
    // ゲーム読み込み
    switchScreen('loading');
    loadClock();
    loadKeyboard();
    loadTitle();
    loadConfig();
    loadMode();
    loadResult();
    getWords();  // jsonから文字取得

    // ゲーム読み込み完了
    window.setTimeout(function () {
        switchScreen('title');
    }, 1000);
}


/* 各ゲーム画面を遷移させる関数
   表示させたい画面の名前: screenName
   ロード画面: loading
   タイトル画面: title
   設定画面: config
   モード選択画面: mode
   スペースキーを押して開始: space
   プレイ画面: playing
   リザルト画面: result
*/
function switchScreen(screenName) {
    $('.switch_screen').each(function () {
        $(this).hide();
    });
    $(`#gamescreen_${screenName}`).show();

    if (screenName === 'space') {
        document.addEventListener('keydown', switchScreenAtSpace);
    }

    function switchScreenAtSpace(event) {
        if (event.code === 'Space') {
            loadPlaying();
            switchScreen('playing');
            this.removeEventListener('keydown', switchScreenAtSpace);
        }
    }
}


// 時計が動くようにする関数
function loadClock() {
    setInterval(() => {
        // 現在時間の取得
        const now = new Date();
        const h = now.getHours();
        const m = now.getMinutes();
        const s = now.getSeconds();

        // 時、分、秒を元に角度を計算
        const degH = h * (360 / 12) + m * (360 / 12 / 60);
        const degM = m * (360 / 60);
        const degS = s * (360 / 60);

        // 各要素を取得
        const elementH = document.querySelector(".c-clock__hour");
        const elementM = document.querySelector(".c-clock__min");
        const elementS = document.querySelector(".c-clock__sec");

        // styleを追加
        elementH.style.transform = `rotate(${degH}deg)`;
        elementM.style.transform = `rotate(${degM}deg)`;
        elementS.style.transform = `rotate(${degS}deg)`;
    }, 10);
}


// キーボードが動くようにする関数
function loadKeyboard() {
    let lightKey = '';  // 点灯中のキー
    document.addEventListener('keydown', function (event) {
        $('#key_' + lightKey).css('background-color', 'rgb(243, 243, 243)');
        lightKey = event.code;
        $('#key_' + lightKey).css('background-color', 'orange');
    });
}


// jsonから文字のオブジェクトを取ってくる関数
function getWords() {
    $.ajax({
        type: 'GET',
        url: './words.json',
        dataType: 'json'
    })
        .then(
            // 取得成功時
            function (json) {
                let data_stringify = JSON.stringify(json);
                let data_json = JSON.parse(data_stringify);
                data_json.forEach(function (word) {
                    typingWords.push(word);
                });
            },
            // エラー発生時
            function () {
                alert('jsonの読み込みに失敗しました');
            }
        );
}


// タイトル画面
function loadTitle() {

}


// 設定画面
function loadConfig() {

}


// モード画面
function loadMode() {

}


// プレイ画面
function loadPlaying() {
    let index = 0;     // 文字のインデックス
    let untyped = '';  // 打ってない文字
    let typed = '';    // 打った文字
    let score = 0;     // 得点

    // 文字フィールドを初期化
    index = getRandom(0, typingWords.length);
    untyped = typingWords[index]['rome'];
    updateField(typingWords[index], score);

    // キー入力したときの処理
    document.addEventListener('keydown', typeKey);


    // キー入力したときの処理の関数
    function typeKey(event) {
        // 入力したキーが、打ってない文字の先頭であった場合
        if (event.key === untyped.charAt(0)) {
            // 打ってない文字の先頭を打った文字の末尾に追加
            typed += untyped.charAt(0);
            untyped = untyped.slice(1);

            // 全部打ち終わったら新しい文字にする
            if (untyped === '') {
                index = getRandom(0, typingWords.length);
                untyped = typingWords[index]['rome'];
                typed = '';
                score += 100;
                updateField(typingWords[index], score);
                return;
            }

            // HTML要素に反映
            $('#untyped').html(untyped);
            $('#typed').html(typed);
        }
    }


    // 文字フィールドに新たな文字を設定する関数
    function updateField(word, s) {
        $('#kanzi_field').html(word['kanzi']);
        $('#kana_field').html(word['kana']);
        $('#untyped').html(word['rome']);
        $('#typed').html('');
        $('#score').html('現在' + s + '点');
    }


    // m以上n未満のランダムな整数を返す関数
    function getRandom(m, n) {
        return Math.floor(Math.random() * (n - m)) + m;
    }


    // カウントダウン処理
    let count = 20;
    function countDown() {
        const timeoutId = setTimeout(countDown, 1000);
        $('#time').html('残り' + count-- + '秒');
        if (count === -1) {
            clearTimeout(timeoutId);  //timeoutIdをclearTimeoutで指定している
            document.removeEventListener('keydown', typeKey);
            switchScreen('result');  //結果を表示する
        }
    }
    countDown();


    // 1000msおきにプログレスバーを更新する
    let val = 0;
    let intervalID;
    intervalID = setInterval(updateProgress, 1000);

    // プログレスバーを更新する
    function updateProgress() {
        // プログレスバーの進捗値を更新し、プログレスバーに反映させる
        val += 1;
        document.getElementById("myProgress").value = val;
        document.getElementById("myProgress").innerText = val + "%";

        // 最大値まで達したら終了
        if (val == 20) {
            clearInterval(intervalID);
            document.getElementById("begin").disabled = false;
        }
    }
}


// リザルト画面
function loadResult() {

}
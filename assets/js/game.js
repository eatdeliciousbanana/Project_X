// グローバル変数
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
    let intervalId = window.setInterval(function () {
        if (typingWords.length) {
            switchScreen('title');
            window.clearInterval(intervalId);
        }
    }, 100);
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
        $('#key_' + lightKey).css('background-color', 'rgb(220, 220, 220)');
        event.preventDefault();  // スペースキーを押したときのスクロールを無効化
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


// モード選択画面
function loadMode() {

}


// プレイ画面
function loadPlaying() {
    let index = 0;     // 文字のインデックス
    let untyped = '';  // 打ってない文字
    let typed = '';    // 打った文字
    let score = 0;     // 得点
    let right_typeCount = 0;  // 正しくキーを押した回数
    let renda_value;  // 連続して正しく打った文字数

    // 文字フィールドを初期化
    index = getRandom(0, typingWords.length);
    untyped = typingWords[index]['rome'];
    updateField(typingWords[index]);
    lightUpNextKey(untyped.charAt(0));

    // キー入力したときの処理
    document.addEventListener('keydown', typeKey);


    // キー入力したときの処理の関数
    function typeKey(event) {

        // 入力したキーが、打ってない文字の先頭であった場合
        if (event.key === untyped.charAt(0)) {
            // 前のキーを消灯する
            lightDownPrevKey(event.key);

            // playメソッドでキー打鍵音を再生する
            document.getElementById(`typing_sound${right_typeCount++ % 20}`).play();

            // 打ってない文字の先頭を打った文字の末尾に追加
            typed += untyped.charAt(0);
            untyped = untyped.slice(1);

            // 全部打ち終わったら新しい文字にする
            if (untyped === '') {
                index = getRandom(0, typingWords.length);
                untyped = typingWords[index]['rome'];
                typed = '';
                // score += 100;
                updateField(typingWords[index]);
            }

            // HTML要素に反映
            $('#untyped').html(untyped);
            $('#typed').html(typed);

            // 次のキーを点灯する
            lightUpNextKey(untyped.charAt(0));

            // プログレスバーを更新
            renda_value = document.getElementById("myProgress").value;
            renda_value++;
            document.getElementById("myProgress").value = renda_value;

            if (renda_value === 50) {
                count += 100;
            } else if (renda_value === 100) {
                count += 100;
            } else if (renda_value === 150) {
                count += 2;
            } else if (renda_value === 200) {
                count += 3;
                renda_value = 0;
                document.getElementById("myProgress").value = renda_value;
            }
            score++;
            updateScore(score);
        } else {
            renda_value = 0;
            document.getElementById("myProgress").value = renda_value;
        }
    }


    // 文字フィールドに新たな文字を設定する関数
    function updateField(word) {
        $('#kanzi_field').html(word['kanzi']);
        $('#kana_field').html(word['kana']);
        $('#untyped').html(word['rome']);
        $('#typed').html('');
    }


    // 前に光っていたキーを消灯させる関数
    function lightDownPrevKey(key) {
        let target = '';
        if (key === '-') {
            target = 'Minus';
        } else if ('0123456789'.includes(key)) {
            target = 'Digit' + key;
        } else {
            target = 'Key' + key.toUpperCase();
        }
        $('#key_' + target).css('background-color', 'rgb(243, 243, 243)');
    }


    // 次に打つキーを点灯させる関数
    function lightUpNextKey(key) {
        let target = '';
        if (key === '-') {
            target = 'Minus';
        } else if ('0123456789'.includes(key)) {
            target = 'Digit' + key;
        } else {
            target = 'Key' + key.toUpperCase();
        }
        $('#key_' + target).css('background-color', 'orange');
    }


    // スコアを更新する関数
    function updateScore(score) {
        $('#score').html('現在' + score + '点');
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
}


// リザルト画面
function loadResult() {

}
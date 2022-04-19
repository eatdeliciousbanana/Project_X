$(function () {
    // グローバル変数
    let globalWords = {};  // 文字
    let mode = {           // モード
        grade: 'elem',   // 学年
        subject: 'jpn',  // 教科
        time: 60         // 制限時間
    };

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
    const intervalId = setInterval(function () {
        if (Object.keys(globalWords).length === 3) {
            switchScreen('title');
            clearInterval(intervalId);
        }
    }, 100);


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
                    globalWords = data_json;
                },
                // エラー発生時
                function () {
                    alert('jsonの読み込みに失敗しました');
                }
            );
    }


    // タイトル画面
    function loadTitle() {
        // ボタンをして画面遷移
        $('#title_btnStart').on('click', function () { switchScreen('mode') });
        $('#title_btnConfig').on('click', function () { switchScreen('config') });
    }


    // 設定画面
    function loadConfig() {
        // ボタンをして画面遷移
        $('#config_btnBack').on('click', function () { switchScreen('title') });
    }


    // モード選択画面
    function loadMode() {
        // モード選択
        $('.mode_select').each(function () {
            $(this).on('click', function () {
                const id = $(this).attr('id').split('_');
                mode.grade = id[0];
                mode.subject = id[1];
                mode.time = parseInt(id[2]);
                loadSpace();
                switchScreen('space');
            });
        });

        // 戻るボタン
        $('#mode_btnBack').on('click', function () { switchScreen('title') });
    }


    // スペースキーを押して開始
    function loadSpace() {
        // スペースキーを押してプレイ画面に遷移
        document.addEventListener('keydown', switchScreenAtSpace);

        function switchScreenAtSpace(event) {
            if (event.code === 'Space') {
                loadCountDown();
                switchScreen('countdown');
                this.removeEventListener('keydown', switchScreenAtSpace);
            }
        }
    }


    // カウントダウン画面
    function loadCountDown() {
        setTimeout(function () {
            loadPlaying();
            switchScreen('playing');
        }, 3000);
    }


    // プレイ画面
    function loadPlaying() {
        const words = globalWords[mode.grade][mode.subject];
        let index = 0;     // 文字のインデックス
        let untyped = '';  // 打ってない文字
        let typed = '';    // 打った文字
        let score = 0;     // 得点
        let right_typeCount = 0;  // 正しくキーを押した回数
        let miss_typeCount = 0;   // 誤ったキーを押した回数
        let renda_typeCount = 0;  // 連続して正しく打った文字数
        const progressBar = document.getElementById('myProgress');  // 連打メーター
        let timeLimit = mode.time;  // 制限時間

        // 文字フィールドを初期化
        index = getRandom(0, words.length);
        untyped = words[index]['rome'];
        updateField(words[index]);
        lightKey(untyped.charAt(0), 'on');

        // キー入力したときの処理
        document.addEventListener('keydown', typeKey);


        // キー入力したときの処理の関数
        function typeKey(event) {

            // エスケープキーが押されたらやり直し
            if (event.key === 'Escape') {
                endPlayingBeforeTimeLimit();
                loadSpace();
                switchScreen('space');
                return;
            }

            // 正しいキーを打った場合
            if (event.key === untyped.charAt(0)) {
                // 前のキーを消灯する
                lightKey(event.key, 'off');

                // playメソッドでキー打鍵音を再生する
                document.getElementById(`typing_sound${right_typeCount++ % 20}`).play();

                // 打ってない文字の先頭を打った文字の末尾に追加
                typed += untyped.charAt(0);
                untyped = untyped.slice(1);

                // 全部打ち終わったら新しい文字にする
                if (untyped === '') {
                    index = getRandom(0, words.length);
                    untyped = words[index]['rome'];
                    typed = '';
                    updateField(words[index]);
                }

                // 打った文字を画面に反映
                $('#untyped').html(untyped);
                $('#typed').html(typed);

                // 次のキーを点灯する
                lightKey(untyped.charAt(0), 'on');

                // 連打メーターを更新
                renda_typeCount++;
                progressBar.value = renda_typeCount;

                if (renda_typeCount === 50) {
                    timeLimit += 10;
                } else if (renda_typeCount === 100) {
                    timeLimit += 10;
                } else if (renda_typeCount === 150) {
                    timeLimit += 20;
                } else if (renda_typeCount === 200) {
                    timeLimit += 30;
                    renda_typeCount = 0;
                    progressBar.value = renda_typeCount;
                }

                // スコアを更新
                updateScore(++score);

            } else {  //間違ったキーを打った場合

                // playメソッドでミス音を再生する
                document.getElementById(`typing_miss_sound${miss_typeCount++ % 20}`).play();

                // 連打メーターをリセット
                renda_typeCount = 0;
                progressBar.value = renda_typeCount;
            }
        }


        // カウントダウン処理
        let timeoutId;
        function countDown() {
            timeoutId = setTimeout(countDown, 1000);
            $('#time').html(`残り${timeLimit--}秒`);
            if (timeLimit === -1) {
                clearTimeout(timeoutId);  //timeoutIdをclearTimeoutで指定している
                endPlaying();
                switchScreen('result');  //結果を表示する
            }
        }
        countDown();


        // プレイ画面を終了する関数
        function endPlaying() {
            document.removeEventListener('keydown', typeKey);
            lightKey(untyped.charAt(0), 'off');
            updateScore(0);
            progressBar.value = 0;
            $('#playing_btnMode').off();
            $('#playing_btnAgain').off();
        }


        // 時間切れになる前にプレイ画面を終了する関数
        function endPlayingBeforeTimeLimit() {
            clearTimeout(timeoutId);
            timeLimit = 0;
            countDown();
        }


        // m以上n未満のランダムな整数を返す関数
        function getRandom(m, n) {
            return Math.floor(Math.random() * (n - m)) + m;
        }


        // 文字フィールドに新たな文字を設定する関数
        function updateField(word) {
            $('#kanzi_field').html(word['kanzi']);
            $('#kana_field').html(word['kana']);
            $('#untyped').html(word['rome']);
            $('#typed').html('');
        }


        // スコアを更新する関数
        function updateScore(score) {
            $('#score').html(`現在${score}点`);
        }


        // キーのライトをつけたり消したりする関数
        function lightKey(key, on_or_off) {
            let target = '';
            if (key === '-') {
                target = 'Minus';
            } else if ('0123456789'.includes(key)) {
                target = 'Digit' + key;
            } else {
                target = 'Key' + key.toUpperCase();
            }
            if (on_or_off === 'on') {
                $('#key_' + target).css('background-color', 'orange');
            } else if (on_or_off === 'off') {
                $('#key_' + target).css('background-color', 'rgb(243, 243, 243)');
            }
        }


        // モード選択ボタンが押されたときの処理
        $('#playing_btnMode').on('click', function () {
            endPlayingBeforeTimeLimit();
            switchScreen('mode');
        });

        // やり直しボタンが押されたときの処理
        $('#playing_btnAgain').on('click', function () {
            endPlayingBeforeTimeLimit();
            loadSpace();
            switchScreen('space');
        });
    }


    // リザルト画面
    function loadResult() {
        // ボタンをして画面遷移
        $('#result_btnAgain').on('click', function () {
            loadSpace();
            switchScreen('space');
        });
        $('#result_btnMode').on('click', function () { switchScreen('mode') });
        $('#result_btnTitle').on('click', function () { switchScreen('title') });
    }
});


// ゲーム画面のカウントダウン
function setupFlip(tick) {
    document.addEventListener('keydown', function (event) {
        if (event.code === 'Space' && $('#gamescreen_space').css('display') === 'block') {
            tick.value = 3;
            const intervalId = setInterval(function () {
                tick.value--;
                if (tick.value === 0) {
                    clearInterval(intervalId);
                }
            }, 1000);
        }
    });
}
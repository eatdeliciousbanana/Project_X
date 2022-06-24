function typingGame(silent_mode) {
    // グローバル変数
    let globalWords = {};  // 文字
    let mode = {           // モード
        grade: 'elem',   // 学年
        subject: 'jpn',  // 教科
        time: 60,        // 制限時間
        div_num: 5        //タイプ文字数を割る数
    };
    let ranking = {};  // ランキング
    let score = 0;     // ゲームの得点

    // ゲーム読み込み
    loadClock();
    loadKeyboard();
    loadTitle();
    loadConfig();
    loadMode();
    loadResult();
    getWords();  // jsonから文字取得
    getRanking();  // ランキング取得

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
        if ($('#gamescreen_loading').css('display') === 'none' && screenName !== 'playing' && screenName !== 'result') {
            gameSound('tap', 'play');
        }
        $('.switch_screen').each(function () {
            $(this).hide();
        });
        $(`#gamescreen_${screenName}`).show();
    }


    // 音を再生する関数
    function gameSound(name, play_or_pause) {
        if (play_or_pause === 'play') {
            document.getElementById('sound_' + name).play();
        } else if (play_or_pause === 'pause') {
            document.getElementById('sound_' + name).pause();
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
            if (event.code === 'Space') {
                event.preventDefault();  // スペースキーを押したときのスクロールを無効化
            }
        });
    }


    // jsonから文字のオブジェクトを取ってくる関数
    function getWords() {
        $.ajax({
            type: 'GET',
            url: './words.json',
            dataType: 'json'
        }).then(
            // 取得成功時
            function (json) {
                let data_stringify = JSON.stringify(json);
                let data_json = JSON.parse(data_stringify);
                globalWords = data_json;
            },
            // エラー発生時
            function () {
                alert('ワードの読み込みに失敗しました');
            }
        );
    }


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


    // タイトル画面
    function loadTitle() {
        // ボタンをして画面遷移
        $('#title_btnStart').on('click', function () {
            gameSound('chime', 'play');
            switchScreen('mode');
        });
        $('#title_btnConfig').on('click', function () { switchScreen('config') });
    }


    // 設定画面
    function loadConfig() {
        const kana_field = document.getElementById('kana_field');
        const media_BGM = document.getElementById('sound_BGM');
        const media_SE = document.getElementsByClassName('sound_SE');
        const media_type = document.getElementsByClassName('sound_type');
        const media_typeMiss = document.getElementsByClassName('sound_typeMiss');

        const hurigana_check = document.getElementById('hurigana_check');
        const volumeSlider_BGM = document.getElementById('volumeSlider-BGM');
        const volumeSlider_SE = document.getElementById('volumeSlider-SE');
        const volumeSlider_type = document.getElementById('volumeSlider-type');
        const volumeSlider_typeMiss = document.getElementById('volumeSlider-typeMiss');

        const expires = 60 * 60 * 24 * 365;  // Cookieの有効期限（1年）

        // Cookie読み込み
        function loadCookie() {
            let cookie = document.cookie;
            let index, value;

            if ((index = cookie.indexOf('hurigana=')) !== -1) {
                value = cookie.slice(index + 9, index + 14);
                if (value.includes('true')) {
                    kana_field.style.display = 'block';
                    hurigana_check.checked = true;
                } else if (value.includes('false')) {
                    kana_field.style.display = 'none';
                    hurigana_check.checked = false;
                }
            }
            if ((index = cookie.indexOf('BGM=')) !== -1) {
                value = parseInt(cookie.slice(index + 4));
                media_BGM.volume = value / 100;
                volumeSlider_BGM.value = value;
            }
            if ((index = cookie.indexOf('SE=')) !== -1) {
                value = parseInt(cookie.slice(index + 3));
                for (let i = 0; i < media_SE.length; i++) {
                    media_SE.item(i).volume = value / 100;
                }
                volumeSlider_SE.value = value;
            }
            if ((index = cookie.indexOf('type=')) !== -1) {
                value = parseInt(cookie.slice(index + 5));
                for (let i = 0; i < media_type.length; i++) {
                    media_type.item(i).volume = value / 100;
                }
                volumeSlider_type.value = value;
            }
            if ((index = cookie.indexOf('typeMiss=')) !== -1) {
                value = parseInt(cookie.slice(index + 9));
                for (let i = 0; i < media_typeMiss.length; i++) {
                    media_typeMiss.item(i).volume = value / 100;
                }
                volumeSlider_typeMiss.value = value;
            }
        }
        loadCookie();

        if (silent_mode) {
            media_BGM.volume = 0;
            for (let i = 0; i < media_SE.length; i++) {
                media_SE.item(i).volume = 0;
            }
            for (let i = 0; i < media_type.length; i++) {
                media_type.item(i).volume = 0;
            }
            for (let i = 0; i < media_typeMiss.length; i++) {
                media_typeMiss.item(i).volume = 0;
            }
            volumeSlider_BGM.value = 0;
            volumeSlider_SE.value = 0;
            volumeSlider_type.value = 0;
            volumeSlider_typeMiss.value = 0;
        }

        hurigana_check.addEventListener('change', function () {
            if (hurigana_check.checked) {
                kana_field.style.display = 'block';
                document.cookie = `hurigana=true; Max-Age=${expires}`;
            } else {
                kana_field.style.display = 'none';
                document.cookie = `hurigana=false; Max-Age=${expires}`;
            }
        });

        // ID.media : 0 is min, 1.0 is max.
        volumeSlider_BGM.addEventListener('change', function () {
            media_BGM.volume = volumeSlider_BGM.value / 100;
            document.cookie = `BGM=${volumeSlider_BGM.value}; Max-Age=${expires}`;
            gameSound('BGM', 'play');
            setTimeout(function () { gameSound('BGM', 'pause') }, 1000);
        });

        volumeSlider_SE.addEventListener('change', function () {
            for (let i = 0; i < media_SE.length; i++) {
                media_SE.item(i).volume = volumeSlider_SE.value / 100;
            }
            document.cookie = `SE=${volumeSlider_SE.value}; Max-Age=${expires}`;
            gameSound('tap', 'play');
        });

        volumeSlider_type.addEventListener('change', function () {
            for (let i = 0; i < media_type.length; i++) {
                media_type.item(i).volume = volumeSlider_type.value / 100;
            }
            document.cookie = `type=${volumeSlider_type.value}; Max-Age=${expires}`;
            gameSound('type0', 'play');
        });

        volumeSlider_typeMiss.addEventListener('change', function () {
            for (let i = 0; i < media_typeMiss.length; i++) {
                media_typeMiss.item(i).volume = volumeSlider_typeMiss.value / 100;
            }
            document.cookie = `typeMiss=${volumeSlider_typeMiss.value}; Max-Age=${expires}`;
            gameSound('typeMiss0', 'play');
        });

        // ボタンをして画面遷移
        $('#config_btnBack').on('click', function () { switchScreen('title') });
    }


    // モード選択画面
    function loadMode() {
        // 学年選択
        $('#btn_elem').on('change', function () {
            $('#mode_elem').show();
            $('#mode_mid').hide();
            $('#mode_high').hide();
        });
        $('#btn_mid').on('change', function () {
            $('#mode_elem').hide();
            $('#mode_mid').show();
            $('#mode_high').hide();
        });
        $('#btn_high').on('change', function () {
            $('#mode_elem').hide();
            $('#mode_mid').hide();
            $('#mode_high').show();
        });

        // 各モードの設定
        const mode_conf = {
            elem: {
                math: {
                    time: 60,
                    div_num: 5
                },
                jpn: {
                    time: 60,
                    div_num: 5
                },
                eng: {
                    time: 60,
                    div_num: 3
                },
                sci: {
                    time: 60,
                    div_num: 5
                },
                social: {
                    time: 60,
                    div_num: 5
                }
            },
            mid: {
                math: {
                    time: 90,
                    div_num: 7
                },
                jpn: {
                    time: 90,
                    div_num: 7
                },
                eng: {
                    time: 90,
                    div_num: 4
                },
                sci: {
                    time: 90,
                    div_num: 7
                },
                social: {
                    time: 90,
                    div_num: 7
                }
            },
            high: {
                math: {
                    time: 120,
                    div_num: 10
                },
                jpn: {
                    time: 120,
                    div_num: 10
                },
                eng: {
                    time: 120,
                    div_num: 5
                },
                physics: {
                    time: 120,
                    div_num: 10
                },
                chem: {
                    time: 120,
                    div_num: 10
                },
                bio: {
                    time: 120,
                    div_num: 10
                },
                geology: {
                    time: 120,
                    div_num: 10
                },
                japanhis: {
                    time: 120,
                    div_num: 10
                },
                worldhis: {
                    time: 120,
                    div_num: 10
                },
                geography: {
                    time: 120,
                    div_num: 10
                }
            }
        };

        // 科目選択
        $('.mode_select').each(function () {
            $(this).on('click', function () {
                const id = $(this).attr('id').split('_');
                mode.grade = id[0];
                mode.subject = id[1];
                mode.time = mode_conf[mode.grade][mode.subject]['time'];
                mode.div_num = mode_conf[mode.grade][mode.subject]['div_num'];
                loadSpace();
                switchScreen('space');
            });
        });

        // 戻るボタン
        $('#mode_btnBack').on('click', function () { switchScreen('title') });
    }


    // スペースキーを押して開始
    function loadSpace() {
        // 学年と科目を表示
        let ret = mode2str();
        $('#gamescreen_space_subject').html(`科目：${ret[0]}/${ret[1]}`);
        $('#gamescreen_space_time').html(`制限時間：${mode.time}秒`);

        // 制限時間セット
        time_tick.value = mode.time;

        // スペースキーを押してプレイ画面に遷移
        document.addEventListener('keydown', switchScreenAtSpace);

        function switchScreenAtSpace(event) {
            if (event.code === 'Space') {
                loadCountDown();
                switchScreen('countdown');
                gameSound('countDown', 'play');
                gameSound('BGM', 'play');
                this.removeEventListener('keydown', switchScreenAtSpace);
            }
        }
    }


    // モードの学年と教科の文字を取得する関数
    function mode2str() {
        let grade, subject;
        switch (mode.grade) {
            case 'elem':
                grade = '小学校';
                break;
            case 'mid':
                grade = '中学校';
                break;
            case 'high':
                grade = '高校';
                break;
            default:
                break;
        }
        switch (mode.subject) {
            case 'jpn':
                subject = '国語';
                break;
            case 'math':
                if (mode.grade === 'elem') {
                    subject = '算数';
                } else {
                    subject = '数学';
                }
                break;
            case 'sci':
                subject = '理科';
                break;
            case 'social':
                subject = '社会';
                break;
            case 'eng':
                subject = '英語';
                break;
            case 'physics':
                subject = '物理';
                break;
            case 'chem':
                subject = '化学';
                break;
            case 'bio':
                subject = '生物';
                break;
            case 'geology':
                subject = '地学';
                break;
            case 'japanhis':
                subject = '日本史';
                break;
            case 'worldhis':
                subject = '世界史';
                break;
            case 'geography':
                subject = '地理';
                break;
            default:
                break;
        }
        return [grade, subject];
    }


    // カウントダウン画面
    function loadCountDown() {
        countdown_tick.value = 3;
        const intervalId = setInterval(function () {
            countdown_tick.value--;
            if (countdown_tick.value === 0) {
                clearInterval(intervalId);
            }
        }, 1000);

        setTimeout(function () {
            loadPlaying();
            switchScreen('playing');
        }, 3000);
    }


    // プレイ画面
    function loadPlaying() {
        const words = globalWords[mode.grade][mode.subject];
        let untyped = '';  // 打ってない文字
        let typed = '';    // 打った文字
        score = 0;         // 得点
        let word_count = 0;       // 打ったワード数
        let right_typeCount = 0;  // 正しくキーを押した回数
        let miss_typeCount = 0;   // 誤ったキーを押した回数
        let renda_typeCount = 0;  // 連続して正しく打った文字数
        let timeLimit = mode.time;  // 制限時間
        let additional_time = 0;    // 追加時間の合計
        let bonus_state = 0;        // 時間追加ボーナスの段階（0,1,2,3の4段階）
        const bonus_time = [1, 1, 2, 3];     // 時間追加ボーナス（1秒,1秒,2秒,3秒）
        const meters = [fm0, fm1, fm2, fm3];  // 液体メーター

        // 文字を初期化
        updateWord();
        lightKey(untyped.charAt(0), 'on');

        // メーターの文字を初期化
        $('#meter_msg').html(`+${bonus_time[bonus_state]}sec`);

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

                // キー打鍵音を再生
                gameSound(`type${right_typeCount++ % 20}`, 'play');

                // 打ってない文字の先頭を打った文字の末尾に追加
                typed += untyped.charAt(0);
                untyped = untyped.slice(1);

                // 全部打ち終わったら新しい文字にする
                if (untyped === '') {
                    wordcount_tick.value = ++word_count;
                    score += Math.round(typed.length / mode.div_num);
                    updateScore(score);
                    updateWord();
                }

                // 打った文字を画面に反映
                $('#untyped').html(untyped.replace(/\*/g, '').replace(/ /g, '_'));
                $('#typed').html(typed.replace(/\*/g, '').replace(/ /g, '_'));

                // 次のキーを点灯する
                if (untyped.charAt(0) === '*') {
                    lightKey(untyped.charAt(1), 'on');
                } else {
                    lightKey(untyped.charAt(0), 'on');
                }

                // 連打メーターを更新
                if (++renda_typeCount === 50) {
                    timeLimit += bonus_time[bonus_state];
                    time_tick.value = timeLimit;
                    additional_time += bonus_time[bonus_state];
                    meters[bonus_state].setPercentage(0);
                    switchBonusState();
                    renda_typeCount = 0;
                } else {
                    meters[bonus_state].setPercentage(renda_typeCount * 2);
                }

            } else {  //間違ったキーを打った場合

                // キー代替処理
                if (mode.subject !== 'eng') {
                    let alter = '';
                    if (alter = checkTypeMiss(event.key, typed, untyped)) {
                        if (untyped.charAt(0) === '*') {
                            lightKey(untyped.charAt(1), 'off');
                        } else {
                            lightKey(untyped.charAt(0), 'off');
                        }
                        untyped = alter;
                        document.dispatchEvent(new KeyboardEvent('keydown', { key: untyped.charAt(0) }));
                        return;
                    }
                }

                // ミス音を再生
                gameSound(`typeMiss${miss_typeCount++ % 20}`, 'play');

                // 連打メーターをリセット
                renda_typeCount = 0;
                meters[bonus_state].setPercentage(0);
            }
        }


        // カウントダウン処理
        let timeoutId;
        function countDown() {
            timeoutId = setTimeout(countDown, 1000);
            time_tick.value = timeLimit--;
            if (timeLimit === -1) {
                clearTimeout(timeoutId);  //timeoutIdをclearTimeoutで指定している
                endPlaying();
            }
        }
        countDown();


        // プレイ画面を終了する関数
        function endPlaying() {
            gameSound('BGM', 'pause');
            document.removeEventListener('keydown', typeKey);
            if (untyped.charAt(0) === '*') {
                lightKey(untyped.charAt(1), 'off');
            } else {
                lightKey(untyped.charAt(0), 'off');
            }
            meters[bonus_state].setPercentage(0);
            switchBonusState(true);
            $('#playing_btnMode').off();
            $('#playing_btnAgain').off();
            switchScreen('result');
            prepareResult();
        }


        // 時間切れになる前にプレイ画面を終了する関数
        function endPlayingBeforeTimeLimit() {
            updateScore(0);
            wordcount_tick.value = 0;
            clearTimeout(timeoutId);
            timeLimit = 0;
            countDown();
        }


        // リザルト画面と成績表の準備をする関数
        function prepareResult() {
            $('#result_score').html(score + '点');
            $('#result_type').html(right_typeCount + '回');
            $('#result_average').html((right_typeCount / (mode.time + additional_time)).toFixed(1) + '回/秒');
            $('#result_misstype').html(miss_typeCount + '回');

            $('#tuuchi_score_value').html(score + '点');
            $('#tuuchi_word_value').html(word_count + 'ワード');
            $('#tuuchi_type_value').html(right_typeCount + '回');

            let average_value = right_typeCount / (mode.time + additional_time);
            $('#tuuchi_average_value').html(average_value.toFixed(1) + '回/秒');
            $('#tuuchi_misstype_value').html(miss_typeCount + '回');

            let missratio_value = 100 * miss_typeCount / (miss_typeCount + right_typeCount);
            $('#tuuchi_missratio_value').html(missratio_value.toFixed(2) + '%');

            set_Evaluation(average_value, missratio_value);

            let ret = mode2str();
            $('#tuuchi_subject').html(`教科：${ret[0]}/${ret[1]}`);

            let records = ranking[`${mode.grade}_${mode.subject}`];
            let i;
            for (i = 0; i < records.length; i++) {
                if (score > records[i].score) {
                    break;
                }
            }
            if (i < 100) {
                $('#tuuchi_rank').html(`${i + 1}位`);
                $('#tuuchi_btnRegister').html('登録');
                $('#tuuchi_btnRegister').prop('disabled', false);
                $('#tuuchi_ranking_name').val('');
                $('#tuuchi_ranking_name').prop('disabled', false);
                $('#tuuchi_ranking_name').prop('placeholder', 'ランキング表示名を入力');
            } else {
                $('#tuuchi_rank').html('圏外');
                $('#tuuchi_btnRegister').html('登録');
                $('#tuuchi_btnRegister').prop('disabled', true);
                $('#tuuchi_ranking_name').val('');
                $('#tuuchi_ranking_name').prop('disabled', true);
                $('#tuuchi_ranking_name').prop('placeholder', `入賞まであと${records[i - 1].score - score + 1}点`);
            }

            $('#result_block1').hide().fadeIn(1000);
            $('#result_block2').hide();
            setTimeout(function () {
                $('#result_block2').fadeIn(1000);
            }, 500);
        }


        function set_Evaluation(average_value, missratio_value) {
            let rank, ave_rank, miss_rank;

            // Set score,word and type evaluation
            if (score >= 80) {
                rank = 'A';
            }
            else if (score >= 50) {
                rank = 'B';
            }
            else {
                rank = 'C';
            }
            $('#tuuchi_score_eval').html(rank);
            $('#tuuchi_word_eval').html(rank);
            $('#tuuchi_type_eval').html(rank);

            // Set average evaluation
            // 値は適当です
            if (average_value >= 10) {
                ave_rank = 'A';
            }
            else if (average_value >= 5) {
                ave_rank = 'B';
            }
            else {
                ave_rank = 'C';
            }
            $('#tuuchi_average_eval').html(ave_rank);

            // Set score,word and type evaluation
            // 値は適当です
            if (missratio_value >= 5) {
                miss_rank = 'C';
            }
            else if (missratio_value >= 3) {
                miss_rank = 'B';
            }
            else {
                miss_rank = 'A';
            }
            $('#tuuchi_misstype_eval').html(miss_rank);
            $('#tuuchi_missratio_eval').html(miss_rank);
        }


        // m以上n未満のランダムな整数を返す関数
        function getRandom(m, n) {
            return Math.floor(Math.random() * (n - m)) + m;
        }


        // 新たな文字を設定する関数
        function updateWord() {
            let index = getRandom(0, words.length);
            let rome = '';
            if (mode.subject === 'eng') {
                rome = words[index]['kana'].toLowerCase();
            } else {
                rome = kanaToRoman(words[index]['kana'], 'kunrei', { bmp: false, longSound: 'hyphen' });
            }
            untyped = rome;
            typed = '';
            $('#kanzi_field').html(words[index]['kanzi']);
            $('#kana_field').html(words[index]['kana']);
            $('#untyped').html(rome.replace(/\*/g, '').replace(/ /g, '_'));
            $('#typed').html('');
        }


        // スコアを更新する関数
        function updateScore(score) {
            score_tick.value = score;
        }


        // キーのライトをつけたり消したりする関数
        function lightKey(key, on_or_off) {
            let target = '';
            if (key === '-') {
                target = 'Minus';
            } else if (key === ' ') {
                target = 'Space';
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


        // 時間追加ボーナスの段階を切り替える関数
        function switchBonusState(reset = false) {
            if (reset) {
                $(`#fluid-meter-${bonus_state}`).hide();
                $('#fluid-meter-0').show();
                $('#meter_msg').html('');
            } else {
                $(`#fluid-meter-${bonus_state}`).hide();
                bonus_state = (bonus_state + 1) % 4;
                $(`#fluid-meter-${bonus_state}`).show();
                gameSound('bonusTime', 'play');
                $('#meter_msg').animate({ fontSize: '30px' }, 200, 'swing', function () {
                    $('#meter_msg').animate({ fontSize: '25px' }, 200, 'swing', function () {
                        $('#meter_msg').html(`+${bonus_time[bonus_state]}sec`);
                    });
                });
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
            score_tick.value = 0;
            wordcount_tick.value = 0;
            loadSpace();
            switchScreen('space');
        });
        $('#result_btnMode').on('click', function () {
            score_tick.value = 0;
            wordcount_tick.value = 0;
            switchScreen('mode');
        });
        $('#result_btnTitle').on('click', function () {
            score_tick.value = 0;
            wordcount_tick.value = 0;
            switchScreen('title');
        });

        // 登録ボタンを押してランキングに登録
        $('#tuuchi_btnRegister').on('click', function () {
            let name = $('#tuuchi_ranking_name').val();
            if (name === '') {
                alert('ランキング表示名を入力してください');
            } else if (name.length > 20) {
                alert('ランキング表示名は1文字以上20文字以内で入力してください');
            } else {
                $('#tuuchi_btnRegister').html('完了');
                $('#tuuchi_btnRegister').prop('disabled', true);
                $('#tuuchi_ranking_name').prop('disabled', true);
                insertRanking(mode.grade, mode.subject, name, score);
            }
        });

        // 名前とスコアをランキングに登録する関数
        function insertRanking(grade, subject, name, score) {
            $.ajax({
                type: 'POST',
                url: '/backend/insert_ranking.php',
                data: { grade: grade, subject: subject, name: name, score: score }
            }).then(
                // 成功時
                function (data, textStatus, jqXHR) {
                    if (data === 'ok') {
                        return;
                    } else if (data === 'already filled') {
                        alert('ランキングに登録できませんでした\nすでに100人登録されています\nもう一度挑戦して, より高得点を目指してください!');
                    } else {
                        console.log(data);
                        alert('ランキングの登録に失敗しました');
                    }
                },
                // エラー発生時
                function (jqXHR, textStatus, errorThrown) {
                    alert('ランキングの登録に失敗しました');
                }
            );
        }
    }
}


// カウントダウンのフリップ
function setupCountDown(tick) {
    window.countdown_tick = tick;
}

// 得点のフリップ
function setupScore(tick) {
    window.score_tick = tick;
}

// ワード数のフリップ
function setupWordCount(tick) {
    window.wordcount_tick = tick;
}

// 残り時間のフリップ
function setupTime(tick) {
    window.time_tick = tick;
}

// 文字アニメーション
Splitting();
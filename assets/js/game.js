function typingGame() {
    let words = [];    // 文字
    let index = 0;     // 文字のインデックス
    let untyped = '';  // 打ってない文字
    let typed = '';    // 打った文字
    let score = 0;     // 得点

    // jsonから文字取得
    getWords(words);

    // 文字フィールドを初期化
    window.setTimeout(function () {
        index = getRandom(0, words.length);
        untyped = words[index]['rome'];
        updateField(words[index], score);
    }, 1000);

    let lightKey = '';  // 点灯中のキー

    // カウントダウン処理
    let count = 20;
    countDown = () => {
        const timeoutId = setTimeout(countDown, 1000);
        $('#time').html('残り'  + count-- + '秒');
        if(count === -1){
      clearTimeout(timeoutId);  //timeoutIdをclearTimeoutで指定している
        $('#result-img').show(); //結果を表示する
        $('#play-btn').show();
       }
    } 
    countDown();

    // キー入力したときの処理
    
    document.addEventListener('keydown', function (event) {

        // キー点灯
        $('#key_' + lightKey).css('background-color', 'rgb(243, 243, 243)');
        lightKey = event.code;
        $('#key_' + lightKey).css('background-color', 'orange');
    
        // 入力したキーが、打ってない文字の先頭であった場合
        if (event.key === untyped.charAt(0)) {
            // 打ってない文字の先頭を打った文字の末尾に追加
            typed += untyped.charAt(0);
            untyped = untyped.slice(1);
    
            // 全部打ち終わったら新しい文字にする
            if (untyped === '') {
                index = getRandom(0, words.length);
                untyped = words[index]['rome'];
                typed = '';
                score += 100;
                updateField(words[index], score);
                return;
            }
    
            // HTML要素に反映
            $('#untyped').html(untyped);
            $('#typed').html(typed);
        }
    });
    
    }

    var val;
  // 一定間隔で処理を行うintervalのIDを保持
  var intervalID;

  // ボタンを押した時に動く関数
  function begin() {
    val = 0;
    // ボタンを無効にする(何回も押せないように)
    document.getElementById("begin").disabled = true;
    // 1000msおきにプログレスバーを更新する
    intervalID = setInterval("updateProgress()", 1000);
  }

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
    

    // 時計
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


// jsonから文字のオブジェクトを取ってくる関数
function getWords(words) {
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
                    words.push(word);
                });
            },
            // エラー発生時
            function () {
                alert('jsonの読み込みに失敗しました');
            }
        );
}


// 文字フィールドに新たな文字を設定する関数
function updateField(word, s) {
    $('#kanzi_field').html(word['kanzi']);
    $('#kana_field').html('（' + word['kana'] + '）');
    $('#untyped').html(word['rome']);
    $('#typed').html('');
    $('#score').html('現在' + s + '点');
}


// m以上n未満のランダムな整数を返す関数
function getRandom(m, n) {
    return Math.floor(Math.random() * (n - m)) + m;
}
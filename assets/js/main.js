$(function () {
    // Lets's start!!を押して選択画面
    $('#btn_gamestart').on('click', function () {
        $('#header').hide();
        $('#select').show();
    });

    // スタートボタンを押してゲーム開始
    $('#begin').on('click', function () {
        typingGame();
        $('#select').hide();
        $('#gamescreen').show();
    });
});
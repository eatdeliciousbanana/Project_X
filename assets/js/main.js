$(function () {
    // スタートボタンを押してゲーム開始
    $('#btn_gamestart').on('click', function () {
        typingGame();
        $('#header').hide();
        $('#gamescreen').show();
    });
});
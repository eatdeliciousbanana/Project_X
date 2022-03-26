$(function () {
    // Lets's start!!を押して選択画面
    $('#btn_gamestart').on('click', function () {
        typingGame();
        $('#header').hide();
        $('#gamescreen').show();
    });
}); 
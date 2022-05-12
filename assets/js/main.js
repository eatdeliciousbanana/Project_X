$(function () {
    // Lets's start!!を押してスタート
    $('#btn_gamestart').on('click', function () {
        typingGame(false);
        $('#header').hide();
        $('#gamescreen').show();
    });

    // サイレント
    $('#btn_gamestart_silent').on('click', function () {
        typingGame(true);
        $('#header').hide();
        $('#gamescreen').show();
    });

    function adjustHeader() {
        const hsize = $(window).height() - 75;
        $("#header").css("height", hsize + "px");
        $("#header-img").css("height", hsize + "px");
    }

    adjustHeader();
    window.onresize = adjustHeader;
}); 
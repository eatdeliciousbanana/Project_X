$(function () {
    // Lets's start!!を押して選択画面
    $('#btn_gamestart').on('click', function () {
        $('#header').hide();
        $('#gamescreen').show();
    });
});

// header(75px)分は静的に引いています
$(document).ready(function () {
    hsize = $(window).height()-75;
    $("#gamescreen").css("height", hsize + "px");
});
$(window).resize(function () {
    hsize = $(window).height()-75;
    $("#gamescreen").css("height", hsize + "px");
});

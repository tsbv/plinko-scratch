var bonusUpdateInt = setInterval(bUpdate, 50);
var curBonus = 0;
var realBonus = 0;
var playBtn = document.getElementById("playbtn");
var playBtnEnabled = true;
var plinkoGameGravity = 3;
var canStartGame = false;
function bUpdate() {
    if (curBonus > realBonus) curBonus = realBonus;
    if (curBonus < realBonus) {
        curBonus += 5;
        var div = document.getElementById('bonus');
        div.innerHTML = '<span class="nl-block none">WIN $' + curBonus + ' BONUS</span><span class="fr-block none">GAGNER ' + curBonus + '$ BONUS</span>';
    }
    if (playBtnEnabled) playBtn.classList.remove("playbtn-disable");
    else playBtn.classList.add("playbtn-disable");
}
playBtn.onclick = function() {
    canStartGame = false;
    startPlinko(5, 3);
};
function updateBonus(bonusSum) {
    realBonus = bonusSum;
}
function gameOver() {
    setTimeout(() => {
        $('.main-section__container').removeClass('show');
        $(".modal--img").removeClass('modal--hide');
        $(".section.h100").addClass('opened');
        $(".reg--wrp").addClass('show');
        $(".modal--back").addClass('show');
    }, 500);
    playBtn.classList.add("playbtn-disable");
    if (canStartGame) {
        startPlinko(5, 3); // Запустить игру только если пользователь нажал на playBtn
        canStartGame = false; // Сбросить флаг после начала игры
    }
}

$(".close--reg").on('click', function() {
    $('.main-section__container').addClass('show');
    $(".modal--img").addClass('modal--hide');
    $(".modal--back").removeClass('show');
    $(".section.h100").removeClass('opened');
    $(".reg--wrp").removeClass('show');
    resetGame();
    var div = document.getElementById('bonus');
    div.innerHTML = '<span class="nl-block none">WIN $' + curBonus + ' BONUS</span><span class="fr-block none">GAGNER ' + curBonus + '$ BONUS</span>';
    canStartGame = true;
});

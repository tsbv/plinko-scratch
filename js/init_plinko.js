// Настройки бонуса
var MAX_BONUS = 1000; // Максимальный бонус в €
var BONUS_MULTIPLIER = 3; // Коэффициент умножения базового бонуса
// При MAX_BONUS = 500 и BONUS_MULTIPLIER = 2: базовый бонус 0-250€
// При MAX_BONUS = 50000 и BONUS_MULTIPLIER = 2: базовый бонус 0-25000€
// При MAX_BONUS = 50000 и BONUS_MULTIPLIER = 200: базовый бонус 0-250€

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
        curBonus += Math.max(100, Math.floor((realBonus - curBonus) / 5));
        if (curBonus > realBonus) curBonus = realBonus;
        var div = document.getElementById('bonus');
        div.innerHTML = '<span class="nl-block none">WIN €' + curBonus + ' BONUS</span><span class="fr-block none">WIN €' + curBonus + ' BONUS</span>';
    }
    if (playBtnEnabled) playBtn.classList.remove("playbtn-disable");
    else playBtn.classList.add("playbtn-disable");
}
playBtn.onclick = function() {
    canStartGame = false;
    startPlinko(5, 3);
};
function updateBonus(bonusSum) {
    realBonus = bonusSum * BONUS_MULTIPLIER;
    if (realBonus > MAX_BONUS) {
        realBonus = MAX_BONUS;
    }
}
function gameOver() {
    setTimeout(() => {
        document.getElementById('intermediate-popup').style.display = 'flex';
    }, 500);
    playBtn.classList.add("playbtn-disable");
}

$(".close--reg").on('click', function() {
    $('.main-section__container').addClass('show');
    $(".modal--img").addClass('modal--hide');
    $(".modal--back").removeClass('show');
    $(".section.h100").removeClass('opened');
    $(".reg--wrp").removeClass('show');
    resetGame();
    var div = document.getElementById('bonus');
    div.innerHTML = '<span class="nl-block none">WIN €' + curBonus + ' BONUS</span><span class="fr-block none">GAGNER €' + curBonus + ' BONUS</span>';
    canStartGame = true;
});

function resetGame() {
    var playBtn = document.getElementById("playbtn");
    window.maxRound = 3;
    for (let i = particles.length - 1; i >= 0; i--) {
        World.remove(world, particles[i].body);
        particles.splice(i, 1);
    }
    curBonus = 0;
    realBonus = 0;
    bonus = 0;
    updateBonus(bonus);
    window.plinkoBalls = 0;
    window.plinkoBallsNow = 0;
    playBtnEnabled = true;
    playBtn.classList.remove("playbtn-disable");
}
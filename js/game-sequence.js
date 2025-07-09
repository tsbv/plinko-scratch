document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('continue-btn').addEventListener('click', function() {
        document.getElementById('intermediate-popup').style.display = 'none';
        document.querySelector('.main-section__container').style.margin = '0';
        document.querySelector('.game--wrp').style.display = 'none';
        document.getElementById('game-2').style.display = 'block';
        const gameText1 = document.querySelector('.game--text1');
        const gameText2 = document.querySelector('.game--text2');
        const gameText3 = document.querySelector('.game--text3');
        if (gameText1) gameText1.innerHTML = '<span>Klik <span>en</span></span>';
        if (gameText2) gameText2.innerHTML = '<span>win een <span class="game--text2-bonus">prijs</span></span>';
        if (gameText3) gameText3.innerHTML = '<span>Klik <span>en</span></span><span>win een <span class="game--text3-bonus">prijs</span></span>';
        if (window.innerWidth < 768) {
            document.body.classList.add('show-parallax-mobile');
        }
    });
});
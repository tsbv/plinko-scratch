/*scratches*/
    const scratchCards = [];
    $('[id^="scratch_"]').each(function(index) {
        const element = this;
        const img = $(element).find('.scratch_action')[0];
        img.src = 'images/scratch-anim.png';
        
        const card = {
            scratch() {
                img.src = 'images/scratch-used.png';
                img.style.clipPath = 'inset(0 100% 0 0)';
                let progress = 0;
                const startTime = Date.now();
                const animate = () => {
                    const elapsed = Date.now() - startTime;
                    progress = Math.min(elapsed / 800, 1);
                    const clipValue = 100 - (progress * 100);
                    img.style.clipPath = `inset(0 ${clipValue}% 0 0)`;
                    if (progress < 1) {
                        requestAnimationFrame(animate);
                    } else {
                        img.style.clipPath = 'none';
                    }
                };
                requestAnimationFrame(animate);
            }
        };
        scratchCards.push(card);
    });
    let maxUsages = 2;
    let totalCards = 3;
    let usageCounter = 0;
    // Очищаем localStorage для новой игры
    localStorage.removeItem('scratch_data_3232');
    for (let i = 1; i <= totalCards; i++) {
        $(`#scratch_${i}`).click(function () {
            if (usageCounter < maxUsages) {
                $(this).addClass('scratch_outer_action_1');
                usageCounter++;
                
                scratchCards[i - 1].scratch();
                $(this).css('pointer-events', 'none');
                
                $(this).find('.bonus_1, .bonus_2, .bonus_3').hide();
                if (usageCounter === 1) {
                    $(this).find('.bonus_1').show(); // 250FS
                } else if (usageCounter === 2) {
                    $(this).find('.bonus_2').show(); // 1000€
                }
                
                if (usageCounter === maxUsages) {
                    setTimeout(function () {
                        document.getElementById('game-2').style.display = 'none';
                        document.querySelector('.game--text3').style.display = 'none';
                        const regWrp = document.querySelector('.reg--wrp');
                        regWrp.style.display = 'block';
                        regWrp.style.visibility = 'visible';
                        regWrp.style.opacity = '1';
                    }, 1500);
                }
            }
        });
    }
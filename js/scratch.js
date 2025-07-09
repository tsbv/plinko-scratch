class ScratchCard {
    constructor(element, options = {}) {
        this.element = element;
        this.animImage = options.animImage || 'images/scratch-anim.png';
        this.usedImage = options.usedImage || 'images/scratch-used.png';
        this.duration = options.duration || 800;
        this.onComplete = options.onComplete || (() => {});
        this.isAnimating = false;
        this.isScratched = false;
        this.init();
    }
    init() {
        const img = this.element.querySelector('.scratch_action');
        if (img) {
            img.src = this.animImage;
            img.style.clipPath = 'inset(0 100% 0 0)';
        }
    }
    scratch() {
        if (this.isAnimating || this.isScratched) return;
        this.isAnimating = true;
        const img = this.element.querySelector('.scratch_action');
        if (!img) return;
        let progress = 0;
        const startTime = Date.now();
        const animate = () => {
            const elapsed = Date.now() - startTime;
            progress = Math.min(elapsed / this.duration, 1);
            const clipValue = 100 - (progress * 100);
            img.style.clipPath = `inset(0 ${clipValue}% 0 0)`;
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                img.src = this.usedImage;
                img.style.clipPath = 'none';
                this.isAnimating = false;
                this.isScratched = true;
                this.onComplete();
            }
        };
        requestAnimationFrame(animate);
    }
    reset() {
        this.isScratched = false;
        this.isAnimating = false;
        const img = this.element.querySelector('.scratch_action');
        if (img) {
            img.src = this.animImage;
            img.style.clipPath = 'inset(0 100% 0 0)';
        }
    }
}
window.ScratchCard = ScratchCard;
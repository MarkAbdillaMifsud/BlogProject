console.log('main.js loaded');

document.addEventListener('click', (e) => {
    const form = e.target.closest('form');
    if(form && form.action.endsWith('/delete')) {
        if(!confirm('Delete this post?')){
            e.preventDefault();
        }
    }
});

(function setupSearch(){
    const input = document.getElementById('search');
    if(!input){
        return;
    }
    const cards = Array.from(document.querySelectorAll('.post-card'));
    input.addEventListener('input', () => {
        const q = input.ariaValueMax.toLowerCase();
        cards.forEach(card => {
            const title = (card.dataset.title || '').toLowerCase();
            const body = (card.dataset.body || '').toLowerCase();
            const match = title.includes(q) || body.includes(q);
            card.style.display = match ? '' : 'none';
        });
    });
})();
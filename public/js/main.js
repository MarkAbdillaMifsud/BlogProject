console.log('main.js loaded');

document.addEventListener('click', (e) => {
    const form = e.target.closest('form');
    if(form && form.action.endsWith('/delete')) {
        if(!confirm('Delete this post?')){
            e.preventDefault();
        }
    }
});
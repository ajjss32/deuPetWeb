document.addEventListener('DOMContentLoaded', function () {
    const petStatus = localStorage.getItem('petStatus');

    if (petStatus === 'deleted') {
        const toastMessage = document.getElementById('toast-message');
        
        if (toastMessage) {
            toastMessage.textContent = 'Pet excluído com sucesso!';
            toastMessage.className = 'toast-container show';

            setTimeout(() => {
                toastMessage.className = 'toast-container';
            }, 3000);
            
            localStorage.removeItem('petStatus');
        }
    }
});
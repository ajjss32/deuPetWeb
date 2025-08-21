function exibirMenuPorAcesso() {
    const tipoAcesso = localStorage.getItem('tipoAcesso');
    
    const menuVoluntario = document.getElementById('menu-voluntario');
    const menuAdotante = document.getElementById('menu-adotante');

    if (menuVoluntario) {
        menuVoluntario.classList.add('d-none');
    }
    if (menuAdotante) {
        menuAdotante.classList.add('d-none');
    }

    if (tipoAcesso === 'voluntario' && menuVoluntario) {
        menuVoluntario.classList.remove('d-none');
    } else if (tipoAcesso === 'adotante' && menuAdotante) {
        menuAdotante.classList.remove('d-none');
    }
}

document.addEventListener('DOMContentLoaded', exibirMenuPorAcesso);
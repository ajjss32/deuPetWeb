function formatarIdade(dataNascimento) {
    const nascimento = new Date(dataNascimento);
    const hoje = new Date();
    let anos = hoje.getFullYear() - nascimento.getFullYear();
    let meses = hoje.getMonth() - nascimento.getMonth();
    if (meses < 0) {
        anos--;
        meses += 12;
    }
    if (anos > 0) {
        return anos === 1 ? "1 ano" : anos + " anos";
    } else {
        return meses === 1 ? "1 mês" : meses + " meses";
    }
}

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

    fetch('../../backend/listar_pets_voluntario.php')
        .then(r => r.json())
        .then(data => {
            const container = document.getElementById('pet-list');
            if (!data.sucesso || !data.pets || data.pets.length === 0) {
                container.innerHTML = `
                    <div class="empty-state">
                        <h3>Você ainda não cadastrou nenhum pet.</h3>
                        <p>Clique em "Adicionar Pet" para começar.</p>
                    </div>`;
                return;
            }
            let html = '<div class="pet-grid">';
            data.pets.forEach(pet => {
                html += `
                    <section class="card">
                        <b>${pet.status ? pet.status : ''}</b>
                        <img src="${pet.foto ? pet.foto : '../../assets/img/pet.png'}" alt="Foto do pet ${pet.nome}">
                        <p>
                            ${pet.nome}, ${formatarIdade(pet.data_de_nascimento)}
                            <span class="icon-actions">
                                <a href="../voluntario/editar-pet.php?id=${pet.id}" 
                                    class="icon-link" 
                                    title="Editar Pet">
                                    <i class="bi bi-pencil-square edit-icon"></i>
                                </a>
                                <a href="../voluntario/interessados.php?pet_id=${pet.id}" 
                                    class="icon-link" 
                                    title="Interessados">
                                    <i class="bi bi-people interested-icon"></i>
                                </a>
                            </span>
                        </p>
                    </section>`;
            });
            html += '</div>';
            container.innerHTML = html;
        });
});
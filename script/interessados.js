document.addEventListener("DOMContentLoaded", async function() {
    const container = document.getElementById("interessados-container");
    const title = document.getElementById('interessados-title')
    const urlParams = new URLSearchParams(window.location.search);
    const petId = urlParams.get('pet_id');
    if (!petId) {
        container.innerHTML = `<p class="text-danger">Pet não informado.</p>`;
        return;
    }

    try {
        const resPet = await fetch(`../../backend/buscar_pet.php?pet_id=${petId}`);
        const dataPet = await resPet.json();
        if (dataPet.sucesso && dataPet.pet && dataPet.pet.nome) {
            title.textContent = `Interessados em ${dataPet.pet.nome}`;
        } else {
            title.textContent = "Interessados";
        }
    } catch {
        title.textContent = "Interessados";
    }

    try {
        const res = await fetch(`../../backend/interessados.php?pet_id=${petId}`);
        const data = await res.json();
        if (!data.sucesso || data.interessados.length === 0) {
        container.innerHTML = `
            <div class="d-flex justify-content-center align-items-center" style="height: 80vh;">
                <div class="text-center p-5">
                    <i class="bi bi-people" style="font-size: 4rem; color: #6c757d;"></i>
                    <h3 class="mt-4">Nenhum interessado ainda</h3>
                    <p class="text-muted">Nenhum usuário favoritou este pet ainda ❤️</p>
                </div>
            </div>
        `;
        return;
        }
        container.innerHTML = "";
        data.interessados.forEach(user => {
            const card = document.createElement("div");
            card.className = "interessado-card";
            card.innerHTML = `
                <img src="${user.foto || 'https://via.placeholder.com/80'}" alt="Foto de ${user.nome}">
                <div class="interessado-info">
                    <h5>${user.nome}</h5>
                    <div class="descricao">${user.descricao ? user.descricao : '<span class="text-muted">Sem descrição</span>'}</div>
                    <div class="cidade"><i class="bi bi-geo-alt"></i> ${user.cidade || ''}</div>
                </div>
                ${
                user.match
                    ? `<button class="btn btn-success btn-match" disabled style="pointer-events:none;opacity:0.85;"> <i class="bi bi-check-circle-fill"></i> Match Realizado </button>`
                    : `<button class="btn btn-outline-danger btn-match" data-id="${user.id}"> <i class="bi bi-heart-fill"></i> Dar Match </button>`
                }
            `;
            container.appendChild(card);
        });
        container.querySelectorAll('.btn-match:not([disabled])').forEach(btn => {
            btn.addEventListener('click', async function() {
                const adotanteId = this.getAttribute('data-id');
                const res = await fetch('../../backend/dar_match.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ adotante_id: adotanteId, pet_id: petId })
                });
                const data = await res.json();
                if (data.sucesso) {
                    showModalMatch(adotanteId, data.canal);
                } else {
                    alert('Erro ao dar match: ' + (data.erro || ''));
                }
            });
        });
    } catch (err) {
        console.error("Erro ao carregar interessados:", err);
        container.innerHTML = `<p class="text-danger">Erro ao carregar interessados. Tente novamente mais tarde.</p>`;
    }
});

function showModalMatch(adotanteId, canalId) {
    const modal = document.createElement('div');
    modal.className = 'modal fade show';
    modal.style.display = 'block';
    modal.innerHTML = `
        <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header"><h5 class="modal-title">Match realizado!</h5></div>
                <div class="modal-body">
                <p>Agora você pode conversar com o adotante!</p>
            </div>
            <div class="modal-footer">
                <a href="../chat.php?canal=${canalId}" class="btn btn-success">Ir para o chat</a>
                <button class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
            </div>
        </div>
        </div>
    `;
    document.body.appendChild(modal);
    modal.querySelector('.btn-secondary').onclick = () => modal.remove();
}
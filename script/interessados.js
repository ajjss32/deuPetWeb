document.addEventListener("DOMContentLoaded", async function() {
    const container = document.getElementById("interessados-container");

    try {
        const res = await fetch("../../backend/interessados.php"); // PHP retorna usuários e pets que favoritaram
        const data = await res.json();

        if (!data.sucesso || data.usuarios.length === 0) {
            container.innerHTML = `
                <div class="d-flex justify-content-center align-items-center" style="height: 80vh;">
                    <div class="text-center p-5">
                        <i class="bi bi-people" style="font-size: 4rem; color: #6c757d;"></i>
                        <h3 class="mt-4">Nenhum interessado ainda</h3>
                        <p class="text-muted">Nenhum usuário favoritou pets ainda ❤️</p>
                    </div>
                </div>
            `;
            return;
        }

        container.innerHTML = "";

        data.usuarios.forEach(usuario => {
            // Card do usuário
            const usuarioCard = document.createElement("div");
            usuarioCard.classList.add("usuario-card", "mb-5", "w-100");

            usuarioCard.innerHTML = `
                <div class="d-flex align-items-center mb-3">
                    <img src="${usuario.foto ?? 'https://via.placeholder.com/50'}" class="rounded-circle me-2" style="width:50px; height:50px; object-fit:cover;" alt="${usuario.nome}">
                    <h5 class="mb-0">${usuario.nome}</h5>
                </div>
                <div class="row pets-container"></div>
            `;

            const petsContainer = usuarioCard.querySelector(".pets-container");

            usuario.pets.forEach(pet => {
                const petCard = document.createElement("div");
                petCard.classList.add("col-md-3", "mb-3");
                petCard.innerHTML = `
                    <div class="card shadow-sm">
                        <img src="${pet.foto ?? 'https://via.placeholder.com/200'}" class="card-img-top" alt="${pet.nome}" style="object-fit: cover; height: 150px;">
                        <div class="card-body">
                            <h6 class="card-title">${pet.nome}, ${calcularIdade(pet.data_de_nascimento)}</h6>
                            <p class="text-muted">${pet.raca ?? ''} • ${pet.sexo ?? ''} • ${pet.porte ?? ''}</p>
                        </div>
                    </div>
                `;
                petsContainer.appendChild(petCard);
            });

            container.appendChild(usuarioCard);
        });

    } catch (err) {
        console.error("Erro ao carregar interessados:", err);
        container.innerHTML = `<p class="text-danger">Erro ao carregar interessados. Tente novamente mais tarde.</p>`;
    }
});

function calcularIdade(dataNascimento) {
    if (!dataNascimento) return "";
    const nascimento = new Date(dataNascimento);
    const hoje = new Date();
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mes = hoje.getMonth() - nascimento.getMonth();
    if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
        idade--;
    }
    return idade + " ano(s)";
}

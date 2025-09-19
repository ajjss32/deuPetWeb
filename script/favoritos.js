document.addEventListener("DOMContentLoaded", async function() {
    const adotanteId = "1f1f1d88-c365-4d59-b38b-d06ad2186a8b";
    const container = document.getElementById("favoritos-container");

    const mostrarNenhumFavorito = () => {
        container.innerHTML = `
            <div class="d-flex justify-content-center align-items-center" style="height: 80vh;">
                <div class="text-center p-5">
                    <i class="bi bi-heartbreak" style="font-size: 4rem; color: #6c757d;"></i>
                    <h3 class="mt-4">Nenhum favorito ainda</h3>
                    <p class="text-muted">Dê like em um pet na tela de adoção para vê-lo aqui ❤️</p>
                </div>
            </div>
        `;
    };

    try {
        const res = await fetch("../../backend/favoritos.php", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                acao: "listar",
                adotante_id: adotanteId
            })
        });

        const data = await res.json();

        if (!data.sucesso || data.favoritos.length === 0) {
            mostrarNenhumFavorito();
            return;
        }

        data.favoritos.forEach(pet => {
            const card = document.createElement("div");
            card.classList.add("card", "mb-3", "shadow-sm");
            card.innerHTML = `
                <img src="${pet.foto}" class="card-img-top" alt="${pet.nome}" style="object-fit: cover; height: 200px;">
                <div class="card-body">
                    <div class="d-flex flex-column">
                        <h5 class="card-title text-start">${pet.nome}, ${calcularIdade(pet.data_de_nascimento)}</h5>
                        <p class="text-muted">${pet.raca ?? ""} • ${pet.sexo ?? ""} • ${pet.porte ?? ""}</p>
                        <div class="d-flex justify-content-center mt-2">
                            <button class="btn btn-danger remover-favorito" data-id="${pet.id}">
                                <i class="bi bi-trash"></i> Remover
                            </button>
                        </div>
                    </div>
                </div>
            `;
            container.appendChild(card);
        });

        // Remover favorito
        container.querySelectorAll(".remover-favorito").forEach(btn => {
            btn.addEventListener("click", async function() {
                const petId = this.getAttribute("data-id");

                try {
                    const resDelete = await fetch("../../backend/favoritos.php", {
                        method: "POST",
                        headers: { "Content-Type": "application/x-www-form-urlencoded" },
                        body: new URLSearchParams({
                            acao: "deletar",
                            adotante_id: adotanteId,
                            pet_id: petId
                        })
                    });

                    const result = await resDelete.json();
                    if (result.sucesso) {
                        this.closest(".card").remove();
                        if (container.children.length === 0) mostrarNenhumFavorito();
                    } else {
                        alert("Erro ao remover favorito: " + result.mensagem);
                    }
                } catch (err) {
                    console.error("Erro ao remover favorito:", err);
                    alert("Erro ao remover favorito. Tente novamente.");
                }
            });
        });

    } catch (err) {
        console.error("Erro ao carregar favoritos:", err);
        container.innerHTML = `<p class="text-danger">Erro ao carregar favoritos. Tente novamente mais tarde.</p>`;
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

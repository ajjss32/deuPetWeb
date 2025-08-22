document.addEventListener("DOMContentLoaded", function() {
    let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
    let container = document.getElementById("favoritos-container");

    if (favoritos.length === 0) {
    container.innerHTML = `
        <div class="d-flex justify-content-center align-items-center" style="height: 80vh;">
        <div class="text-center p-5">
            <i class="bi bi-heartbreak" style="font-size: 4rem; color: #6c757d;"></i>
            <h3 class="mt-4">Nenhum favorito ainda</h3>
            <p class="text-muted">Dê like em um pet na tela de adoção para vê-lo aqui ❤️</p>
        </div>
        </div>
    `;
    return;
    }

    favoritos.forEach(pet => {
        let card = document.createElement("div");
        card.classList.add("card", "mb-3");
        card.innerHTML = `
            <img src="${pet.image}" class="card-img-top" alt="${pet.name}">
            <div class="card-body">
                <div class="d-flex flex-column">
                    <p class="card-title text-start">${pet.name}, ${pet.age}</p>
                    <div class="d-flex justify-content-center">
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
    document.querySelectorAll(".remover-favorito").forEach(btn => {
        btn.addEventListener("click", function() {
            let id = this.getAttribute("data-id");
            favoritos = favoritos.filter(fav => fav.id !== id);
            localStorage.setItem("favoritos", JSON.stringify(favoritos));
            location.reload(); // Recarrega para atualizar lista
        });
    });
});
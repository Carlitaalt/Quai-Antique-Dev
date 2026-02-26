const galerieImage = document.getElementById("allImages");

// Charger toutes les images au démarrage
loadImages();

function loadImages() {
    fetch('/api/pictures')
        .then(response => response.json())
        .then(pictures => {
            galerieImage.innerHTML = "";
            pictures.forEach(picture => {
                galerieImage.innerHTML += getImage(picture.id, picture.title, picture.imagePath);
            });
            showAndHideElementsforRole();
        })
        .catch(error => console.error("Erreur chargement images :", error));
}

function getImage(id, titre, urlImage) {
    titre = sanitizeHtml(titre);
    urlImage = sanitizeHtml(urlImage);

    return `<div class="col p-3">
        <div class="image-card text-white">
            <img src="${urlImage}" class="rounded w-100" alt="${titre}">
            <p class="titre-image">${titre}</p>
            <div class="action-image-buttons" data-show="admin">
                <button type="button" class="btn btn-outline-light" data-bs-toggle="modal" data-bs-target="#EditionPhotoModal"><i class="bi bi-pencil-square"></i></button>
                <button type="button" class="btn btn-outline-light" onclick="deleteImage(${id})" data-bs-toggle="modal" data-bs-target="#DeletePhotoModal"><i class="bi bi-trash"></i></button>
            </div>
        </div>
    </div>`;
}

// Ajouter une image
document.getElementById("btnSavePhoto").addEventListener("click", saveImage);

function saveImage() {
    const title = document.getElementById("photoTitle").value;
    const file = document.getElementById("photoFile").files[0];

    if (!title || !file) {
        alert("Veuillez remplir le titre et choisir une image");
        return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("image", file);

    fetch('/api/pictures', {
        method: 'POST',
        headers: { 'X-AUTH-TOKEN': getToken() },
        body: formData
    })
        .then(response => response.json())
        .then(() => {
            loadImages();
            document.getElementById("photoTitle").value = "";
            document.getElementById("photoFile").value = "";
            bootstrap.Modal.getInstance(document.getElementById("EditionPhotoModal")).hide();
        })
        .catch(error => console.error("Erreur ajout image :", error));
}

// Supprimer une image
let imageToDeleteId = null;

function deleteImage(id) {
    imageToDeleteId = id;
}

document.getElementById("btnDeletePhoto").addEventListener("click", confirmDelete);

function confirmDelete() {
    if (!imageToDeleteId) return;

    fetch('/api/pictures/' + imageToDeleteId, {
        method: 'DELETE',
        headers: { 'X-AUTH-TOKEN': getToken() }
    })
        .then(() => {
            loadImages();
            bootstrap.Modal.getInstance(document.getElementById("DeletePhotoModal")).hide();
            imageToDeleteId = null;
        })
        .catch(error => console.error("Erreur suppression image :", error));
}
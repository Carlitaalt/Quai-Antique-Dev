import Route from "./Route.js";
import { allRoutes, websiteName } from "./allRoutes.js";

// Création d'une route pour la page d'erreur 404
const error404Route = new Route("/404", "Page introuvable", "pages/404.html");

// Fonction pour récupérer la route correspondant à une URL donnée
const getRouteByUrl = (url) => {
    let currentRoute = null;
    // Parcours de toutes les routes pour trouver la correspondance
    allRoutes.forEach((element) => {
        if (element.url == url) {
            currentRoute = element;
        }
    });
    // Si aucune route ne correspond, retourner la route d'erreur 404
    if (currentRoute != null) {
        return currentRoute;
    } else {
        return error404Route;
    }
};

// Fonction pour charger une page en fonction de l'URL
const LoadContentPage = async () => {
    const path = window.location.pathname;
    // Récupération de l'URL actuelle 
    const actualRoute = getRouteByUrl(path);
    // Récupération du contenu HTML de la route
    const html = await fetch(actualRoute.pathHtml).then((data) => data.text());
    // Ajout du contenu HTML à l'élément avec l'ID "main-page"
    document.getElementById("main-page").innerHTML = html;

    // Ajout du contenu Javascript
    if(actualRoute.pathJS != "") {
        // Création d'une balise script
        var scriptTag = document.createElement("script");
        scriptTag.setAttribute("type", "text/javascript");
        scriptTag.setAttribute("src", actualRoute.pathJS);

        // Ajout de la balise script au corps du document
        document.querySelector("body").appendChild(scriptTag);
}

// Changement du titre de la page
document.title = actualRoute.title + " - " + websiteName;
};

// Fonction pour gérer les événements de routage (clic sur les liens)
const routeEvent = (event) => {
    event.preventDefault();
    // Mis à jour de l'URL dans l'historique du navigateur
    window.history.pushState({}, "", event.target.href);
    // Chargement du contenu de la page correspondante
    LoadContentPage();
};

// Gestion de l'événement de retour en arrière dans l'historique du navigateur 
window.onpopstate = LoadContentPage;
// Assignation de la fonction routeEvent à la propriété de la fenêtre
window.routeEvent = routeEvent;
// Chargement du contenu de la page au chargement initial
LoadContentPage();

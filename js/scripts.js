const elementosIniciales = 3;
const JSONpath = ["../src/json/mis_proyectos-edicion.json", "../src/json/mis_proyectos-programacion.json"];

let indexEachGrid = [0, 0];
let elementosACargar = [elementosIniciales, elementosIniciales];
let elementosCargados = [0, 0];

const loaderDiv = document.querySelector("#loader");
const mainDiv = document.querySelector("#main_content");
const body = document.querySelector("body");
let intervalVariable;

window.addEventListener("load", () => {
    loader();

    setTimeout(() => {

        loaderDiv.style.display = "none";
        mainDiv.classList.add("show");
        body.style.overflow = "auto";

        clearTimeout(intervalVariable);
        eventListeners();
        autoType();
        uploadProjectsFromJSON(JSONpath[0], ".videos-container", 0);
        uploadProjectsFromJSON(JSONpath[1], ".programming-container", 1);
    }, 3500)
})

function loader() {
    const pictures = document.querySelectorAll("#loader picture");
    const prefix = "non-";
    body.style.overflow = "hidden";

    intervalVariable = setInterval(() => {
        for (let index = 0; index < pictures.length; index++) {
            const picture = pictures[index];

            const claseActual = picture.className;
            const clasePoner = claseActual.startsWith(prefix) ? claseActual.substring(prefix.length, claseActual.length) : prefix.concat(claseActual);

            picture.classList.remove(claseActual);
            picture.classList.add(clasePoner);
        }
    }, 600);
}

function eventListeners() {
    const imgBarras = document.querySelector(".header__navigation-barras");
    const links = document.querySelectorAll(".left a");

    imgBarras.addEventListener("click", () => {
        links.forEach(link => {
            link.classList.toggle("mostrar-enlaces");
            link.classList.toggle("no-mostrar-enlaces");
        });
    });

    const enlacesNavegacionPrincipal = document.querySelectorAll(".header__navigation a");

    enlacesNavegacionPrincipal.forEach(link => {
        link.addEventListener("click", e => {
            const target = e.target.getAttribute("href");

            if(target.includes("pdf"))
                return;

            e.preventDefault();
            const seccion = document.querySelector(target);

            seccion.scrollIntoView({ behavior: "smooth" });
        })
    });

    const btnContactar = document.querySelector(".info-container #btn-contacto");

    btnContactar.addEventListener("click", e => {
        e.preventDefault();
        const target = e.target.getAttribute("href");
        const seccion = document.querySelector(target);

        seccion.scrollIntoView({ behavior: "smooth" });
    })

    const flechaArribaContenedor = document.querySelector(".flecha-arriba");
    const alturaHeader = document.querySelector(".header").clientHeight;

    window.addEventListener("scroll", () => {
        const scrollPosition = window.scrollY;

        if (scrollPosition > alturaHeader)
            flechaArribaContenedor.style.opacity = 1;
        else
            flechaArribaContenedor.style.opacity = 0;
    });

    flechaArribaContenedor.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        })
    })

    const btnVerTodosProjects = document.querySelectorAll(".ver-todos button");
    const esVerTodos = [true, true];

    btnVerTodosProjects.forEach(btn => {
        btn.addEventListener("click", e => {
            e.preventDefault();
            const i = btn.id.includes("programming") ? 1 : 0;

            if (esVerTodos[i]) {
                uploadProjectsFromJSON(JSONpath[i], i == 0 ? ".videos-container" : ".programming-container", i);
                btnVerTodosProjects[i].textContent = "Ver Menos";
            } else {
                removeElements(i);
                btnVerTodosProjects[i].textContent = "Ver Todos";
            }

            esVerTodos[i] = !esVerTodos[i];
        })
    });
}

function autoType() {
    const text = document.querySelector("#what-to-be");
    const saludo = document.querySelector("#about-me__saludo");

    new Typed(text, {
        strings: ["Backend Developer", "Frontend Developer", "System Administrator", "Video Editor"],
        typeSpeed: 70,
        backSpeed: 50,
        loop: true
    });
}

function uploadProjectsFromJSON(jsonPath, classMainContainer, i) {
    const btnVerTodosProjects = document.querySelector(".ver-todos button");

    fetch(jsonPath)
        .then(response => response.json())
        .then(arrayJSON => {
            const container = document.querySelector(classMainContainer);

            if (elementosCargados[i] == elementosIniciales) // Solo está en pantalla los elementos iniciales
                elementosACargar[i] = arrayJSON.length;

            if (elementosCargados[i] == elementosACargar[i]) // Si los elementos cargados son iguales a los elementos a cargar es que no hay nada que cargar
                return;

            const fragment = document.createDocumentFragment();

            while (indexEachGrid[i] < elementosACargar[i]) {
                const object = arrayJSON[indexEachGrid[i]++];
                const card = document.createElement("div");
                card.className = "card";

                if (i != 0)
                    card.innerHTML = `
                  <img src="${object.img_source}" alt="${object.title} logo">
                  <h2>${object.title}</h2>
                  <p>${object.description}</p>
                  <h3>Tecnologías utilizadas</h3>
                  <div class="stack-utilizado">
                    ${object.stack_used_images.map((img, index) => `<img src="${img}" alt="tecnología logo" title="${object.stack_used_titles[index]}">`).join("")}
                  </div>
                  <button type="button" class="btn">
                    <a href="${object.github_link}" target="_blank" rel="noopener noreferrer">Ver Código Fuente</a>
                  </button>
                `;
                else
                    card.innerHTML = `
                    <img src="${object.thumbnail_source}" alt="${object.titulo}">
                    <h2>${object.titulo}</h2>
                    <button type="button" class="btn">
                        <a href="${object.link_youtube}" target="_blank" rel="noopener noreferrer">Ver Vídeo</a>
                    </button>
                    `;

                elementosCargados[i]++;
                fragment.appendChild(card);
            }

            container.appendChild(fragment);
        })
        .catch(error => console.log(error));
}

function removeElements(i) {
    const grid = document.querySelectorAll(".grid");
    const cards = grid[i].querySelectorAll(".card");

    // Convertir NodeList a array para evitar problemas de actualización de índices al eliminar elementos
    const cardsArray = Array.from(cards);

    for (let i = cardsArray.length; i > elementosIniciales; i--)
        cardsArray[i - 1].remove();

    elementosCargados[i] = elementosIniciales;
    indexEachGrid[i] = elementosIniciales;
}
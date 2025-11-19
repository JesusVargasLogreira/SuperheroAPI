export default async function mostrarHome() {
    const appContainer = document.getElementById("app");
    appContainer.innerHTML = "<h2>Cargando superhéroes...</h2>";

    try {
        // 1️⃣ Cargar API de superhéroes
        const response = await fetch(
            "https://raw.githubusercontent.com/akabab/superhero-api/master/api/all.json"
        );

        const heroes = await response.json();

        // 2️⃣ Limpiar contenedor
        appContainer.innerHTML = "";

        // 3️⃣ Crear tarjetas
        heroes.forEach((hero) => {
            const card = document.createElement("div");
            card.classList.add("app-card");

            card.innerHTML = `
        <img src="${hero.images.lg}" alt="${hero.name}">
        <div class="app-info">
          <h2>${hero.name}</h2>

          <p><strong>Nombre real:</strong> ${hero.biography.fullName || "Desconocido"}</p>

          <p><strong>Raza:</strong> ${hero.appearance.race || "Desconocida"}</p>

          <p><strong>Fuerza:</strong> ${hero.powerstats.strength}</p>

          <p><strong>Conexiones:</strong> 
            ${hero.connections.groupAffiliation || "Ninguna"}
          </p>
          
        </div>
      `;

            appContainer.appendChild(card);
        });

    } catch (error) {
        console.error("Error al cargar los datos:", error);
        appContainer.innerHTML = "<p>Error al cargar los héroes 😢</p>";
    }
}

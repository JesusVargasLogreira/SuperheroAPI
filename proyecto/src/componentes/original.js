import { db } from '../firebaseConfig.js';
import { collection, addDoc } from 'firebase/firestore';

export default async function mostrarOriginal() {
    const contenedor = document.getElementById("app");
    contenedor.innerHTML = "";

    // 1️⃣ Cargar superhéroes
    const res = await fetch("https://raw.githubusercontent.com/akabab/superhero-api/master/api/all.json");
    const heroes = await res.json();

    // Contenedores base
    const form = document.createElement("div");
    const resultado = document.createElement("pre");
    const tabla = document.createElement("div");     // Aquí se pintará la tabla
    const imagenes = document.createElement("div");  // Aquí se mostrarán imágenes

    let comparacion = {
        heroe1: "",
        heroe2: "",
        resultado: "",
        fecha: ""
    };

    resultado.textContent = JSON.stringify(comparacion, null, 2);

    // 🔹 Selects de héroes
    const p1 = document.createElement("p");
    p1.textContent = "Seleccionar Héroe 1";

    const select1 = document.createElement("select");

    const p2 = document.createElement("p");
    p2.textContent = "Seleccionar Héroe 2";

    const select2 = document.createElement("select");

    heroes.forEach(h => {
        const opt1 = document.createElement("option");
        opt1.value = h.id;
        opt1.textContent = h.name;
        select1.appendChild(opt1);

        const opt2 = document.createElement("option");
        opt2.value = h.id;
        opt2.textContent = h.name;
        select2.appendChild(opt2);
    });


    // 2️⃣ Función: mostrar imágenes
    function mostrarImagenes(heroeA, heroeB) {
        imagenes.innerHTML = `
      <div style="display:flex; gap:20px; align-items:center; margin: 15px 0;">
        <div style="text-align:center;">
          <img src="${heroeA.images.lg}" width="150">
          <p>${heroeA.name}</p>
        </div>
        <div style="text-align:center;">
          <img src="${heroeB.images.lg}" width="150">
          <p>${heroeB.name}</p>
        </div>
      </div>
    `;
    }

    // 3️⃣ Función: generar tabla de comparación
    function mostrarTabla(heroeA, heroeB) {
        const stats = ["intelligence", "strength", "speed", "durability", "power", "combat"];

        let html = `
      <table border="1" cellpadding="8" style="border-collapse: collapse; margin: 15px 0;">
        <tr style="background:#222; color:#fff;">
          <th>Stat</th>
          <th>${heroeA.name}</th>
          <th>${heroeB.name}</th>
        </tr>
    `;

        stats.forEach(stat => {
            html += `
        <tr>
          <td>${stat.toUpperCase()}</td>
          <td>${heroeA.powerstats[stat]}</td>
          <td>${heroeB.powerstats[stat]}</td>
        </tr>
      `;
        });

        html += `</table>`;

        tabla.innerHTML = html;
    }

    // 4️⃣ Función principal de comparación
    function comparar() {
        const heroeA = heroes.find(h => h.id == select1.value);
        const heroeB = heroes.find(h => h.id == select2.value);
        if (!heroeA || !heroeB) return;

        const stats = ["intelligence", "strength", "speed", "durability", "power", "combat"];

        let resultadoComparacion = "";
        stats.forEach(stat => {
            const a = heroeA.powerstats[stat];
            const b = heroeB.powerstats[stat];

            resultadoComparacion += `${stat.toUpperCase()}: ${heroeA.name} ${a} vs ${b} ${heroeB.name} → `;
            resultadoComparacion += (a > b) ? `${heroeA.name} gana\n` :
                (b > a) ? `${heroeB.name} gana\n` :
                    "Empate\n";
        });

        comparacion.heroe1 = heroeA.name;
        comparacion.heroe2 = heroeB.name;
        comparacion.resultado = resultadoComparacion;
        comparacion.fecha = new Date().toLocaleString(); // Guardar fecha

        mostrarImagenes(heroeA, heroeB);
        mostrarTabla(heroeA, heroeB);

        resultado.textContent = JSON.stringify(comparacion, null, 2);
    }

    // Detectar cambios en selects
    select1.onchange = comparar;
    select2.onchange = comparar;


    // 5️⃣ BOTÓN: Comparación Aleatoria
    const botonAleatorio = document.createElement("button");
    botonAleatorio.textContent = "Comparación Aleatoria";
    botonAleatorio.onclick = () => {
        const rand1 = heroes[Math.floor(Math.random() * heroes.length)];
        const rand2 = heroes[Math.floor(Math.random() * heroes.length)];

        select1.value = rand1.id;
        select2.value = rand2.id;

        comparar();
    };


    // 6️⃣ Guardar en Firebase
    const botonGuardar = document.createElement("button");
    botonGuardar.textContent = "Guardar en Firebase";
    botonGuardar.onclick = async () => {
        try {
            await addDoc(collection(db, "comparacionesHeroes"), comparacion);
            alert("✅ Comparación guardada con fecha en Firebase!");
        } catch (error) {
            console.error("Error al guardar:", error);
            alert("❌ Ocurrió un error al guardar.");
        }
    };


    // Agregar todo al DOM
    form.appendChild(p1);
    form.appendChild(select1);
    form.appendChild(p2);
    form.appendChild(select2);
    form.appendChild(botonAleatorio);
    form.appendChild(botonGuardar);

    contenedor.appendChild(form);
    contenedor.appendChild(imagenes);
    contenedor.appendChild(tabla);
    contenedor.appendChild(resultado);
}

const propietarioData = [];
const propiedadData = [];

function mostrarVistaPrevia() {
    const input = document.getElementById('urlImagen');
    const vistaPrevia = document.getElementById('vistaPrevia');
    const url = input.value.trim();

    if (url) {
        vistaPrevia.src = url;
        vistaPrevia.style.display = 'block';
    } else {
        vistaPrevia.style.display = 'none';
    }
}

function Guardar() {
    document.getElementById('formulario').addEventListener('submit', function (e) {
        e.preventDefault(); // Evita que se envíe el formulario

        // Obtener datos del propietario
        const propietario = {
            dni: document.getElementById('dni').value.trim(),
            cuil: document.getElementById('cuil').value.trim(),
            apellido: document.getElementById('apellido').value.trim(),
            nombre: document.getElementById('nombre').value.trim()
        };

        // Obtener datos de la propiedad
        const propiedad = {
            titulo: document.getElementById('titulo').value.trim(),
            habitaciones: parseInt(document.getElementById('habitaciones').value),
            banios: parseInt(document.getElementById('banios').value),
            metros: parseFloat(document.getElementById('metros').value),
            provincia: document.getElementById('provincia').value.trim(),
            localidad: document.getElementById('localidad').value.trim(),
            barrio: document.getElementById('barrio').value.trim(),
            precio: parseFloat(document.getElementById('precio').value),
            imagenUrl: document.getElementById('urlImagen').value.trim()
        };

        // Guardar en los arrays
        propietarioData.push(propietario);
        propiedadData.push(propiedad);

        localStorage.setItem('propiedadData', JSON.stringify(propiedadData));

        console.log("Propietarios:", propietarioData);
        console.log("Propiedades:", propiedadData);

        alert("Datos guardados en arrays correctamente.");
        this.reset(); // Opcional: limpiar el formulario
        document.getElementById('vistaPrevia').style.display = 'none'; // Ocultar imagen
    });
}
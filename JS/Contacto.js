document.getElementById("contactoForm").addEventListener("submit", function(event) {
    let isValid = true;

    // Validación de Nombre
    const nombre = document.getElementById("nombre").value.trim();
    const nombreError = document.getElementById("nombreError");
    if (nombre === "") {
        nombreError.style.display = "block";
        isValid = false;
    } else {
        nombreError.style.display = "none";
    }

    // Validación de Email
    const email = document.getElementById("email").value.trim();
    const emailError = document.getElementById("emailError");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        emailError.style.display = "block";
        isValid = false;
    } else {
        emailError.style.display = "none";
    }

    // Validación de Mensaje
    const mensaje = document.getElementById("mensaje").value.trim();
    const mensajeError = document.getElementById("mensajeError");
    if (mensaje === "") {
        mensajeError.style.display = "block";
        isValid = false;
    } else {
        mensajeError.style.display = "none";
    }

    // Evitar envío si no es válido
    if (!isValid) {
        event.preventDefault();
    }
});

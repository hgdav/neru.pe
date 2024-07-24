document.addEventListener('DOMContentLoaded', function () {
    const btn = document.getElementById('calc');
    const formulario = document.getElementById('formulario');
    const resultadoSpan = document.getElementById('resultado');

    btn.addEventListener('click', function (event) {
        event.preventDefault();
        event.stopPropagation();

        clearErrors();

        try {
            let talla = validarCampo('talla', 100, 250);
            let peso = validarCampo('peso', 30, 200);
            let estilo = validarEstilo();

            let resultado = obtenerTallaRecomendada(talla, peso, estilo);
            mostrarResultado(resultado);
        } catch (error) {
            mostrarError(error.message);
        }
    });

    function validarCampo(id, min, max) {
        let valor = parseFloat(document.getElementById(id).value);
        if (isNaN(valor) || valor < min || valor > max) {
            throw new Error(`Por favor, ingresa un ${id} válido.`);
        }
        return valor;
    }

    function validarEstilo() {
        let estilo = document.getElementById('estilo').value;
        if (!estilo) {
            throw new Error("Por favor, selecciona un estilo.");
        }
        return estilo;
    }

    function obtenerTallaRecomendada(talla, peso, estilo) {
        if ((talla >= 150 && talla <= 170) && (peso >= 50 && peso <= 65)) {
            if (estilo === '1' || estilo === '2') {
                return "TALLA S";
            } else if (estilo === '3') {
                return "TALLA M";
            }
        } else if ((talla >= 150 && talla <= 175) && (peso >= 60 && peso <= 75)) {
            if (estilo === '1') {
                return "TALLA S";
            } else if (estilo === '2') {
                return "TALLA M";
            } else if (estilo === '3') {
                return "TALLA L";
            }
        } else if ((talla >= 160 && talla <= 185) && (peso >= 65 && peso <= 90)) {
            if (estilo === '1') {
                return "TALLA M";
            } else if (estilo === '2') {
                return "TALLA L";
            } else if (estilo === '3') {
                return "TALLA XL";
            }
        } else if ((talla >= 160 && talla <= 190) && (peso >= 85 && peso <= 95)) {
            if (estilo === '1') {
                return "TALLA L";
            } else if (estilo === '2' || estilo === '3') {
                return "TALLA XL";
            }
        } else if ((talla > 190) && (peso >= 96 && peso <= 100)) {
            return "XXL_NO_DISPONIBLE";
        } else if ((talla <= 149) && (peso <= 49)) {
            return "XS_NO_DISPONIBLE";
        } else {
            return "FUERA_DE_RANGO";
        }
    }

    function mostrarResultado(resultado) {
        formulario.classList.add('blur');
        let mensajeHTML = "";

        if (resultado === "XXL_NO_DISPONIBLE") {
            mensajeHTML = `<div style="font-size: 18px; line-height: 1.5;">Al parecer, tu talla es XXL y aún no está disponible en nuestra tienda.<br>¡Esperamos tenerla pronto!</div>`;
        } else if (resultado === "XS_NO_DISPONIBLE") {
            mensajeHTML = `<div style="font-size: 18px; line-height: 1.5;">Al parecer, tu talla es XS y aún no está disponible en nuestra tienda.<br>¡Esperamos tenerla pronto!</div>`;
        } else if (resultado === "FUERA_DE_RANGO") {
            mensajeHTML = `<div style="font-size: 18px; line-height: 1.5;">Lo sentimos, tus medidas están fuera del rango de nuestras tallas disponibles.</div>`;
        } else {
            mensajeHTML = `<div style="font-size: 18px; line-height: 1.5;">¡Redoble de tambores!🥁<br>
                Después de analizar tus medidas y estilo, te recomendamos: <br> <b>${resultado}</b></div>`;
        }

        resultadoSpan.innerHTML = mensajeHTML;
        resultadoSpan.style.display = 'block';
    }

    function mostrarError(mensaje) {
        formulario.classList.add('blur');
        resultadoSpan.innerHTML = `<div style="font-size: 18px; line-height: 1.5; color: red;"><b>${mensaje}</b></div>`;
        resultadoSpan.style.display = 'block';
    }

    function clearErrors() {
        resultadoSpan.style.display = 'none';
        formulario.classList.remove('blur');
    }

    document.addEventListener('click', function () {
        if (formulario.classList.contains('blur')) {
            formulario.classList.remove('blur');
            resultadoSpan.style.display = 'none';
        }
    });

    resultadoSpan.addEventListener('click', function (event) {
        event.stopPropagation();
    });
});
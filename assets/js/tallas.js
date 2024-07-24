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
        if (talla < 150 || peso < 50) {
            return "TALLA XS";
        }
        if (talla > 190 || peso > 100) {
            return "TALLA XXL";
        }

        const LIMITES = {
            S: { maxTalla: 170, maxPeso: 65 },
            M: { maxTalla: 180, maxPeso: 80 },
            L: { maxTalla: 190, maxPeso: 95 }
        };

        let tallaBase;
        if (talla <= LIMITES.S.maxTalla && peso <= LIMITES.S.maxPeso) {
            tallaBase = "S";
        } else if (talla <= LIMITES.M.maxTalla && peso <= LIMITES.M.maxPeso) {
            tallaBase = "M";
        } else {
            tallaBase = "L";
        }

        const ajusteEstilo = {
            "1": -1,
            "2": 0,
            "3": 1
        };

        const tallas = ["XS", "S", "M", "L", "XL", "XXL"];
        const indiceTallaBase = tallas.indexOf(tallaBase);
        const indiceTallaFinal = Math.max(0, Math.min(tallas.length - 1, indiceTallaBase + ajusteEstilo[estilo]));

        return "TALLA " + tallas[indiceTallaFinal];
    }

    function mostrarResultado(resultado) {
        formulario.classList.add('blur');
        resultadoSpan.innerHTML = `<div style="font-size: 18px; line-height: 1.5;">¡Redoble de tambores!🥁<br>
            Después de analizar tus medidas y estilo, te recomendamos: <br> <b>${resultado}</b></div>`;
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
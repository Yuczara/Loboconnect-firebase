const formulario = document.getElementById('recoveryPassForm');
const input = document.querySelector('#recoveryPassForm input');

const campos = {
    email: false,
}

const validarFormulario = (e) => {
    switch (e.target.name) {
        case "email":
            validarCampo(expresiones.email, e.target, 'alertEmail')
            break;
    }
}

const validarCampo = (expresion, input, id_alert) => {
    if (input.value.length > 0) {
        if (expresion.test(input.value)) {
            document.getElementById(`${id_alert}`).classList.remove('form-input-error__activo');
            campos.email = true;
        } else {
            document.getElementById(`${id_alert}`).classList.add('form-input-error__activo');
            campos.email = false;
        }
    } else {
        document.getElementById(`${id_alert}`).classList.remove('form-input-error__activo');
        campos.email = false;
    }
}

input.addEventListener('keyup', validarFormulario); //Cuando la tecla se levanta
input.addEventListener('blur', validarFormulario); //Cuando se hace clic fuera del input


formulario.addEventListener('submit', (e) => {
    e.preventDefault();
    // console.log(campos.password);
    if (campos.email) {
        const DATA = {
            email: $('#email').val(),
        }
        $.post('http://localhost:3000/recuperarPassword', DATA, function(respuesta) {
            console.log(respuesta);
            if (respuesta.status == 'NO EXIST') {
                Swal.fire({
                    position: 'top-end',
                    icon: 'error',
                    title: '¡Precaución!',
                    html: `No existe una cuenta registrada con el correo </br> <span class="redColor">${respuesta.correo}</span> </br> Por favor, intente nuevamente`,
                })
            } else if (respuesta.status == 'OK') {
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: '¡Éxito!',
                    html: `Se han enviado instrucciones de inicio de sesión al correo</br> <span class="redColor">${respuesta.correo}</span>`,
                });
                formulario.reset();
            }
        });
    } else {
        Swal.fire({
            position: 'top-end',
            icon: 'error',
            title: '¡Precaución!',
            text: 'Rellene correctamente el formulario',
        })
    }

});
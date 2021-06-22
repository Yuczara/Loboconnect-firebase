const formulario = document.getElementById('newPassRecoveryForm');
const inputPass = document.querySelectorAll('#newPassRecoveryForm input');

const campos = {
    newPassword: false,
}

const validarFormulario = (e) => {
    switch (e.target.name) {
        case "newPassword":
            console.log('SI PASA')
            validarCampo(expresiones.password, e.target, 'alertNewPassword')
            break;
    }
}

const validarCampo = (expresion, input, id_alert) => {
    if (input.value.length > 0) {
        if (expresion.test(input.value)) {
            document.getElementById(`${id_alert}`).classList.remove('form-input-error__activo');
            campos.newPassword = true;
        } else {
            document.getElementById(`${id_alert}`).classList.add('form-input-error__activo');
            campos.newPassword = false;
        }
    } else {
        document.getElementById(`${id_alert}`).classList.remove('form-input-error__activo');
        campos.newPassword = false;
    }
}
inputPass.forEach((inputP) => {
    inputP.addEventListener('keyup', validarFormulario); //Cuando la tecla se levanta
    inputP.addEventListener('blur', validarFormulario);
})

//Cuando se hace clic fuera del input
formulario.addEventListener('submit', (e) => {
    e.preventDefault();
    // console.log(campos.password);
    if (campos.newPassword) {
        const DATA = {
            codigoRecu: $('#codigoRecu').val(),
            newPassword: $('#newPassword').val(),
        }
        $.post('http://localhost:3000/modificarMiPassword', DATA, function(respuesta) {
            console.log(respuesta)
            if (respuesta.status == 'ERROR') {
                Swal.fire({
                    position: 'top-end',
                    icon: 'error',
                    title: '¡Precaución!',
                    html: `Ocurrio un error en el proceso, vuelva a enviar un código de recuperación desde el formulario`,
                })
            } else if (respuesta.status == 'OK') {
                formulario.reset();
                let timerInterval
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: '¡Éxito!',
                    html: `Se han modificado la contraseña exitosamente, será redirigido a la página inicial en <b></b> millisegundos.`,
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    allowEnterKey: false,
                    timer: 5000,
                    timerProgressBar: true,
                    didOpen: () => {
                        Swal.showLoading()
                        timerInterval = setInterval(() => {
                            const content = Swal.getHtmlContainer()
                            if (content) {
                                const b = content.querySelector('b')
                                if (b) {
                                    b.textContent = Swal.getTimerLeft()
                                }
                            }
                        }, 100)
                    },
                    willClose: () => {
                        clearInterval(timerInterval)
                    }
                }).then((result) => {
                    if (result.dismiss === Swal.DismissReason.timer) {
                        window.location.href = 'http://localhost:3000'
                    }
                })
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
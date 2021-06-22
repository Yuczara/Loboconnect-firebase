const formulario = document.getElementById('cambiarPasswordForm');
const inputs = document.querySelectorAll('#cambiarPasswordForm input');

const campos = {
    password: false,
}

const validarFormulario = (e) => {
    switch (e.target.name) {
        case "actualPassword":
            validarCampo(expresiones.password, e.target, 'actualPassword', 'alertActualPassword')
            break;
        case "newpassword":
            validarCampo(expresiones.password, e.target, 'newpassword', 'alertNewPassword')
            break;
    }
}

const validarCampo = (expresion, input, campo, id_alert) => {
    if (input.value.length > 0) {
        if (expresion.test(input.value)) {
            document.getElementById(`${campo}`).classList.remove('border-danger');
            document.getElementById(`${campo}`).classList.add('border-success');
            document.getElementById(`${id_alert}`).classList.remove('form-input-error__activo');
            campos.password = true;
        } else {
            document.getElementById(`${campo}`).classList.remove('border-success');
            document.getElementById(`${campo}`).classList.add('border-danger');
            document.getElementById(`${id_alert}`).classList.add('form-input-error__activo');
            campos.password = false;
        }
    } else {
        document.getElementById(`${campo}`).classList.remove('border-success');
        document.getElementById(`${campo}`).classList.remove('border-danger');
        document.getElementById(`${id_alert}`).classList.remove('form-input-error__activo');
        campos.password = false;
    }

}

inputs.forEach((input) => {
    input.addEventListener('keyup', validarFormulario); //Cuando la tecla se levanta
    input.addEventListener('blur', validarFormulario); //Cuando se hace clic fuera del input
});

formulario.addEventListener('submit', (e) => {
    e.preventDefault();
    // console.log(campos.password);
    if (campos.password) {
        const DATA = {
            actualPassword: $('#actualPassword').val(),
            newpassword: $('#newpassword').val(),
        }
        $.post('http://localhost:3000/changePass', DATA, function(respuesta) {
            console.log(respuesta);
            if (respuesta.status == 'ERROR') {
                Swal.fire({
                    position: 'top-end',
                    icon: 'error',
                    title: '¡Precaución!',
                    text: `La contraseña actual ingresada no coincide con la de su cuenta`,
                })
            } else if (respuesta.status == 'OK') {
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: '¡Éxito!',
                    text: 'Se ha cambiado la contraseña',
                    timer: 1500
                });
                formulario.reset();

                document.getElementById('newpassword').classList.remove('border-success');
                document.getElementById('actualPassword').classList.remove('border-success');
                document.getElementById('newpassword').classList.remove('border-danger');
                document.getElementById('actualPassword').classList.remove('border-danger');
                document.getElementById('alertNewPassword').classList.remove('form-input-error__activo');
                document.getElementById('alertActualPassword').classList.remove('form-input-error__activo');
                campos.password = false;
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
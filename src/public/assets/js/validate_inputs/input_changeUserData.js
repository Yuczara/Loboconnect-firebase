const formulario = document.getElementById('cambiarUserDataForm');
const inputs = document.querySelectorAll('#cambiarUserDataForm input');

const inputNewName = document.getElementById('newName');
const inputNewDepa = document.getElementById('newDepartamento');

const campos = {
    newDepartamento: true,
    newName: true,
}

const validarFormulario = (e) => {
    switch (e.target.name) {
        case "newName":
            validarCampo(expresiones.username, e.target, 'newName', 'alertnewName');
            break;
        case "newDepartamento":
            validarCampo(expresiones.departamento, e.target, 'newDepartamento', 'alertnewDepartamento');
            break;
    }
}

const validarCampo = (expresion, input, campo, id_alert) => {
    if (input.value.length > 0) {
        if (expresion.test(input.value)) {
            document.getElementById(`${campo}`).classList.remove('border-danger');
            document.getElementById(`${campo}`).classList.add('border-success');
            document.getElementById(`${id_alert}`).classList.remove('form-input-error__activo');
            campos[campo] = true;
        } else {
            document.getElementById(`${campo}`).classList.remove('border-success');
            document.getElementById(`${campo}`).classList.add('border-danger');
            document.getElementById(`${id_alert}`).classList.add('form-input-error__activo');
            campos[campo] = false;
        }
    } else {
        document.getElementById(`${campo}`).classList.remove('border-success');
        document.getElementById(`${campo}`).classList.remove('border-danger');
        document.getElementById(`${id_alert}`).classList.remove('form-input-error__activo');
        campos[campo] = false;
    }
}

const revisarCampos = () => {
    validarCampo(expresiones.username, inputNewName, 'newName', 'alertnewName');
    validarCampo(expresiones.departamento, inputNewDepa, 'newDepartamento', 'alertnewDepartamento');
}

setTimeout(() => {
    revisarCampos();
}, 1000)


inputs.forEach((input) => {
    input.addEventListener('keyup', validarFormulario); //Cuando la tecla se levanta
    input.addEventListener('blur', validarFormulario); //Cuando se hace clic fuera del input
});


formulario.addEventListener('submit', (e) => {
    e.preventDefault();
    if (campos.newName && campos.newDepartamento) {
        const DATA = {
            newName: $('#newName').val(),
            newDepartamento: $('#newDepartamento').val(),
        }
        $.post('http://localhost:3000/cambiarUserData', DATA, function(respuesta) {

            if (respuesta.status != 'OK') {
                Swal.fire({
                    position: 'top-end',
                    icon: 'error',
                    title: '¡Precaución!',
                    text: `Los datos no se han modificado`,
                })
            } else {
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: '¡Éxito!',
                    showConfirmButton: false,
                    text: 'Los datos se han modificado con éxito',
                    timer: 1500
                });
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
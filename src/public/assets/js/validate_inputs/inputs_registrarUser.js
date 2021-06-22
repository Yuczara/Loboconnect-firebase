const formulario = document.getElementById('formularioNuevoUsuario');
const inputs = document.querySelectorAll('#formularioNuevoUsuario input');

const campos = {
    username: false,
    email: false,
    departamento: false,
    password: false,
}

const validarFormulario = (e) => {
    switch (e.target.name) {
        case "username":
            validarCampo(expresiones.username, e.target, 'username', 'alertUser');
            break;
        case "email":
            validarCampo(expresiones.email, e.target, 'email', 'alertEmail');
            break;
        case "departamento":
            validarCampo(expresiones.departamento, e.target, 'departamento', 'alertDepa');
            break;
        case "password":
            validarCampo(expresiones.password, e.target, 'password', 'alertPass');
            validarAmbasPassword();
            break;
        case "passwordRep":
            validarAmbasPassword();
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

const validarAmbasPassword = () => {
    const inputPass1 = document.getElementById('password');
    const inputPass2 = document.getElementById('passwordRep');

    if (inputPass2.value.length > 0) {

        if (inputPass1.value != inputPass2.value || (inputPass2.value.length < 4)) {
            document.getElementById('passwordRep').classList.remove('border-success');
            document.getElementById('passwordRep').classList.add('border-danger');
            document.getElementById('alertPassRep').classList.add('form-input-error__activo');
            campos['password'] = false;
        } else {
            document.getElementById('passwordRep').classList.remove('border-danger');
            document.getElementById('passwordRep').classList.add('border-success');
            document.getElementById('alertPassRep').classList.remove('form-input-error__activo');
            campos['password'] = true;
        }
    } else if ((inputPass1.value <= 0) && (inputPass2.value <= 0)) {
        document.getElementById('passwordRep').classList.remove('border-danger');
        document.getElementById('passwordRep').classList.remove('border-success');
        document.getElementById('alertPassRep').classList.remove('form-input-error__activo');
        campos['password'] = false;
    }
}

inputs.forEach((input) => {
    input.addEventListener('keyup', validarFormulario); //Cuando la tecla se levanta
    input.addEventListener('blur', validarFormulario); //Cuando se hace clic fuera del input
});


formulario.addEventListener('submit', (e) => {
    e.preventDefault();
    if (campos.username && campos.departamento && campos.password && campos.email) {
        const DATA = {
            username: $('#username').val(),
            email: $('#email').val(),
            password: $('#password').val(),
            departamento: $('#departamento').val(),
        }
        $.post('http://localhost:3000/register', DATA, function(respuesta) {
            console.log(respuesta.status);
            if (respuesta.status == 'USER EXIST') {
                Swal.fire({
                    position: 'top-end',
                    icon: 'error',
                    title: '¡Precaución!',
                    text: `El usuario ${DATA.email} ya existe`,
                })
            } else if (respuesta.status == 'OK') {
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: '¡Éxito!',
                    text: 'Se ha registrado al usuario con éxito',
                    timer: 1500
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
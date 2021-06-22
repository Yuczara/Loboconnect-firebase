$(document).ready(function() {
    mostrarAvisosPubli();

    $('#btnRefreshAvisosPub').click(function() {

        Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Los avisos se han actualizado',
            showConfirmButton: false,
            timer: 1000
        })

        mostrarAvisosPubli();
        console.log('Avisos actualizados!')
    });

    $('#btnRefreshAvisosPub').click(function() {
        mostrarAvisosPubli();
    });

    $('#noEdit').click(function() {
        $('#noEdit').html('');
        $('#id_aviso').val('');
        $('#titulo').val('');
        $('#descripcion').val('');
        $('#btn-publicar').val('Publicar');

        contador1();
        contador2();
    });

    function mostrarAvisosPubli() {
        contador1();
        contador2();
        $.ajax({ //Lo que hay entre parentesis es un objeto
            url: 'http://localhost:3000/api/mostrarAvisosPublicados',
            type: 'GET',
            success: function(respuesta) {

                if (respuesta.length !== 0) {
                    let avisosCuerpo = '';
                    let cont = 0;
                    for (let aviso in respuesta) {
                        avisosCuerpo = avisosCuerpo + `
                        <tr>
                            <td>
                                ${Object.values(respuesta)[cont].titulo}              
                            </td>                   
                            <td class="ocultar">
                            ${Object.values(respuesta)[cont].descripcion}                                    
                            </td>                    
                            <td class="ocultar">
                            ${Object.values(respuesta)[cont].fechaPublicacion}    
                            </td>                   
                            <td class="ocultar">

                            ${Object.values(respuesta)[cont].fechaLimite} 
                            </td>
                            <td class="ocultar">
                            ${Object.values(respuesta)[cont].fechaModificacion} 
                            </td>
                            <td class="text-center">
                                <a title="Editar" class="editarAviso btn btn-outline-warning" id="${Object.values(respuesta)[cont].key}">
                                    <h5>📝</h5>
                                </a>
                                <a title="Eliminar" class="deleteAviso btn btn-outline-danger" style="cursor: pointer;" id="${Object.values(respuesta)[cont].key}">
                                    <h5>❌</h5>
                                </a>
                            </td>
                        </tr>
                    `;
                        cont++;
                    }
                    $('#btn-publicar').val('Publicar');
                    $('#avisosPublicados').html(avisosCuerpo);

                } else {
                    let mensaje = `<tr class="text-center" style="color: darkred;"> <td>No</td> <td>hay</td> <td>avisos</td> <td>registrados</td> <td>aún</td>  <td>publicados</td></tr>`;
                    $('#avisosPublicados').html(mensaje);
                }
            }
        });
    }

    $(document).on('click', '.deleteAviso', function() {
        console.log($(this)[0].id)
        Swal.fire({
            title: '¿Estás seguro?',
            text: "¡Esta acción elimina el aviso permanentemente!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#a9a9a9',
            confirmButtonText: 'Si, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                let idAviso = $(this)[0].id;

                $.ajax({
                    url: 'http://localhost:3000/eliminar/' + idAviso,
                    type: 'GET',
                });
                mostrarAvisosPubli();
                Swal.fire(
                    '¡Eliminado!',
                    'Tu aviso ha sido eliminado.',
                    'success'
                )
            }
        })
    });

    $(document).on('click', '.editarAviso', function() {
        var idAviso = $(this)[0].id;
        $.ajax({
            url: 'http://localhost:3000/api/obtenerID/' + idAviso,
            type: 'GET',
            success: function(respuesta) {
                $('#id_aviso').val(respuesta.aviso_id);
                $('#titulo').val(respuesta.titulo);
                $('#descripcion').val(respuesta.descripcion);
                $('#btn-publicar').val('Actualizar');
                $('#noEdit').load('btnCancelar.html');
                contador1();
                contador2();
                campos.titulo = true;
                campos.descripcion = true;
            }
        });
    });

    // INPUTS PARA AVISOS
    const formulario = document.getElementById('aviso-capturar');
    const inputs = document.querySelectorAll('#aviso-capturar input');
    const textArea = document.querySelectorAll('#aviso-capturar textarea');
    const campos = {
        titulo: true,
        descripcion: true,
    }

    const validarFormulario = (e) => {
        switch (e.target.name) {
            case "titulo":
                validarCampo(expresiones.titulo, e.target, 'titulo', 'alertTitulo');
                contador1();
                break;
            case "descripcion":
                validarCampo(expresiones.descripcion, e.target, 'descripcion', 'alertDescripcion');
                contador2();
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

    inputs.forEach((input) => {
        input.addEventListener('keyup', validarFormulario); //Cuando la tecla se levanta
        input.addEventListener('blur', validarFormulario); //Cuando se hace clic fuera del input
        input.addEventListener('copy', validarFormulario);
        input.addEventListener('cut', validarFormulario);
        input.addEventListener('input', validarFormulario);
        input.addEventListener('change', validarFormulario);
        input.addEventListener('keypress', validarFormulario);
        input.addEventListener('paste', validarFormulario);
    });

    textArea.forEach((input) => {
        input.addEventListener('keyup', validarFormulario); //Cuando la tecla se levanta
        input.addEventListener('blur', validarFormulario); //Cuando se hace clic fuera del input
        input.addEventListener('copy', validarFormulario);
        input.addEventListener('cut', validarFormulario);
        input.addEventListener('input', validarFormulario);
        input.addEventListener('change', validarFormulario);
        input.addEventListener('keypress', validarFormulario);
        input.addEventListener('paste', validarFormulario); //Cuando se hace clic fuera del input
    });

    formulario.addEventListener('submit', (e) => {
        e.preventDefault();
        if (campos.titulo && campos.descripcion) {
            const DATA = {
                id: $('#id_aviso').val(),
                titulo: $('#titulo').val(),
                descripcion: $('#descripcion').val(),
            }
            $.post('http://localhost:3000/altaAviso', DATA, function(respuesta) {

                if (!respuesta.status) {
                    Swal.fire({
                        position: 'top-end',
                        icon: 'error',
                        title: '¡Precaución!',
                        text: `Los datos no se han modificado`,
                    })
                } else {
                    mostrarAvisosPubli();
                    if (respuesta.status == "Publicado") {
                        Swal.fire({
                            title: '¡Aviso publicado con éxito!',
                            timer: 1500,
                            icon: 'success',
                            position: 'top-end',
                            showConfirmButton: false,
                            timerProgressBar: true,
                        });
                    } else if (respuesta.status == "Actualizado") {
                        Swal.fire({
                            title: '¡Aviso actualizado con éxito!',
                            timer: 1500,
                            icon: 'success',
                            position: 'top-end',
                            showConfirmButton: false,
                            timerProgressBar: true,
                        });
                    }

                    document.getElementById("titulo").classList.remove('border-success');
                    document.getElementById("descripcion").classList.remove('border-success');
                    document.getElementById("titulo").classList.remove('border-danger');
                    document.getElementById("descripcion").classList.remove('border-danger');
                    document.getElementById("alertTitulo").classList.remove('form-input-error__activo');
                    document.getElementById("alertDescripcion").classList.remove('form-input-error__activo');
                    campos["titulo"] = false;
                    campos["descripcion"] = false;


                    $('#id_aviso').val('');
                    $('#titulo').val('');
                    $('#descripcion').val('');
                    $('#cancelarEdicion').hide();

                    contador1();
                    contador2();
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

    function contador1() {
        let inicial1 = $('#titulo').val().length;

        if (inicial1 > 0) {
            setTimeout(() => {
                let valor = document.getElementById('titulo').value.length;
                let respuesta = document.getElementById('contadorR1');
                if (valor <= 20) {
                    document.getElementById('contadorR1').innerHTML = valor + `/20`;
                    respuesta.style.color = 'black';
                } else {
                    document.getElementById('contadorR1').innerHTML = valor + `/20`;
                    respuesta.style.color = 'red';
                }
            }, 200);
        } else if (inicial1 === 0) {
            setTimeout(() => {
                document.getElementById('contadorR1').innerHTML = ``;
            }, 300);
        }
    }

    function contador2() {
        let inicial2 = $('#descripcion').val().length;
        if (inicial2 > 0) {
            setTimeout(() => {
                let valor = document.getElementById('descripcion').value.length;
                let respuesta = document.getElementById('contadorR2');

                if (valor <= 500) {
                    document.getElementById('contadorR2').innerHTML = valor + `/500`;
                    respuesta.style.color = 'black';
                } else {
                    document.getElementById('contadorR2').innerHTML = valor + `/500`;
                    respuesta.style.color = 'red';
                }
            }, 200);
        } else if (inicial2 === 0) {
            setTimeout(() => {
                document.getElementById('contadorR2').innerHTML = ``;
            }, 300);
        }

    }
});
$(document).ready(function() {

    mostrarUsuarios();

    $('#btnRefreshUsers').click(function() {

        Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Los usuarios se han actualizado',
            showConfirmButton: false,
            timer: 1000
        })

        mostrarUsuarios();
        console.log('Usuarios actualizados!')
    });

    function mostrarUsuarios() {
        $.ajax({ //Lo que hay entre parentesis es un objeto
            url: 'http://localhost:3000/api/mostrarUsuarios',
            type: 'GET',
            success: function(respuesta) {
                if (respuesta.length > 0) {
                    let avisosCuerpo = '';
                    let cont = 0;
                    for (let aviso in respuesta) {
                        avisosCuerpo = avisosCuerpo + `
                        <tr> 
                            <td>
                                ${respuesta[cont].email_id} 
                            </td>
                            <td class="ocultar">
                                 ${respuesta[cont].usuario} 
                            </td>
                            <td class="ocultar">
                                 ${respuesta[cont].departamento} 
                            </td>
                            <td class="ocultar">
                                 ${respuesta[cont].status} 
                            </td>          
                            <td class="text-center">
                                <a title="Eliminar" class="btn btn-outline-danger deleteUser" style="cursor: pointer;" id="${respuesta[cont].key}">
                                    <h5>Eliminar</h5>
                                 </a>
                            </td>
                        </tr>
                    `;
                        cont++;
                    }

                    $('#usuarios').html(avisosCuerpo);
                } else {
                    let mensaje = '<h1>No hay usuarios registrados aún </h1>';
                    $('#usuarios').html(mensaje);
                }
            }
        });
    }

    $(document).on('click', '.deleteUser', function() {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "¡Esta acción eliminará al usuario permanentemente!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#a9a9a9',
            confirmButtonText: 'Si, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                let idUser = $(this)[0].id;
                $.ajax({
                    url: 'http://localhost:3000/eliminarAccount/' + idUser,
                    type: 'GET',
                });
                mostrarUsuarios();
                Swal.fire(
                    '¡Eliminado!',
                    'El usuario ha sido eliminado.',
                    'success'
                )
            }
        })
    });
});
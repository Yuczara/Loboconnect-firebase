$(document).ready(function() {
    mostrarAvisos();

    $('#btnRefresh').click(function() {
        Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Los avisos se han actualizado',
            showConfirmButton: false,
            timer: 1000
        })
        mostrarAvisos();
        console.log('¡Avisos actualizados!')
    });

    function mostrarAvisos() {
        $.ajax({ //Lo que hay entre parentesis es un objeto
            url: 'http://localhost:3000/api/mostrarAvisos',
            type: 'GET',
            success: function(respuesta) {
                if (respuesta.length > 0) {
                    let avisosCuerpo = '';
                    let cont = 0;
                    for (let aviso in respuesta) {
                        avisosCuerpo = avisosCuerpo + `
                    <div class="card mb-3 card-bg" style="max-width: 100%">
                        <div class="row g-0">
                            <div class="col-md-12">
                                <div class="card-body">
                                    <h5 class="card-title">
                                        ${Object.values(respuesta)[cont].titulo}
                                    </h5>
                                    <p class="card-text">
                                    ${Object.values(respuesta)[cont].descripcion}
                                    </p>
                                    <p class="card-text"><small class="text-muted">Fecha de publicación: ${Object.values(respuesta)[cont].fechaPublicacion} </small></p>
                                    <p class="card-text"><small class="text-muted">Fecha limite: ${Object.values(respuesta)[cont].fechaLimite} </small></p>
                                    <p class="card-text"><small class="text-muted">${Object.values(respuesta)[cont].usuario} ${Object.values(respuesta)[cont].departamento} </small></p>
                                </div>
                            </div> 
                        </div>
                    </div>
                    `;
                        cont++;
                    }

                    $('#avisoCardBodyContainer').html(avisosCuerpo);
                } else {
                    let mensaje = '<h1>No hay avisos publicaos aún </h1>';
                    $('#avisoCardBodyContainer').html(mensaje);
                }
            }
        });
    }

});
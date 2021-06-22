/*------------------------ express -----------------------*/
const express = require("express");
const ruta = express.Router(); //Para las rutas
module.exports = ruta; //Para exportar esta función o constante
/*------------------------ express -----------------------*/

/*------------------------ extras -----------------------*/
const {
    v4: uuidv4
} = require("uuid");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const Notification = require("../server/notifications");
/*------------------------ extras -----------------------*/

/*------------------------ FIREBASE -----------------------*/
const adminFire = require("firebase-admin"); //Mando llamar a todos los modulos de Admin-Firebase
const urlFirebase = require("../server/keys"); //Archivo a la ruta de nuestra BD
const serviceAccount = require("../server/fir-loboconnect-firebase-adminsdk-9qsqz-718d0008ad.json"); //Archivo con las credenciales de la base de datos
adminFire.initializeApp({
    credential: adminFire.credential.cert(serviceAccount),
    databaseURL: urlFirebase.urlDatabaseFirestore,
});

const db = adminFire.database(); //Para conectarse a la base de datos en firebase realtime
/*------------------------ FIREBASE -----------------------*/

//######################################################################### Variables Globales#
/*------------------------ Mensajes -----------------------*/
var advetenciaInexis = {
    titulo: "Usuario",
    user: " ",
    descripcion: "Inexistente",
};

var codigoGlobalRecuperacion = "";

var advetenciaExis = {
    titulo: "Usuario",
    user: " ",
    descripcion: "Existente",
};

var advetenciaNoVerificado = {
    titulo: "Usuario",
    user: " ",
    descripcion: "No verificado",
};

var advetenciaCodigoExpirado = {
    titulo: "Código",
    user: " ",
    descripcion: "No Válido",
};

var advetenciaPassIncorrect = {
    titulo: "Contraseña",
    user: " ",
    descripcion: "Incorrecta",
};

// Rutas para el navbar
const rutaGlobal = "./partials/navbarGlobal";
const rutaAdmin = "./partials/navbarAdmin";
//######################################################################### Variables Globales#

/*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ MENSAJES */

ruta.get("/expirado", (req, res) => {
    res.render("mensaje", {
        advertencia: advetenciaCodigoExpirado
    });
});

ruta.get("/noVerificado", (req, res) => {
    res.render("mensaje", {
        advertencia: advetenciaNoVerificado
    });
});

/*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ MENSAJES */

/*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ RUTAS LOGIN */

//-------------------------------------------------------------------- lOGIN

ruta.get("/", (req, res) => {
    if (req.session.currentEmail && req.session.currentPassword)
        res.redirect("/avisosGestionPage");
    else res.render("login");
});

//-------------------------------------------------------------------- REGISTER

ruta.get("/registrarPage", (req, res) => {
    if (
        req.session.currentEmail &&
        req.session.currentPassword &&
        req.session.currentUserType == "admin"
    )
        res.render("registro", {
            ruta: rutaAdmin
        });
    else res.redirect("/");
});

//-------------------------------------------------------------------- RECUPERAR CONTRASEÑA

ruta.get("/recuperarPass", (req, res) => {
    res.render("forgotPassword");
});

/*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ RUTAS LOGIN */

/*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ RUTAS INTERFAZ ALPLICACION */

//-------------------------------------------------------------------- GESTOR DE AVISOS

ruta.get("/avisosGestionPage", (req, res) => {
    if (req.session.currentEmail && req.session.currentPassword) {

        if (req.session.currentUserType == "admin") res.render("avisosGestion", {
            ruta: rutaAdmin
        });
        else res.render("avisosGestion", {
            ruta: rutaGlobal
        });

    } else res.redirect("/");

});

//-------------------------------------------------------------------- PERFIL DE USUARIO

ruta.get("/perfilPage", (req, res) => {
    if (req.session.currentEmail && req.session.currentPassword) {
        let profileData = {
            name: req.session.currentNombre,
            email: req.session.currentEmail,
            depa: req.session.currentDepartamento,
        };
        if (req.session.currentUserType == "admin") res.render("profilPage", {
            profile: profileData,
            ruta: rutaAdmin
        });
        else res.render("profilPage", {
            profile: profileData,
            ruta: rutaGlobal
        });
    } else res.redirect("/");
});

//-------------------------------------------------------------------- HISTORIAL

ruta.get("/historialPage", (req, res) => {
    if (req.session.currentEmail && req.session.currentPassword) {
        if (req.session.currentUserType == "admin") res.render("historial", {
            ruta: rutaAdmin
        });
        else res.render("historial", {
            ruta: rutaGlobal
        });
    } else res.redirect("/");
});

//-------------------------------------------------------------------- CUENTAS DE LA APLICACION

ruta.get("/accountsPage", (req, res) => {
    if (req.session.currentEmail && req.session.currentPassword && req.session.currentUserType == "admin")
        res.render("cuentas", {
            ruta: rutaAdmin
        });
    else res.redirect("/");
});

//-------------------------------------------------------------------- FORMULARIO PARA CAMBIAR PASSWORD

ruta.get("/cambiarPass", (req, res) => {
    if (req.session.currentEmail && req.session.currentPassword) {
        if (req.session.currentUserType == "admin") res.render("changePassword", {
            ruta: rutaAdmin
        });
        else res.render("changePassword", {
            ruta: rutaGlobal
        });
    } else res.redirect("/");
});

//-------------------------------------------------------------------- FORMULARIO CAMBIAR DATOS

ruta.get("/cambiarDatos", (req, res) => {
    if (req.session.currentEmail && req.session.currentPassword) {
        let profileData = {
            name: req.session.currentNombre,
            email: req.session.currentEmail,
            depa: req.session.currentDepartamento,
        };
        if (req.session.currentUserType == "admin") res.render("cambiarDatos", {
            profile: profileData,
            ruta: rutaAdmin
        });
        else res.render("cambiarDatos", {
            profile: profileData,
            ruta: rutaGlobal
        });
    } else res.redirect("/");
});

/*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ RUTAS INTERFAZ ALPLICACION */

/*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ RUTAS DE ACCIONES */

//-------------------------------------------------------------------- SALIR

ruta.get("/exit", (req, res) => {
    req.session.destroy();
    res.redirect("/");
});

//-------------------------------------------------------------------- INICIAR SESION - VERIFICAR LOGUEO

ruta.post("/verificarLogueo", (req, res) => {
    let {
        username,
        password
    } = req.body;

    let usernameNoSpace = username.trim();
    let passwordNoSpace = password.trim();
    if (usernameNoSpace.length > 0 && passwordNoSpace.length > 0) {
        console.log(
            "-----------------------\nEstos son los valores ingresados",
            usernameNoSpace,
            passwordNoSpace
        );

        db.ref("usuarios_lc")
            .orderByChild("email_id")
            .equalTo(usernameNoSpace)
            .once("value", (snapshot) => {
                const resConsulta_email_id = snapshot.val();
                if (resConsulta_email_id == null) {
                    advetenciaInexis.user = usernameNoSpace;
                    res.render("mensaje", {
                        advertencia: advetenciaInexis
                    });
                } else {
                    const resultadoStatus = Object.values(resConsulta_email_id)[0].status;
                    if (resultadoStatus == false) {
                        advetenciaNoVerificado.user = usernameNoSpace;
                        res.render("mensaje", {
                            advertencia: advetenciaNoVerificado
                        });
                        advetenciaNoVerificado.user = " ";
                    } else {
                        console.log("-----------------------\nSi existe");
                        let dataUser = Object.values(resConsulta_email_id)[0];
                        verificarPassword(dataUser);
                    }
                }
            })
            .catch((error) => {
                console.error(error);
            });

        let verificarPassword = function(dataUserBD_values) {
            bcrypt.compare(
                passwordNoSpace,
                dataUserBD_values.pass,
                function(err, isValid) {
                    if (isValid) {
                        req.session.currentEmail = dataUserBD_values.email_id;
                        req.session.currentNombre = dataUserBD_values.usuario;
                        req.session.currentDepartamento = dataUserBD_values.departamento;
                        req.session.currentPassword = dataUserBD_values.pass;
                        req.session.currentUserType = dataUserBD_values.userType;
                        res.redirect("/avisosGestionPage");
                    } else {
                        res.render("mensaje", {
                            advertencia: advetenciaPassIncorrect
                        });
                        console.log(err);
                    }
                }
            );
        };
    } else {
        advetenciaInexis.user = "";
        res.render("mensaje", {
            advertencia: advetenciaInexis
        });
    }
});

//-------------------------------------------------------------------- REGISTRAR NUEVO USUARIO

ruta.post("/register", (req, res) => {
    if (req.session.currentUserType == "admin") {
        let {
            email,
            username,
            password,
            departamento
        } = req.body;
        let emailNoSpace = email.trim();
        let usernameNoSpace = username.trim();
        let passwordNoSpace = password.trim();
        let departamentoNoSpace = departamento.trim();

        if (
            emailNoSpace.length > 0 &&
            usernameNoSpace.length > 0 &&
            passwordNoSpace.length > 0 &&
            departamentoNoSpace.length > 0
        ) {
            console.log(
                "-----------------------\nContraseña introducida: " + passwordNoSpace
            );
            const salt = 10;
            const hash = bcrypt.hashSync(passwordNoSpace, salt);
            passwordNoSpace = hash;
            console.log(
                "`-----------------------\nContraseña registrada: " + passwordNoSpace
            );

            db.ref("usuarios_lc")
                .orderByChild("email_id")
                .equalTo(email)
                .once("value", (snapshot) => {
                    const resConsulta_email_id = snapshot.val();
                    console.log(resConsulta_email_id);

                    if (resConsulta_email_id == null) insertarUsuario();
                    else {
                        res.json({
                            status: "USER EXIST"
                        });
                    }
                })
                .catch((error) => {
                    console.error(error);
                });
            let insertarUsuario = function() {
                let codigo = uuidv4();
                let codigoDeVerificacion_Enviar = codigo;

                let object_nuevoUsuario = {
                    email_id: emailNoSpace,
                    usuario: usernameNoSpace,
                    pass: passwordNoSpace,
                    departamento: departamentoNoSpace,
                    userType: "global",
                    status: false,
                    codigo: codigoDeVerificacion_Enviar,
                    codigoRecuperacionPass: "",
                };

                //Inserta al usuario y envía código de confirmación
                db.ref("usuarios_lc")
                    .push(object_nuevoUsuario)
                    .then(() => {
                        console.log(
                            "-----------------------\n",
                            codigoDeVerificacion_Enviar
                        );
                        console.log(
                            "-----------------------\nUsuario registrado correctamente"
                        );
                        res.json({
                            status: "OK"
                        });
                        correoConfirmacion_NuevoUser(codigoDeVerificacion_Enviar);
                    })
                    .catch((err) => console.log(err));
            };

            let correoConfirmacion_NuevoUser = function(codigoDeVerificacion) {
                const correoVerificacion_cuerpoHTML =
                    `<h3> Se le ha registrado en Lobo Connect,
                                                    para activar su cuenta haga clic en el enlace 
                                                    a continuación http://localhost:3000/activarAccount/` +
                    codigoDeVerificacion +
                    `
                                                     </h3>\n<h3>Reciba un cordial saludo.</h3>`;

                const transporter = nodemailer.createTransport({
                    service: "gmail",
                    auth: {
                        user: "sisgeinn2@gmail.com",
                        pass: "ouifrdsbfkonhxaj", //'1q2w3e1q' // Remplazar con nustras credenciales o con la contraseña especifica de la aplciación
                    },
                });

                const mailOptions = {
                    to: emailNoSpace,
                    subject: "Código de activación para su cuenta en Lobo Connect",
                    html: correoVerificacion_cuerpoHTML,
                };

                transporter.sendMail(mailOptions, function(error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log(
                            "-----------------------\nCorreo enviado status: " + info.response
                        );
                    }
                });
            };
        }
    }
});

//-------------------------------------------------------------------- ACTIVAR CUENTA DE USUARIO

ruta.get("/activarAccount/:code", (req, res) => {
    let codigoRecibido_activar = req.params.code;
    let codigoRecibidoNoSpace = codigoRecibido_activar.trim();

    db.ref("usuarios_lc")
        .orderByChild("codigo")
        .equalTo(codigoRecibidoNoSpace)
        .once("value", (snapshot) => {
            const resConsulta_codigo_verificacion = snapshot.val();
            if (resConsulta_codigo_verificacion == null) res.redirect("/expirado");
            //Si la consulta es nula, se enviará que el código ya expiró
            else activarCuenta(resConsulta_codigo_verificacion);
        })
        .catch((err) => {
            console.log(err);
            res.redirect("/");
        });

    let activarCuenta = function(object_datosUserAccount) {
        let keyUser = Object.keys(object_datosUserAccount)[0];
        let emailActivado = Object.values(object_datosUserAccount)[0].email_id;

        //Eliminar el código de activación y activar la cuenta
        db.ref("usuarios_lc/" + keyUser)
            .child("codigo")
            .remove()
            .then(() => {
                db.ref("usuarios_lc")
                    .child(keyUser)
                    .update({
                        status: true,
                    })
                    .then(() => {
                        console.log(
                            "-----------------------\nCuenta",
                            emailActivado,
                            "activada"
                        );
                        res.redirect("/");
                    });
            });
    };
});

//-------------------------------------------------------------------- ELIMINA LA CUENTA DE USUARIO

ruta.get("/eliminarAccount/:id", (req, res) => {
    if (
        req.session.currentEmail &&
        req.session.currentPassword &&
        req.session.currentUserType == "admin"
    ) {
        let id = req.params.id;
        db.ref("usuarios_lc/" + id)
            .remove()
            .then(() => {
                console.log("Usuario eliminado con éxito");
            });
    } else res.redirect("/");

});

//-------------------------------------------------------------------- PUBLICA O ACTUALIZA UN AVISO

ruta.post("/altaAviso", (req, res) => {
    if (req.session.currentEmail && req.session.currentPassword) {
        let {
            id,
            titulo,
            descripcion
        } = req.body;

        let tituloNoSpace = titulo.trim();
        let descripcionNoSpace = descripcion.trim();
        let idNoSpace = id.trim();

        let email = req.session.currentEmail;
        let nombre = req.session.currentNombre;
        let departamento = req.session.currentDepartamento;

        let currentDate = new Date()
            .toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
            })
            .toString();

        console.log("-----------------------\n", req.body);

        //Insertar nuevo aviso
        let insertaNuevoAviso = function() {
            Date.prototype.addDays = function(days) {
                let date = new Date(this.valueOf());
                date.setDate(date.getDate() + days);
                return date;
            };

            let currentDate_standard = new Date();
            let fechaLimit = currentDate_standard
                .addDays(15) //Para agregar un limite de eliminación
                .toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                })
                .toString();

            let params = {
                fechaModificacion: currentDate,
                fechaPublicacion: currentDate,
                fechaParaOrdenar: new Date().toString(),
                fechaLimite: fechaLimit,
                titulo: tituloNoSpace,
                descripcion: descripcionNoSpace,
                exist: "true",
                email: email,
                usuario: nombre,
                departamento: departamento,
            };

            db.ref("avisos_lc")
                .push(params)
                .then(() => {
                    res.json({
                        status: "Publicado"
                    });
                    data = {
                        notification: {
                            title: titulo,
                            body: descripcion,
                        },
                    };
                    // Notification.send(data);

                    console.log("-----------------------\nAviso creado con exito");
                })
                .catch((error) => {
                    console.error(error);
                });
        };

        //Actualizar aviso existente
        let actualizaAviso = function(clave) {
            db.ref("avisos_lc")
                .child(clave)
                .update({
                    fechaModificacion: currentDate,
                    titulo: tituloNoSpace,
                    descripcion: descripcionNoSpace,
                })
                .then(() => {
                    res.json({
                        status: "Actualizado"
                    });
                    data = {
                        notification: {
                            title: titulo,
                            body: descripcion,
                        },
                    };
                    // Notification.send(data);

                    console.log("-----------------------\nAviso Actualizado");
                })
                .catch((err) => {
                    console.log(err);
                });
        };

        if (idNoSpace.length <= 0) {
            insertaNuevoAviso();
        } else actualizaAviso(idNoSpace);

    } else res.json({ status: "ERROR" });

});

//-------------------------------------------------------------------- ELIMINA UN AVISO

ruta.get("/eliminar/:id", (req, res) => {
    if (req.session.currentEmail && req.session.currentPassword) {
        let id = req.params.id.trim();
        db.ref("avisos_lc/" + id)
            .remove()
            .then(() => {
                console.log("-----------------------\nAviso eliminado correctamente");
            })
            .catch((error) => {
                console.error(error);
            });
    } else res.json("ERROR");
});

//-------------------------------------------------------------------- ACTUALIZA CON UNA NUEVA CONTASEÑA

ruta.post("/changePass", (req, res) => {
    let {
        actualPassword,
        newpassword
    } = req.body;
    let actualPasswordNoSpace = actualPassword.trim();
    let newpasswordNoSpace = newpassword.trim();

    if (req.session.currentEmail && req.session.currentPassword) {
        bcrypt.compare(
            actualPassword,
            req.session.currentPassword,
            function(err, isValid) {
                if (isValid) {
                    comprobarUsuario(req.session.currentEmail);
                } else {
                    res.json({
                        status: "ERROR"
                    });
                }
            }
        );

        let comprobarUsuario = function(user_email) {
            db.ref("usuarios_lc")
                .orderByChild("email_id")
                .equalTo(user_email)
                .once("value", (snapshot) => {
                    const resConsulta_email_id = snapshot.val();
                    const keyFromDB = Object.keys(resConsulta_email_id)[0];
                    cambiarContraseña(keyFromDB);
                });
        };

        let cambiarContraseña = function(key) {
            let passNew = newpassword;
            req.session.currentPassword = passNew;
            const salt = 10;
            const hash = bcrypt.hashSync(passNew, salt);
            passNew = hash;
            db.ref("usuarios_lc")
                .child(key)
                .update({
                    pass: passNew,
                })
                .catch((err) => {
                    console.log(err);
                });
            res.json({
                status: "OK"
            });
        };
    }
});

//-------------------------------------------------------------------- ACTUALIZA DATOS DEL USUARIO

ruta.post("/cambiarUserData", (req, res) => {
    let { newDepartamento, newName } = req.body;
    let depTrim = newDepartamento.trim();
    let nameTrim = newName.trim();
    if (req.session.currentEmail && req.session.currentPassword) {
        if (req.session.currentNombre == nameTrim && req.session.currentDepartamento == depTrim)
            res.json({
                status: "OK"
            });
        else {
            db.ref("usuarios_lc")
                .orderByChild("email_id")
                .equalTo(req.session.currentEmail)
                .once("value", (snapshot) => {
                    const resConsulta_email_id = snapshot.val();
                    let keyDelUsuario = Object.keys(resConsulta_email_id)[0];
                    actualizarUserData(keyDelUsuario);
                });

            let actualizarUserData = function(keyDelUsuario) {
                //Actualiza el nombre y departamento
                db.ref("usuarios_lc")
                    .child(keyDelUsuario)
                    .update({
                        usuario: nameTrim,
                        departamento: depTrim,
                    })
                    .then(() => {
                        req.session.currentNombre = nameTrim;
                        req.session.currentDepartamento = depTrim;
                        console.log(
                            "-----------------------\nDatos de usuario actualizados"
                        );
                        res.json({
                            status: "OK"
                        });
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            };
        }
    } else res.json('ERROR');

});

/*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ RUTAS DE ACCIONES */

/*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ API'S */

//-------------------------------------------------------------------- MOSTRAR AVISOS PUBLICADOS SEGUN USUARIO

ruta.get("/api/mostrarAvisosPublicados", (req, res) => {
    if (req.session.currentEmail && req.session.currentPassword) {
        let emailUser_current = req.session.currentEmail;

        db.ref("avisos_lc")
            .orderByChild("email")
            .equalTo(emailUser_current)
            .once("value", (snapshot) => {
                const resConsulta_email_id = snapshot.val();
                //Para mostrar al inicio el último aviso modificado

                function sortAvisosPorFecha(objetoResultado_Avisos) {
                    let arr = [];
                    let cont = 0;

                    let currentDate = new Date()
                        .toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                        })
                        .toString();

                    for (let resultado in objetoResultado_Avisos) {
                        let keyActual = Object.keys(objetoResultado_Avisos)[cont];
                        let datosRequeridos_objeto = Object.values(objetoResultado_Avisos)[
                            cont
                        ];

                        if (currentDate === datosRequeridos_objeto.fechaLimite) {
                            db.ref("avisos_lc/" + keyActual)
                                .remove()
                                .then(() => {
                                    console.log(
                                        "-----------------------\nEliminado por fecha - Aviso eliminado correctamente"
                                    );
                                })
                                .catch((error) => {
                                    console.log(error);
                                });
                        } else {
                            arr.push({
                                key: keyActual,
                                titulo: datosRequeridos_objeto.titulo,
                                descripcion: datosRequeridos_objeto.descripcion,
                                fechaPublicacion: datosRequeridos_objeto.fechaPublicacion,
                                fechaModificacion: datosRequeridos_objeto.fechaModificacion,
                                fechaOrndenamiento: datosRequeridos_objeto.fechaParaOrdenar,
                                fechaLimite: datosRequeridos_objeto.fechaLimite,
                            });
                        }
                        cont++;
                    }
                    arr.sort(function(a, b) {
                        return (
                            new Date(b.fechaOrndenamiento) - new Date(a.fechaOrndenamiento)
                        );
                    });
                    return arr; // returns array
                }

                let avisosArray = sortAvisosPorFecha(resConsulta_email_id);
                res.json(avisosArray);
            })
            .catch((error) => {
                console.log(error);
            });
    } else res.json({ status: 'ERROR' });

});

//-------------------------------------------------------------------- MUESTRA USUARIOS

ruta.get("/api/mostrarUsuarios", (req, res) => {
    if (req.session.currentEmail && req.session.currentPassword) {
        db.ref("usuarios_lc").once("value", (snapshot) => {
            resConsulta_email_id_all = snapshot.val();

            if (resConsulta_email_id_all == null) {
                res.json([]);
            } else {
                let arr = [];
                let cont = 0;
                for (let resultado in resConsulta_email_id_all) {
                    let keyActual = Object.keys(resConsulta_email_id_all)[cont];
                    let datosRequeridos_objeto = Object.values(resConsulta_email_id_all)[
                        cont
                    ];
                    datosRequeridos_objeto.status == true ?
                        (statusUser = "Si") :
                        (statusUser = "No");
                    if (datosRequeridos_objeto.userType != "admin") {
                        arr.push({
                            key: keyActual,
                            email_id: datosRequeridos_objeto.email_id,
                            usuario: datosRequeridos_objeto.usuario,
                            departamento: datosRequeridos_objeto.departamento,
                            status: statusUser,
                        });
                    }
                    cont++;
                }

                res.json(arr);
            }
        });
    } else res.json("ERROR - ACCESO DENEGADO");
});

//-------------------------------------------------------------------- OBTENER EL ID DE UN AVISO PARA EDITARLO

ruta.get("/api/obtenerID/:id", (req, res) => {
    let id = req.params.id.trim();

    //Para avisos existentes
    let avisoPlantilla = {
        aviso_id: "",
        descripcion: "",
        titulo: "",
    };

    db.ref("avisos_lc/" + id)
        .once("value", (snapshot) => {
            const resConsulta_avisoID = snapshot.val();
            avisoPlantilla = {
                aviso_id: id,
                descripcion: resConsulta_avisoID.descripcion,
                titulo: resConsulta_avisoID.titulo,
            };
            res.json(avisoPlantilla);
        })
        .catch((error) => {
            console.error(error);
        });
});

//-------------------------------------------------------------------- DEVUELVE LOS AVISOS ORDENADOS PARA LA PÁGINA DE HISTORIAL

ruta.get("/api/mostrarAvisos", (req, res) => {
    if (req.session.currentEmail && req.session.currentPassword) {
        db.ref("avisos_lc")
            .orderByChild("fechaPublicacion")
            .once("value", (snapshot) => {
                const resConsulta_fechaPublicacion = snapshot.val();

                if (resConsulta_fechaPublicacion == null) {
                    res.json([]);
                } else {
                    let arr = [];
                    let cont = 0;

                    let currentDate = new Date()
                        .toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                        })
                        .toString();

                    for (let resultado in resConsulta_fechaPublicacion) {
                        let datosRequeridos_objeto = Object.values(resConsulta_fechaPublicacion)[cont];
                        if (datosRequeridos_objeto.fechaLimite === currentDate) {
                            db.ref("avisos_lc/" + keyActual)
                                .remove()
                                .then(() => {
                                    console.log(
                                        "-----------------------\nEliminado por fecha - Aviso eliminado correctamente"
                                    );
                                })
                                .catch((error) => {
                                    console.error(error);
                                });
                        } else {
                            arr.push({
                                titulo: datosRequeridos_objeto.titulo,
                                descripcion: datosRequeridos_objeto.descripcion,
                                fechaPublicacion: datosRequeridos_objeto.fechaPublicacion,
                                fechaParaOrdenar: datosRequeridos_objeto.fechaParaOrdenar,
                                fechaLimite: datosRequeridos_objeto.fechaLimite,
                                departamento: datosRequeridos_objeto.departamento,
                                usuario: datosRequeridos_objeto.usuario,
                            });
                        }
                        cont++;
                    }

                    //Ordenar los objetos en el arreglo por fecha para mostrar el más reciente
                    let arrayValuesHistorial = arr.sort(function(a, b) {
                        return new Date(b.fechaParaOrdenar) - new Date(a.fechaParaOrdenar);
                    });
                    res.json(arrayValuesHistorial);
                }
            });
    } else res.json("ERROR - ACCESO DENEGADO");

});

/*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ API'S */


//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ RECURPERAR CONTRASEÑA DESDE EL CODIGO DE RECUPERACION

//-------------------------------------------------------------------- RECIBE AL EMAIL PARA ENVIAR EL CODIGO DE RECUPERACION 

ruta.post("/recuperarPassword", (req, res) => {
    let email = req.body.email;
    let emailNoSpace = email.trim();
    console.log(
        "-----------------------\nCorreo para enviar código de recuperación: " +
        emailNoSpace
    );

    db.ref("usuarios_lc")
        .orderByChild("email_id")
        .equalTo(emailNoSpace)
        .once("value", (snapshot) => {
            const resConsulta_email_id = snapshot.val();

            console.log("-----------------------\n", resConsulta_email_id);
            if (resConsulta_email_id != null) crearCodigoRecuperacion(resConsulta_email_id);
            else {
                res.json({
                    status: "NO EXIST",
                    correo: emailNoSpace
                });
            }
        })
        .catch((err) => {
            res.json({
                status: "ERROR",
                correo: emailNoSpace
            });
            console.log(err);
        });

    let crearCodigoRecuperacion = function(objectUser_check) {
        let codigoRecupInicial = uuidv4();
        let codigoRecup = codigoRecupInicial;

        console.log(
            "-----------------------\nEste es el codigo de recuperación:",
            codigoRecup
        );

        let keyDelUsuario = Object.keys(objectUser_check)[0];
        //Agrega un código único de recuperación para el usuario
        db.ref("usuarios_lc")
            .child(keyDelUsuario)
            .update({
                codigoRecuperacionPass: codigoRecup,
            })
            .then(() => {
                res.json({
                    status: "OK",
                    correo: emailNoSpace
                });
                enviarCorreo(codigoRecup);
            });
    };

    let enviarCorreo = function(codigoRecupera) {
        const codigoRecuperacionPass_cuerpoHTML =
            `<h3> Para reestablecer su contraseña haga clic en el 
                                                    siguiente enlace: http://localhost:3000/recoveryPass/` +
            codigoRecupera +
            `
                                                    </h3> \n <h3>Si no ha sido usted quien hizo la petición, haga caso omiso 
                                                    a este correo </h3>`;

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "sisgeinn2@gmail.com",
                pass: "ouifrdsbfkonhxaj", //'1q2w3e1q' // Remplazar con nustras credenciales o con la contraseña especifica de la aplciación
            },
        });

        const mailOptions = {
            to: email,
            subject: "Codigo de recuperación de contraseña",
            html: codigoRecuperacionPass_cuerpoHTML,
            // text:
        };

        transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log(
                    "-----------------------\nCorreo enviado status: " + info.response
                );
            }
        });
    };
});

//-------------------------------------------------------------------- LINK PARA VERIFICAR CODIGO DE RECUPERACION

ruta.get("/recoveryPass/:code", (req, res) => {
    let codigoRe = req.params.code;
    let codigoReNoSpace = codigoRe.trim();

    db.ref("usuarios_lc")
        .orderByChild("codigoRecuperacionPass")
        .equalTo(codigoReNoSpace)
        .once("value", (snapshot) => {
            const resConsulta_codigoRecuperacionPass = snapshot.val();

            if (resConsulta_codigoRecuperacionPass == null) {
                console.log("-----------------------\nCódigo expirado");
                res.redirect("/expirado");
            } else {
                const valuesObjeto = Object.values(resConsulta_codigoRecuperacionPass)[0].status;
                console.log(valuesObjeto);

                //Verifica el Status de la cuenta para comprobar que la cuenta esté verificada
                if (valuesObjeto == false) res.redirect("/noVerificado");
                else {
                    codigoGlobalRecuperacion = codigoReNoSpace;
                    res.redirect("/ingresaNuevaPassword");
                }
            }
        });
});

//-------------------------------------------------------------------- FORMULARIO PARA ESCRIBIR NUEVA PASSWORD

ruta.get("/ingresaNuevaPassword", (req, res) => {
    console.log(codigoGlobalRecuperacion);
    db.ref("usuarios_lc")
        .orderByChild("codigoRecuperacionPass")
        .equalTo(codigoGlobalRecuperacion)
        .once("value", (snapshot) => {
            const resConsulta_codigoRecuperacionPass = snapshot.val();

            if (resConsulta_codigoRecuperacionPass == null) res.redirect("/expirado");
            else {
                const value_codRec = Object.values(resConsulta_codigoRecuperacionPass)[0].codigoRecuperacionPass;
                console.log(value_codRec);
                res.render("recoveryPassword", {
                    codigoRecuperacion: value_codRec
                });
            }
        });
});

//-------------------------------------------------------------------- RUTA QUE MODIFICA LA PASSWORD 

ruta.post("/modificarMiPassword", (req, res) => {
    let {
        newPassword,
        codigoRecu
    } = req.body;

    let codigoRecuNoSpace = codigoRecu.trim();

    db.ref("usuarios_lc")
        .orderByChild("codigoRecuperacionPass")
        .equalTo(codigoRecuNoSpace)
        .once("value", (snapshot) => {
            const resConsulta_codigoRecuperacionPass = snapshot.val();

            if (resConsulta_codigoRecuperacionPass != null) {
                actualizaMiPassword(resConsulta_codigoRecuperacionPass);
            } else {
                res.json({
                    status: "ERROR"
                });
            }
        });

    let actualizaMiPassword = function(objectUser_byCodigoRecuperacion) {
        let key = Object.keys(objectUser_byCodigoRecuperacion)[0];
        let passNew = newPassword;
        const salt = 10;
        const hash = bcrypt.hashSync(passNew, salt);
        passNew = hash;
        //Actualiza la nueva contraseña recuperada y agrega un código de recuperación nuevo, pero inaccesible
        db.ref("usuarios_lc")
            .child(key)
            .update({
                pass: passNew,
                codigoRecuperacionPass: uuidv4(),
            })
            .then(() => {
                res.json({
                    status: "OK"
                });
                console.log("Contraseña cambiada");
            })
            .catch((err) => {
                console.log(err);
                res.json({
                    status: "ERROR"
                });
            });
    };
});

//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ RECURPERAR CONTRASEÑA DESDE EL CODIGO DE RECUPERACION
//Registar registros
firebase.database().ref('Contactos').push(params);

// Hacer una consulta general
firebase.database().ref('Contactos').once('value', (snapshot) => {
    const data = snapshot.val();
    res.render('login2', { contactos: data });
}).catch((error) => {
    console.error(error);
});


/*------------------------ express -----------------------*/
const express = require('express');
const ruta = express.Router(); //Para las rutas
module.exports = ruta; //Para exportar esta función o constante
/*------------------------ express -----------------------*/

/*------------------------ FIREBASE -----------------------*/
const adminFire = require('firebase-admin'); //Mando llamar a todos los modulos de Admin-Firebase

const urlFirebase = require('../server/keys'); //Archivo a la ruta de nuestra BD
var serviceAccount = require("../server/nodefirebase-lobocprueba-firebase-adminsdk-w13zw-92e9b67c90.json"); //Archivo con las credenciales de la base de datos

adminFire.initializeApp({
    credential: adminFire.credential.cert(serviceAccount),
    databaseURL: urlFirebase.urlDatabaseFirestore
});

const db = adminFire.database(); //Para conectarse a la base de datos en firebase realtime

/*------------------------ FIREBASE -----------------------*/


ruta.get('/', (req, res) => {
    res.render('login');
});

ruta.post('/pruebaFireBase-registro', (req, res) => {
    const params = {
        nombre: req.body.username,
        saludo: req.body.password
    }
    db.ref('Contactos').push(params); //Registar registros

    res.redirect('/');
});

ruta.get('/rellenarEspacios', (req, res) => {
    db.ref('Contactos').once('value', (snapshot) => {
        const data = snapshot.val();
        res.render('login2', { contactos: data });
    }).catch((error) => {
        console.error(error);
    });
});
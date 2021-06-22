//metodos para enviar notificaciones
const admin = require("firebase-admin");

var FCM = require('fcm-push');
const { response } = require("express");

function enviar(message) {
    var serverKey = 'AAAAovvY-Mw:APA91bHi3MGnR1zBKVkNdjRa-T3JWOgAKb6ZitOIQ1t_pbhMYCwnKPRk1DJxI9Flp1LQfz0dnD61K2Nq8Mklj9rx9HBaMVVSDqaClpRSxPEOhX0_Hi7wr9lVWti4l4wlyB5sV_G9KDIQ';
    var fcm = new FCM(serverKey);

    //callback style
    fcm.send(message, function(err, response) {
        if (err) {
            console.log("Algo a salido mal!! :(", err);
        } else {
            console.log("Notificación enviada con exito: ", response);
        }
    });

    /*
    //promise style
    fcm.send(message)
        .then(function(response){
            console.log("Successfully sent with response: ", response);
        })
        .catch(function(err){
            console.log("Something has gone wrong!");
            console.error(err);
        })*/

}


function send(message) {
    var serverKey = 'AAAAovvY-Mw:APA91bHi3MGnR1zBKVkNdjRa-T3JWOgAKb6ZitOIQ1t_pbhMYCwnKPRk1DJxI9Flp1LQfz0dnD61K2Nq8Mklj9rx9HBaMVVSDqaClpRSxPEOhX0_Hi7wr9lVWti4l4wlyB5sV_G9KDIQ';
    var fcm = new FCM(serverKey);
    var topic = "test";

    admin.messaging().sendToTopic(topic, message)
        .then(function(response) {
            console.log("Successfully sent message:", response);
        })
        .catch(function(error) {
            console.log("Error sending message:", error);
        });
}


//Exportar las funciones para utilizarlas en otros scripts
module.exports = { enviar, send };
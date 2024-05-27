//importación de módulos
import express from "express";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import _ from "lodash";
import chalk from "chalk";

//Guardar instancia de express en app (servidor)
const app = express();

// habilitamos un puerto para escuchar las peticiones
app.listen(3000, () => {
    console.log("Servidor escuchando en http://localhost:3000");
});

//Se crea array vacío de alcance global para agregar usuarios
let users = [];

//Se crea función para mostrar lsta de usuarios
const lista = (array) => {
    let templateLista = `
    <ul>
    `
    array.forEach(user => {
        templateLista += `
        <li>Nombre: ${user.first}, Apellido: ${user.last}, ID: ${user.id}, TimeStamp: ${user.time}</li>
        `
        console.log(chalk.bgWhite.blue(`Nombre: ${user.first}, Apellido: ${user.last}, ID: ${user.id}, TimeStamp: ${user.time}`))
    })
    templateLista += `
    </ul>`
    
    return templateLista;
}

const fetcher = async () => {
    //endpoint para usuarios
    app.get('/usuarios', async (req, res) => {
        //Llamar a api con axios
        const { data } = await axios.get('https://randomuser.me/api');
        //Especificar datos requeridos de data (api)
        const { name: { first, last }, gender } = data.results[0];
        //Crear variable de id de 6 dígitos con uuid
        const id = uuidv4().slice(30);
        //Crear variable de fechas con moment
        const time = moment().format('MMM Do YYYY, LTS');
        //Pushear a array users los datos de cada usuario obtenido de data
        users.push({ first, last, gender, id, time });
        //Crear variable con usuarios separados por género, usando lodash
        const usersOrder = _.partition(users, ({ gender }) => gender == 'female');

        //Crear plantilla para insertar función "lista" con usuarios 
        let template = `
        <h4>Total Mujeres ${usersOrder[0].length}</h4>
            ${lista(usersOrder[0])}        
        <h4>Total Hombres ${usersOrder[1].length}</h4>
            ${lista(usersOrder[1])}        
        `
        //Definir respuesta del servidor, mostrando la plantilla con usuarios
        res.send(template)
    })
}

fetcher()



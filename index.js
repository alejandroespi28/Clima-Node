require('dotenv').config();

const {inquirerMenu,leerInput, pausa, listarLugares} = require('./helpers/inquirer');
const Busquedas = require('./models/busquedas');



 const main = async() =>{
    const busquedas = new Busquedas();
    let opt;
    
    do {
        opt = await inquirerMenu();
        
        switch(opt){
            case '1':
                const lugar = await leerInput('Ciudad a buscar:');
            
                const lugares =await busquedas.ciudad(lugar);
                const id = await listarLugares(lugares);
                if(id === '0') continue;
           
                const lugarSelecto = lugares.find(l => l.id === id);   
                busquedas.agregarHistorial(lugarSelecto.nombre)
                const {lng, lat} = lugarSelecto;     
                const datos = await busquedas.climaLugar(lat, lng);
               
                // console.log(datos);
               
                console.log('\nInformación de la ciudad\n'.green);
                console.log('Ciudad:',lugarSelecto.nombre,);
                console.log('Lat:',lugarSelecto.lat);
                console.log('Lng:',lugarSelecto.lng);
                console.log('Temperatura:',datos.temp);
                console.log('Minima:',datos.min);
                console.log('Máxima:',datos.max);
                console.log('El clima se encuentra con:',datos.desc.green);
                break;
                case '2':
               
                busquedas.historialCapitalizado.forEach((lugar,i) =>{
                    let idx= i+1;
                    console.log(`${idx}. ${lugar}`);
                })
              
                break;

        }


        if(opt !==0) await pausa();
    }while(opt !== '0')

}

main();
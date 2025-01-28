const axios  = require("axios");
const fs = require("fs");

class Busquedas {
    historial = [];
    dbPath = './db/database.json';

    constructor(){
        this.leerDB();
      
      
    }

    
    get historialCapitalizado() {
        return this.historial.map( lugar => {

            let palabras = lugar.split(' ');
            palabras = palabras.map( p => p[0].toUpperCase() + p.substring(1) );

            return palabras.join(' ')

        })
    }

    get getParamsMapBox() {
       return {
        "access_token": process.env.MAPBOX_KEY,
        "limit":5,
        "lenguage": 'es' 
       }
       }
    get getParamsOpenWeather(){
        https://api.openweathermap.org/data/2.5/weather?lat=21&lon=-101&appid=28533d227505f8b84f00ab31c77ed169&units=metric&lang=es
        return{
         "appid": process.env.OPENWEATHER_KEY,
         'units': 'metric',
         'lang' : 'es',
        }
    }   

    async ciudad (lugar = ""){
        //  Peticion HTTP
       try {
        const instance = axios.create({
            baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
            params: this.getParamsMapBox
        });

        const res = await instance.get();
        return res.data.features.map(lugar => ({
            id: lugar.id,
            nombre: lugar.place_name,
            lng: lugar.center[0],
            lat: lugar.center[1],
        }) )

     
       
        } catch (error) {
            console.log(error);
          return [];
       }
       
       
    }

    async climaLugar(lat, lng){
        
        try {
            const instance = axios.create({
                baseURL: `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}`,
                params: this.getParamsOpenWeather,
            });
            const res = await instance.get();
            const {weather,main} = res.data;
            
            return{
                desc: weather[0].description, 
                temp: main.temp,
                min:  main.temp_min,
                max:  main.temp_max,
            }

        } catch (error) {
            console.log(error);
        }
    }

    agregarHistorial(lugar = ''){
      if  (this.historial.includes(lugar.toLowerCase())){
          return;
      }
        this.historial.unshift(lugar.toLowerCase());
        // Grabar en DB
        this.guardarDB();
    
    }

    guardarDB(){
        const payload={
            historial: this.historial
        };
        fs.writeFileSync(this.dbPath, JSON.stringify(payload));

    }

   leerDB(){

    if( !fs.existsSync( this.dbPath ) ) return;
        
    const info = fs.readFileSync( this.dbPath, { encoding: 'utf-8' });
    const data = JSON.parse( info );

    this.historial = data.historial;

                
    }


}

module.exports = Busquedas;
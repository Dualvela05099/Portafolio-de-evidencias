Write-Host "=============================="
Write-Host " CREANDO APP INVENTARIO EXPO "
Write-Host "=============================="


# Verificar Node
if (!(Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "Node.js no está instalado"
    exit
}


# Crear proyecto
Write-Host "[1/4] Creando proyecto..."


if (!(Test-Path "InventarioApp")) {

    npx create-expo-app InventarioApp

}
else {

    Write-Host "El proyecto InventarioApp ya existe"

}


Set-Location InventarioApp



Write-Host "[2/4] Instalando SQLite..."


npx expo install expo-sqlite




Write-Host "[3/4] Creando App.js..."



$app = @'

import { useState, useEffect } from 'react';

import {
View,
Text,
TextInput,
Button,
FlatList,
StyleSheet,
Alert,
TouchableOpacity
} from 'react-native';


import * as SQLite from 'expo-sqlite';



const db = SQLite.openDatabaseSync('inventario.db');



export default function App(){


const [nombre,setNombre]=useState('');

const [cantidad,setCantidad]=useState('');

const [precio,setPrecio]=useState('');


const [productos,setProductos]=useState([]);




useEffect(()=>{


db.execSync(`

CREATE TABLE IF NOT EXISTS productos(

id INTEGER PRIMARY KEY AUTOINCREMENT,

nombre TEXT,

cantidad INTEGER,

precio REAL

)

`);


cargarProductos();


},[]);




function cargarProductos(){


const datos = db.getAllSync(

"SELECT * FROM productos ORDER BY nombre"

);


setProductos(datos);


}





function agregar(){



if(!nombre || !cantidad || !precio){


Alert.alert(
"Error",
"Completa todos los campos"
);


return;


}



db.runSync(

"INSERT INTO productos(nombre,cantidad,precio) VALUES(?,?,?)",

[
nombre,
Number(cantidad),
Number(precio)
]


);



setNombre('');

setCantidad('');

setPrecio('');


cargarProductos();



}






function cambiar(id,valor){



db.runSync(

"UPDATE productos SET cantidad=cantidad+? WHERE id=?",

[
valor,
id
]


);


cargarProductos();


}






function eliminar(id){



db.runSync(

"DELETE FROM productos WHERE id=?",

[id]

);



cargarProductos();



}





return(



<View style={styles.container}>


<Text style={styles.titulo}>
Inventario Local
</Text>




<TextInput

style={styles.input}

placeholder="Producto"

value={nombre}

onChangeText={setNombre}

/>




<TextInput

style={styles.input}

placeholder="Cantidad"

keyboardType="numeric"

value={cantidad}

onChangeText={setCantidad}

/>




<TextInput

style={styles.input}

placeholder="Precio"

keyboardType="decimal-pad"

value={precio}

onChangeText={setPrecio}

/>





<Button

title="Agregar producto"

onPress={agregar}

/>





<FlatList


data={productos}


keyExtractor={item=>item.id.toString()}




renderItem={({item})=>(


<View style={styles.item}>


<View style={{flex:1}}>


<Text style={styles.nombre}>

{item.nombre}

</Text>


<Text>

Stock: {item.cantidad}

</Text>



<Text>

Total:
${(item.cantidad*item.precio).toFixed(2)}

</Text>



</View>





<TouchableOpacity onPress={()=>cambiar(item.id,1)}>

<Text>
➕
</Text>

</TouchableOpacity>




<TouchableOpacity onPress={()=>cambiar(item.id,-1)}>

<Text>
➖
</Text>

</TouchableOpacity>





<TouchableOpacity onPress={()=>eliminar(item.id)}>

<Text>
❌
</Text>

</TouchableOpacity>



</View>



)}



/>


</View>



);



}





const styles=StyleSheet.create({


container:{

flex:1,

padding:20,

paddingTop:60

},



titulo:{

fontSize:28,

fontWeight:'bold',

textAlign:'center',

marginBottom:20

},



input:{

borderWidth:1,

padding:10,

marginBottom:10,

borderRadius:8

},



item:{

flexDirection:'row',

padding:15,

marginTop:10,

backgroundColor:'#eee',

borderRadius:10

},



nombre:{

fontSize:18,

fontWeight:'bold'

}



});



'@



Set-Content -Path "App.js" -Value $app -Encoding UTF8




Write-Host "[4/4] LISTO"

Write-Host ""

Write-Host "Para iniciar la app:"

Write-Host ""

Write-Host "cd InventarioApp"

Write-Host "npx expo start"
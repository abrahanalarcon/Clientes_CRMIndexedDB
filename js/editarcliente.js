(function(){
    let DB;
    let idCliente;
    const formulario = document.querySelector('#formulario');
   
    const nombreInput = document.querySelector('#nombre');
    const emailInput = document.querySelector('#email');
    const empresaInput = document.querySelector('#empresa');
    const telefonoInput = document.querySelector('#telefono');
    document.addEventListener('DOMContentLoaded', () => {
        conectarDB();
        // Verificar si el cliente existe
        const parametrosURL = new URLSearchParams(window.location.search);
        const idCliente = parametrosURL.get('id');
        if(idCliente) {
              
            setTimeout( () => {
                obtenerCliente(idCliente);
            }, 100);
        
        }
    });


    function obtenerCliente(id) {
        const transaction = DB.transaction(['crm'], 'readwrite');
        const objectStore = transaction.objectStore('crm');

        const cliente = objectStore.openCursor();
        cliente.onsuccess = function(e) {
            const cursor = e.target.result;

            if(cursor) {
               if(cursor.value.id  == Number(id)) {
                llenarFormulario(cursor.value);
                }
               cursor.continue();
            }
        }
    }

    function llenarFormulario(datosCliente) {
        const { nombre, email, empresa, telefono } = datosCliente;
         nombreInput.value = nombre;
         emailInput.value = email;
         empresaInput.value = empresa;
         telefonoInput.value = telefono;
    }
   
     function conectarDB (){
          const abrirConexion = window.indexedDB.open('crm', 1);

          abrirConexion.onerror = function() {
              console.log('Hubo un error');
          };
       
          abrirConexion.onsuccess = function() {
              DB = abrirConexion.result;
          };
    }   

})();
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

        formulario.addEventListener('submit', actualizarCliente);
        // Verificar si el cliente existe
        const parametrosURL = new URLSearchParams(window.location.search);
        idCliente = parametrosURL.get('id');
        if(idCliente) {
              
            setTimeout( () => {
                obtenerCliente(idCliente);
            }, 100);
        
        }
    });
    function actualizarCliente(e) {
        e.preventDefault();

        if( nombreInput.value === '' || emailInput.value === '' || empresaInput.value === '' || telefonoInput.value === '' ) {
            imprimirAlerta('Todos los campos son obligatorios', 'error');
            return;
        }
      // actualizar...
      const clienteActualizado = {
        nombre: nombreInput.value,
        email: emailInput.value,
        empresa: empresaInput.value,
        telefono: telefonoInput.value,
        id: Number( idCliente )
      };
      // actualizar...
      const transaction = DB.transaction(['crm'], 'readwrite');
      const objectStore = transaction.objectStore('crm');

      objectStore.put(clienteActualizado);
      transaction.oncomplete = () => {
        imprimirAlerta('Editado Correctamente');

        setTimeout(() => {
            window.location.href = 'index.html';
        }, 3000);
    };

    transaction.onerror = (error) => {
        console.log(error);
        console.log('Hubo un errorr.');
    };
    }

    function obtenerCliente(id) {
        const transaction = DB.transaction(['crm'], 'readonly');
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

    function conectarDB() {
        // ABRIR CONEXIÓN EN LA BD:
    
        const abrirConexion = window.indexedDB.open('crm', 1);
    
        // si hay un error, lanzarlo
        abrirConexion.onerror = function() {
            console.log('Hubo un error');
        };
    
        // si todo esta bien, asignar a database el resultado
        abrirConexion.onsuccess = function() {
            // guardamos el resultado
            DB = abrirConexion.result;
        };
    }
   


})();
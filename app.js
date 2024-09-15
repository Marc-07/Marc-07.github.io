//Selectores
const pacienteInput = document.querySelector("#paciente");
const propietarioInput = document.querySelector("#propietario");
const emailInput = document.querySelector("#email");
const fechaInput = document.querySelector("#fecha");
const sintomasInput = document.querySelector("#sintomas");
const fotoInput = document.querySelector("#foto");

const formulario = document.querySelector("#formulario-cita");
const formularioInput = document.querySelector("#formulario-cita input[type='submit']")
const contenedorCitas = document.querySelector("#citas");

//Eventos
pacienteInput.addEventListener("change", datosCita);
propietarioInput.addEventListener("change",datosCita);
emailInput.addEventListener("change", datosCita);
fechaInput.addEventListener("change",datosCita);
sintomasInput.addEventListener("change", datosCita);
fotoInput.addEventListener("change",leerArchivo); //Change o submit //Revisar file

formulario.addEventListener("submit", submitCita)

let editando = false

const citaObj = { 
    id: generarId(),
    paciente: "",
    propietario: "",
    email: "",
    fecha: "",
    sintomas: "",
    file: "",
}

class Notificacion {
    constructor ({texto, tipo}){
        this.texto = texto,
        this.tipo = tipo

        this.mostrar();
    }

    mostrar(){
        //Crear la notificacion
        const alerta = document.createElement("DIV");
        alerta.classList.add("text-center", "w-full", "p-3", "text-white", "my-5", "alert", "uppercase", "font-bold", "text-sm", "rounded", "block");

        //Eliminar alertas duplicadas 
        const alertaPrevia = document.querySelector(".alert");
        alertaPrevia?.remove();

        //Si es de tipo error agrega una clase 
        this.tipo === "error" ?  alerta.classList.add("bg-red-500") :  alerta.classList.add("bg-green-500");

        //Mensaje de error
        alerta.textContent = this.texto

        //Insertar en el DOM 
        formulario.parentElement.insertBefore(alerta, formulario);

        //Quitar la alerta despues de 3s
        setTimeout(() => {
            alerta.remove()
        }, 3000);
    }
}

class AdminCitas {
    constructor (){
        this.citas = [];

    };

    agregar(cita){
        this.citas = [...this.citas, cita]
        this.mostrar();
    };

    editar(citaActualizada){
        this.citas = this.citas.map(cita => cita.id === citaActualizada.id ? citaActualizada : cita);
        this.mostrar();

    };

    eliminar(id){
        this.citas = this.citas.filter(cita => cita.id !== id);
        this.mostrar();
    };

    mostrar() {
        // Limpiar el HTML
        while (contenedorCitas.firstChild) {
            contenedorCitas.removeChild(contenedorCitas.firstChild);
        }

        //Comprobar si hay citas
        if (this.citas.length === 0){
            contenedorCitas.innerHTML = "<p class='text-xl mt-5 mb-10 text-center font-bold text-teal-600'>No hay pacientes todavía</p>"
            return
        }
    
        // Generando las citas
        this.citas.forEach(cita => {
            const divCita = document.createElement('div');
            divCita.classList.add(
                'flex', // Alineación en fila para pantallas medianas y mayores
                'flex-col', 'md:flex-row', // En columna para pantallas pequeñas
                'items-center', 'md:items-start', 'justify-between', // Centrado en pantallas pequeñas
                'bg-white', 'shadow-md', 'rounded-lg', 'p-5',  // Estilos de la card
                'mb-5'
            );

            const img = document.createElement('img');
            img.classList.add('w-32', 'h-32', 'md:w-40', 'md:h-40', 'rounded-xl', 'object-cover', 'mr-5');  // Tamaño y forma de la imagen
            img.src = cita.file;

            const divContenido = document.createElement('div');
            divContenido.classList.add('flex-1', 'text-left', 'mr-5');  // El contenido toma el resto del espacio

            const paciente = document.createElement('p');
            paciente.classList.add('font-semibold', 'mb-2', 'text-gray-700');
            paciente.innerHTML = `<span class="font-bold">Paciente: </span> ${cita.paciente}`;

            const propietario = document.createElement('p');
            propietario.classList.add('text-gray-600', 'mb-2');
            propietario.innerHTML = `<span class="font-bold">Propietario: </span> ${cita.propietario}`;

            const email = document.createElement('p');
            email.classList.add('text-gray-600', 'mb-2');
            email.innerHTML = `<span class="font-bold">E-mail: </span> ${cita.email}`;

            const fecha = document.createElement('p');
            fecha.classList.add('text-gray-600', 'mb-2');
            fecha.innerHTML = `<span class="font-bold">Fecha: </span> ${cita.fecha}`;

            const sintomas = document.createElement('p');
            sintomas.classList.add('text-gray-600', 'mb-2');
            sintomas.innerHTML = `<span class="font-bold">Síntomas: </span> ${cita.sintomas}`;

            // Botones de eliminar y editar
            const btnEditar = document.createElement('button');
            btnEditar.classList.add('py-2', 'px-5', 'bg-teal-600', 'hover:bg-teal-700', 'text-white', 'font-bold', 'uppercase', 'rounded-lg', 'flex', 'items-center', 'gap-2', 'mb-2', 'btn-editar');
            btnEditar.innerHTML = ' <svg fill="none" class="h-5 w-5" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>';
            const clone = {...cita}
            btnEditar.onclick = () => cargarEdicion (clone)


            const btnEliminar = document.createElement('button');
            btnEliminar.classList.add('py-2', 'px-5', 'bg-red-600', 'hover:bg-red-700', 'text-white', 'font-bold', 'uppercase', 'rounded-lg', 'flex', 'items-center', 'gap-2');
            btnEliminar.innerHTML = '<svg fill="none" class="h-5 w-5" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>';
            btnEliminar.onclick = () => this.eliminar(cita.id)


            const contenedorBotones = document.createElement("div");
            contenedorBotones.classList.add("flex", "flex-col", "md:flex-col", "gap-2", "md:ml-5", "mt-5", "md:mt-0"); // Los botones estarán en columna

            contenedorBotones.appendChild(btnEditar);
            contenedorBotones.appendChild(btnEliminar);

            // Ensamblado del divCita
            divContenido.appendChild(paciente);
            divContenido.appendChild(propietario);
            divContenido.appendChild(email);
            divContenido.appendChild(fecha);
            divContenido.appendChild(sintomas);

            divCita.appendChild(img);
            divCita.appendChild(divContenido);
            divCita.appendChild(contenedorBotones); 

            contenedorCitas.appendChild(divCita);
        });  
    }  
}

function datosCita (e){
    citaObj[e.target.name] = e.target.value

}

function leerArchivo(e) {
    const archivo = e.target.files[0]; 

    if (archivo) {
        const reader = new FileReader(); 
        reader.onload = function(e) {
            citaObj.file = e.target.result;
        }
        reader.readAsDataURL(archivo); 
    }
}

const citas = new AdminCitas();

function submitCita (e){
    e.preventDefault();
    if( Object.values(citaObj).some(valor  => valor.trim() === "")){
        const notificacion = new Notificacion ({
            texto: "Todos los campos son obligatorios",
            tipo: "error"
        })
        return;
    }

    if (editando){
        citas.editar({...citaObj});
        const notificacion = new Notificacion ({
            texto: "Editado Correctamente",
            tipo: "exito"
        })
    }else{
        citas.agregar({...citaObj});
        const notificacion = new Notificacion ({
            texto: "Paciente registrado",
            tipo: "exito"
        })
    }

    formulario.reset();
    reiniciarObjetoCita();
    formularioInput.value = "Registrar Paciente";
    editando = false;
  
}

function reiniciarObjetoCita (){
    Object.assign(citaObj,{ 
        
        id: generarId(),
        paciente: "",
        propietario: "",
        email: "",
        fecha: "",
        sintomas: "",
        file: "" //Empieza con string vacio? 
    });   
}

function generarId(){
    return Math.random().toString(36).substring(2) + Date.now()
}

function cargarEdicion (cita){
    Object.assign(citaObj, cita)

    pacienteInput.value = cita.paciente;
    propietarioInput.value = cita.propietario;
    emailInput.value = cita.email;
    fechaInput.value = cita.fecha;
    sintomasInput.value = cita.sintomas;
    fotoInput.value;

    editando = true
    formularioInput.value = "Guardar Cambios"
}
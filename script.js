// =======================================
// MEMOTEST - GENERAL JOSÉ DE SAN MARTÍN
// PARTE 1
// =======================================

// Frases y explicación histórica
const datosCartas = [
{
    frase:"Serás lo que debas ser o no serás nada.",
    explicacion:"Una de las frases más conocidas de San Martín. Resalta la importancia del esfuerzo, la vocación y el compromiso con los ideales."
},
{
    frase:"Seamos libres, que lo demás no importa nada.",
    explicacion:"Pronunciada durante la campaña libertadora. Expresa que la libertad era el objetivo más importante."
},
{
    frase:"La conciencia es el mejor juez que tiene un hombre de bien.",
    explicacion:"San Martín destacaba que la honestidad y la integridad son más importantes que la opinión de los demás."
},
{
    frase:"Cuando la patria está en peligro, todo está permitido, excepto no defenderla.",
    explicacion:"Una invitación al compromiso con la defensa de la nación y sus valores."
},
{
    frase:"Mi sable nunca saldrá de la vaina por opiniones políticas.",
    explicacion:"San Martín rechazaba las guerras civiles y priorizaba la unidad del pueblo."
},
{
    frase:"Hace más ruido un solo hombre gritando que cien mil que están callados.",
    explicacion:"Destaca el valor de expresar las propias ideas y actuar cuando es necesario."
},
{
    frase:"La biblioteca destinada a la educación universal es más poderosa que nuestros ejércitos.",
    explicacion:"Para San Martín, la educación era la herramienta más importante para construir una nación."
},
{
    frase:"Una derrota peleada vale más que una victoria casual.",
    explicacion:"Resalta el esfuerzo y la perseverancia por encima de la suerte."
}
];

// Crear el mazo (duplicar cartas)
let cartas = [];

datosCartas.forEach(carta=>{
    cartas.push({...carta});
    cartas.push({...carta});
});

// Mezclar cartas
function mezclar(array){

    for(let i=array.length-1;i>0;i--){

        const j=Math.floor(Math.random()*(i+1));

        [array[i],array[j]]=[array[j],array[i]];
    }

}

mezclar(cartas);

// Variables del juego

const tablero=document.getElementById("tablero");

const popup=document.getElementById("popup");

const frase=document.getElementById("frase");

const explicacion=document.getElementById("explicacion");

const continuar=document.getElementById("continuar");

const victoria=document.getElementById("victoria");

const sonidoAcierto=document.getElementById("acierto");

const sonidoError=document.getElementById("error");

const musica=document.getElementById("musica");

const aplausos=document.getElementById("aplausos");

let primeraCarta=null;

let segundaCarta=null;

let bloqueo=false;

let parejasEncontradas=0;

let esperandoPopup=false;

// Reproducir música en el primer clic
document.addEventListener("click",()=>{

    if(musica.paused){

        musica.volume=0.25;

        musica.play().catch(()=>{});

    }

},{once:true});

// Crear las cartas
function crearTablero(){

    tablero.innerHTML="";

    cartas.forEach((dato,index)=>{

        const carta=document.createElement("div");

        carta.className="carta";

        carta.dataset.frase=dato.frase;

        carta.dataset.index=index;

        carta.innerHTML=`

        <div class="carta-interna">

            <div class="frente">

                🇦🇷

            </div>

            <div class="dorso">

                ${dato.frase}

            </div>

        </div>

        `;

        carta.addEventListener("click",girarCarta);

        tablero.appendChild(carta);

    });

}

crearTablero();

// =======================================
// MEMOTEST - PARTE 2
// LÓGICA DEL JUEGO
// =======================================

function girarCarta(){

    if(bloqueo) return;

    if(esperandoPopup) return;

    if(this===primeraCarta) return;

    if(this.classList.contains("correcta")) return;

    this.classList.add("girada");

    if(primeraCarta===null){

        primeraCarta=this;

        return;

    }

    segundaCarta=this;

    bloqueo=true;

    comprobarPareja();

}

function comprobarPareja(){

    const coincide=

    primeraCarta.dataset.frase===segundaCarta.dataset.frase;

    if(coincide){

        parejaCorrecta();

    }else{

        parejaIncorrecta();

    }

}

// =======================================
// PAREJA CORRECTA
// =======================================

function parejaCorrecta(){

    sonidoAcierto.currentTime=0;

    sonidoAcierto.play().catch(()=>{});

    primeraCarta.classList.add("correcta");

    segundaCarta.classList.add("correcta");

    parejasEncontradas++;

    const carta=

    datosCartas.find(

        c=>c.frase===primeraCarta.dataset.frase

    );

    frase.textContent=carta.frase;

    explicacion.textContent=carta.explicacion;

    esperandoPopup=true;

    popup.classList.remove("oculto");

}

// =======================================
// BOTÓN CONTINUAR
// =======================================

continuar.addEventListener("click",()=>{

    popup.classList.add("oculto");

    primeraCarta=null;

    segundaCarta=null;

    bloqueo=false;

    esperandoPopup=false;

    if(parejasEncontradas===datosCartas.length){

        setTimeout(

            mostrarVictoria,

            700

        );

    }

});

// =======================================
// PAREJA INCORRECTA
// =======================================

function parejaIncorrecta(){

    sonidoError.currentTime=0;

    sonidoError.play().catch(()=>{});

    setTimeout(()=>{

        primeraCarta.classList.remove("girada");

        segundaCarta.classList.remove("girada");

        primeraCarta=null;

        segundaCarta=null;

        bloqueo=false;

    },1000);

}
// =======================================
// MEMOTEST - PARTE 3
// VICTORIA, REINICIO Y CONFETI
// =======================================

// Mostrar pantalla de victoria
function mostrarVictoria(){

    aplausos.currentTime = 0;
    aplausos.play().catch(()=>{});

    iniciarConfeti();

    victoria.classList.remove("oculto");

}

// Reiniciar juego
function reiniciarJuego(){

    // Ocultar ventana
    victoria.classList.add("oculto");

    detenerConfeti();

    // Reiniciar variables
    primeraCarta = null;
    segundaCarta = null;
    bloqueo = false;
    esperandoPopup = false;
    parejasEncontradas = 0;

    // Quitar cartas actuales
    tablero.innerHTML = "";

    // Volver a crear el mazo
    cartas = [];

    datosCartas.forEach(carta=>{

        cartas.push({...carta});
        cartas.push({...carta});

    });

    mezclar(cartas);

    crearTablero();

}

// =======================================
// CONFETI
// =======================================

const canvas = document.getElementById("confetti");
const ctx = canvas.getContext("2d");

let confeti = [];
let animacion = null;

function ajustarCanvas(){

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

}

window.addEventListener("resize", ajustarCanvas);

ajustarCanvas();

function iniciarConfeti(){

    confeti = [];

    const colores = [
        "#6ec6ff",
        "#ffffff",
        "#ffd54f"
    ];

    for(let i=0;i<220;i++){

        confeti.push({

            x:Math.random()*canvas.width,

            y:Math.random()*canvas.height-canvas.height,

            r:Math.random()*8+4,

            dy:Math.random()*3+2,

            dx:(Math.random()-0.5)*2,

            color:colores[
                Math.floor(Math.random()*colores.length)
            ],

            rot:Math.random()*360

        });

    }

    animarConfeti();

}

function animarConfeti(){

    ctx.clearRect(0,0,canvas.width,canvas.height);

    confeti.forEach(p=>{

        ctx.save();

        ctx.translate(p.x,p.y);

        ctx.rotate(p.rot*Math.PI/180);

        ctx.fillStyle=p.color;

        ctx.fillRect(-p.r/2,-p.r/2,p.r,p.r);

        ctx.restore();

        p.y+=p.dy;
        p.x+=p.dx;
        p.rot+=3;

        if(p.y>canvas.height){

            p.y=-20;
            p.x=Math.random()*canvas.width;

        }

    });

    animacion=requestAnimationFrame(animarConfeti);

}

function detenerConfeti(){

    cancelAnimationFrame(animacion);

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

}
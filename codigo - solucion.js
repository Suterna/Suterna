// Manejadores de eventos
window.addEventListener("load", inicio);

function inicio() {
    document.querySelector("#numeros legend+p+ul").addEventListener("click", clickNumeros);
    document.querySelector("#reintegro").addEventListener("click", clickReintegro);
    document.querySelector("#btnLimpiar").addEventListener("click", limpiar);
    document.querySelector("#btnCargarSorteo").addEventListener("click", cargarSorteo);
    document.querySelector("#btnVerificar").addEventListener("click", verificarSorteo);

    cargarSelect();
}

// Variables globales
var iContador = 0;
var iUltimo = null;
var iReintegro = null;
var oXML = loadXMLDoc("sorteos.xml");

// Numeros
function clickNumeros(oEvento) {
    var oE = oEvento || window.event;

    // Si han hecho click en un botón
    if (oE.target.type == "button")
        if (!oE.target.classList.contains("seleccion")) {
            if (iContador < 6) {
                iContador++;
            } else if (iContador == 6) {
                document.querySelector("#rellenaNum" + iUltimo).classList.remove("seleccion");
            }
            iUltimo = parseInt(oE.target.value);
            oE.target.classList.add("seleccion");
        } else { // Si estaba seleccionado
            oE.target.classList.remove("seleccion");
            iContador--;
        }
}

function clickReintegro(oEvento) {
    var oE = oEvento || window.event;

    // Si se ha pulsado un botón
    if (oE.target.type == "button") {
        // Recupero si había algún botón pulsado previamente
        var oReintegroPrevio = oE.currentTarget.querySelector(".seleccion");
        if (oReintegroPrevio != null) {
            oReintegroPrevio.classList.remove("seleccion");
        }
        oE.target.classList.add("seleccion");
        iReintegro = oE.target.value;
    }
}

// Limpiar
function limpiar() {
    var oSeleccionados = document.querySelectorAll("#numeros .seleccion");

    for (var i = 0; i < oSeleccionados.length; i++) {
        oSeleccionados[i].classList.remove("seleccion");
    }

    iContador = 0;
    iUltimo = null;
    iReintegro = null;
}

function loadXMLDoc(filename) {
    if (window.XMLHttpRequest) {
        xhttp = new XMLHttpRequest();
    } else // code for IE5 and IE6
    {
        xhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xhttp.open("GET", filename, false);

    xhttp.send();

    return xhttp.responseXML;
}

function cargarSelect() {

    // Crear <select> si no existe
    var oSelect = document.querySelector("#desplegable");
    if (oSelect == null) {
        // Crear elemento
        oSelect = document.createElement("select");
        oSelect.id = "desplegable";

        // Insertar elemento en la ubicacion solicitada
        var oInput = document.querySelector("#btnCargarSorteo");
        var oFieldset = oInput.parentNode;

        oFieldset.insertBefore(oSelect, oInput);

        // Generar options
        var oSorteos = oXML.querySelectorAll("sorteo");

        for (var i = 0; i < oSorteos.length; i++) {
            //Crear option
            var oOption = document.createElement("option");
            oOption.value = oSorteos[i].getAttribute("fecha");
            oOption.textContent = oSorteos[i].getAttribute("fecha");

            //Agregar option
            oSelect.appendChild(oOption)
        }
    }
}

function cargarSorteo() {

    var sFechaSorteo = document.querySelector("#desplegable").value;
    // Selector sorteo[fecha="06-11-2014"]
    var oSorteo = oXML.querySelector('sorteo[fecha="' + sFechaSorteo + '"]');

    borrarTablas();

    // Crear tabla
    var oTabla = document.createElement("table");
    var oTHead = oTabla.createTHead();
    var oFila = oTHead.insertRow(-1);
    var oTH = document.createElement("TH");
    oTH.textContent = "Num 1";
    oFila.appendChild(oTH);

    oTH = document.createElement("TH");
    oTH.textContent = "Num 2";
    oFila.appendChild(oTH);

    oTH = document.createElement("TH");
    oTH.textContent = "Num 3";
    oFila.appendChild(oTH);

    oTH = document.createElement("TH");
    oTH.textContent = "Num 4";
    oFila.appendChild(oTH);

    oTH = document.createElement("TH");
    oTH.textContent = "Num 5";
    oFila.appendChild(oTH);

    oTH = document.createElement("TH");
    oTH.textContent = "Num 6";
    oFila.appendChild(oTH);

    oTH = document.createElement("TH");
    oTH.textContent = "Complementario";
    oFila.appendChild(oTH);

    oTH = document.createElement("TH");
    oTH.textContent = "Reintegro";
    oFila.appendChild(oTH);

    var oTBody = oTabla.createTBody();
    oFila = oTBody.insertRow(-1);

    var oNumeros = oSorteo.querySelectorAll("numero");
    for (var i = 0; i < oNumeros.length; i++) {
        var oCelda = oFila.insertCell(-1);
        oCelda.textContent = oNumeros[i].textContent;
        oCelda.dataset.numero = oNumeros[i].textContent;
    }

    //Complementario
    var oComplementario = oSorteo.querySelector("complementario");
    var oCelda = oFila.insertCell(-1);
    oCelda.textContent = oComplementario.textContent;
    oCelda.dataset.complementario = oComplementario.textContent;

    //Reintegro
    var oReintegro = oSorteo.querySelector("reintegro");
    oCelda = oFila.insertCell(-1);
    oCelda.textContent = oReintegro.textContent;
    oCelda.dataset.reintegro = oReintegro.textContent;

    oTabla.className = "tablaSorteo";
    document.querySelector("#sorteos fieldset:last-child").appendChild(oTabla);

    // Crear tabla con los premios
    var oTablaPremios = document.createElement("table");
    oTHead = oTablaPremios.createTHead();
    oFila = oTHead.insertRow(-1);
    oTH = document.createElement("TH");
    oTH.textContent = "Categoria";
    oFila.appendChild(oTH);

    oTH = document.createElement("TH");
    oTH.textContent = "Premio";
    oFila.appendChild(oTH);

    oTBody = oTablaPremios.createTBody();

    oFila = oTBody.insertRow(-1);
    oFila.dataset.aciertos = "6";
    oCelda = oFila.insertCell(-1);
    oCelda.textContent = "1ª categoria (6 aciertos)";

    oCelda = oFila.insertCell(-1);
    oCelda.textContent = oSorteo.querySelector("cat1").textContent;

    oFila = oTBody.insertRow(-1);
    oFila.dataset.aciertos = "5C";
    oCelda = oFila.insertCell(-1);
    oCelda.textContent = "2ª categoria (5 aciertos + complementario)";

    oCelda = oFila.insertCell(-1);
    oCelda.textContent = oSorteo.querySelector("cat2").textContent;

    oFila = oTBody.insertRow(-1);
    oFila.dataset.aciertos = "5";
    oCelda = oFila.insertCell(-1);
    oCelda.textContent = "3ª categoria (5 aciertos)";

    oCelda = oFila.insertCell(-1);
    oCelda.textContent = oSorteo.querySelector("cat3").textContent;

    oFila = oTBody.insertRow(-1);
    oFila.dataset.aciertos = "4";
    oCelda = oFila.insertCell(-1);
    oCelda.textContent = "4ª categoria (4 aciertos)";

    oCelda = oFila.insertCell(-1);
    oCelda.textContent = oSorteo.querySelector("cat4").textContent;

    oFila = oTBody.insertRow(-1);
    oFila.dataset.aciertos = "3";
    oCelda = oFila.insertCell(-1);
    oCelda.textContent = "5ª categoria (3 aciertos)";

    oCelda = oFila.insertCell(-1);
    oCelda.textContent = oSorteo.querySelector("cat5").textContent;

    oFila = oTBody.insertRow(-1);
    oFila.dataset.aciertos = "R";
    oCelda = oFila.insertCell(-1);
    oCelda.textContent = "Reintegro";

    oCelda = oFila.insertCell(-1);
    oCelda.textContent = oSorteo.querySelector("reint").textContent;

    oTablaPremios.className = "tablaPremios";
    document.querySelector("#sorteos fieldset:last-child").appendChild(oTablaPremios);
}

function borrarTablas() {

    var oTablas = document.querySelectorAll("#sorteos table");

    for (var i = 0; i < oTablas.length; i++) {
        oTablas[i].remove();
    }

}

function verificarSorteo() {

    borrarAciertos();

    if (iContador == 6 && iReintegro != null) {

        // Obtener numeros del usuario
        var oNumeros = document.querySelectorAll("#numeros fieldset ul:nth-child(3) .seleccion");
        var sNumeros = [];


        for (var i = 0; i < oNumeros.length; i++) {
            sNumeros.push(oNumeros[i].value);
        }

        var iAciertos = 0;

        // Verificar números premiados
        for (i = 0; i < sNumeros.length; i++) {

            var oCelda = document.querySelector('.tablaSorteo td[data-numero="' + sNumeros[i] + '"]');

            if (oCelda != null) {
                oCelda.classList.add("acierto");
                iAciertos++;
            }
        }

        if (iAciertos >= 3) {

            var bComplementario = false;
            if (iAciertos == 5) { // Complementario tambien ???

                var sComplementario = document.querySelector("td[data-complementario]").textContent;
                if (sNumeros.includes(sComplementario)) {
                    document.querySelector('.tablaPremios tr[data-aciertos="5C"]').classList.add("premio");
                    document.querySelector('.tablaSorteo td[data-complementario]').classList.add("acierto");
                    bComplementario = true;
                }
            }

            if (bComplementario == false) {
                var oFilaPremio = document.querySelector('.tablaPremios tr[data-aciertos="' + iAciertos + '"]');
                if (oFilaPremio != null) {
                    oFilaPremio.classList.add("premio");
                }
            }
        }

        var sReintegro = document.querySelector("td[data-reintegro]").textContent;
        if (sReintegro == iReintegro) {
            document.querySelector('.tablaPremios tr[data-aciertos="R"]').classList.add("premio");
            document.querySelector('.tablaSorteo td[data-reintegro]').classList.add("acierto");
        }

    } else {
        alert("Faltan numeros por seleccionar");
    }
}

function borrarAciertos() {

    var oAciertos = document.querySelectorAll(".acierto");

    for (var i = 0; i < oAciertos.length; i++) {

        oAciertos[i].classList.remove("acierto");
    }

    var oPremios = document.querySelectorAll(".premio");

    for (var i = 0; i < oPremios.length; i++) {

        oPremios[i].classList.remove("premio");
    }
}
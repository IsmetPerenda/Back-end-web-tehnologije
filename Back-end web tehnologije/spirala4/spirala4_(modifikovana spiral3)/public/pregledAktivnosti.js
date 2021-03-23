var sortiranASC;
var varijablaZaID = " ";
var dan = null;


window.onload = function () {
    sortiranASC = false;
    
    ucitajSortirano(null, null, ispisRez);


}

function ispisRez(data, error) {

    if (!error) {
        let result = '<table>';
        result += "<tr id='tblheader'><th id='naziv' >Naziv</th><th id='aktivnost'>Aktivnost</th><th id='dan'>Dan</th><th id='pocetak'>Pocetak</th><th id='kraj'>Kraj</th></tr>";


        for (let el in data) {
            result += "<tr><td>" + data[el].naziv + "</td><td>" + data[el].aktivnost + "</td><td>" + data[el].dan + "</td><td>" + data[el].pocetak + "</td><td>" + data[el].kraj + "</td></tr>";
        }
        result += '</table>';
        document.getElementById("1").innerHTML = result;
    }
    tblheader = document.getElementById("tblheader");
    if (varijablaZaID != " ") {

        if (sortiranASC == true) {
            document.getElementById(varijablaZaID).innerHTML += "&#8595;";

        } else {
            document.getElementById(varijablaZaID).innerHTML += "&#8593;"
        }
    }
    tblheader.addEventListener('click', (e) => {
        varijablaZaID = e.target.id;
        if (sortiranASC == false) {
            ucitajSortirano(dan, "A" + e.target.id, ispisRez);

            sortiranASC = true;
        }
        else if (sortiranASC == true) {
            ucitajSortirano(dan, "D" + e.target.id, ispisRez);
            sortiranASC = false;
        }

    });
}

function sortiranjeDana(){
    dan = document.getElementById("meni").value;
    ucitajSortirano(dan,null,ispisRez);
}
function sviPredmeti(){
    var all = document.getElementById("btn");
    ucitajSortirano(null,null,ispisRez);
}




window.onload = function () {

    iscrtavanjeTabela();
}
function dodavanje() {
    
    $.post("http://localhost:8080/v1/unosRasporeda", { subjectName: document.getElementById("naziv").value, activity: document.getElementById("aktivnost").value}, function (data, status) {
        $.post("http://localhost:8080/v1/raspored", { subjectName: document.getElementById("naziv").value, activity: document.getElementById("aktivnost").value, day: document.getElementById("dan").value, timeS: document.getElementById("pocetak").value, timeE: document.getElementById("kraj").value }, function (data1, status1) {
            alert(data1);
            if (data1 === "GRESKA: Upisivanje u datoteku se nije izvsilo!" && data === "Predmet je dodan!") {
                $.ajax({
                    url: "http://localhost:8080/v1/unosRasporeda",
                    type: 'DELETE',
                    data :  {subjectName: document.getElementById("naziv").value }
                });
            }
            iscrtavanjeTabela();

        });
    });
}
function iscrtavanjeTabela(){
    $.get("http://localhost:8080/v1/unosRasporeda", function (data, status) {
      
        
        let result = '<table>';
        result += "<tr id='tblheader'><th id='naziv'>Naziv</th></tr>";
    
    
        for (let el in data) {
            result += "<tr><td>" + data[el].predmet + "</td></tr>";
        }
        result += '</table>';
        document.getElementById("tabelaPredmeti").innerHTML = result;
    });
    $.get("http://localhost:8080/v1/raspored", function (data, status) {
      
        let result = '<table>';
        result += "<tr id='tblheader'><th id='naziv' >Naziv</th><th id='aktivnost'>Aktivnost</th><th id='dan'>Dan</th><th id='pocetak'>Pocetak</th><th id='kraj'>Kraj</th></tr>";
    
    
        for (let el in data) {
            result += "<tr><td>" + data[el].naziv + "</td><td>" + data[el].aktivnost + "</td><td>" + data[el].dan + "</td><td>" + data[el].pocetak + "</td><td>" + data[el].kraj + "</td></tr>";
        }
        result += '</table>';
        document.getElementById("tabelaAktivnosti").innerHTML = result;
    });
  
}
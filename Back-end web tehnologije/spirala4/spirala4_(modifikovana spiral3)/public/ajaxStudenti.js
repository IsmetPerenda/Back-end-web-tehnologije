

window.onload = function () {

    $.get("http://localhost:8080/v2/grupa", function (data, status) {
        let result = '';
        //console.log(data);
        let podaci = {};
        podaci = JSON.parse(data);
       
        for (let el in podaci) {

            result += '<option>' + podaci[el].naziv + '</option>';


        }

        document.getElementById("grupe").innerHTML = result;
    });

}

function dodajStudente() {
    let students = document.getElementById("textarea").value;
    let grupaStudenata = document.getElementById("grupe").value;
    
    let s = students.toString();
    let enter = s.split("\n");
    let nizStudenata = [];
    for (let i = 0; i < enter.length; i++) {
        var data = enter[i].split(",");
        var niz2 = { ime: data[0], index: data[1], grupa: grupaStudenata};
        nizStudenata.push(niz2);
    }
    console.log(nizStudenata);
    $.post("http://localhost:8080/unosStudenata", {studenti : nizStudenata}, function (data, status) {
        document.getElementById("textarea").value = ""; 
        let niz = JSON.parse(data);
        niz.forEach(element => {
            document.getElementById("textarea").value += element;
        });
        
    });  
}
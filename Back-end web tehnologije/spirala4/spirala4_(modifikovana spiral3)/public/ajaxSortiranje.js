function ucitajSortirano(dan,atribut,ispisRez){
    var ajax = new XMLHttpRequest();
    ajax.onreadystatechange = function() {// Anonimna funkcija
        if (ajax.readyState == 4 && ajax.status == 200){
            var json = JSON.parse(ajax.responseText);
            ispisRez(json,null);
        }
        else if (ajax.readyState == 4){
         ispisRez(null,"Greska");
        }
            
    }
    var http = "http://localhost:8080/raspored?";
    if(atribut != null && atribut != " "){
         http += "sort=" + atribut;
     }
     if(dan != null && dan != " " && atribut != null && atribut != " "){
         http+= "&";
         
     }
     if(dan != null && dan != " "){
         http += "dan=" + dan;
     }
 
     
     ajax.open("GET",http,true);
    
     ajax.send();
 }



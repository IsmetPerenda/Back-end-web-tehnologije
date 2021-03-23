function validateForm() {
    var a = document.forms["forma"]["subjectName"].value;
    var b = document.forms["forma"]["activity"].value;
    var c = document.forms["forma"]["day"].value;
    var d = document.forms["forma"]["timeS"].value;
    var e = document.forms["forma"]["timeE"].value;
    var dani = ["ponedjeljak","utorak","srijeda","cetvrtak","petak"];
    
    var aktivnost = b.toLowerCase(); 
    var dan = c.toLowerCase(); 
    

    if (a == "") {
      alert("Morate ispuniti ovo polje!");
      return false;
    }
    
    if (aktivnost == "") {
      alert("Morate ispuniti ovo polje!");
      return false;
    }else if(aktivnost != "predavanje" && aktivnost != "vjezba"){
      alert("Aktivnost moze biti ili predvanje ili vjezba!");
      return false;
    }

      if(aktivnost === "vjezba"){
        if(a.search("grupa") === -1){
          alert("Vjezba mora imati grupu");
          return false;
        }
       
      }
    if (dan == "") {
        alert("Morate ispuniti ovo polje!");
        return false;
      }
      var imaD = false;
    for(let i of dani){
      if(i === dan){
        imaD = true;
        break;
      }
    }
    if(imaD == false){
      alert("Morate unijeti validan radni dan!");
      return false;
    }

    if (d == "") {
        alert("Morate ispuniti ovo polje!");
        return false;
      }
    if (e == "") {
        alert("Morate ispuniti ovo polje!");
        return false;
      }
  }
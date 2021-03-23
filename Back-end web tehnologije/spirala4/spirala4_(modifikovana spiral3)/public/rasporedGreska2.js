class Raspored{
    constructor(raspored){
        this.raspored = [];
        var niz1 = raspored.split("\n");
        for(let i = 0; i< niz1.length; i++){
            var data = niz1[i].split(",");

            var niz2 = {naziv : data[0], aktivnost : data[1], dan: data[2], start: data[3], end: data[4]};

            this.raspored.push(niz2);
        }
       
    }
   

      dajTrenutnuAktivnost(vrijeme,nazivGrupe){
        
        let nizVrijeme = vrijeme.split('T');
        let date = new Date(nizVrijeme[0].replaceAll("-"," "));
        let day = date.getDay();

        let time = nizVrijeme[1].split(':');

        
        let dani = ["ponedjeljak","utorak","srijeda","cetvrtak","petak","subota","nedelja"];
            let kojiJeDan = dani[day];
            if(nazivGrupe != "grupa1" && nazivGrupe != "grupa2")return "Trenutno n//////ma aktivnosti";
        for(let i = 0; i < this.raspored.length;i++){
            if(kojiJeDan === this.raspored[i].dan){
                var startnoVrijeme = this.raspored[i].start.split(":");
                var krajnjeVrijeme = this.raspored[i].end.split(":");
                var minutes = (+time[0]) * 60 + (+time[1]);
                var minutesStart = 0;
                var minutesEnd = (+krajnjeVrijeme[0]) * 60 + (+krajnjeVrijeme[1]);
                if(minutes>= minutesStart && minutes<=minutesEnd){
                  
                    if(this.raspored[i].aktivnost === "vjezbe"){
                        let predmet = this.raspored[i].naziv.split("-");
                      //  console.log("debug");
                        let v = minutesEnd-minutes;
                        return(" "+ v.toString());
                
                    }else{
                       // console.log("debug");
                        let predmet2 = this.raspored[i].naziv;
                        let v = minutesEnd-minutes;
                        return(predmet2 + " "+ v.toString());
                    }
                }
            }
        }
        

        return "Trenutno nema aktivnosti";
    }
      dajSljedecuAktivnost(vrijeme,nazivGrupe){
        
        let nizVrijeme = vrijeme.split('T');
        let date = new Date(nizVrijeme[0].replaceAll("-"," "));
        let day = date.getDay();
        let time = nizVrijeme[1].split(':');
        let dani = ["ponedjeljak","utorak","srijeda","cetvrtak","petak","subota","nedelja"];
        let kojiJeDan = dani[day];
        for(let i = 0; i < this.raspored.length;i++){
            if(kojiJeDan === this.raspored[i].naziv){
                var startnoVrijeme = this.raspored[i].start.split(":");
                var krajnjeVrijeme = this.raspored[i].end.split(":");
                var minutes = (+time[0]) * 60 + (+time[1]);
                var minutesStart =0;
               
                

                
                if(this.raspored[i].aktivnost === "vjezbe"){
                    let predmet = this.raspored[i].naziv.split("-");
                    if(predmet[1] === nazivGrupe){
                    if(minutesStart>=minutes && minutes<minutesEnd ){
                       
                        //console.log("debug");
                        let v = minutesStart - minutes;
                        return(predmet[0] +" "+ v.toString());
                        }else return "Nastava je gotova za danas";
                     }
                }else{
                    
                    if(minutesStart>=minutes && minutes<minutesEnd ){
                     //onsole.log("debug");

                     let predmet2 = this.raspored[i].naziv;
                     let v = minutesStart ;
                     return(predmet2 + " "+ v.toString());
                     
                    }else return "Nastava je gotova za danas";
                 }
            }
        }
        

        return "Nastava je gotova za danas";
    }
    
    
   dajPrethodnuAktivnost(vrijeme,nazivGrupe){
        
        let nizVrijeme = vrijeme.split('T');
        let date = new Date(nizVrijeme[0].replaceAll("-"," "));
        let day = date.getDay();
        let time = nizVrijeme[1].split(':');
        let dani = ["//","utorak","srijeda","cetvrtak","petak","subota","nedelja"];
            let kojiJeDan = dani[day];
            let indeks = day;
            var daniPrije = false;
            var max = 0;
            var zabiljeziPredmet;
            while(true){
                
            for(let i = 0; i < this.raspored.length;i++){
                
                if(daniPrije == true){
                    if(kojiJeDan === this.raspored[i].dan){
                        let krajnjeVrijeme = this.raspored[i].end.split(":");
                        let vrijeme = (+krajnjeVrijeme[0]) * 60 + (+krajnjeVrijeme[1] );
                        //console.log(max + "vs" + vrijeme);
                        if(max < vrijeme){
                            max = vrijeme;
                            zabiljeziPredmet = this.raspored[i].naziv;
                        } 
                    }
                }
                if(kojiJeDan === this.raspored[i].dan){
                    
                    var krajnjeVrijeme = this.raspored[i].end.split(":");
                    var minutes = (+time[0]) * 60 + (+time[1]);
                    var minutesEnd = (+krajnjeVrijeme[0]) * 60 + (+krajnjeVrijeme[1] );
                    if(minutes>=minutesEnd){
                        if(this.raspored[i].aktivnost === "vjezbe"){
                            let predmet = this.raspored[i].naziv.split("-");
                            return(predmet[0]);
                        }else{
                       
                            let predmet2 = this.raspored[i].naziv;
                            return(predmet2);
                        }
                    }
                }
            }if(max>0)return (zabiljeziPredmet);
            if(indeks == 0)indeks = 6;
            indeks--;
            kojiJeDan = dani[indeks];
           // console.log(kojiJeDan);
            
            daniPrije = true;
            
             
        }
        
     }
        
    
};

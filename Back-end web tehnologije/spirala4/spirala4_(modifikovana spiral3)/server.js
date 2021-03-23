
const fs = require('fs');
const url = require('url');
const querystring = require('querystring');
const js2xmlparser = require("js2xmlparser");
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const db = require('./baza/dataBase.js');
const { deepStrictEqual } = require('assert');
db.sequelize.sync().then(function () {
    console.log("Kreirane tabele");
});

function getJSONPredmeti() {
    let predmeti = [];
    let niz1;
    if (!fs.existsSync('public/predmeti.csv')) {
        return null;
    }
    let x = fs.readFileSync('public/predmeti.csv');
    let datoteka = x.toString();
    niz1 = datoteka.split(",");
    for (let i = 0; i < niz1.length; i++) {

        var niz2 = { predmet: niz1[i] }
        predmeti.push(niz2);
    }
    return predmeti;
}
/* Metoda getJSON
- provjerava da li postoji datoteka
-ako postoji cita datoteku
-upisuje u posebnu varijablu koa string
- splita po novom redu i spasava u niz1
-splita po zarezu u novu varijablu
-pravi JSON raspored
*/
function getJSON() {
    let raspored = [];
    let niz1;
    if (!fs.existsSync('public/raspored.csv')) {
        return null;
    }
    let x = fs.readFileSync('public/raspored.csv');
    let datoteka = x.toString();
    niz1 = datoteka.split("\n");
    for (let i = 0; i < niz1.length; i++) {
        var data = niz1[i].split(",");
        var niz2 = { naziv: data[0], aktivnost: data[1], dan: data[2], pocetak: data[3], kraj: data[4] };
        raspored.push(niz2);
    }
    return raspored;
}


/* Metoda preispitajRaspored
-koristi metodu getJSON da ddobije raspored iz datoteke
-provjerava da li je radni dan
-provjerava da li se vrijeme poklapa sa nekim drugim vremenom preko minuta
-ako se ne poklapa upisuje u datoteku novo unesenu formu sa html-a
 */
function preispitajRaspored(naziv, aktivnost, dan, pocetak, kraj) {
    let datoteka = getJSON();
    let x = fs.readFileSync('public/raspored.csv');
    let str = x.toString();
    let upisi = false;

    for (let i = 0; i < datoteka.length; i++) {
        var startnoVrijeme = datoteka[i].pocetak.split(":");
        var krajnjeVrijeme = datoteka[i].kraj.split(":");
        var startnoVrijeme2 = pocetak.split(":");
        var krajnjeVrijeme2 = kraj.split(":");
        var minutesStart = (+startnoVrijeme[0]) * 60 + (+startnoVrijeme[1]);
        var minutesEnd = (+krajnjeVrijeme[0]) * 60 + (+krajnjeVrijeme[1]);
        var minutesStart2 = (+startnoVrijeme2[0]) * 60 + (+startnoVrijeme2[1]);
        var minutesEnd2 = (+krajnjeVrijeme2[0]) * 60 + (+krajnjeVrijeme2[1]);


        if (datoteka[i].dan === dan) {

            if ((minutesStart <= minutesStart2 && minutesEnd >= minutesEnd2) || (minutesStart >= minutesStart2 && minutesStart < minutesEnd2 && minutesEnd <= minutesEnd2) || (minutesStart < minutesStart2 && minutesEnd >= minutesStart2)) {
                upisi = false;
                break;
            } else upisi = true;

        }


    }

    if (upisi === true) {
        let content = naziv + "," + aktivnost + "," + dan + "," + pocetak + "," + kraj;
        let dat = str + "\n" + content;
        fs.writeFile('public/raspored.csv', dat, function (err) {
            if (err) return console.log(err);
        });
        return true;
    }
    return false;
}

/* Metoda getJSONbyDay
-provjerava da li postoji datoteka
-ako postoji radi isto sve sto i getJSON stim da u raspored spasava samo one predmete koji se nalaze taj dan koji je poslat kao parametar
 */

function getJSONbyDay(day) {

    let raspored = [];
    let niz1;

    if (!fs.existsSync('public/raspored.csv')) {
        return null;
    }

    let x = fs.readFileSync('public/raspored.csv');
    let datoteka = x.toString();
    niz1 = datoteka.split("\n");
    for (let i = 0; i < niz1.length; i++) {
        var data = niz1[i].split(",");

        var niz2 = { naziv: data[0], aktivnost: data[1], dan: data[2], pocetak: data[3], kraj: data[4] };
        if (niz2.dan === day) {
            raspored.push(niz2)
        }
    }
    //console.log(raspored);
    return raspored;
}


/*Metoda getCSVbyDay
-pretvara JSON raspored po danu u CSV fajl
 */
function getCSVbyDay(rasporedPoDanima) {
    console.log(rasporedPoDanima);
    let raspored = "";

    for (let i = 0; i < rasporedPoDanima.length; i++) {
        raspored += rasporedPoDanima[i].naziv + "," + rasporedPoDanima[i].aktivnost + "," + rasporedPoDanima[i].dan + "," + rasporedPoDanima[i].pocetak + "," + rasporedPoDanima[i].kraj + "\n";
    }
    return raspored;
}

/*Metoda sortirajNiz
- vraca metodu koja sortira po danima,vremenu,nazivima,predvanjima i aktivnostima
 */
function sortirajNiz(key, order) {
    let dani = ["ponedjeljak", "utorak", "srijeda", "cetvrtak", "petak"];
    return function innerSort(a, b) {
        var varA = a[key];
        var varB = b[key];
        if (key == 'dan') {
            varA = dani.indexOf(varA);
            varB = dani.indexOf(varB);
        }
        let comparison = 0;
        if (varA > varB) {
            comparison = 1;
        } else if (varA < varB) {
            comparison = -1;
        }
        if (order === 'D') {
            comparison = comparison * -1;
        }
        return comparison;

    };
}


app.get('/v1/raspored', function (request, response) {
    let infoFromURL = url.parse(request.url);
    const urlWhole = new URL('http://localhost:8080' + request.url);


    const search_params = urlWhole.searchParams;
    let sortiraj = false;
    let str = "";
    /* 
    -provjravamo da li je parametar sort poslan
    -ako jeste koje sortiranje zahtjeva ASC ili DESC
    -provjerava po cemu se treba soritrati
    */
    if (search_params.has('sort')) {
        const at = search_params.get('sort');
        if (at.charAt(0) === 'A' || at.charAt(0) === 'D') {

            for (let i = 1; i < at.length; i++) {
                str += at.charAt(i);
            }
            if (str === 'naziv' || str === 'aktivnost' || str === 'dan' || str === 'pocetak' || str === 'kraj') {
                sortiraj = true;
            }


        }
    }
    /*
    -provjera da li je poslat parametar za dan
    -ako jeste uzimamo dan
    -saljemo metodi getJSONbyDay koja vraca JSON samo sa tim danom
    -provjera da li treba sortiranje
    -ako treba sortiranje sortiramo po onome sto zahtjeva sort parametar
    -provjera da li trazi csv fajl ili JSON

     */
    if (search_params.has('dan')) {
        const dan = search_params.get('dan');
        let rasporedPoDanimaCSV = null;
        let rasporedPoDanima = getJSONbyDay(dan);
        if (sortiraj == true) {
            const at = search_params.get('sort');
            rasporedPoDanima = rasporedPoDanima.sort(sortirajNiz(str, at.charAt(0)));
        }
        if (JSON.stringify(request.headers.accept) === "\"text/csv\"") {
            response.setHeader('Content-Type', 'text/csv');
            rasporedPoDanimaCSV = getCSVbyDay(rasporedPoDanima);
            if (rasporedPoDanimaCSV === null) {
                response.end(JSON.stringify({ "greska": "Datoteka raspored.csv nije kreirana!" }));
            }
            else {

                response.end(rasporedPoDanimaCSV);
            }

        } else {
            if (rasporedPoDanima === null) {
                response.end(JSON.stringify({ "greska": "Datoteka raspored.csv nije kreirana!" }));
            }
            else {
                response.setHeader('Content-Type', 'application/json');
                response.end(JSON.stringify(rasporedPoDanima));
            }
        }
    }
    /*
    -provjera da li zahtjeva csv fajl
    -ako da,provjera da li treba sortirati
     */
    else if (JSON.stringify(request.headers.accept) === "\"text/csv\"") {


        response.setHeader('Content-Type', 'text/csv');
        let specialVar = getJSON();
        if (sortiraj == true) {
            const at = search_params.get('sort');
            specialVar = specialVar.sort(sortirajNiz(str, at.charAt(0)));
        }
        let odgovor = getCSVbyDay(specialVar);
        if (odgovor === null) {
            response.end(JSON.stringify({ "greska": "Datoteka raspored.csv nije kreirana!" }));
        } else {
            response.end(odgovor);
        }

    } else {


        response.setHeader('Content-Type', 'application/json');
        let x = getJSON();
        if (x === null) {
            response.end(JSON.stringify({ "greska": "Datoteka raspored.csv nije kreirana!" }));
        } else {
            if (sortiraj == true) {
                const at = search_params.get('sort');
                x = x.sort(sortirajNiz(str, at.charAt(0)));
            }
            response.end(JSON.stringify(x));
        }

    }


});






app.post('/v1/raspored', function (request, response) {


    const data = request.body;

    if (preispitajRaspored(data['subjectName'], data['activity'], data['day'], data['timeS'], data['timeE']) === true) {

        response.writeHead(200, { 'Content-Type': 'text/plain' });
        response.write("Aktivnost je dodana u datoteku!");
        response.end();
    } else {
        response.writeHead(200, { "Content-Type": "text/plain" });
        response.write("GRESKA: Upisivanje u datoteku se nije izvsilo!");
        response.end();
    }



});
function provjeraPredmeta(predmet, aktivnost) {
    let predmeti = getJSONPredmeti();
    let pom;
    for (let i = 0; i < predmeti.length; i++) {
        if (aktivnost === "vjezba") {
            pom = predmet.split("-");
            if (predmeti[i].predmet == pom[0]) return true;
        } else {

            if (predmeti[i].predmet == predmet) return true;
        }
    }
    return false;
}


app.post('/v1/unosRasporeda', function (req, res) {
    const data = req.body;

    if (provjeraPredmeta(data['subjectName'], data['activity']) == false) {

        if (data['activity'] === "vjezba") {

            let pom = data['subjectName'].split("-");
            fs.appendFile('public/predmeti.csv', "," + pom[0], function (err) {
                if (err) return console.log(err);
            });

            res.end("Predmet je dodan!");
        }
        else {
            fs.appendFile('public/predmeti.csv', "," + data['subjectName'], function (err) {
                if (err) return console.log(err);
            });

            res.end("Predmet je dodan!");

        }
    } else {
        res.end("Predmet postoji");
    }

});
app.get('/v1/unosRasporeda', function (req, res) {
    let predmeti = getJSONPredmeti();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(predmeti));
});
app.delete('/v1/unosRasporeda', function (req, res) {

    let predmeti = getJSONPredmeti();
    let str = "";
    for (let i = 0; i < predmeti.length - 1; i++) {
        str += predmeti[i].predmet;
        if (i != predmeti.length - 2) str += ",";

    }
    fs.writeFile('public/predmeti.csv', str, function (err) {
        if (err) return console.log(err);
    });

    res.end("Predmet je obrisan");
});

//CRUD RUTE
//CRUD PREDMETA
app.post("/v2/predmet", function (req, res) {
    const data = req.body;
    db.predmet.create(data,

    ).then(odgovor => {
        res.end("Predmet je dodan")
    }).catch(function (err) {
        console.log("create failed with error: " + err);
        return 0;
    });
});


app.get("/v2/predmet", function (req, res) {

    db.predmet.findAll().then(function (predmeti) {
        let json = [];
        predmeti.forEach(predmet => {
            json.push(predmet);
        });
        res.send(JSON.stringify(json));
    });

});
app.get("/v2/predmet/:id", function (req, res) {
    let id = req.params.id;
    db.predmet.findByPk(id).then(function (predmet) {
        res.send(JSON.stringify(predmet));
    });

});


app.put("/v2/predmet/:id", function (req, res) {
    let Id = req.params.id;
    const data = req.body
    db.predmet.update(data,
        { where: { id: Id } }
    ).then(odgovor => {
        res.send("Predmet je izmijenjen");
    }).catch(function (err) {
        console.log("update failed with error: " + err);
        return 0;

    });


});
app.delete("/v2/predmet/:id", function (req, res) {
    let Id = req.params.id;

    db.predmet.destroy({
        where: { id: Id }
    }).then(odgovor => {
        res.send("Predmet je obrisan");
    }).catch(function (err) {
        console.log("update failed with error: " + err);
        return 0;

    });
});

//CRUD AKTIVNOSTI
app.post("/v2/aktivnost", function (req, res) {
    const data = req.body;
    db.aktivnost.create(data
    ).then(odgovor => {
        res.end("Aktivnost je dodana")
    }).catch(function (err) {
        console.log("create failed with error: " + err);
        return 0;
    });
});
app.get("/v2/aktivnost", function (req, res) {

    db.aktivnost.findAll().then(function (aktivnosti) {
        let json = [];
        aktivnosti.forEach(aktivnost => {
            json.push(aktivnost);
        });
        res.send(JSON.stringify(json));
    });

});
app.get("/v2/aktivnost/:id", function (req, res) {
    let id = req.params.id;
    db.aktivnost.findByPk(id).then(function (aktivnost) {
        res.send(JSON.stringify(aktivnost));
    });

});


app.put("/v2/aktivnost/:id", function (req, res) {
    let Id = req.params.id;
    const data = req.body
    db.aktivnost.update(data,
        { where: { id: Id } }
    ).then(odgovor => {
        res.send("Aktivnost je izmijenjen");
    }).catch(function (err) {
        console.log("update failed with error: " + err);
        return 0;

    });


});
app.delete("/v2/aktivnost/:id", function (req, res) {
    let Id = req.params.id;
    db.aktivnost.destroy({
        where: { id: Id }
    }).then(odgovor => {
        res.send("Aktivnost je obrisan");
    }).catch(function (err) {
        console.log("update failed with error: " + err);
        return 0;

    });
});


//CRUD DAN
app.post("/v2/dan", function (req, res) {
    const data = req.body;
    db.dan.create(data
    ).then(odgovor => {
        res.end("Dan je dodan")
    }).catch(function (err) {
        console.log("create failed with error: " + err);
        return 0;
    });
});


app.get("/v2/dan", function (req, res) {

    db.dan.findAll().then(function (dani) {
        let json = [];
        dani.forEach(dan => {
            json.push(dan);
        });
        res.send(JSON.stringify(json));
    });

});
app.get("/v2/dan/:id", function (req, res) {
    let id = req.params.id;
    db.dan.findByPk(id).then(function (dan) {
        res.send(JSON.stringify(dan));
    });

});


app.put("/v2/dan/:id", function (req, res) {
    let Id = req.params.id;
    const data = req.body
    db.dan.update(data,
        { where: { id: Id } }
    ).then(odgovor => {
        res.send("Dan je izmijenjen");
    }).catch(function (err) {
        console.log("update failed with error: " + err);
        return 0;

    });


});
app.delete("/v2/dan/:id", function (req, res) {
    let Id = req.params.id;

    db.dan.destroy({
        where: { id: Id }
    }).then(odgovor => {
        res.send("Dan je obrisan");
    }).catch(function (err) {
        console.log("update failed with error: " + err);
        return 0;

    });
});

//CRUD TIP
app.post("/v2/tip", function (req, res) {
    const data = req.body;
    db.tip.create(data
    ).then(odgovor => {
        res.end("Tip je dodan")
    }).catch(function (err) {
        console.log("create failed with error: " + err);
        return 0;
    });
});


app.get("/v2/tip", function (req, res) {

    db.tip.findAll().then(function (tipovi) {
        let json = [];
        tipovi.forEach(tip => {
            json.push(tip);
        });
        res.send(JSON.stringify(json));
    });

});


app.get("/v2/tip/:id", function (req, res) {
    let id = req.params.id;
    db.tip.findByPk(id).then(function (tip) {
        res.send(JSON.stringify(tip));
    });

});


app.put("/v2/tip/:id", function (req, res) {
    let Id = req.params.id;
    const data = req.body
    db.tip.update(data,
        { where: { id: Id } }
    ).then(odgovor => {
        res.send("Tip je izmijenjen");
    }).catch(function (err) {
        console.log("update failed with error: " + err);
        return 0;

    });


});
app.delete("/v2/tip/:id", function (req, res) {
    let Id = req.params.id;

    db.tip.destroy({
        where: { id: Id }
    }).then(odgovor => {
        res.send("Tip je obrisan");
    }).catch(function (err) {
        console.log("update failed with error: " + err);
        return 0;

    });
});

//CRUD GRUPA
app.post("/v2/grupa", function (req, res) {
    const data = req.body;
    db.grupa.create(data
    ).then(odgovor => {
        res.end("Grupa je dodana")
    }).catch(function (err) {
        console.log("create failed with error: " + err);
        return 0;
    });
});


app.get("/v2/grupa", function (req, res) {

    db.grupa.findAll().then(function (grupe) {
        let json = [];
        grupe.forEach(grupa => {
            json.push(grupa);
        });
        res.send(JSON.stringify(json));
    });

});


app.get("/v2/grupa/:id", function (req, res) {
    let id = req.params.id;
    db.grupa.findByPk(id).then(function (grupa) {
        res.send(JSON.stringify(grupa));
    });

});


app.put("/v2/grupa/:id", function (req, res) {
    let Id = req.params.id;
    const data = req.body
    db.grupa.update(data,
        { where: { id: Id } }
    ).then(odgovor => {
        res.send("Grupa je izmijenjena");
    }).catch(function (err) {
        console.log("update failed with error: " + err);
        return 0;

    });


});
app.delete("/v2/grupa/:id", function (req, res) {
    let Id = req.params.id;

    db.grupa.destroy({
        where: { id: Id }
    }).then(odgovor => {
        res.send("Grupa je obrisana");
    }).catch(function (err) {
        console.log("update failed with error: " + err);
        return 0;

    });
});





//CRUD STUDENT
app.post("/v2/student", function (req, res) {
    const data = req.body;
    db.student.create(data
    ).then(odgovor => {
        res.end("Student je dodan")
    }).catch(function (err) {
        console.log("create failed with error: " + err);
        return 0;
    });
});


app.get("/v2/student", function (req, res) {

    db.student.findAll().then(function (studenti) {
        let json = [];
        studenti.forEach(student => {
            json.push(student);
        });
        res.send(JSON.stringify(json));
    });

});


app.get("/v2/student/:id", function (req, res) {
    let id = req.params.id;
    db.student.findByPk(id).then(function (student) {
        res.send(JSON.stringify(student));
    });

});


app.put("/v2/student/:id", function (req, res) {
    let Id = req.params.id;
    const data = req.body
    db.student.update(data,
        { where: { id: Id } }
    ).then(odgovor => {
        res.send("Student je izmijenjen");
    }).catch(function (err) {
        console.log("update failed with error: " + err);
        return 0;

    });


});
app.delete("/v2/student/:id", function (req, res) {
    let Id = req.params.id;

    db.student.destroy({
        where: { id: Id }
    }).then(odgovor => {
        res.send("Student je obrisan");
    }).catch(function (err) {
        console.log("update failed with error: " + err);
        return 0;

    });
});


app.put("/v2/student/:sid/grupa/:gid", function (req, res) {
    let s;
    let g;
    db.student.findByPk(req.params.sid).then(function (student) {
        s = student;
        db.grupa.findByPk(req.params.gid).then(function (grupa) {
            g = grupa;

            s.addGrupa(g, { through: { student_grupa: false } });
            res.end("Veza dodana");
        });
    });

});

//drugi zadatak 4ta spirala
app.post('/unosStudenata', async function (req, res) {
    let studenti = req.body.studenti;
    let grupa = await db.grupa.findAll({where : {naziv : studenti[0].grupa}});
    grupa = grupa[0];
    let odgovor = [];
    let logi = false;
    for(let i = 0; i < studenti.length;i++){
        let s = await db.student.findAll();
       
            
            for(let j = 0; j < s.length; j++){
                if(studenti[i].ime != s[j].ime && studenti[i].index == s[j].index){
                    odgovor.push(`Student ${studenti[i].ime} nije kreiran jer postoji student ${s[j].ime} sa istim indexom ${s[j].index}`);
                    logi = true;
                    break;
                }else if(studenti[i].ime == s[j].ime && studenti[i].index == s[j].index ){
                    let grupe =  await s[j].getGrupa();
                  //  console.log(grupe);
                    let nadjenaGrupa = false
                    logi = true;
                    for(let k = 0; k < grupe.length; k++){
                        console.log(grupa.id + " vs " + grupe[k].id  + " and " + grupa.predmetFK + " vs " + grupe[k].predmetFK );
                        if(grupa.id == grupe[k].id && grupa.predmetFK == grupe[k].predmetFK){
                            nadjenaGrupa = true;
                         //   console.log("uso3");
                            break;
                        }else if(grupa.predmetFK == grupe[k].predmetFK) {
                          //  console.log("uso2");
                           await s[j].removeGrupa(grupe[k]);
                        }
                    }
                    if(nadjenaGrupa == false){
                      await  s[j].addGrupa(grupa);
                    }
                    break;
                }

            }
           if(logi == false){
              db.student.create(studenti[i]).then(function (student) {
               student.addGrupa(grupa);
            })
           }
    
    }
    
    res.end(JSON.stringify(odgovor));
    
});

app.listen(8080);
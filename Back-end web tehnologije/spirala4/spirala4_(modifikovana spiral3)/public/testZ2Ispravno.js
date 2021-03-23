let raspored1=`BWT-grupa2,vjezbe,ponedjeljak,13:30,15:00
BWT,predavanje,ponedjeljak,15:00,18:00
MUR1,predavanje,utorak,09:00,11:00
MUR1-grupa1,vjezbe,srijeda,11:00,12:30
MUR1-grupa2,vjezbe,srijeda,12:30,14:00
RMA,predavanje,ponedjeljak,09:00,12:00
BWT-grupa1,vjezbe,ponedjeljak,12:00,13:30
FWT-grupa2,vjezbe,srijeda,11:00,12:30
FWT-grupa1,vjezbe,srijeda,12:30,14:00
ASP,predavanje,srijeda,09:00,12:00
MUR2,predavanje,cetvrtak,12:00,15:00
FWT,predavanje,cetvrtak,09:00,10:30`;

let assert = chai.assert;
describe('Testovi', function () {

    it('Nema trenutne aktivnosti ', function () {
        const x = new Raspored(raspored1);
        var pom = x.dajTrenutnuAktivnost("10-04-2020T18:01:00","grupa1");
        assert.equal(pom, "Trenutno nema aktivnosti");
    });
    it('Pocetak neke aktivnosti', function () {
        const x = new Raspored(raspored1);
        var pom = x.dajTrenutnuAktivnost("10-04-2020T09:00:00","grupa2");
        assert.equal(pom, "RMA 180");
    });
    it('Kraj neke aktivnosti', function () {
        const x = new Raspored(raspored1);
        var pom = x.dajTrenutnuAktivnost("10-07-2020T10:30:00","grupa2");
        assert.equal(pom, "FWT 0");
    });
    it('Neispravna grupa', function () {
        const x = new Raspored(raspored1);
        var pom = x.dajTrenutnuAktivnost("10-07-2020T12:30:00","grupa45");
        assert.equal(pom, "Trenutno nema aktivnosti");
    });
    it('Ispravna grupa', function () {
        const x = new Raspored(raspored1);
        var pom = x.dajTrenutnuAktivnost("10-07-2020T12:30:00","grupa2");
        assert.equal(pom, "MUR2 150");
    });
    it('Prethodna aktivnost za grupu', function () {
        const x = new Raspored(raspored1);
        var pom = x.dajPrethodnuAktivnost("10-04-2020T13:00:00","grupa2");
        assert.equal(pom, "RMA");
    });
    it('Prethodna aktivnost tri dana unazad', function () {
        const x = new Raspored(raspored1);
        var pom = x.dajPrethodnuAktivnost("10-04-2020T08:20:00","grupa2");
        assert.equal(pom, "MUR2");
    });
   
    it(' Slučaj kada je prva sljedeca aktivnost vježba sa pogrešnom grupom, tada trebate vratiti aktivnost poslije nje', function(){
        const x= new Raspored(raspored1)
        let pom = x.dajSljedecuAktivnost("10-04-2020T13:20:00","grupa1");
        assert.equal(pom, 'BWT 100');
    });
   it('Nastava je gotova za danas', function() {
    const x= new Raspored(raspored1)
      let pom = x.dajSljedecuAktivnost("10-06-2020T13:30:00","grupa1");
      assert.equal(stapomtus, 'Nastava je gotova za danas');
 
     });
});
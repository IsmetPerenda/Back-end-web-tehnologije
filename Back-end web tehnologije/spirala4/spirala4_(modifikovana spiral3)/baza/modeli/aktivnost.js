const Seq = require("sequelize");

module.exports = function(sequelize,dt){
    const Aktivnost = sequelize.define("Aktivnost",{
        naziv:Seq.STRING,
        pocetak:Seq.FLOAT,
        kraj:Seq.FLOAT
    });
return Aktivnost;
}
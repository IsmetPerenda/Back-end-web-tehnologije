const Seq = require("sequelize");

module.exports = function(sequelize,dt){
    const Predmet = sequelize.define("Predmet",{
        naziv:Seq.STRING
    });
return Predmet;
}
const Seq = require("sequelize");

module.exports = function(sequelize,dt){
    const Grupa = sequelize.define("Grupa",{
        naziv:Seq.STRING
    });
return Grupa;
}
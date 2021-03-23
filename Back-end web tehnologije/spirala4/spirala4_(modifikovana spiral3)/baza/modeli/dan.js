const Seq = require("sequelize");

module.exports = function(sequelize,dt){
    const Dan = sequelize.define("Dan",{
        naziv:Seq.STRING
    });
return Dan;
}
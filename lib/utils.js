var _ = require("underscore");

//trim some useless strings to let the output more pure.
exports.trim = function(string,reg){
  var string = string || "";
  var reg_replace = /\r|\n|\t/g;
  if(reg instanceof RegExp === true){
    reg_replace = reg;
  }
  return  string.replace(reg_replace,"");
};

//a safe & easy RegExp renderer.
exports.match = function(reg_exp,string,indexof){
  if(string == null){
    return null;
  }else{
    indexof = indexof || 0;
    if(_.isArray(reg_exp.exec(string)) === true){
      if(indexof >= 0){
        return reg_exp.exec(string)[indexof];
      }else{
        return reg_exp.exec(string);
      }
    }else{
      return reg_exp.exec(string);
    }
  }
};

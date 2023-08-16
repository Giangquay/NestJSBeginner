
export const pick = (object={},key:string[]):any=>{
    return key.reduce((obj,key)=>{
        if(object && Object.prototype.hasOwnProperty.call(object,key))
        {
            obj[key]  = object[key]
        }
        return obj;
    },{})
}

export   function deleteProperties(obj, properties) {
    for (let prop of properties) {
      if (obj.hasOwnProperty(prop)) {
        delete obj[prop];
      }
    }
  }
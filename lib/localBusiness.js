{ "type"  : "object",
  "additionalPropertied"  : false,
  "properties"  : {
    "_id"         : {
      "type"      : "string",
      "minLength" : 25,
      "maxlendth" : 25
    },
    "name"        : {
      "required"  : true,
      "type"      : "string",
      "minLength" : 2,
      "maxlendth" : 127
    },
    "postalCode"   : {
      "required"  : false,
      "type"      : "string",
      "minLength" : 0,
      "maxlendth" : 10
    },
    "addressRegion" : {
      "required"  : false,
      "type"      : "string",
      "minLength" : 0,
      "maxlendth" : 127
    },
    "addresLocality"  : {
      "required"  : false,
      "type"      : "string",
      "minLength" : 0,
      "maxlendth" : 127
    },
    "streetAddress" : {
      "required"  : false,
      "type"      : "string",
      "minLength" : 0,
      "maxlendth" : 127
    },
    "telephone" : {
      "required"  : false,
      "type"      : "string",
      "minLength" : 0,
      "maxlendth" : 127
    },
    "faxNumber" : {
      "required"  : false,
      "type"      : "string",
      "minLength" : 0,
      "maxlendth" : 127
    },
    "openingHours" : {
      "required"  : false,
      "type"      : "string",
      "minLength" : 0,
      "maxlendth" : 127
    },
    "url" : {
      "required"  : false,
      "type"      : "string",
      "minLength" : 0,
      "maxlendth" : 127
    }
  }
}

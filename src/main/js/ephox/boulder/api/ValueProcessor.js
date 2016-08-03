define(
  'ephox.boulder.api.ValueProcessor',

  [
    'ephox.boulder.api.FieldPresence',
    'ephox.boulder.api.ObjReader',
    'ephox.boulder.api.ObjWriter',
    'ephox.boulder.combine.ResultCombine',
    'ephox.compass.Arr',
    'ephox.numerosity.api.JSON',
    'ephox.peanut.Fun',
    'ephox.perhaps.Option',
    'ephox.perhaps.Result',
    'ephox.scullion.ADT'
  ],

  function (FieldPresence, ObjReader, ObjWriter, ResultCombine, Arr, Json, Fun, Option, Result, Adt) {
    var adt = Adt.generate([
      { field: [ 'key', 'okey', 'presence', 'prop' ] },
      { state: [ 'okey', 'instantiator' ] }
    ]);

    var output = function (okey, value) {
      return adt.state(okey, Fun.constant(value));
    };

    var snapshot = function (okey) {
      return adt.state(okey, Fun.identity);
    };

    var strict = function (key) {
      return adt.field(key, key, FieldPresence.strict(), value(Result.value));
    };

    var defaulted = function (key, fallback) {
      return adt.field(key, key, FieldPresence.defaulted(fallback), value(Result.value));
    };

    var strictAccess = function (path, obj, key) {
      // In strict mode, if it undefined, it is an error.
      return ObjReader.readOptFrom(obj, key).fold(function () {
        console.log('path', path);
        var message = 'Failed Path: ' + path.join(' > ') + '\nCould not find valid *strict* value for "' + key + '" in ' + Json.stringify(obj, null, 2);
        return Result.error([ message ]);
      }, Result.value);
    };

    var fallbackAccess = function (obj, key, fallback) {
      return Result.value(ObjReader.readOr(key, fallback)(obj));
    };

    var optionAccess = function (obj, key) {
      return Result.value(ObjReader.readOptFrom(obj, key));
    };

    var cExtractOne = function (path, obj, field, strength) {
      return field.fold(
        function (key, okey, presence, prop) {
          var bundle = function (av) {
            return prop.extract(path.concat([ key ]), strength, av).map(function (res) {
              return ObjWriter.wrap(okey, res);
            });
          };

          return (function () {
            return presence.fold(function () {
              return strictAccess(path, obj, key).bind(bundle);
            }, function (fallback) {
              return fallbackAccess(obj, key, fallback).bind(bundle);
            }, function () {
              console.log('OPTIONING');
              return optionAccess(obj, key).bind(function (optValue) {
                return optValue.fold(function () {
                  var outcome = ObjWriter.wrap(okey, Option.none());
                  console.log('basic value', okey, outcome);
                  return Result.value(outcome);
                }, function (ov) {



                  return prop.extract(path.concat([ key ]), strength, ov).map(function (res) {
                    return ObjWriter.wrap(okey, Option.some(res));
                  });
                });
              });
            });
          })();
        },
        function (okey, instantiator) {
          var state = instantiator(obj);
          return ObjWriter.wrap(okey, strength(state));
        }
      );
    };

    var cExtract = function (path, obj, fields, strength) {
       var results = Arr.map(fields, function (field) {
        return cExtractOne(path, obj, field, strength);
      });

      return ResultCombine.consolidateObj(results, {});
    };

    var value = function (validator) {
      var extract = function (path, strength, val) {
        // Include path when validation fails.
        return validator(val).map(strength);
      };

      var toString = function () {
        return 'val';
      };

      return {
        validate: Fun.noop,
        extract: extract,
        toString: toString
      };      
    };

    var obj = function (fields) {
      var extract = function (path, strength, obj) {
        return cExtract(path, obj, fields, strength);
      };

      var toString = function () {
        var fieldStrings = Arr.map(fields, function (field) {
          return field.fold(function (key, okey, presence, prop) {
            return key + ' -> ' + prop.toString();
          }, function (okey, instantiator) {
            return 'state(' + okey + ')';
          });
        });
        return 'obj{\n' + fieldStrings.join('\n') + '}'; 
      };

      return {
        validate: Fun.noop,
        extract: extract,
        toString: toString
      };
    };

    var arr = function (prop) {
      var extract = function (path, strength, array) {
        var results = Arr.map(array, function (a, i) {
          return prop.extract(path.concat(['[' + i + ']' ]), strength, a);
        });
        return strength(ResultCombine.consolidateArr(results));
      };

      var toString = function () {
        return 'array(' + prop.toString() + ')';
      };

      return {
        validate: Fun.noop,
        extract: extract,
        toString: toString
      };
    };

    var arrOfObj = function (path, fields) {
      return arr(obj(path, fields));
    };

    return {
      value: value,
      obj: obj,
      arr: arr,

      arrOfObj: arrOfObj,

      prop: adt.prop,
      // obj: adt.obj,
      // arr: adt.arr,
      state: adt.state,

      field: adt.field,
      
      output: output,
      snapshot: snapshot,
      strict: strict,
      defaulted: defaulted
    };
  }
);


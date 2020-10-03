// this is what you would do if you liked things to be easy:
// var stringifyJSON = JSON.stringify;

// but you don't so you're going to write it from scratch:
var stringifyJSON = function(obj) {
  if (typeof obj === 'number') {
    return obj.toString();
  }
  let resultStr = '';
  if (obj === null) {
    return 'null';
  }
  if (typeof obj === 'boolean') {
    return obj.toString();
  }

  //First Tests for Empty Object- ->
  // alert(JSON.stringify(obj) + ' ' + typeof obj)
  for (let key in obj) {
    if (typeof obj[key] === 'function' || obj[key] === 'undefined') {
      return '{}';
    }
  }

  if (Object.keys(obj).length === 0 && obj.constructor === Object) {
    return '{}';
  } else if (obj.constructor === Object) {
    for (let key in obj) {
      if (typeof obj[key] === 'boolean' || obj[key] === null) {
        resultStr = resultStr.concat('"' + key + '":');
        resultStr = resultStr.concat(obj[key]) + ',';
      } else {
        if (obj[key].constructor === Object) {
          resultStr = resultStr.concat('"' + key + '":');
          let result = coolerFunc(obj[key]);
          resultStr = resultStr.concat(result + ',');
        } else if (Array.isArray(obj[key])) {
          resultStr = resultStr.concat('"' + key + '":');
          let result = '';
          for (let i = 0; i < obj[key].length; i++) {
            result = result.concat('"' + obj[key][i] + '",');
          }
          // if (result[result.length - 1] === ',') {
          //   result = result.split('');
          //   result.splice(result.length - 1, 1)
          //   result = result.join('');
          // }
          result = result.split('');
          if (result[result.length - 1] === ',') {
            result.splice(result.length - 1, 1);
          }
          result.unshift('[');
          result.push(']');
          resultStr = resultStr.concat(result.join('') + ',');
          // resultStr = resultStr.split('');
          // resultStr.unshift('{');
          // resultStr.push('}')
          // return resultStr.join('');
        } else {
          resultStr = resultStr.concat('"' + key + '":');
          resultStr = resultStr.concat('"' + obj[key] + '"');
          // resultStr = resultStr.concat(',')
        }
      }
    }
    // if (resultStr[resultStr.length - 1] === ',') {
    //   resultStr = resultStr.split('')
    //   resultStr.splice(resultStr.length - 1, 1);
    //   resultStr = resultStr.join('');
    // }
    resultStr = resultStr.split('');
    if (resultStr[resultStr.length - 1] === ',') {
      resultStr.splice(resultStr.length - 1, 1);
    }
    resultStr.unshift('{');
    resultStr.push('}');
    // resultStr = resultStr.join('');
    // resultStr = resultStr.split(',');
    resultStr = resultStr.join('');
    return resultStr;
  }

  //Array Case- ->
  if (Array.isArray(obj)) {
    if (obj.length > 1) {
      if (obj.every(x => x.constructor === Object)) {
        for (let i = 0; i < obj.length; i++) {
          if (obj[i].constructor === Object) {
            let result = '';
            for (let key in obj[i]) {
              result = result.concat('"' + key + '":');
              result = result.concat('"' + obj[i][key] + '"');
            }
            result = result.split('');
            result.unshift('{');
            result.push('}');
            result.push(',');
            resultStr = resultStr.concat(result.join(''));
          }
        }
        resultStr = resultStr.split('');
        if (resultStr[resultStr.length - 1] === ',') {
          resultStr.splice(resultStr.length - 1, 1);
        }
        resultStr.unshift('[');
        resultStr.push(']');
        return resultStr.join('');
      }
      //Every Element in the Array is not an Array
      if (obj.every(x => !Array.isArray(x))) {
        for (let key in obj) {
          if (typeof obj[key] === 'string') {
            let x = obj[key];
            x = x.split('');
            x.splice(0, 0, '"');
            x.splice(x.length, 0, '"');
            x = x.join('');
            resultStr = resultStr.concat(x);
          } else {
            resultStr = resultStr.concat(obj[key].toString() + ',');
          }
        }
        if (resultStr[resultStr.length - 1] === ',') {
          resultStr = resultStr.split('');
          resultStr.splice(resultStr.length - 1, 1);
          resultStr = resultStr.join('');
        }

        resultStr = resultStr.split('');
        resultStr.unshift('[');
        resultStr.push(']');
        return resultStr.join('');
      }

      let innerArrayTest = obj.filter(x => Array.isArray(x));
      if (innerArrayTest.length > 0) {
        let resultStr = '[';
        let sI = 0;
        let result = nestedArrFunc (obj, resultStr);
        return result;
      }



      for (let z = 0; z < obj.length; z++) {
        if (obj[z].constructor === Object) {
          let result = coolerFunc(obj[z]) + ',';
          resultStr = resultStr.concat(result);
        }
      }

      if (resultStr[resultStr.length - 1] === ',') {
        resultStr = resultStr.split('');
        resultStr.splice(resultStr.length - 1, 1);
        resultStr = resultStr.join('');
      }

      resultStr = resultStr.split('');
      resultStr.unshift('[');
      resultStr.push(']');
      return resultStr.join('');


    } else {
      if (Array.isArray(obj[0])) {
        let counter = 0;
        let result = coolFunc(obj, counter);
        return result;
      }
    }
    if (typeof obj[0] === 'string') {
      resultStr = obj[0].split('');
      resultStr.splice(0, 0, '"');
      resultStr.splice(resultStr.length, 0, '"');
      resultStr = resultStr.join('');
      obj.splice(0, 1, resultStr);
    }
    let result = obj;
    result = result.join('');
    return '[' + result + ']';
  }

  //String Case- ->
  if (typeof obj === 'string') {
    for (let key in obj) {
      resultStr = resultStr.concat(obj[key]);
    }
  }
  resultStr = resultStr.split('');
  resultStr.splice(0, 0, '"');
  resultStr.splice(resultStr.length, 0, '"');
  resultStr = resultStr.join('');
  return resultStr;
};

let coolFunc = function (obj, counter) {
  if (!Array.isArray(obj)) {
    let result = ('"' + obj + '"');
    result = result.split('');
    for (let i = 0; i < counter; i++) {
      result.unshift('[');
      result.push(']');
    }
    return result.join('');
  }
  obj.unshift();
  counter++;
  return coolFunc(obj[0], counter);
};

let nestedArrFunc = function (obj, resultStr, cI, lI) {
  for (let i = 0; i < obj.length; i++) {
    if (Array.isArray(obj[i])) {
      resultStr = resultStr.split('');

      if (cI === undefined && lI === undefined) {
        resultStr.splice(i + 1, 0, '[');
        saveLength = resultStr.length;
      } else if (lI > - 1 && cI === undefined) {
        resultStr.splice(i + 1 + lI, 0, '[');
        saveLength = resultStr.length - lI;
      } else if (cI && lI) {
        resultStr.splice(cI, 0, '[');
        saveLength = resultStr.length - cI - lI;
      }

      let index = 0;
      //-2 because I don't need the last comma.
      while (index < obj[i].length - 1) {
        resultStr.push(',');
        index++;
      }

      resultStr.splice(saveLength + obj[i].length, 0, ']');

      let countdownIndex = obj[i].length - 1;
      while (countdownIndex > -1) {
        if (Array.isArray(obj[i][countdownIndex])) {
          return nestedArrFunc(obj[i], resultStr.join(''), saveLength + countdownIndex, index);
        }

        resultStr.splice(saveLength + countdownIndex + 1, 0, obj[i][countdownIndex]);
        countdownIndex--;
      }
      //Implicit Return :D
      resultStr.push(']');
      return resultStr.join('');
    } else {
      resultStr += (obj[i]) + ',';
      lI = 1;
    }
  }
};

let coolerFunc = function (obj) {
  let resultStr = '';
  for (let key in obj) {
    resultStr = resultStr.concat('"' + key + '":"' + obj[key] + '"');
  }
  resultStr = resultStr.split('');
  resultStr.unshift('{');
  resultStr.push('}');
  return resultStr.join('');
};

let handleArray = function (array) {
  if (array.length === 0) {
    return '[]';
  }
};


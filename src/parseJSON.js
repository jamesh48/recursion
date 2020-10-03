// this is what you would do if you were one to do things the easy way:
// var parseJSON = JSON.parse;

// but you're not, so you'll write it from scratch:
var parseJSON = function(json) {
  const arrBracket = new RegExp(/\[/g).test(json);
  const objBracket = new RegExp(/\{/g).test(json);
  const emptyArr = new RegExp(/\[]/g).test(json);
  const emptyObj = new RegExp(/\{}/g).test(json);

  if (arrBracket) {
    if (emptyArr) {
      return [];
    }
    const array = [];
    json = removeExtraChars(json, -1);
    return handleArrayX(json, array);
  }

  if (objBracket) {
    if (emptyObj) {
      return {};
    }
    const obj = {};
    json = removeExtraChars(json, -1);
    return handleObjX(json, obj);
  }
};

const handleArrayX = function (json, array) {
  json = json.split('');
  let openBracketIndex = json.indexOf('[');
  let commaIndex = json.indexOf(',');
  let closeBracketIndex = json.indexOf(']');

  if (commaIndex === -1) {
    let arrayItem = json.splice(openBracketIndex + 1, closeBracketIndex - 1).join('');
    array.push(nullBooleanNumberTest(arrayItem));
    return array;
  }

  let arrayItem = json.splice(openBracketIndex + 1, commaIndex - 1).join('');
  array.push(nullBooleanNumberTest(arrayItem));


  //Preparing JSON String for Next Iteration by removing comma- ->
  let index = (json.join('')).search(/\,/g);
  json.splice(index, 1);

  return handleArrayX(json.join(''), array);
};

const handleObjX = function (json, obj) {
  json = json.split('');
  let openBracketIndex = json.indexOf('{');
  let colonIndex = json.indexOf(':');
  let commaIndex = json.indexOf(',');
  let closeBracketIndex = json.lastIndexOf('}');

  let nestedObj = json.slice(openBracketIndex + 1, closeBracketIndex);
  let nestedObjTest = nestedObj.indexOf('}') > -1;
  if (nestedObjTest) {
    let key = nestedObj.slice(0, colonIndex - 1);
    key = key.join('').replace(/\"/g, '');
    nestedObj = nestedObj.slice(colonIndex, closeBracketIndex);
    obj[key] = handleNestedObj(nestedObj, -1, -1, {});
    return obj;
  }

  if (commaIndex === -1) {
    let property = json.splice(openBracketIndex + 1, closeBracketIndex - 1);
    let objKey = property.splice(0, property.indexOf(':')).join('');
    let objValue = property.splice(property.indexOf(':') + 1).join('');
    objKey = shiftPop(objKey);
    obj[objKey] = nullBooleanNumberTest(objValue);
    return obj;
  }

  while (commaIndex < colonIndex) {
    let restOfJson = json.slice(commaIndex + 1);
    commaIndex = commaIndex + restOfJson.indexOf(',') + 1;
  }
  let property = json.splice(openBracketIndex + 1, commaIndex - 1);

  let objKey = property.splice(0, property.indexOf(':')).join('');
  let objValue = property.splice(property.indexOf(':') + 1).join('');

  objKey = shiftPop(objKey);
  // objValue = shiftPop(objValue);

  obj[objKey] = nullBooleanNumberTest(objValue);

  //Preparing JSON String for Next Iteration by removing comma- ->
  let index = (json.join('')).search(/\,/g);
  json.splice(index, 1);
  json = json.join('');
  return handleObjX(json, obj);
};

const removeBrackets = function (str) {
  if (str.indexOf('{') !== -1) {
    //Removes {
    str = str.replace(/\{/g, '');
  } else if (str.indexOf('}') !== -1) {
    //Removes Colon
    str = str.replace(/\:/g, '');
    //Removes }
    str = str.replace(/\}/g, '');
  }
  return str;
};

const shiftPop = function (item) {
  if (item[0] === '"') {
    item = item.split('');
    item.shift();
    item.pop();
    item = item.join('');
  }
  return item;
};

const removeExtraChars = function (str, startingIndex) {
  //Removes Extra Spaces from obj;
  //Does Not Remove spaces between quotes- ->
  if (str.indexOf(' ') === -1) {
    return str;
  }
  let strCopy = str.slice(0);
  strCopy = strCopy.split('');
  let counter = 0;
  let firstIndex = 0;
  if (startingIndex === -1) {
    firstIndex = strCopy.indexOf('"');
  } else {
    firstIndex = startingIndex;
  }
  let slicedStr = strCopy.slice(firstIndex + 1);

  let secondIndexTest = slicedStr.indexOf('"');
  let secondIndex = secondIndexTest + firstIndex + 1;

  let nonStringSection = strCopy.slice(secondIndex + 1);

  let thirdIndex = nonStringSection.indexOf('"');
  let xFactor = secondIndex + thirdIndex;
  let removeSpaces = nonStringSection.slice(0, thirdIndex);

  for (let i = 0; i < removeSpaces.length; i++) {
    if (removeSpaces[i] === ' ') {
      let index = removeSpaces[i];
      removeSpaces.splice(i, 1);
      counter++;
    }
  }

  strCopy.splice(secondIndex + 1, removeSpaces.length + counter, removeSpaces.join(''));

  if (thirdIndex === -1) {
    strCopy = strCopy.join('');
    return strCopy;
  }
  return removeExtraChars(strCopy.join(''), xFactor);
};

const nullBooleanNumberTest = function (item) {
  if (!isNaN(parseFloat(item))) {
    return parseFloat(item);
  }
  if ((/null/g).test(item)) {
    return null;
  } else if ((/true/g).test(item)) {
    return true;
  } else if ((/false/g).test(item)) {
    return false;
  } else {
    return shiftPop(item);
  }
};

const handleNestedObj = function (nestedObj, startingIndex, colonIndex, obj) {
  let closingBracketIndex = nestedObj.lastIndexOf('}');

  //First Pass;
  if (startingIndex === -1) {
    colonIndex = nestedObj.indexOf(':');
    startingIndex = nestedObj.indexOf('{');
  }

  //Handling the Key
  let key = nestedObj.slice(startingIndex + 1, colonIndex);
  let keysColon = key.indexOf(':');
  key.splice(keysColon, 1);
  key = key.join('').replace(/\"/g, '');

  let colonIndexTest = nestedObj.slice(colonIndex + 1).indexOf(':');
  if (colonIndexTest === -1) {

    let innerMostBracket = nestedObj.slice(colonIndex + 1).indexOf('}') + colonIndex + 1;
    let value = nestedObj.slice(colonIndex + 1, innerMostBracket).join('');

    obj[key] = nullBooleanNumberTest(value);
    return nullBooleanNumberTest(obj);
  } else {
    //Setting up for next iteration;
    startingIndex = nestedObj.slice(startingIndex + 1).indexOf('{') + startingIndex + 1;
    colonIndex = nestedObj.slice(colonIndex + 1).indexOf(':') + colonIndex + 1;
    //????
    obj[key] = handleNestedObj(nestedObj, startingIndex, colonIndex, obj);
    return obj;
  }
};

// const handleNestedObjValue = function (value) {
//   let obj = {};
//   let firstBracketIndex = value.indexOf('{') + 1;
//   let secondBracketIndex = value.slice(firstBracketIndex).indexOf('}');
//   let colonIndex = value.indexOf(':');
//   let key = value.slice(firstBracketIndex + 1, colonIndex);
//   key = key.join('').replace(/\"/g, '');
//   let nestedValue = value.slice(colonIndex + 1, value.indexOf('}'));
//   nestedValue = nestedValue.join('').replace(/\"/g, '');
//   obj[key] = nestedValue;
//   return nullBooleanNumberTest(obj);
// };

//ref: https://stackoverflow.com/questions/20817618/is-there-a-splice-method-for-strings
const spliceSlice = function (str, index, count, add) {
  // We cannot pass negative indexes directly to the 2nd slicing operation.
  if (index < 0) {
    index = str.length + index;
    if (index < 0) {
      index = 0;
    }
  }
  return str.slice(0, index) + (add || '') + str.slice(index + count);
};

// If life was easy, we could just do things the easy way:
// var getElementsByClassName = function (className) {
//   return document.getElementsByClassName(className);
// };

// But instead we're going to implement it from scratch:

//targetClassName- ->
// var getElementsByClassName = function (className) {
//   let resultArr = [];
//   let test = $('html').find('.' + className);


//   test.each(
//     function() {
//       resultArr.push(this);
//     }
//   )

//   return resultArr;
// };

const getElementsByClassName = function (className) {
  let resultArr = [];
  let c = document.documentElement.childNodes;
  let documentNodes = document.body.childNodes;

  for (let i = 0; i < c.length; i++) {
    if (c[i].classList !== undefined) {
      let test = c[i].classList.contains(className);
      if (test) {
        resultArr.push(c[i]);
      }
    }
  }

  let test = helperFunc(documentNodes, className);
  for (let i = 0; i < test.length; i++) {
    resultArr.push(test[i]);
  }
  return resultArr;
};

const helperFunc = function (documentNodes, className) {

  let accumulator = [];

  for (let i = 0; i < documentNodes.length; i++) {

    if (documentNodes[i].nodeName !== '#text') {
      let test = getSiblings(documentNodes[i]);

      for (let e = 0; e < test.length; e++) {
        if (test[e].childNodes.length && test[e].nodeName === 'DIV') {
          for (let x = 0; x < test[e].childNodes.length; x++) {

            if (test[e].childNodes[x].classList.contains(className)) {
              accumulator.push(test[e].childNodes[x]);
            }
          }
        }
      }
      if (documentNodes[i].classList.contains(className)) {
        accumulator.push(documentNodes[i]);

        if (documentNodes[i].nextSibling) {
          if (documentNodes[i].nextSibling.classList.contains(className)) {
            accumulator.push(documentNodes[i]);
          }
        }
        if (test.some(x => x.classList.contains(className))) {
          for (let x = 0; x < test.length; x++) {
            if (test[x].classList.contains(className)) {
              accumulator.push(test[x]);
            }
          }
        }
      } else if (i === documentNodes.length - 1) {
        if (!documentNodes[i].id) {
          documentNodes = documentNodes[i].childNodes;
          return helperFunc (documentNodes, className);
        }
      }
    }
    if (accumulator.length > 0) {
      return accumulator;
    }
  }
};


const getSiblings = function (elem) {
  let siblings = [];
  let sibling = elem.firstChild;
  while (sibling) {
    if (sibling.nodeType === 1 && sibling !== elem) {
      siblings.push(sibling);
    }
    sibling = sibling.nextSibling;
  }
  return siblings;
};
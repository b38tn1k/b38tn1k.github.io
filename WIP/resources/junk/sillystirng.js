else {
  if (activeCell.type == T_ADD) { // concatenate
    res = '';
    for (let i = 0; i < vals.length; i++) {
      res += vals[i];
    }
  } else if (activeCell.type == T_SUBTRACT) { // shorten or remove
    res = vals[0];
    for (let i = 1; i < vals.length; i++) {
      if (isNumbers[i] == true) {
        let myNumber = parseFloat(vals[i])
        if (myNumber < res.length) {
          res = res.substring(0, res.length - myNumber);
        } else {
          res = '';
        }
      } else {
        let myIndexStart = res.indexOf(vals[i]);
        let myIndexEnd = myIndexStart + vals[i].length;
        if (myIndexStart != -1) {
          let endCap = '';
          if (myIndexEnd < res.length) {
            endCap = res.substring(myIndexEnd, res.length);
          }
          res = res.substring(0, myIndexStart) + endCap;
        }
      }
    }
  } else if (activeCell.type == T_MULT) { // get index of substring
    res = 'error';
    if (vals.length >= 2) {
      res = vals[0].indexOf(vals[1]);
    }
  } else if (activeCell.type == T_DIV) { //get char at index
    let myIndex = 0;
    let cando = false;
    res = -1
    for (let i = 1; i < isNumbers.length; i++) {
      if (isNumbers[i] == true) {
        myIndex = vals[i];
        cando = true;
        break;
      }
    }
    if (cando == true && myIndex < vals[0].length) {
      res = vals[0][myIndex];
    }
  } else {
    res = '';
  }
}

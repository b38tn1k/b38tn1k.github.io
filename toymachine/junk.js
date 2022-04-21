
function scratchNet() {
  let inputs = [[0, 0, 1, 0, 1, 1, 0, 1], [1, 0, 1, 0, 0, 0, 0, 0], [1, 0, 1, 1, 1, 1, 1, 1], [0, 1, 1, 1, 0, 1, 1, 0], [0, 0, 0, 0, 0, 0, 1, 1]];
  let outputs = [0, 1, 1, 0, 0];
  let myNN = new NN(inputs, outputs);
  for (let its = 0; its < 10; its ++) {
    for (let steps = 0; steps < 10; steps++) {
      myNN.step();
    }
    console.log(myNN.test([1, 0, 1, 0, 0, 1, 0, 0]));
  }
}

function slowScratchNet() {
  let inputs = [[0, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0], [1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0]];
  let outputs = [1, 0];
  let myNN = new NN(inputs, outputs);
  for (let its = 0; its < 10; its ++) {
    for (let steps = 0; steps < 50; steps++) {
      myNN.step();
    }
    console.log(myNN.test([0, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 0]));
  }
}

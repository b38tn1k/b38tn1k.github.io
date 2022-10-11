function openSubMenuString(title, level = 0){
  let myString = '';
  myString += '<div id="';
  myString += title.replace(/ /g, "_");
  myString += '">';

  myString += '<details class="level' + String(level) + '">';
  myString += '<summary>';
  for (let i = 0; i < level; i++){
    myString += '&nbsp';
  }
  myString += String(title);
  myString += '</summary>';
  return myString;
}

function closeSubMenuString(){
  return '</details></div>';
}

function createMenuDiv() {
  jlog('Main', 'createMenuDiv');
  menu.remove();
  menu = createDiv();

  let menuHTMLString = openSubMenuString('blocks menu');
  for (const [title, blocks] of Object.entries(blockMenuDict)) {
    menuHTMLString += openSubMenuString(title, 1);
    menuHTMLString += closeSubMenuString();
  }
  menuHTMLString += closeSubMenuString();
  menu.html(menuHTMLString);
  for (const [title, blocks] of Object.entries(blockMenuDict)) {
    let myDiv = document.getElementById(title.replace(/ /g, "_"), menu);
    // console.log(myDiv);
    for (let i = 0; i < blocks.length; i++) {
      addButtonToDiv(blockConfig[blocks[i]]['block label'], blocks[i], newCellFromButtonClick, myDiv);
    }
  }


  if (mobileHack == false){
    menu.style('font-size', '16px');
  } else {
    menu.style('font-size', '12px');
  }
  menu.style('background-color', 'DimGray');
  menu.style('padding', '10px');
  menu.style('outline', '1px solid black');
  if (menu.size().height > windowHeight - 50){
    let newHeight = windowHeight - 50;
    menu.size(null, newHeight);
  } else {
    menu.size(null, null);
  }
  menu.style('overflow', "auto");
  menu.position(10, 10);
  noClickZone = [10, menu.size().width + 10, windowHeight - 2* menu.size().height, windowHeight];
  if (hideMenu == true){
    menu.hide();
    noClickZone = [-1, -1, -1, -1];
  } else {
    menu.show();
  }
  showDev = ! showDev;
  showDevDiv();
}

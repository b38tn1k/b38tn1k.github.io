function setupMenu() {
    menu = new CircularMenu();

    // let themesArray = Object.keys(themes);

    // // Divide the themes into three groups
    // let themeGroup1 = themesArray.slice(0, themesArray.length / 2);
    // let themeGroup2 = themesArray.slice(themesArray.length / 2);
    // // let themeGroup3 = themesArray.slice(2 * themesArray.length / 3);

    // // Create buttons for each theme group
    // let buttons1 = themeGroup1.map(
    //     (theme) => new MenuButton(theme, 0, 0, () => setTheme(theme), 1)
    // );
    // buttons1.push(
    //     new MenuButton('...', 0, 0, () => menu.activateSubMenu('themes2'), 1)
    // );
    // let buttons2 = themeGroup2.map(
    //     (theme) => new MenuButton(theme, 0, 0, () => setTheme(theme), 1)
    // );
    // buttons2.push(
    //     new MenuButton('...', 0, 0, () => menu.activateSubMenu('themes1'), 1)
    // );

    // // Add each theme group as a separate submenu
    // menu.newSubMenu(buttons1, 'themes1');
    // menu.newSubMenu(buttons2, 'themes2');
    // // Create Buttons for a Settings submenu
    // let settings = [];
    // settings.push(
    //     new MenuButton('Themes', 0, 0, () => menu.activateSubMenu('themes1'), 1)
    // );

    // // menu.newSubMenu(settings, 'settings');
    menu.addButton('New Note', newNote);
    menu.addButton('New Zone', newZone);
    menu.addButton('New Process', newProcess);
    menu.addButton('New Source', newSource);
    menu.addButton('New Sink', newSink);
    menu.addButton('New Metric', newMetric);
    menu.addButton('New Split', newSplit);
    menu.addButton('New Merge', newMerge);
    // menu.addButton('Settings', () => {menu.activateSubMenu('settings');});
}

function setTheme(theme) {
    COLOR_THEME = theme;
    document.body.style.backgroundColor = getColor('background');
}

function newSource() {
    const pos = screenToBoard(menu.position.x, menu.position.y);
    sess.addSource(pos.x, pos.y);
    menu.dismiss();
}

function newNote() {
    const pos = screenToBoard(menu.position.x, menu.position.y);
    sess.addNote(pos.x, pos.y);
    menu.dismiss();
}

function newSink() {
    const pos = screenToBoard(menu.position.x, menu.position.y);
    menu.dismiss();
    sess.addSink(pos.x, pos.y);
}

function newSplit() {
    const pos = screenToBoard(menu.position.x, menu.position.y);
    sess.addSplit(pos.x, pos.y);
    menu.dismiss();
}

function newMerge() {
    const pos = screenToBoard(menu.position.x, menu.position.y);
    sess.addMerge(pos.x, pos.y);
    menu.dismiss();
}

function newProcess() {
    const pos = screenToBoard(menu.position.x, menu.position.y);
    menu.dismiss();
    sess.addProcess(pos.x, pos.y);
}

function newZone() {
    const pos = screenToBoard(menu.position.x, menu.position.y);
    menu.dismiss();
    sess.addZone(pos.x, pos.y);
}

function newMetric() {
    const pos = screenToBoard(menu.position.x, menu.position.y);
    sess.addMetric(pos.x, pos.y);
    menu.dismiss();
}


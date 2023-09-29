function loadColors(data) {
    for (let colorName in data) {
        let colorValue = data[colorName];
        colors[colorName] = color(colorValue);
    }
}

function getColor(field) {
    return colors[themes[COLOR_THEME][field]];
}

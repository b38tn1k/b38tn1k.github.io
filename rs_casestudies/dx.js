let dx = function (p) {

    const myColors = {};

    p.setup = function () {
        p.createCanvas(1000, 400);
        p.pixelDensity(2);
        setupColors();
        p.background(myColors["rsLightGrey"]);
    };

    p.draw = function () {

    };

    p.keyPressed = function () {
        if (p.key === ' ') {
            p.saveCanvas('dx', 'png');
        }
    };

    function setupColors() {
        myColors["rsBlue"] = p.color("#0D1B34");
        myColors["rsLightGrey"] = p.color("#E0E0DB");
        myColors["rsDarkGrey"] = p.color("#2A2829");
        myColors["rustOrange"] = p.color("#C25B56");
        myColors["secondary"] = p.color("#666666");
        myColors["background"] = p.color("#0d1b34");
        myColors["secondary"] = p.color("#ccff00");
        myColors["goldenYellow"] = p.color("#FFD700");
        myColors["oliveGreen"] = p.color("#808000");
        myColors["plumPurple"] = p.color("#DDA0DD");
        myColors["burntSienna"] = p.color("#EA7E5D");
        myColors["mustardYellow"] = p.color("#FFDB58");
        myColors["sageGreen"] = p.color("#9DC183");
        myColors["powderBlue"] = p.color("#B0E0E6");
        myColors["hero"] = p.color("#FF4F00"); //CB4154
        myColors["forestGreen"] = p.color("#005411");
        myColors["navyBlue"] = p.color("#001F3F");
        myColors["skyBlue"] = p.color("#87CEEB");
        myColors["peachCoral"] = p.color("#FFB8A1");
        myColors["lightOrange"] = p.color("#FFCBA4");
        myColors["darkGoldenOrange"] = p.color("#FFB366");
        myColors["startColor"] = p.color("#ccff00");
        myColors["endColor"] = p.color("#666666");
    }
};

new p5(dx, 'dx');
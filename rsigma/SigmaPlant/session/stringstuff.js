

// Key mapping for compression and uncompression
const keyMap = {
    aDims: '<aD>',
    bCart: '<bC>',
    bDims: '<bD>',
    bOffset: '<bO>',
    bSqrDim: '<bS>',
    buttons: '<bt>',
    changed: '<cg>',
    connected: '<ct>',
    Connector: '<Cn>',
    connector: '<cn>',
    constructor: '<cr>',
    dataLabels: '<dl>',
    data: '<d>',
    Edit: '<e>',
    EDIT: '<E>',
    false: '<f>',
    FeatureDataIDLabel: '<FL>',
    FeatureDataTextLabel: '<TL>',
    features: '<ft>',
    FeatureUIButtonClose: '<Cb>',
    FeatureUIButtonLetterLabel: '<Lb>',
    FeatureUIButtonMove: '<Mb>',
    FeatureUIButtonResize: '<Rb>',
    FeatureUIInputButton: '<Ib>',
    FeatureUIOutputButton: '<Ob>',
    Geometry: '<ge>',
    INPUT: '<IN>',
    Input: '<in>',
    Labels: '<lb>',
    MERGE: '<MG>',
    Merge: '<Mg>',
    merge: '<mg>',
    METRIC: '<MC>',
    Metric: '<Mc>',
    metric: '<mc>',
    mouseOverData: '<md>',
    OUTPUT: '<OT>',
    Output: '<ot>',
    ParentDefined: '<pd>',
    PARENTLINK: '<PL>',
    ParentLink: '<Pl>',
    parentLink: '<pl>',
    PARENT: '<PN>',
    Parent: '<Pn>',
    parent: '<pn>',
    Plant: '<PT>',
    plant: '<pt>',
    PROCESS: '<PR>',
    Process: '<Pr>',
    process: '<pr>',
    RESIZE: '<RS>',
    Resize: '<rs>',
    SOURCE: '<SC>',
    Source: '<Sc>',
    source: '<sc>',
    SPLIT: '<SP>',
    Split: '<Sp>',
    split: '<sp>',
    sink: '<s>',
    SINK: '<S>',
    target: '<tg>',
    title: '<tl>',
    true: '<t>',
    type: '<tp>',
    XDELETE: '<XD>',
    Xdelete: '<Xd>',
    Zone: '<z>',
    ZONE: '<Z>'
};


function calculateStringSimilarity(str1, str2) {
    const m = str1.length;
    const n = str2.length;

    // Create a 2D array to store the distances
    const dp = Array(m + 1)
        .fill(null)
        .map(() => Array(n + 1).fill(0));

    // Initialize the first row and column of the array
    for (let i = 0; i <= m; i++) {
        dp[i][0] = i;
    }
    for (let j = 0; j <= n; j++) {
        dp[0][j] = j;
    }

    // Calculate the Levenshtein distance
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (str1[i - 1] === str2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1];
            } else {
                dp[i][j] = Math.min(
                    dp[i - 1][j] + 1, // Deletion
                    dp[i][j - 1] + 1, // Insertion
                    dp[i - 1][j - 1] + 1 // Substitution
                );
            }
        }
    }

    // Return the similarity score (1 - normalized Levenshtein distance)
    const maxLen = Math.max(m, n);
    const similarity = 1 - dp[m][n] / maxLen;
    return similarity;
}

function compressString(input, keyMap) {
    let compressed = input;
    for (let key in keyMap) {
        if (keyMap.hasOwnProperty(key)) {
            const regex = new RegExp(key, 'g');
            compressed = compressed.replace(regex, keyMap[key]);
        }
    }
    return compressed;
}

function decompressString(compressed, keyMap) {
    let decompressed = compressed;
    for (let key in keyMap) {
        if (keyMap.hasOwnProperty(key)) {
            const regex = new RegExp(keyMap[key], 'g');
            decompressed = decompressed.replace(regex, key);
        }
    }
    return decompressed;
}
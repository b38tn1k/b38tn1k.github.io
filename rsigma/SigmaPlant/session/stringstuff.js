
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
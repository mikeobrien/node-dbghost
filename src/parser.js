module.exports = function(stdout) {
    var match, results = [], 
        errorRegex = /(<ERROR>([\s\S]*?)<\/ERROR>|.*\.\.\.Error!(.*))/g;
    while (match = errorRegex.exec(stdout)) {
        results.push((match[3] || match[2])
            .replace(/^.*\.\.\./gm, '')
            .replace(/\r\n\r\n/g, '\r\n').trim());
    }
    return results.join('\r\n');
};
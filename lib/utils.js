
// fetch user's home
exports.getUserHome = function () {
    return process.env[process.platform === 'win32' ? 'USERPROFILE' : 'HOME'];
};

// fetch filename
exports.fetchName = function (str) {
    var filename = str.substr(str.lastIndexOf('/') + 1);
    if (filename.indexOf('?') !== -1) {
        var parts = filename.split('?');
        filename = parts[0];
    }
    return filename;
};

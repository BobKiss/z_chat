const path      = require('path');

//
// module.exports.news = (req, res) => {
//     res.sendFile(path.join(__dirname, '../public', 'news.html'));
// };
module.exports.main = (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'news.html'));
};

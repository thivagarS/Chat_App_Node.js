const path = require('path');
module.exports = {
    entry: './public/js/index.js',
    output: {
        path: path.resolve(__dirname, 'public/js'), // THis is changed because while using dev server it will try to inject the js file into the html file which is inside dist/js  but our html file is outside
        filename: 'bundle.js'
    },
}
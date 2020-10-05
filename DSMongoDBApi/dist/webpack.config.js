
const path = require('path');
const restify = require('restify');

console.log("dirnameMio:" + __dirname);

module.exports = {
    mode: 'production',
    resolve: {
        extensions: ['.js', '.json', '.html', '.css', '.png', '.md',],
     },

    context: __dirname,
    entry: {
        app: ['./app.js']
    },
    output: {
        path: __dirname,
        filename: '../docker/DSMongoDBApi.js',
    },
    target: 'node',
    externals: {
        "path": "require('path')",
        "webpack": "require('webpack')",
        "restify": "require('restify')",
        "bunyan": "require('bunyan')",
        "bunyan-elasticsearch-bulk": "require('bunyan-elasticsearch-bulk')",
        "mongodb": "require('mongodb')",
        "restify-swagger-jsdoc": "require('restify-swagger-jsdoc')"

    },
    module: {
        rules: [
            {
                test: /(\.js|.js)$/,
                include: path.resolve(__dirname),
                exclude: ['/node_modules/']
            }
        ]
    }
};


module.exports = {
<<<<<<< HEAD
    publicPath: process.env.NODE_ENV === "production" ? "./" : "/",
    baseUrl: './',
=======
    publicPath: './',
>>>>>>> fb02044817cb34c9ac90ec70428cb4b6bb493208
    assetsDir: 'static',
    productionSourceMap: false,
    outputDir: process.env.DIR_NAME,
    devServer: {
        host: "0.0.0.0",
        port: 8080,
        open: true,
        proxy: {
            '/api': {
                target: 'http://musicapi.leanapp.cn',
                changeOrigin: true,
                pathRewrite: {
                    '^/api': ''
                }
            },
            '/text': {
                target: 'http://192.168.31.93:8078',
                changeOrigin: true,
                pathRewrite: {
                    '^/text': ''
                }
            },

            '/file': {
                target: 'http://47.108.204.66:8078',
                changeOrigin: true,
                pathRewrite: {
                    '^/file': ''
                }
            },

            '/dev': {
                target: "http://192.168.31.94:8077",
                // ws: true,
                // secure:true,
                changeOrigin: true,
                pathRewrite: {
                    '^/dev': ''
                }
            },
            '/map': {
                target: "http://apis.map.qq.com",
                changeOrigin: true,
                pathRewrite: {
                    '^/map': ''
                }
            },

        }
    }

}
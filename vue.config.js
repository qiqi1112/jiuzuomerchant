module.exports = {
    publicPath: './',
    assetsDir: 'static',
    productionSourceMap: false,
    outputDir: process.env.DIR_NAME,
    devServer: {
        host: "0.0.0.0",
        port: 8080,
        open: true,
        proxy: {
            '/api': {
                // target: "http://192.168.31.100:8077",
                // target: "http://192.168.31.194:8077",
                target: 'https://storetest.cdhqht.com',
                changeOrigin: true,
                pathRewrite: {
                    '^/api': ''
                }
            },
            '/file': {
                // target: 'http://47.108.204.66:8078',
                target: 'https://storetest.cdhqht.com',
                changeOrigin: true,
                pathRewrite: {
                    '^/file': ''
                }
            },
            '/map': {
                target: "https://apis.map.qq.com",
                changeOrigin: true,
                pathRewrite: {
                    '^/map': ''
                }
            },

        }
    }

}
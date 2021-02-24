module.exports = {
    publicPath: './',
    assetsDir: 'static',
    productionSourceMap: false,
    devServer: {
        host: "0.0.0.0",
        // port: 8080,
        open: true,
        proxy: {
            '/api': {
                target: "http://192.168.2.7:8077",
                // target: "http://192.168.2.50:8077",
                // target: 'https://storetest.cdhqht.com',
                changeOrigin: true,
                pathRewrite: {
                    '^/api': ''
                }
            },
            '/file': {
                target: "http://192.168.2.7:8077",
                // target: "http://192.168.2.50:8077",
                // target: 'https://storetest.cdhqht.com',
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
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
                target: 'https://storetest.cdhqht.com',
                changeOrigin: true,
                pathRewrite: {
                    '^/api': ''
                }
            },
            '/file': {
                target: 'https://storetest.cdhqht.com',
                changeOrigin: true,
                pathRewrite: {
                    '^/file': ''
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
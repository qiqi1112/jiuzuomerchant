module.exports = {
    baseUrl: './',
    assetsDir: 'static',
    productionSourceMap: false,
    devServer: {
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

            '/dev': {
                target: "http://47.108.204.66:8077",
                changeOrigin: true,
                pathRewrite: {
                    '^/dev': ''
                }
            },
        }
    }

}
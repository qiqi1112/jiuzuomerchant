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
            }
        }
    }

}
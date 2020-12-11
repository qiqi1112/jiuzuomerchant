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
                target: "http://192.168.31.100:8077",
                // target: "http://192.168.31.194:8077",
                // target: 'https://storetest.cdhqht.com',
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
    },
    chainWebpack: (config) => {
        // 指定环境打包js路径
        if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'test') {
            const isLegacyBundle = process.env.VUE_CLI_MODERN_MODE && !process.env.VUE_CLI_MODERN_BUILD
            const filename = getAssetPath(
                assetsDir,
                `js/[name]${isLegacyBundle ? `-legacy` : ``}${filenameHashing ? '.[contenthash:8]' : ''}.js`
            )
            config.mode('production').devtool(productionSourceMap ? 'source-map' : false).output.filename(filename).chunkFilename(filename)
        }
        // 修改图片输出路径
        // config.module.rule('images').test(/\.(png|jpe?g|gif|ico)(\?.*)?$/).use('url-loader').loader('url-loader').options({
        //   name: path.join('../assets/', 'img/[name].[ext]')
        // })
    },

}
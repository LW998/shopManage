module.exports = {
    // 输出文件目录
    outputDir: "dist",
    lintOnSave: false,
    devServer: {
        host: "localhost",
        //运行端口
        port: 8100,
        //是否使用https
        https: false,
        //是否自动打开浏览器
        open: true,
        //proxy跨域代理
        proxy: {
            '/api': {
                target: 'http://localhost:8080/shopManage',
                changeOrigin: true,
                pathRewrite: {
                    '^/api': ''
                }
            }
        }
    },
    configureWebpack: {
        resolve: {
            alias: {
                'vue$': 'vue/dist/vue.esm.js' // 'vue/dist/vue.common.js' for webpack 1
            }
        }
    }
};
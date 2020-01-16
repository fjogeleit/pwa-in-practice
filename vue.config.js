module.exports = {
  transpileDependencies: [
    "vuetify"
  ],
  parallel: false,
  configureWebpack: {
    performance: {
      hints: false
    }
  },
  chainWebpack: config => {
    config.module
      .rule('js')
      .exclude.add(/\.worker\.js$/)
      .end();

    config.module
      .rule('worker')
      .test(/\.worker\.js$/i)
      .use('worker-loader')
      .loader('worker-loader')
      .end();
  },
  pwa: {
    name: "PWA in Practice",
    themeColor: '#424242',
    iconPaths: {
      favicon32: 'img/icons/icon32x32.png',
      favicon16: 'img/icons/icon16x16.png',
      appleTouchIcon: 'img/icons/icon152x152.png',
      maskIcon: 'img/icons/icon192x192.png',
      msTileImage: 'img/icons/icon144x144.png'
    },
    manifestOptions: {
      icons: [
        {
          "src": "/img/icons/icon144x144.png",
          "type": "image/png",
          "sizes": "144x144"
        },
        {
          "src": "/img/icons/icon192x192.png",
          "type": "image/png",
          "sizes": "192x192"
        },
        {
          "src": "/img/icons/icon512x512.png",
          "type": "image/png",
          "sizes": "512x512"
        }
      ],
    },
    workboxPluginMode: 'InjectManifest',
    workboxOptions: {
      swSrc: 'public/service-worker.js',
      exclude: [/\.map$/, /manifest\.json$/]
    }
  }
}
const { defineConfig } = require('@vue/cli-service')
const path = require('path');
module.exports = defineConfig({
  transpileDependencies: true,

  pluginOptions: {
    s3Deploy: {
      registry: undefined,
      awsProfile: 'default',
      overrideEndpoint: false,
      region: 'us-east-1',
      bucket: 'Flashnote_v.1',
      createBucket: true,
      staticHosting: true,
      staticIndexPage: 'index.html',
      staticErrorPage: 'error.html',
      assetPath: 'dist',
      assetMatch: '**',
      deployPath: '/',
      acl: 'private',
      pwa: false,
      enableCloudfront: false,
      pluginVersion: '4.0.0-rc3',
      uploadConcurrency: 5
    }
  }
  transpileDependencies: true,
  outputDir: path.resolve(__dirname, 'dist'),

})

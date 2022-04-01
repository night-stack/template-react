const transform = require('@formatjs/ts-transformer').transform
const path = require('path')
const webpack = require('webpack')
require('dotenv').config()

/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  i18n: {
    locales: ['en', 'id'],
    defaultLocale: 'id',
  },
  webpack5: true,
  env: {
    API_PROTOCOL: process.env.API_PROTOCOL || 'http',
    API_HOST: process.env.API_HOST || 'localhost',
    API_PORT: process.env.API_PORT || '3000',
    API_VERSION: process.env.API_VERSION || '',

    API_IMAGE_PROTOCOL: process.env.API_IMAGE_PROTOCOL || 'http',
    API_IMAGE_HOST: process.env.API_IMAGE_HOST || 'localhost',
    API_IMAGE_PORT: process.env.API_IMAGE_PORT || '3000',
    API_IMAGE_VERSION: process.env.API_IMAGE_VERSION || '',

    REQUEST_TIMEOUT: process.env.REQUEST_TIMEOUT || 10000,
    GOOGLE_ID: process.env.GOOGLE_ID || '',
    FACEBOOK_ID: process.env.FACEBOOK_ID || '',
    NEXT_PUBLIC_GOOGLE_ANALYTICS: process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS || '',
  },
  publicRuntimeConfig: {
    REQUEST_TIMEOUT: process.env.REQUEST_TIMEOUT || 10000,
    API_URL: `${process.env.API_PROTOCOL}://${process.env.API_HOST}${process.env.API_PORT ? `:${process.env.API_PORT}` : ''}${process.env.API_VERSION}`,
    IMAGES_DOMAIN: `${process.env.API_IMAGE_PROTOCOL}://${process.env.API_IMAGE_HOST}${process.env.API_IMAGE_PORT ? `:${process.env.API_IMAGE_PORT}` : ''}${process.env.API_IMAGE_VERSION}`,
    GOOGLE_ID: process.env.GOOGLE_ID || '',
    FACEBOOK_ID: process.env.FACEBOOK_ID || '',
    TIMEZONE_SERVER: process.env.TIMEZONE_SERVER || '',
    GOOGLE_ANALYTICS: process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS || '',
  },

  images: {
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    domains: [
      // '147.139.170.42',
      `${process.env.API_IMAGE_HOST}`,
      'encrypted-tbn0.gstatic.com'
    ],
    path: '/_next/image',
    loader: 'default',
    minimumCacheTTL: 60,
  },
  webpack: config => {
    config.resolve.alias['@/components'] = path.join(__dirname, 'components')
    config.resolve.alias['@/public'] = path.join(__dirname, 'public')
    config.resolve.alias['@/styles'] = path.join(__dirname, 'styles')
    config.resolve.alias['@/constants'] = path.join(__dirname, 'constants')
    config.resolve.alias['@/services'] = path.join(__dirname, 'services')
    config.resolve.extensions = ['.ts', '.tsx', '.js']
    return config
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              getCustomTransformers() {
                return {
                  before: [
                    transform({
                      overrideIdFn: '[sha512:contenthash:base64:6]',
                    }),
                  ],
                }
              },
            },
          },
        ],
      },
    ],
  },
  plugins: [
    // other plugins,
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery'
    }),
  ]
}

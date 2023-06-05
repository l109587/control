module.exports = {
  apiPrefix: '/api/v1', //请求接口
  logout: false,
  fixedHeader: true, // sticky primary layout header
  layouts: [
    {
      name: 'primary',
      include: [/.*/],
      exclude: [/(\/(en|zh))*\/login/],
    },
  ],
  i18n: {
    languages: [
      {
        key: 'zh',
        title: '中文',
        flag: '/china.svg',
      },
    ],
    defaultLanguage: 'zh',
  },
  outputPath:"cc"
}

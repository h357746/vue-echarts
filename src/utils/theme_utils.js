const theme = {
  chalk: {
    // 背景颜色
    backgroundColor: '#161522',
    titleColor: '#ffffff',
    // 左上角Logo图标路径
    logoSrc: 'logo_dark.png',
    // 切换主题按钮的图片路径
    themeSrc: 'qiehuan_dark.png',
    // 页面顶部边框图片
    headerBorderSrc: 'header_border_dark.png'
  },
  vintage: {
    // 背景颜色
    backgroundColor: '#eeeeee',
    titleColor: '#000000',
    // 左上角Logo图标路径
    logoSrc: 'logo_light2.png',
    // 切换主题按钮的图片路径
    themeSrc: 'qiehuan_light.png',
    // 页面顶部边框图片
    headerBorderSrc: 'header_border_light.png'
  }
}

export function getThemeValue (themeName) {
  return theme[themeName]
}

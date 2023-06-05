# WebUI

## 监测器UI


### .env(环境变量文件），
1 设置了关闭自动打开浏览器 
2 默认端口为8000 
3 在局域网能够让其他机器通过ip访问本机)

.eslintignore（主要作用是忽略以下文件的语法检查
表示忽略build目录下类型为js的文件的语法检查）






# WebUI

## 监测器UI

### .env(环境变量文件）

1 设置了项目启动关闭自动打开浏览器 
2 默认端口为8000 
3 在局域网能够让其他机器通过ip访问本机


### .eslintignore

主要作用是忽略以下文件的语法检查
例如src/locales/**/*.js表示忽略locales目录下类型为js的文件的语法检查


### .eslintrc

1 "jsx-a11y/href-no-hash": "off",//表示关闭无障碍辅助功能
2 "no-console": warn,//禁止使用console


### .prettierrc（格式化配置项)

1 "semi": false,    // 使用分号, 默认true
2 "singleQuote": true,   // 使用单引号, 默认false(在jsx中配置无效, 默认都是双引号)
3 "trailingComma": "es5"仅使用多行数组尾后逗号和多行对象尾后逗号


### .prettierignore (未知)



### .stylelintrc.json

1 "declaration-empty-line-before": null, //禁止在声明语句之前有空行。
2 "no-descending-specificity": null // 禁止特异性较低的选择器在特异性较高的选择器之后重写
3 "selector-pseudo-class-no-unknown": null, //不允许未知的伪类选择器。
4 "selector-pseudo-element-colon-notation": null //关闭为适用的伪元素指定单引号或双冒号符号


### jest.config.js

自定义测试接口地址


### manifest.json

用于指定应用的显示名称、图标、应用入口文件地址及需要使用的设备权限等信息。是扩展的配置文件，指明了扩展的各种信息。
1 "name": "MyExtension", // 扩展名称
2 扩展图表及尺寸


### tsconfig.json(ts编译器的配置文件)
"target": "esnext", //指定要使用模块化的规范为esnext,
"module": "ESNext", // 用来指定项目中要使用的库
include 用于表示 ts 管理的文件。exclude用于表示 ts 排除的文件(即不被编译的文件)


### typings.d.ts
为 TypeScript 提供有关用 JavaScript 编写的 API 的类型信息,就是可以在ts中调用js的声明文件

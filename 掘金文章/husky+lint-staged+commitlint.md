---
theme: devui-blue
highlight: atom-one-dark
---

### 概念简介

**husky:** `husky`是一个git钩子管理工具，它可以帮助开发者在git提交代码时自动执行一些操作，例如：`代码格式化`，`代码检查`，`单元测试`等。其工作原理是通过在git仓库中添加钩子脚本来实现的。

**lint-staged:** 针对暂存的git文件运行linters,通过这样，可以确保没有错误进入存储库并强制执行的代码样式。lint运行在整个项目上会很慢，开发者也只想对提交的文件进行lint，所以`lint-staged`内包含一个脚本，该脚本以暂存的文件列表作为参数运行`shell`任务。

**commitlint:** 帮助您的团队遵守提交约定，允许在git历史添加更多语义。例如：`type`, `scope`或`breaking changes`

**stylelint:** 一个强大的`css过滤器`，能够帮助我们避免错误并强制执行约定。


### 开始实战
这里我们用`create-react-app`创建一个项目。

```shell
npx create-react-app my-app
```

#### 1.安装`husky`

**Automatic(推荐)**
`husky-init`是使用husky快速初始化项目的一次性命令。

```js
npx husky-init && npm install        # npm
npx husky-init && yarn               # Yarn 1 
yarn dlx husky-init --yarn2 && yarn  # Yarn 2+ 
pnpm dlx husky-init && pnpm install  # pnpm
```

##### 1.1 生成脚本
运行上面代码成功后会自动在`packjson.json`中添加`prepare`脚本，并在根目录生成一个`.husky`的文件。默认情况下，它将在你提交时运行`npm test`

```json
{
  "scripts": {
    "prepare": "husky install"
  }
}
```
.husky目录结构如下
```
my-app
└───.husky
│   └───pre-commit       
│
└───src
```
pre-commit脚本内容如下：
        
```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# 这里我们先将npm test 改成 npx --no-install lint-staged 
npx --no-install lint-staged 
```
    
##### 1.2 新增husky钩子`commit-msg`
接下来在.husky下添加另外的钩子，请使用`husky add`。

例如：

```shell
npx husky add .husky/commit-msg 'npx --no -- commitlint --edit "$1"'
```
commit-msg脚本内容如下：
```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npx --no -- commitlint --edit "$1"
```

当我们想绕过husky钩子提交时，可以使用Git `-n/--no-verify'
```shell
git commit -m 'first commit' --no-verfiy
```

#### 2.安装`lint-staged`
```shell
npm install --save-dev lint-staged
```


##### 2.1 新增命令
在`package.json`文件中新增`lint-staged`命令
```json
{
  "scripts": {
    "lint-staged": "lint-staged"
  }
}
```

##### 2.2 `lint-staged`配置方式
lint-staged可以通过多种方式配置：

- `lint-staged`配置在`package.json`中
- `.lintstagerc`使用JSON或者YML格式的文件，或者明确使用文件扩展名：
   - `.lintstagerc.json`
   - `.lintstagerc.yaml`
   - `.lintstagerc.yml`
- `.lintstagedrc.mjs`或`lint-staged.config.mjs`ESM格式文件
   - 默认导出值应该是一个配置：`export default { ... }`
- `.lint-staged.config.js`或`.lintstagedrc.js`用于ESM或者CommmonJS格式的，具体取决于package.json里面是否包含`"type":"module"`选项。

在这里，我们以`package.json`文件中配置为例
```json
{
  "lint-staged": {
    "src/**/*.less": "stylelint --syntax less"
  }
}
```

此时，我们在使用`git commit`命令时，就会对暂存区的文件执行`"lint-staged"`里面的命令了。

这个时候项目还未安装`stylelint`，`commit`后会报错。接下来让我们来安装`stylelint`。

#### 3.安装`stylelint`
使用`npm`安装Stylelint和配置：
```shell
npm install --save-dev stylelint stylelint-config-standard-scss
```
这里还有其它不错的配置，根据自己情况选择。比如：`@umijs/fabric/dist/stylelint`

##### 3.1 创建stylelint配置文件
在项目根目录创建一个`.stylelintrc.json`配置文件，内容如下：
```json
{
  "extends": "stylelint-config-standard-scss"
}
```
##### 3.2 运行stylelint
```shell
npx stylelint "**/*.{css,less}"
```
单独运行上面命令或者使用`git commit`提交项目修改的文件。

此时，我们就能看到命令窗口有一些错误：

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dfffc8528f364396af7808155656388c~tplv-k3u1fbpfcp-watermark.image?)

此时，我们可以点击文件路径跳转到相关页面，根据报错信息，逐一修改。

#### 4.添加新命令

这个时候我们完善`package.json`里面`lint-staged`命令为：
```json
  "lint-staged": {
    "**/*.less": "stylelint --syntax less",
    "**/*.{js,jsx,ts,tsx}": "npm run lint-staged:js",
    "**/*.{js,jsx,ts,tsx,less,md,json}": [
      "prettier --write"
    ]
  }
```
`package.json`的`scripts`里新增一条命令：
```json
"lint-staged:js": "eslint --ext .js,.jsx,.ts,.tsx ",
```
上面几个命令是当我们在使用`git`提交暂存代码时，就会执行`lint-staged`里的linters配置，首先使用`stylelint`检查`.less`相关文件。然后在对`.{js,jsx,ts,tsx}`文执行eslint检查。最后在对`.{js,jsx,ts,tsx,md,json}`文件使用`prettier`格式化它们。

完成上面步骤后，就可以对我们暂存区的文件代码进行`代码检查`和`代码美化`了。然后就是`commit`代码，接下来就是接入`commilint`对我们提交的代码信息做规范。

#### 5. 安装`commitlint`

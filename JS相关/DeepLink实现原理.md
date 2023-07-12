### DeepLink(深度链接)

>  一种可以跳转到应用内特定页面的链接方案。

广义上的深度链接包含了DeepLink和Deferred DeepLink，主要触发场景分为两种：

- 已安装目标APP：在H5页面点击链接，就能直接跳转到App内指定页面
- 未安装目标App：在H5页面点击链接，会先跳转应用商城，下载后首次打开App时，将自动跳转指定页面


### DeepLink实现方式
**1. URL Scheme（ios/android都适用）**

URL Scheme是实现DeepLink兼容性最高的一项方法，原生App可以反向操作
工作流程： 用户点击DeepLink时，操作系统提供解析URL Scheme的能力，判断哪个App、是否安装了App, 唤醒App并传递参数

URL Scheme的协议样式如下：

Scheme://host:port/path?query

● Scheme：代表Scheme协议名称，可自定义

● host：代表Scheme作用的地址域

● port：代表该路径的端口号

● path：代表的是想要跳转的指定页面(路径)

● query：代表想要传递的参数

由于涉及到需要打开页面的能力，用于接收从H5传递过来的参数，那么还需要一些配置：

Android：配置Action和category
iOS：原理一致，配置info
工作流程是：当用户点击此类深度链接时—>操作系统提供解析URL Scheme的能力—>判断属于哪个App、是否安装了App—>唤醒App并传递需要的参数。



**2. 进阶版 Universal link（ios9.2及以上使用）**
Universal Link是iOS 9以后苹果推出的通用链接技术，能够方便的通过一个https链接来打开App指定页面，不需要额外的判断；如果没有安装App，则跳转到自定义地址。

相对Scheme的优势在于，Universal Link是一个Web Link，因此少了很多麻烦：

当用户已安装该App时，不需要加载任何页面以及判断提示，能够立即唤醒App，用户未安装App，则跳去对应的web link（自定义页面）。
Universal Links支持从其他App中的UIWebView中跳转到目标App。
绝大多数平台都支持Universal Link，能被搜索引擎索引，iOS微信7.0.5版本也解除了对Universal Link的限制，目前微信7.0.5以上版本已经能流畅运行Universal Link。
在Deeplink的实现方案中，Universal Link相比Scheme无疑具有更优的用户体验，iOS9.2及以上的版本更推荐使用Universal Link唤醒App。

**3. 使用第三方工具openinstall**

openinstall是国内专业的深度链接（Deeplink）技术服务商，在Deeplink实现方案上有五年以上的技术服务经验，开发者仅需三步即可为App实现深度链接（Deeplink）一键唤醒功能：

此项Deeplink一键唤醒服务，在方案细节上包括以下几方面：

在Android拉起方面使用的是scheme，iOS是scheme、Universal Link（通用链接）。
Universal Link只能在iOS系统大于 9.2或以上的设备上使用，9.2以下默认会使用scheme。
iOS在微信上想要正常唤醒App，必须使用通用链接协议(Universal Link)，需要保证微信版本在7.0.5或以上，而且iOS下载设置里面，需要选择AppStore及其他下载选项（里面配置的地址内容不限制）。实现方法集成文档里有详细介绍。
接入openinstall来实现Deeplink，前期的浏览器兼容适配、资源配置、数据匹配等方面都无需花费成本研发，后期系统环境变化导致的技术迭代也完全可以由openinstall跟进，无需人员专门维护，专业的深度链接提供商也能提供更加稳定的服务体验。

openinstall客户常用Deeplink应用场景包括：

教育类App：点击H5页面直达App内对应的直播课页面、课程购买页面。
电商类App：点击H5页面直达App内对应的商品购物页、领券页面。
游戏类App：点击H5页面直达App内对应的游戏对战房间、答题房间。
资讯类App：点击H5页面直达App内对应的资讯、互动页面。
搜索引擎：搜索引擎中收录的文章，点击直达App内对应文章页面。
短信通知：用户点击短信内链接，直达App内对应活动页面。
广告拉新：用户点击信息流广告、营销广告H5，下载后直达对应页面
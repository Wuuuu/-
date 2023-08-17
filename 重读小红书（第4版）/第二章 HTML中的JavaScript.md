### 2.1 \<script\>元素

将JavaScript插入HTML的主要方法是使用\<script\>元素。这个元素是由网景公司创造出来，并最早在Netscape Navigator2中实现的。后来，这个元素被正式加入到HTML规范。\<script\>元素有下列8个属性。

- async： 可选。表示应该立即开始下载脚本，但不能阻止其他页面动作，比如下载资源或等待 其他脚本加载。只对外部脚本文件有效。

- defer：可选。表示脚本可以延迟到文档完全被解析和显示之后在执行。只对外部脚本文件有效。

- charset：可选。使用src属性指定的代码字符集。这个属性很少使用，因为大多数浏览器不在乎他的值。

- crossorigin：可选。配置相关请求的CORS（跨源资源共享）设置。默认不使用CORS。crossorigin="anonymous"配置文件请求不必设置凭据标志。crossorigin="use-credentials"设置凭据标志，意味着出站请求会包含凭据。

- intergrity：可选。允许比对接收到的资源和指定的加密签名以验证子资源完整性。如果接收到的资源的签名与这个属性指定的签名不匹配，则页面会报错，脚本不会执行。这个属性可以用于确保CDN不会提供恶意内容。

- language：废弃。

- src：可选。表示包含要执行的代码的外部文件。

- type：可选。代替language，表示代码块中脚本语言的内容类型。按照惯例，这个值始终都是"text/javascrip"。如果这个值是module，则代码会被当成ES6模块，而且只有这时候代码中才能出现import和export关键字。

  使用\<script\>的方式有两种：通过直接在网页中嵌入JavaScript代码，已经通过在网页中包含外包的JavaScript文件。



#### 2.1.1 标签位置

过去，所有\<script\>元素都被放在页面的<head>标签内，如下面的例子所示：

```html
<!DOCTYPE html> 
<html> 
    <head>
        <title>Example HTML Page</title>
        <script src="example1.js"></script>
        <script src="example1.js"></script>
    </head>
    <body>
        <!-- 这里是页面内容 -->
    </body>
</html>
```

这种做法主要目的是把外部的CSS和JavaScript文件都集中放在一起。不过，把所有JavaScript文件都放在<head>里，也就意味着必须吧所有JavaScript代码都下载、解析和解释完成后，才能开始渲染页面。对于需要很多JavaScript的页面，这会导致页面渲染的明显延迟，在此期间浏览器窗口完全空白。未解决这个问题，现代Web应用程序通常将所有JavaScript引用放在<body>元素中的页面内容后面。

#### 2.1.2 推迟执行脚本

HTML4.0为\<script\>元素定义了一个叫**defer**的属性。这个属性表示脚本在执行的时候不会改变页面的结构。也就是说，脚本会被延迟到整个页面都解析完毕后再运行。因此，在\<script\>元素上设置**defer**属性，相当于告诉浏览器立即下载，但延迟执行。

> **defer**属性在对外部脚本文件才有效。这是HTML5中明确规定的，因此支持HTML5的浏览器会忽略行内脚本的**defer**属性

#### 2.1.3 异步执行脚本

HTML5为\<script\>元素定义了async属性。从改变脚本处理方式上看，**async**和**defer**类似。当然，他们两者都只适用于外部脚本，都会告诉浏览器立即开始下载。不过，与**defer**不同的是，标记为**async**的脚本并不保证能按照它们出现的次序执行。比如：

<!DOCTYPE html> 
<html> 
    <head>
        <title>Example HTML Page</title>
        <script async src="example1.js"></script>
        <script async src="example1.js"></script>
    </head>
    <body>
        <!-- 这里是页面内容 -->
    </body>
</html>

在这个例子中，第二个脚本可能先于第一个脚本执行。因此，重点在于它们之间没有依赖关系。给脚本添加**async**属性的目的是告诉浏览器，不必等脚本下载和执行完后再加载页面，同样也不必等到该异步脚本下载和执行后再加载其他脚本。正因为如此，异步脚本不应该在加载期间修改DOM

#### 2.1.4 动态加载脚本

除了\<script\>标签，还有其他方式加载脚本。因为JavaScript可以使用DOM API，所以通过向DOM中动态添加script元素同样可以加载指定的脚本。只要创建一个script元素并将其添加到DOM即可。

```js
let script = document.createElement('script');
script.srt = 'gibberish.js';
document.head.appendChild(script);
```

在把HTMLElement元素添加到DOM且执行到这段代码之前不会发送请求。默认情况下，以这种方式创建的\<script\>元素是以异步方式加载的，相当于添加了**async**属性。不过，即便所有浏览器都支持createElement()方法，但不是所有浏览器都支持**async**属性。因此，如果要统一动态脚本的加载行为，可以明确设置为同步加载

```JS
script.async = false;
```



### 2.2 行内代码与外部文件

虽然可以直接在HTML中嵌入JS代码，但是通常最佳实践是尽可能将JS代码放在外部文件中。推荐使用外部文件的理由如下。

- 可维护性。 JS代码如果分散到很多HTML页面，会导致维护困难。而且一个目录保存所有JS文件，则更容易维护。
- 缓存。浏览器会根据特定的设置缓存所有外部链接的JS文件，这意味着如果两个页面都会用到同一个文件，则该文件只需下载一次，这最终意味着页面加载更快。
- 适应未来：通过把JS放到外部文件中，就不必考虑用XHTML或前面提到的注释和科技。包含外部JS文件的语法在HTML和XHTML中是一样的。



### 2.3 文档模式

### 2.4 \<noscript\>元素

## 小结

**JavaScript**是通过\<script\>元素插入到HTML页面中的。这个元素用于把JS代码嵌入到HTML页面中，跟其他标记混合在一起，也可用于引入 保存在外部文件中的JS。本章重点可以总结如下。

- 要包含外部JS文件，必须将src属性设置为要包含文件的URL。文件可以跟网页在同一个服务器上，也可以位于完全不同的域。
- 所有\<script\>元素会依照它们在网页中出现的次序被解释。在不使用defer和async属性情况下，包含在\<script\>元素中的代码必须严格按次序解释。
- 对不推迟执行的脚本，浏览器必须解释完全于\<script\>元素中的代码，然后才能继续渲染页面的剩余部分。为此，通常把\<script\>元素放到页面末尾，介于主内容之后 及</body>标签之前。
- 可以使用defer属性把脚本推迟到文档渲染完毕后再执行。推迟的脚本原则上按照他们被列出的次序执行。
- 可以使用async属性表示脚本不需要等待其他脚本，同时也不阻塞文档渲染，即异步加载。异步脚本不能保证按照他们在页面中出现的次序执行。
- 通过使用<noscript>元素，可以指定在浏览器不支持脚本时显示的内容。如果浏览器支持并启用脚本，则<noscript>元素中的任何内容都不会被 渲染。


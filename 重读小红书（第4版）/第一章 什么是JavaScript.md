### **1.1** 历史回顾

**1995年，JavaScript问世。当时主要用途替代Perl等服务器端语言处理输入验证**



### **1.2 JavaScript实现**

虽然JavaScript和ECMAScript基本上是同义词，但JavaScript远远不限于ECMA-262所定义的那样。完整的JavaScript实现包含一下几个部分：

- 核心（ECMAScript）
- 文档对下给你模型（DOM）
- 浏览器对象模型（BOM）

#### 1.2.1 ECMAScript

ECMAScript，即ECMA-262定义的语言，并不局限于Web浏览器。

#### 1.2.2 DOM

**文档对象模型（DOM，Document Object Model）**是一个应用编程接口（API），用于HTML中使用扩展的XML。DOM将整个页面抽象为一组分层节点。HTML或XML页面的每个组成部分都是一种节点，包含不同数据。比如下面HTML页面:

```HTML
<html> 
    <head> 
        <title>Sample Page</title> 
    </head> 
    <body> 
        <p> Hello World!</p>
    </body>
</html>
```

**DOM**通过创建表示文档的树，让开发者可以随心所欲地控制网页的内容和结构。使用**DOM API**可以轻松删除、添加、替换、修改节点。



#### 1.2.3  BOM

IE3和Netscape Navigator 3提供了**浏览器对象模型（BOM）API**，用于支持访问和操作浏览器的窗口。使用BOM，开发者可以操控浏览器显示页面之外的部分。

总体来说，BOM主要针对浏览器窗口和子窗口，不过人们通常会把任何特定于浏览器的扩展都归在BOM的范畴。比如，下面就是这样一些扩展：

- 弹出新浏览器窗口的能力；
- 移动、缩放和关闭浏览器窗口的能力；
- navigator对象，提供关于浏览器的详尽信息；
- location对象，提供浏览器加载页面的详尽信息；
- screen对象，提供关于用户屏幕分辨率的详尽信息；
- performance对象，提供浏览器内存占用、导航行为和时间统计的详尽信息；



## 小结

**JavaScript**是一门用来与网页交互的脚本语言，包含以下三个组成部分。

ECMAScript：由ECMA-262定义提供核心功能。

文档对象模型（DOM）：提供与网页内容交互的方法和接口。

浏览器对象模型（BOM）：提供与浏览器交互的方法和接口。


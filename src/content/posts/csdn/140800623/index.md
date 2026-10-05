---
title: "pycharm的debug模式不会在非断点处抛出异常时暂停"
published: 2024-07-30
description: ''
image: ''
tags: ["工具", "Python"]
category: "技术笔记"
draft: false
lang: 'zh-CN'
---

# 描述
pycharm调试（debug）模式下自动在异常处暂停并允许调试的功能非常好用，可以帮助我们快速定位错误并解决。
但在远程调试的时候，pycharm的debug模式在非断点处碰到异常时会直接退出，无法暂停。有时候虽然能暂停，但会定位到奇怪的地方。
如下图：
![在这里插入图片描述](/images/csdn/8ddcfe128c05379479451cfe.png)
我这里有个除以0的异常，但debug却定位到了其他地方：
![在这里插入图片描述](/images/csdn/c2fddaa25e60e22cfee09a5d.png)
![在这里插入图片描述](/images/csdn/d92a08ac8433bcdc8de21ce0.png)
这种情况非常莫名其妙，且不知道怎么搜索这个问题。
# 解决方案 勾选Gevent兼容
![在这里插入图片描述](/images/csdn/08c1bf65ef1774151e17dd84.png)
**打开Gevent兼容就可以解决。** 如下图：
![在这里插入图片描述](/images/csdn/a30cbeda9d85a2a7a436491d.png)
![在这里插入图片描述](/images/csdn/b337c48637c74d0a711d7bea.png)
设置完后可以定位了。

---

原文链接：[CSDN](https://blog.csdn.net/qq_42464569/article/details/140800623)

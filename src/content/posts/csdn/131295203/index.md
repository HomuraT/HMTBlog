---
title: "stable-diffusion-webui 快捷安装教程"
published: 2023-06-19
description: ''
image: ''
tags: ["计算机视觉", "Python", "工具"]
category: "技术笔记"
draft: false
lang: 'zh-CN'
---

# 简介
stable-diffusion-webui 是一个用来装载Stable Diffusion 模型的网页，可以方便的调用模型生成图片。
stable-diffusion-webui的github地址为：[https://github.com/AUTOMATIC1111/stable-diffusion-webui](https://github.com/AUTOMATIC1111/stable-diffusion-webui)
这个库的依赖很多，虽然代码里面有写安装依赖库的代码，但几乎都是国外资源，在国内网络环境下很难下载而出现代码报错。

本文将几乎所有需要的依赖下载到了本地，且将里面一些安装的链接改成了国内源，因此可以更方便的安装。

【注意】：这个教程的环境是linux，windows环境可以去找一些懒人包
# 步骤
代码文件百度云链接为：链接：[https://pan.baidu.com/s/1cvPzMTtb_nqMZFbPuieFRw?pwd=d6ln](https://pan.baidu.com/s/1cvPzMTtb_nqMZFbPuieFRw?pwd=d6ln) 提取码：d6ln 
这个文件有500M里面包含了很多依赖库及其原版压缩包，压缩包部分可以自行删除。

解压后进入主目录，然后按照顺序执行下面的代码：
```
conda create -n sdw python=3.10
conda activate sdw

cd ./repositories/k-diffusion
pip install -r requirements.txt -i https://pypi.tuna.tsinghua.edu.cn/simple
python setup.py build install # 会报错，但好像没问题

cd ../../hmt_install
pip install tb-nightly -i https://pypi.mirrors.ustc.edu.cn/simple/
pip install GFPGAN-master.zip -i https://pypi.tuna.tsinghua.edu.cn/simple
pip install CLIP-main.zip -i https://pypi.tuna.tsinghua.edu.cn/simple
pip install open_clip-main.zip -i https://pypi.tuna.tsinghua.edu.cn/simple
pip install xformers -i https://pypi.tuna.tsinghua.edu.cn/simple
pip install torchvision -i https://pypi.tuna.tsinghua.edu.cn/simple
pip install ngrok -i https://pypi.tuna.tsinghua.edu.cn/simple

cd ../
python launch.py # 这个会安装一些依赖库，不要直接用 webui.py
等待
Installing requirements for CodeFormer
Installing requirements

python webui.py --no-half-vae # 执行完 launch.py 后，可以用这个命令启动
```
# 运行结果
![在这里插入图片描述](/images/csdn/83c1d055ddb03f9edde04020.png)

这里面会有一些错误，但好像生成过程没问题，如果看到这里的人有谁知道怎么解决里面的问题可以评论区说一下是（￣︶￣）↗　

![在这里插入图片描述](/images/csdn/6aa0f8deb17856a163ff505e.png)
有这个就说明启动成功。

# 界面
![在这里插入图片描述](/images/csdn/5373a4b51de381e70127e9d7.png)
# 一些其他资源
【注意】：模型权重要自己去下载，然后放到
```
models/Stable-diffusion/
```
这个路径里

- 整合包（与本文的方法不一样）：https://www.bilibili.com/video/BV1iM4y1y7oA/
- 模型分享：https://www.bilibili.com/video/BV1em4y1z7Dg/
- 一些教程：https://www.bilibili.com/read/cv21362202

# 模型选择
![在这里插入图片描述](/images/csdn/3b6af8521230787c3bafeb32.png)
左上角可以选择模型。

---

原文链接：[CSDN](https://blog.csdn.net/qq_42464569/article/details/131295203)

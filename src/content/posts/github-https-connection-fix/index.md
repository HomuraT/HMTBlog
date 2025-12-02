---
title: GitHub HTTPS 连接问题解决方案
published: 2025-12-01
description: '解决服务器上 SSH 可以连接 GitHub 但 HTTPS 连接失败的问题，通过修改 hosts 文件指向可用 IP 地址'
image: ''
tags: ['GitHub', 'Git', '网络问题', 'Linux']
category: '技术笔记'
draft: false 
lang: 'zh-CN'
---

在服务器运维过程中，有时会遇到 SSH 可以正常连接 GitHub，但使用 HTTPS 协议克隆仓库时却连接超时的问题。本文记录了这个问题的原因分析和解决方案。

## 问题现象

在服务器上使用 HTTPS 协议克隆 GitHub 仓库时，连接超时：

```bash
git clone https://github.com/xxx/xxx.git
# 报错：Failed to connect to github.com port 443 after xxxxx ms: Connection timed out
```

而使用 SSH 协议则可以正常工作。这种情况通常让人感到困惑，因为 SSH 能通，说明网络本身是可以连接到 GitHub 的。

## 问题原因

经过排查发现，问题的根源在于：**DNS 解析到的 GitHub IP 地址的 443 端口被阻断了**。

虽然 GitHub 有多个 IP 地址，但由于网络环境、地理位置或 DNS 解析策略的不同，不同服务器解析到的 IP 地址可能不同。当解析到的某个 IP 的 443 端口不可达时，就会出现 HTTPS 连接失败的情况。

## 解决方案

### 步骤 1：找到可用的 IP 地址

首先，我们需要在**能够正常访问 GitHub 的服务器**上查询 GitHub 的 IP 地址：

```bash
ping -c 1 github.com
```

记录返回的 IP 地址。例如，输出可能是：

```
PING github.com (20.205.243.166) 56(84) bytes of data.
64 bytes from 20.205.243.166: icmp_seq=1 ttl=112 time=5.23 ms
```

这里的 IP 地址 `20.205.243.166` 就是我们需要的可用 IP。

### 步骤 2：修改 hosts 文件

在出现问题的服务器上，编辑 `/etc/hosts` 文件：

```bash
sudo vim /etc/hosts
```

在文件末尾添加以下内容（使用你在步骤 1 中获取的 IP 地址）：

```
20.205.243.166 github.com
```

保存并退出编辑器。

### 步骤 3：验证修复结果

修改完成后，进行验证：

```bash
# 测试 HTTPS 连接
curl -v https://github.com

# 尝试克隆仓库
git clone https://github.com/xxx/xxx.git
```

如果一切正常，应该可以成功连接和克隆了。

## 实际案例分析

在我遇到的实际案例中：

- **问题服务器**：DNS 解析到 `140.82.114.4`，测试发现该 IP 的 443 端口不通
- **正常服务器**：DNS 解析到 `20.205.243.166`（亚洲节点），可以正常访问
- **解决方法**：在问题服务器的 hosts 文件中添加 `20.205.243.166 github.com`
- **结果**：HTTPS 连接恢复正常，可以顺利克隆仓库
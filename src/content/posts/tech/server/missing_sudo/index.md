---
title: Sudo 误删/权限丢失后的不重启救援指南
published: 2026-02-13
description: '记录一次服务器 sudo 权限意外丢失后的紧急救援过程，利用 Docker 挂载宿主机根目录进行提权修复。'
image: ''
tags: [Linux, Docker, 服务器维护]
category: Tech
draft: false 
lang: ''
---

# 问题根源

当 `/usr/bin/sudo` 的所有者被误改为普通用户（如 `renlin`）时，Linux 为了安全，自动剥夺了 sudo 的 SUID 特权位（那个 `s` 权限）。

正常情况下，sudo 的权限应该是：
```
-rwsr-xr-x 1 root root ... /usr/bin/sudo
```

但现在变成了：
```
-rwxr-xr-x 1 renlin root ... /usr/bin/sudo
```

注意两个致命问题：
1. 所有者从 `root` 变成了 `renlin`
2. 权限从 `rws`（有 SUID）变成了 `rwx`（无特权）

你陷入了一个死循环：要修 sudo 需要用 sudo 命令，但 sudo 坏了所以你用不了 sudo。

# 利用 Docker 提权修复

**原理**：Docker 守护进程是 Root 运行的。如果你能运行 docker 容器，你就可以把宿主机的根目录挂载到容器里，然后在容器里修改宿主机文件的权限。

## 第一步：使用 Docker 修复 sudo 权限

执行这条命令，它会启动一个容器，挂载你的硬盘，并修复 sudo 的权限：

```bash
docker run -v /:/mnt --rm -it alpine sh -c "chmod 4755 /mnt/usr/bin/sudo && chown root:root /mnt/usr/bin/sudo"
```

## 第二步：验证 sudo

Docker 命令跑完后，立刻在当前终端验证：

```bash
sudo ls
```

如果提示输入密码并成功列出文件，说明 sudo 活了！

## 第三步：重装核心包（彻底修复）

现在 sudo 能用了，立刻用系统自带的安装命令，把那些坏掉的 ping、su、mount 全都重装一遍。系统会自动把它们修复到完美状态：

```bash
sudo apt-get update
sudo apt-get install --reinstall --allow-downgrades sudo passwd mount iputils-ping util-linux policykit-1 cron fuse3 login
```

# 最终验收（4 步验证）

为了确保万无一失，请按照以下 4 个步骤进行最终验收。如果这 4 步全过，你就彻底安全了。

## ✅ 第 1 步：验证 sudo 功能

最关键的一步。如果没有这个，别的都免谈。

```bash
sudo id
```

**合格标准：**
输出必须包含 `uid=0(root)`。

- 如果系统问你要密码，并且输完密码后显示了 root 信息，通过！
- 如果报错 `setuid` 相关错误，说明没修好。

## ✅ 第 2 步：验证 SUID 权限

检查关键系统命令的 SUID 特权位是否恢复。

```bash
ls -l /usr/bin/sudo /usr/bin/passwd /usr/bin/ping /usr/bin/mount /usr/bin/su /usr/bin/newgrp
```

**合格标准：**
仔细看每一行的权限部分（最左边一串字符）。**必须** 看到 **`rws`**（注意是小写的 **s**，且通常是红色的）。

例如：
```
-rwsr-xr-x 1 root root ... /usr/bin/sudo
-rwsr-xr-x 1 root root ... /usr/bin/ping
```

- 如果有 `s`，通过！
- 如果是 `x` (如 `-rwxr-xr-x`)，说明特权没加上，功能受限。

## ✅ 第 3 步：验证 ping 命令

回到最开始导致你发现问题的命令。

```bash
ping -c 3 www.baidu.com
```

**合格标准：**

- 输出类似 `64 bytes from ...`，通过！
- 如果报错 `socket: Operation not permitted`，说明 `ping` 的 SUID 没修好。

## ✅ 第 4 步：验证文件所有权

确认 `/usr/bin` 目录下确实没有任何文件属于 `renlin` 了。

```bash
find /usr/bin -user renlin
```

**合格标准：**

- **没有任何输出**（直接跳到下一行命令提示符），通过！
- 如果还有输出文件名，说明还有漏网之鱼（通常是软链接，可以用 `sudo chown -h root:root ...` 修复）。

# 惨痛教训

以后永远、永远不要执行 `chown -R 用户名 /usr` 或 `chown -R 用户名 /bin`。

Linux 的系统目录（/usr, /bin, /sbin, /etc, /lib）必须严格属于 root，一旦改了，系统防御机制就会自动"自爆"（剥夺特权）。

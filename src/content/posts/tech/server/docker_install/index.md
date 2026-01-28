---
title: 服务器docker安装
published: 2026-01-27
description: 'Ubuntu/Debian 系统 Docker 安装配置完整指南（国内镜像源）'
image: ''
tags: ['Linux', '服务器维护']
category: '技术笔记'
draft: false 
lang: ''
---


# 安装前准备

## 更新系统并安装依赖

```bash
sudo apt-get update

sudo apt-get install -y \
    ca-certificates \
    curl \
    gnupg \
    lsb-release
```

## 创建密钥目录

```bash
sudo mkdir -p /etc/apt/keyrings
```

---

# Docker 安装

> **注意**：国内网络环境下无法直接访问 Docker 官方源，需使用国内镜像源（如阿里云）。

## 1. 清理旧的残留文件（可选）

如果之前安装失败过，先清理：

```bash
sudo rm -f /etc/apt/keyrings/docker.gpg
sudo rm -f /etc/apt/sources.list.d/docker.list
```

## 2. 下载 GPG 密钥（阿里云镜像）

```bash
curl -fsSL https://mirrors.aliyun.com/docker-ce/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
```

## 3. 添加软件源（阿里云镜像）

```bash
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://mirrors.aliyun.com/docker-ce/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
```

## 4. 更新软件列表

```bash
sudo apt-get update
```

## 5. 安装 Docker Engine

```bash
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

## 6. 验证安装

```bash
docker --version

sudo docker run hello-world
```

看到 "Hello from Docker!" 说明安装成功。

---

# 权限配置

## 添加用户到 docker 组（推荐）

```bash
# 创建 docker 组（通常已自动创建）
sudo groupadd docker

# 将当前用户添加到 docker 组
sudo usermod -aG docker $USER
```

## 激活权限

权限修改后需要重新登录：

```bash
# 方法1：激活新组设置（当前会话临时生效）
newgrp docker

# 方法2：重新登录 SSH

# 方法3：重启系统（最可靠）
sudo reboot 
```

## 验证权限

```bash
# 查看当前用户所属组
groups

# 测试（无需 sudo）
docker run hello-world
```

---

# 服务管理

## 启停服务

```bash
# 启动
sudo systemctl start docker

# 停止
sudo systemctl stop docker

# 重启
sudo systemctl restart docker

# 查看状态
sudo systemctl status docker
```

## 开机自启

```bash
# 启用
sudo systemctl enable docker

# 禁用
sudo systemctl disable docker
```

---

# 镜像加速配置

国内拉取镜像较慢，建议配置镜像加速器。

## 创建配置文件

```bash
sudo mkdir -p /etc/docker

sudo tee /etc/docker/daemon.json > /dev/null <<EOF
{
  "registry-mirrors": [
    "https://docker.mirrors.ustc.edu.cn",
    "https://hub-mirror.c.163.com",
    "https://mirror.ccs.tencentyun.com"
  ],
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "100m",
    "max-file": "3"
  }
}
EOF
```

## 应用配置

```bash
sudo systemctl daemon-reload
sudo systemctl restart docker
```

## 验证配置

```bash
docker info | grep -A 5 "Registry Mirrors"
```

---

# 常用命令速查

## 镜像操作

```bash
docker pull nginx:latest      # 拉取镜像
docker images                  # 查看本地镜像
docker rmi nginx:latest        # 删除镜像
docker build -t myapp:v1 .     # 构建镜像
```

## 容器操作

```bash
docker run -d --name web nginx             # 后台运行
docker run -it ubuntu /bin/bash            # 交互式运行
docker ps                                   # 查看运行中容器
docker ps -a                                # 查看所有容器
docker stop web                             # 停止容器
docker start web                            # 启动容器
docker rm web                               # 删除容器
docker exec -it web /bin/bash              # 进入容器
docker logs web                             # 查看日志
docker logs -f web                          # 实时查看日志
```

## 系统清理

```bash
docker system df                # 查看磁盘占用
docker system prune             # 清理未使用资源
docker system prune -a          # 清理所有未使用资源（含镜像）
docker volume prune             # 清理未使用卷
```

---

# 常见问题

## 权限不足

```
Got permission denied while trying to connect to the Docker daemon socket
```

**解决**：确认用户已加入 docker 组并重新登录。

## 镜像下载慢

**解决**：配置国内镜像加速器（见上文）。

## 服务无法启动

```bash
# 查看详细错误
sudo journalctl -xu docker.service

# 检查配置文件语法
sudo dockerd --validate
```

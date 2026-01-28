---
title: 服务器配置
published: 2026-01-27
description: ''
image: ''
tags: ['Linux', '服务器维护']
category: '技术笔记'
draft: false 
lang: ''
---

# 修改登录密码
如果你已经登录，想要修改自己的密码，只需在终端输入：
```bash
sudo passwd user
```

# 开启ssh连接功能
## 安装openssh
- Ubuntu / Debian:
```bash
sudo apt update
sudo apt install openssh-server
```

- CentOS / RHEL / Fedora:
```bash
sudo yum install openssh-server
```

## 启动并启用ssh服务
```bash
# 启动 SSH 服务
sudo systemctl start sshd

# 设置开机自启（防止重启后无法连接）
sudo systemctl enable sshd

# 再次确认状态（应显示 active (running)）
sudo systemctl status sshd
```
如果提示没有对应服务，可以尝试运行ssh（而非sshd）：
```bash
sudo systemctl enable --now ssh
sudo systemctl status ssh
```
## 验证服务状态
```bash
# 检查服务状态（应显示 active (running)）
sudo systemctl status ssh

# 检查端口监听（应看到 22 端口被 sshd 占用）
ss -ltn | grep 22
```

# 创建新用户（将数据盘设置为默认home路径）
```bash
# 1. 首先创建家目录基础路径（如果不存在）
sudo mkdir -p /mnt/data/home

# 2 修改访问权限
sudo chmod 755 /mnt/data

# 3. 创建用户并指定家目录
sudo useradd -m -d /mnt/data/home/<username> -s /bin/bash <username>

# 4. 设置用户密码
sudo passwd <username>
```

## （可选）将用户添加到sudo组

如果需要该用户有管理员权限：

```bash
sudo usermod -aG sudo <username>
```
## 验证用户创建成功
```bash
# 查看用户信息（包括家目录位置）
id <username>
getent passwd <username>

# 查看用户家目录
ls -la /mnt/data/home/<username>

# 切换到新用户测试
su - <username>

# 查看当前路径（应该是用户家目录）
pwd

# 退出
exit
```
## （可选）迁移已有用户的家目录

如果用户已经创建在默认位置，需要迁移：

```bash
# 1. 创建新的家目录位置
sudo mkdir -p /mnt/data/home

# 2. 复制现有家目录内容
sudo rsync -av /home/<username>/ /mnt/data/home/<username>/

# 3. 修改用户的家目录配置
sudo usermod -d /mnt/data/home/<username> <username>

# 4. 验证修改
getent passwd <username>

# 5. 测试登录
su - <username>
pwd  # 应该显示 /mnt/data/home/username

# 6. 确认无误后，删除旧的家目录（谨慎操作！）
# sudo rm -rf /home/<username>
```

# 生成ssh密钥对
## 1. 在Ubuntu服务器上生成密钥对

切换到新创建的用户，然后生成密钥：

```bash
# 切换到新用户
sudo su - username

# 创建.ssh目录
mkdir -p ~/.ssh
chmod 700 ~/.ssh

# 生成密钥对（不设置密码短语，直接回车）
ssh-keygen -t ed25519 -f ~/.ssh/id_ed25519 -C "username@server" -N ""

# 或生成RSA密钥
ssh-keygen -t rsa -b 4096 -f ~/.ssh/id_rsa -C "username@server" -N ""

# 将公钥添加到授权文件
cat ~/.ssh/id_ed25519.pub >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys

# 查看生成的文件
ls -la ~/.ssh/
```

## 2. 查看并保存私钥

```bash
# 显示私钥内容（需要发送给用户）
cat ~/.ssh/id_ed25519

# 或者直接将私钥复制到可下载的位置
sudo cp ~/.ssh/id_ed25519 /tmp/username_private_key
sudo chmod 644 /tmp/username_private_key

# 如果使用了自定义家目录，使用完整路径
# sudo cat /mnt/data1/home/username/.ssh/id_ed25519
# sudo cp /mnt/data1/home/username/.ssh/id_ed25519 /tmp/username_private_key
```

## 3. 将私钥传递给用户

```bash
# 在服务器上显示
cat /tmp/username_private_key
```

**⚠️ 安全提示：**
- 传递完私钥后，立即删除临时文件：`sudo rm /tmp/username_private_key`
- 建议通过加密通道（如加密邮件、1Password、LastPass）发送私钥
- 提醒用户妥善保管私钥，不要泄露

## 快速创建脚本
```bash
#!/bin/bash

# 快速创建用户脚本
# 用法: ./create_user.sh username

# 配置变量
BASE_HOME_DIR="/mnt/data/home"

# 检查是否提供了用户名参数
if [ -z "$1" ]; then
    echo "错误：请提供用户名"
    echo "用法: $0 username"
    exit 1
fi

USERNAME=$1
PASSWORD=$1
HOME_DIR="$BASE_HOME_DIR/$USERNAME"
# 动态获取服务器IP地址（优先使用默认路由的源IP，否则使用hostname -I）
SERVER_IP=$(ip route get 1.1.1.1 2>/dev/null | awk '{print $7; exit}' || hostname -I | awk '{print $1}' || echo "127.0.0.1")

# 检查是否以root权限运行
if [ "$EUID" -ne 0 ]; then 
    echo "错误：请使用sudo运行此脚本"
    exit 1
fi

# 检查用户是否已存在
if id "$USERNAME" &>/dev/null; then
    echo "错误：用户 $USERNAME 已存在"
    exit 1
fi

# 创建家目录基础路径
mkdir -p "$BASE_HOME_DIR"

# 创建用户并指定家目录
useradd -m -d "$HOME_DIR" -s /bin/bash "$USERNAME"

# 设置密码（密码与用户名相同）
echo "$USERNAME:$PASSWORD" | chpasswd

# 切换到新用户并创建SSH密钥
su - "$USERNAME" << 'EOF'
mkdir -p ~/.ssh
chmod 700 ~/.ssh
ssh-keygen -t ed25519 -f ~/.ssh/id_ed25519 -C "$USERNAME@server" -N ""
cat ~/.ssh/id_ed25519.pub >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
EOF

# 获取私钥内容
PRIVATE_KEY=$(cat "$HOME_DIR/.ssh/id_ed25519")

# 输出结果
echo ""
echo "======================================"
echo "用户创建成功！"
echo "======================================"
echo ""
echo "服务器IP：$SERVER_IP"
echo "账号：$USERNAME"
echo "密码：$PASSWORD"
echo ""
echo "======================================"
echo "私钥内容（保存为文件后需修改权限）："
echo "======================================"
echo "$PRIVATE_KEY"
echo "======================================"
echo ""
echo "【Windows 用户】保存私钥后，在 PowerShell 中执行以下命令修复权限："
echo '（将 <密钥路径> 替换为实际路径，如 C:\Users\你的用户名\.ssh\id_ed25519）'
echo ""
echo 'icacls "<密钥路径>" /inheritance:r'
echo 'icacls "<密钥路径>" /grant:r "$env:UserName:F"'
echo ""
echo "【Linux/macOS 用户】保存私钥后执行："
echo 'chmod 600 <密钥路径>'
echo ""
echo "======================================"
```

# 取消账号密码连接
要只允许密钥连接并关闭密码登录，你需要修改 SSH 服务端的主配置文件 `/etc/ssh/sshd_config`。

⚠️ **极重要警告**： 在执行下面操作之前，请务必确认你已经配置好了 SSH 公钥/私钥，并且当前已经能够使用密钥成功登录。 如果你还没有配置好密钥就关闭了密码登录，你将被锁在服务器外面，无法远程连接！

## 1. 编辑 SSH 配置文件
```bash
sudo vim /etc/ssh/sshd_config
```

## 2. 修改关键参数
在文件中找到以下参数并进行修改（如果找不到，可以在文件末尾添加）。

**必须修改项**： 找到 PasswordAuthentication，将其改为 no：
```bash
PasswordAuthentication no
```
**检查确认项**： 确保公钥验证是开启的（通常默认是开启的，但最好检查一下）：
```bash
PubkeyAuthentication yes
```

## 3. 检查语法是否正确
为了防止配置文件写错导致 SSH 服务启动失败，先运行测试命令：

```bash
sudo sshd -t
```
- 如果不显示任何输出，说明配置文件语法正确。
- 如果报错，请重新打开文件检查拼写。

## 4. 重启 SSH 服务
使配置生效：
```bash
sudo systemctl restart ssh
```
(注意：在某些发行版中，服务名可能是 `sshd`，命令为 `sudo systemctl restart sshd`)

# 密钥权限修改
```bash
# 1. 禁用权限继承并删除所有已继承的权限
icacls "D:\Archive\Passkey\Pro6000\Pro6000" /inheritance:r

# 2. 为当前用户添加显式的“完全控制”权限
# 注意：$env:UserName 会自动获取你当前的用户名
icacls "D:\Archive\Passkey\Pro6000\Pro6000" /grant:r "${env:UserName}:F"
```
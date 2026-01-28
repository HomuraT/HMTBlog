---
title: 服务器登录公告配置
published: 2026-01-28
description: ''
image: ''
tags: ['Linux', '服务器维护']
category: '技术笔记'
draft: false 
lang: ''
---

# 登录通知类型说明
Linux系统中有三种主要的登录通知：

| 通知类型 | 显示时机 | 配置文件 | 说明 |
|---------|---------|---------|------|
| **Banner** | 登录前（输入密码前） | `/etc/ssh/sshd_config` | 法律声明、警告信息 |
| **MOTD** | 登录后 | `/etc/motd` 或 `/etc/update-motd.d/` | 欢迎消息、系统信息 |
| **Last Login** | 登录后 | SSH配置 | 上次登录时间和IP |

# 第一部分：配置登录前横幅（Banner）
## 1. 创建横幅文件
```bash
# 创建横幅文件
sudo nano /etc/ssh/banner
```
## 2. 添加横幅内容
```
###############################################################################
#                                                                             #
#                           🚀 欢迎访问服务器                                  #
#                                                                             #
#  警告：本系统仅供授权用户使用！                                                #
#  所有活动将被记录和监控。                                                     #
#  未经授权的访问将被追究法律责任。                                              #
#                                                                             #
###############################################################################
```

## 3. 配置SSH使用横幅
```bash
# 编辑SSH配置
sudo nano /etc/ssh/sshd_config
```

找到 `Banner` 配置行并修改：

```
# 启用横幅
Banner /etc/ssh/banner
```

## 4. 重启SSH服务
```bash
sudo systemctl restart ssh
```

## 5. 测试横幅显示
```bash
ssh username@服务器IP
```

# 第二部分：配置登录后欢迎消息（MOTD）
Ubuntu系统使用**动态MOTD**系统，通过脚本生成消息。
## 方法一：使用静态MOTD（简单）
### 1. 禁用动态MOTD

```bash
# 备份现有配置
sudo cp /etc/pam.d/sshd /etc/pam.d/sshd.backup

# 编辑PAM配置
sudo nano /etc/pam.d/sshd
```

注释掉这两行（在行首添加 `#`）：

```
# session    optional     pam_motd.so  motd=/run/motd.dynamic
# session    optional     pam_motd.so noupdate
```

### 2. 创建静态MOTD

```bash
sudo nano /etc/motd
```

添加自定义消息：

```
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║               🎉 欢迎登录 Ubuntu 服务器！                      ║
║                                                              ║
║  服务器名称：Production Server                                ║
║  系统版本：Ubuntu 22.04 LTS                                   ║
║  维护联系：admin@example.com                                  ║
║                                                              ║
║  📚 文档：https://wiki.example.com                           ║
║  🔧 工单：https://tickets.example.com                        ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
```

### 3. 设置文件权限

```bash
sudo chmod 644 /etc/motd
```
## 方法二：自定义动态MOTD脚本（推荐）
动态MOTD可以显示实时系统信息。

### 1. 了解动态MOTD脚本位置

```bash
# 查看现有脚本
ls -la /etc/update-motd.d/
```

脚本按数字顺序执行：
- `00-header` - 系统信息头
- `10-help-text` - 帮助信息
- `50-motd-news` - Ubuntu新闻
- `80-livepatch` - Livepatch状态
- `90-updates-available` - 可用更新
- `91-release-upgrade` - 版本升级提示
- `95-hwe-eol` - 硬件支持提示

### 2. 禁用不需要的脚本

```bash
# 禁用Ubuntu新闻
sudo chmod -x /etc/update-motd.d/50-motd-news

# 禁用Livepatch提示
sudo chmod -x /etc/update-motd.d/80-livepatch

# 禁用释放升级提示
sudo chmod -x /etc/update-motd.d/91-release-upgrade

# 禁用所有默认脚本（如果要完全自定义）
sudo chmod -x /etc/update-motd.d/*
```

### 3. 创建自定义欢迎脚本

```bash
sudo nano /etc/update-motd.d/01-custom-banner
```

添加以下内容：

```bash
#!/bin/bash

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${GREEN}"
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║                                                              ║"
echo "║               🚀 欢迎登录 Ubuntu 服务器                      ║"
echo "║                                                              ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# 显示系统信息
echo -e "${BLUE}📊 系统信息：${NC}"
echo "  ├─ 主机名：$(hostname)"
echo "  ├─ 内核版本：$(uname -r)"
echo "  ├─ 运行时间：$(uptime -p)"
echo "  ├─ 系统负载：$(uptime | awk -F'load average:' '{print $2}')"
echo ""

# 显示磁盘使用情况
echo -e "${BLUE}💾 磁盘使用：${NC}"
df -h | grep -E '^/dev/' | awk '{printf "  ├─ %s: %s / %s (%s)\n", $6, $3, $2, $5}'
echo ""

# 显示内存使用
echo -e "${BLUE}🧠 内存使用：${NC}"
free -h | grep Mem | awk '{printf "  ├─ 已用: %s / %s\n", $3, $2}'
echo ""

# 显示登录用户
echo -e "${BLUE}👥 当前在线用户：${NC}"
who | awk '{printf "  ├─ %s (来自 %s)\n", $1, $5}' | sed 's/[()]//g'
echo ""

# 显示重要提示
echo -e "${YELLOW}⚠️  提示：${NC}"
echo "  ├─ 请勿在生产环境进行未经测试的操作"
echo "  ├─ 所有操作将被记录"
echo "  └─ 遇到问题请联系：admin@example.com"
echo ""
```

### 4. 设置脚本权限

```bash
sudo chmod +x /etc/update-motd.d/01-custom-banner
```

### 5. 测试MOTD

```bash
# 手动运行MOTD脚本查看效果
sudo run-parts /etc/update-motd.d/

# 或者重新登录查看
```

## 方法三：创建极简版MOTD

如果只想显示简单的欢迎消息：

```bash
# 禁用所有动态脚本
sudo chmod -x /etc/update-motd.d/*

# 创建简单的欢迎脚本
sudo nano /etc/update-motd.d/00-header
```

添加内容：

```bash
#!/bin/bash
echo ""
echo "🎉 欢迎登录 $(hostname)"
echo "📅 当前时间：$(date '+%Y-%m-%d %H:%M:%S')"
echo ""
```

设置权限：

```bash
sudo chmod +x /etc/update-motd.d/00-header
```

# 第三部分：配置Last Login信息

## 1. 禁用Last Login提示

```bash
# 编辑SSH配置
sudo nano /etc/ssh/sshd_config
```

添加或修改：

```
# 禁用最后登录信息
PrintLastLog no
```

## 2. 重启SSH服务

```bash
sudo systemctl restart ssh
```

# 第四部分：高级自定义示例
## 示例1：带系统监控的MOTD

```bash
sudo nano /etc/update-motd.d/10-system-info
```

```bash
#!/bin/bash

# 获取系统信息
HOSTNAME=$(hostname)
UPTIME=$(uptime -p | sed 's/up //')
LOAD=$(cat /proc/loadavg | awk '{print $1, $2, $3}')
MEMORY=$(free -m | awk 'NR==2{printf "%.2f%%", $3*100/$2 }')
DISK=$(df -h / | awk 'NR==2{print $5}')
USERS=$(who | wc -l)

# 显示信息
cat << EOF

┌─────────────────────────────────────────────────────┐
│           系统状态监控 - $(date '+%Y-%m-%d %H:%M')        
├─────────────────────────────────────────────────────┤
│ 主机名称: $HOSTNAME
│ 运行时间: $UPTIME
│ 系统负载: $LOAD
│ 内存使用: $MEMORY
│ 磁盘使用: $DISK
│ 在线用户: $USERS
└─────────────────────────────────────────────────────┘

EOF
```

```bash
sudo chmod +x /etc/update-motd.d/10-system-info
```

## 示例2：带安全提示的MOTD

```bash
sudo nano /etc/update-motd.d/20-security-info
```

```bash
#!/bin/bash

# 检查可用更新
UPDATES=$(apt list --upgradable 2>/dev/null | grep -c upgradable)
SECURITY=$(apt list --upgradable 2>/dev/null | grep -i security | wc -l)

# 检查重启需求
REBOOT_REQUIRED=""
if [ -f /var/run/reboot-required ]; then
    REBOOT_REQUIRED="⚠️  需要重启系统"
fi

# 显示信息
cat << EOF
📦 系统更新状态：
  ├─ 可用更新：$UPDATES 个
  ├─ 安全更新：$SECURITY 个
  └─ $REBOOT_REQUIRED

EOF
```

```bash
sudo chmod +x /etc/update-motd.d/20-security-info
```

## 示例3：带Docker状态的MOTD

如果服务器运行Docker：

```bash
sudo nano /etc/update-motd.d/30-docker-info
```

```bash
#!/bin/bash

# 检查Docker是否安装
if command -v docker &> /dev/null; then
    CONTAINERS=$(docker ps -q | wc -l)
    IMAGES=$(docker images -q | wc -l)
    
    cat << EOF
🐳 Docker 状态：
  ├─ 运行中的容器：$CONTAINERS
  └─ 镜像数量：$IMAGES

EOF
fi
```

```bash
sudo chmod +x /etc/update-motd.d/30-docker-info
```

# 第五部分：完整配置示例

## 推荐的完整配置

```bash
# 1. 禁用所有默认脚本
sudo chmod -x /etc/update-motd.d/*

# 2. 创建自定义头部
sudo nano /etc/update-motd.d/00-header
```

```bash
#!/bin/bash
echo ""
echo -e "\033[0;32m╔═══════════════════════════════════════════╗\033[0m"
echo -e "\033[0;32m║     🚀 欢迎登录生产环境服务器              ║\033[0m"
echo -e "\033[0;32m╚═══════════════════════════════════════════╝\033[0m"
echo ""
```

```bash
# 3. 创建系统信息脚本
sudo nano /etc/update-motd.d/10-sysinfo
```

```bash
#!/bin/bash

HOSTNAME=$(hostname)
KERNEL=$(uname -r)
UPTIME=$(uptime -p | sed 's/up //')
LOAD=$(cat /proc/loadavg | awk '{print $1, $2, $3}')

echo "📊 系统信息："
echo "  ├─ 主机: $HOSTNAME"
echo "  ├─ 内核: $KERNEL"
echo "  ├─ 运行时间: $UPTIME"
echo "  └─ 负载: $LOAD"
echo ""
```

```bash
# 4. 创建资源使用脚本
sudo nano /etc/update-motd.d/20-resources
```

```bash
#!/bin/bash

# 内存
MEMORY=$(free -h | awk 'NR==2{printf "%s/%s (%.2f%%)", $3, $2, $3*100/$2}')

# 磁盘
DISK=$(df -h / | awk 'NR==2{printf "%s/%s (%s)", $3, $2, $5}')

echo "💻 资源使用："
echo "  ├─ 内存: $MEMORY"
echo "  └─ 磁盘: $DISK"
echo ""
```

```bash
# 5. 设置权限
sudo chmod +x /etc/update-motd.d/00-header
sudo chmod +x /etc/update-motd.d/10-sysinfo
sudo chmod +x /etc/update-motd.d/20-resources

# 6. 测试
sudo run-parts /etc/update-motd.d/
```
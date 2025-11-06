---
title: "UV 学习记录"
published: 2025-11-06
updated: 2025-11-06
draft: false
description: "基于 Rust 的极速 Python 包与项目管理器 UV：安装、环境与包管理、运行、导出/锁定、版本管理、常见问题与最佳实践速查。"
image: ""
tags: ["Python", "UV", "包管理", "工具笔记"]
category: "学习记录"
lang: "zh-CN"
prevTitle: ""
prevSlug: ""
nextTitle: ""
nextSlug: ""
---
## UV 是什么？

UV 是一个用 Rust 编写的快速 Python 包/项目管理工具，旨在替代 pip、pip-tools、pipx、poetry、pyenv、virtualenv 等工具，提供统一而高效的体验。

## 安装

### Linux/macOS

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

### Windows（推荐）

```powershell
powershell -c "irm https://astral.sh/uv/install.ps1 | iex"
```

### 通过 pip 安装

```bash
pip install uv
```

## 基本使用速查

### 1) 创建项目与环境

```bash
# 新建并初始化项目
uv init my-project
cd my-project

# 在现有目录初始化
uv init

# 指定 Python 版本
uv init --python 3.11 my-project
```

### 2) 管理 Python 环境

```bash
# 创建虚拟环境（自动检测 Python）
uv venv

# 指定 Python 版本
uv venv --python 3.11

# 指定虚拟环境名称（如需）
uv venv my-env

# 激活（传统方式）
# Linux/macOS: source .venv/bin/activate
# Windows: .venv\Scripts\activate

# 推荐：无需显式激活，直接运行
uv run python script.py

# 停用（传统方式）
deactivate
```

### 3) 包管理

```bash
# 安装包
uv add requests
uv add requests pandas numpy
uv add --dev pytest black
uv add "requests>=2.28.0"
uv add "pandas==1.5.0"

# 从 requirements.txt 安装
uv add -r requirements.txt

# 移除包
uv remove requests
uv remove requests pandas

# 更新
uv lock --upgrade      # 全部包
uv add requests --upgrade  # 指定包
```

### 4) 运行代码

```bash
# 脚本/模块
uv run python script.py
uv run python -m pytest

# 带参数
uv run python script.py --arg value

# 一次性脚本（临时环境安装后运行）
uv run --with requests python -c "import requests; print(requests.get('https://httpbin.org/get').json())"
```

### 5) requirements.txt 管理

```bash
# 由当前环境导出
uv pip freeze > requirements.txt

# 或直接导出
uv export --format requirements-txt --output-file requirements.txt

# 从 requirements.txt 安装
uv add -r requirements.txt
# 或（在虚拟环境中）
uv pip install -r requirements.txt
```

若需手动维护依赖，UV 主要使用 `pyproject.toml`：

```toml
[project]
name = "my-project"
version = "0.1.0"
dependencies = [
  "requests>=2.28.0",
  "pandas>=1.5.0",
  "numpy>=1.24.0",
]

[project.optional-dependencies]
dev = [
  "pytest>=7.0.0",
  "black>=22.0.0",
  "flake8>=5.0.0",
]

[build-system]
requires = ["hatchling"]
build-backend = "hatchling.build"
```

### 6) 锁定依赖

```bash
# 生成/更新锁定文件 uv.lock
uv lock
uv lock --upgrade

# 按锁定版本安装
uv sync
uv sync --no-dev  # 仅生产依赖
```

### 7) Python 版本管理

```bash
uv python list
uv python install 3.11
uv python install 3.12
uv run --python 3.11 python script.py
```

### 8) 常用工作流

```bash
# 新项目
uv init my-project && cd my-project
uv add requests pandas
uv add --dev pytest black
uv run python main.py

# 克隆现有项目
git clone <repo> && cd <dir>
uv sync
uv run python main.py
```

### 9) 高级功能

```bash
# 工具（类似 pipx）
uv tool run black .
uv tool run pytest
uv tool install black
uv tool install pytest

# 缓存
uv cache info
uv cache clean

# 配置
uv config list
uv config set index-url https://pypi.org/simple/
```

### 10) 迁移指南

```bash
# 从 pip + requirements.txt 迁移
uv init
uv add -r requirements.txt
rm requirements.txt  # 可选

# 从 Poetry 迁移
uv init
uv sync
```

### 11) 设置超时时间

```bash
UV_HTTP_TIMEOUT=60 uv sync
```

## 常见问题（FAQ）

### 在 CI/CD 中使用 UV

```yaml
- name: Install uv
  uses: astral-sh/setup-uv@v1

- name: Install dependencies
  run: uv sync

- name: Run tests
  run: uv run pytest
```

### 配置私有源

```bash
uv config set index-url https://private-pypi.company.com/simple/
```

或在 `pyproject.toml`：

```toml
[[tool.uv.index]]
name = "private"
url = "https://private-pypi.company.com/simple/"
```

### 查看已安装的包

```bash
uv pip list
uv pip show requests
```

### 换源示例

```bash
# 阿里云
export UV_INDEX_URL=https://mirrors.aliyun.com/pypi/simple/

# 清华
export UV_INDEX_URL=https://pypi.tuna.tsinghua.edu.cn/simple/

# 中科大
export UV_INDEX_URL=https://mirrors.ustc.edu.cn/pypi/simple/

# 使用示例
uv pip install <package-name>
```

## 最佳实践

- 使用 `uv run` 代替手动激活环境
- 提交 `uv.lock`，确保团队一致性
- 以 `pyproject.toml` 为中心管理依赖
- 定期 `uv lock --upgrade` 更新依赖
- 使用 `--dev` 区分开发/生产依赖

## 参考

- UV 官方文档
- UV GitHub 仓库
- Python 打包用户指南

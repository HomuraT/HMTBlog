---
title: "Langchain学习——PromptTemplate"
published: 2025-07-25
description: ''
image: ''
tags: ["大模型"]
category: "学习记录"
draft: false
lang: 'zh-CN'
---

# LangChain 


详细测试样例和源码，可访问[github](https://github.com/HomuraT/langchain-study/tree/main/unitests/test_prompt_templates)
## PromptTemplate - 基础字符串模板

### 💡 概念定义

`PromptTemplate` 是LangChain中最基础的提示模板类，用于创建具有变量占位符的字符串模板。它支持动态变量替换，是构建AI应用提示的核心组件。

**官方文档**: [How to use prompts](https://python.langchain.com/docs/how_to/prompts/)

### 🔧 核心方法

#### 创建方法

```python
from langchain_core.prompts import PromptTemplate

# 方法1：使用from_template（推荐）
prompt = PromptTemplate.from_template("Tell me a {adjective} joke about {topic}")

# 方法2：使用构造函数
prompt = PromptTemplate(
    input_variables=["adjective", "topic"],
    template="Tell me a {adjective} joke about {topic}"
)
```

**输入**:
- `template` (str): 包含变量占位符的模板字符串，使用`{variable_name}`格式
- `input_variables` (List[str], 可选): 显式指定输入变量列表，`from_template`会自动识别

**输出**: PromptTemplate实例

**原理**: 使用Python字符串格式化语法，自动识别模板中的变量占位符并创建输入变量列表

#### 格式化方法

```python
# 方法1：format方法
formatted_string = prompt.format(adjective="funny", topic="programming")

# 方法2：invoke方法（兼容LCEL）
formatted_string = prompt.invoke({"adjective": "funny", "topic": "programming"}).text
```

**输入**: 键值对字典，键为变量名，值为替换内容
**输出**: 格式化后的字符串
**原理**: 使用Python字符串格式化将变量占位符替换为实际值

### 📝 使用示例

```python
from langchain_core.prompts import PromptTemplate

# 创建邮件模板
email_template = PromptTemplate.from_template(
    "写一封{tone}的邮件给{recipient}，主题是{subject}。内容包括：{content}"
)

# 格式化邮件
email = email_template.format(
    tone="正式",
    recipient="客户",
    subject="产品更新通知",
    content="我们的新功能已经上线"
)

print(email)
# 输出: 写一封正式的邮件给客户，主题是产品更新通知。内容包括：我们的新功能已经上线
```

---

## ChatPromptTemplate - 对话消息模板

### 💡 概念定义

`ChatPromptTemplate` 专门用于构建对话式AI的提示模板，支持多种消息类型（系统、用户、AI消息），是构建聊天机器人和对话应用的核心组件。

**官方文档**: [How to use chat models](https://python.langchain.com/docs/how_to/chatbots/)

### 🔧 核心方法

#### 创建方法

```python
from langchain_core.prompts import ChatPromptTemplate

# 方法1：使用元组格式
chat_prompt = ChatPromptTemplate.from_messages([
    ("system", "You are a helpful assistant specialized in {domain}"),
    ("user", "Please help me with: {request}"),
    ("assistant", "I'll help you with {request}. Let me think about this..."),
    ("user", "{follow_up}")
])

# 方法2：使用消息模板对象
from langchain_core.prompts import SystemMessagePromptTemplate, HumanMessagePromptTemplate

system_template = SystemMessagePromptTemplate.from_template(
    "You are a {role} with expertise in {domain}"
)
human_template = HumanMessagePromptTemplate.from_template("Help me with: {task}")

chat_prompt = ChatPromptTemplate.from_messages([system_template, human_template])
```

**输入**:
- 消息列表，每个消息可以是：
  - 元组格式: `(role, content_template)`
  - 消息模板对象: `SystemMessagePromptTemplate`, `HumanMessagePromptTemplate`, `AIMessagePromptTemplate`

**输出**: ChatPromptTemplate实例

**原理**: 将对话转换为结构化的消息序列，每个消息具有特定的角色和内容

#### 格式化方法

```python
# 生成消息列表
messages = chat_prompt.format_messages(
    domain="web development",
    request="optimize my React app",
    follow_up="What about performance monitoring?"
)

# 消息类型: [SystemMessage, HumanMessage, AIMessage, HumanMessage]
```

**输入**: 变量字典
**输出**: 消息对象列表（SystemMessage, HumanMessage, AIMessage等）
**原理**: 将每个消息模板格式化为对应的消息对象

### 📝 使用示例

```python
from langchain_core.prompts import ChatPromptTemplate

# 创建智能客服模板
customer_service = ChatPromptTemplate.from_messages([
    ("system", "你是专业的{company}客服代表，始终保持{tone}和耐心。"),
    ("user", "用户问题：{user_question}"),
    ("assistant", "我理解您的问题。让我为您查找相关信息..."),
    ("user", "补充信息：{additional_info}")
])

# 格式化对话
messages = customer_service.format_messages(
    company="科技公司",
    tone="友好专业",
    user_question="产品无法正常工作",
    additional_info="错误代码是404"
)

for msg in messages:
    print(f"{type(msg).__name__}: {msg.content}")
```

---

## MessagesPlaceholder - 消息占位符

### 💡 概念定义

`MessagesPlaceholder` 允许在对话模板中动态插入消息列表，常用于管理对话历史、上下文消息等场景。它是构建有状态对话应用的关键组件。

**官方文档**: [How to add chat history](https://python.langchain.com/docs/how_to/message_history/)

### 🔧 核心方法

#### 创建方法

```python
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder

# 在模板中插入消息占位符
prompt = ChatPromptTemplate([
    ("system", "You are a helpful assistant"),
    MessagesPlaceholder("conversation_history"),
    ("user", "现在请回答: {question}")
])
```

**输入**:
- `variable_name` (str): 占位符变量名
- `optional` (bool, 可选): 是否为可选占位符

**输出**: MessagesPlaceholder实例

**原理**: 在模板渲染时将指定变量的消息列表插入到当前位置

#### 使用方法

```python
from langchain_core.messages import HumanMessage, AIMessage

# 准备历史消息
history = [
    HumanMessage(content="你好"),
    AIMessage(content="您好！有什么可以帮助您的吗？"),
    HumanMessage(content="我想学习Python")
]

# 格式化包含历史的对话
messages = prompt.format_messages(
    conversation_history=history,
    question="什么是列表推导式？"
)
```

**输入**: 
- `conversation_history`: 消息对象列表
- 其他模板变量

**输出**: 完整的消息序列

**原理**: 将历史消息插入到指定位置，保持对话的连贯性

### 📝 使用示例

```python
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.messages import HumanMessage, AIMessage

# 创建上下文感知的对话模板
context_chat = ChatPromptTemplate([
    ("system", "你是一个有用的助手，能基于对话历史提供连贯的回答"),
    MessagesPlaceholder("conversation_history"),
    ("user", "{new_question}")
])

# 模拟对话历史
history = [
    HumanMessage(content="我正在学习机器学习"),
    AIMessage(content="太好了！机器学习是一个很有前景的领域。"),
    HumanMessage(content="我对神经网络特别感兴趣")
]

# 生成包含历史的新对话
messages = context_chat.format_messages(
    conversation_history=history,
    new_question="能给我推荐一些神经网络的学习资源吗？"
)

print(f"对话包含{len(messages)}条消息")
# 输出: 对话包含5条消息 (1系统 + 3历史 + 1新用户)
```

---

## Jinja2PromptTemplate - 高级模板引擎

### 💡 概念定义

Jinja2模板引擎为LangChain提供了强大的模板功能，支持条件逻辑、循环、过滤器、宏等高级特性，适合构建复杂的动态提示。

**官方文档**: [How to use custom prompt templates](https://python.langchain.com/docs/how_to/custom_prompts/)

### 🔧 核心功能

#### 创建方法

```python
from langchain_core.prompts import PromptTemplate

# 指定使用Jinja2模板格式
prompt = PromptTemplate.from_template(
    template="Hello {{ name }}! Welcome to {{ place }}.",
    template_format="jinja2"
)
```

**输入**:
- `template`: Jinja2格式的模板字符串
- `template_format="jinja2"`: 指定使用Jinja2引擎

**输出**: 支持Jinja2语法的PromptTemplate实例

#### 条件逻辑

```python
conditional_template = PromptTemplate.from_template(
    """
{%- if user.is_vip -%}
尊敬的VIP用户 {{ user.name }}，您享有专属服务！
{%- else -%}
您好 {{ user.name }}，欢迎使用我们的服务！
{%- endif -%}
    """,
    template_format="jinja2"
)
```

**原理**: 使用`{%- if condition -%}...{%- endif -%}`语法实现条件分支

#### 循环功能

```python
loop_template = PromptTemplate.from_template(
    """
任务清单：
{%- for task in tasks %}
{{ loop.index }}. {{ task.name }} - 优先级：{{ task.priority }}
{%- endfor %}
    """,
    template_format="jinja2"
)
```

**原理**: 使用`{%- for item in items -%}...{%- endfor -%}`语法实现循环，`loop.index`提供循环计数

#### 过滤器应用

```python
filter_template = PromptTemplate.from_template(
    """
- 姓名：{{ name | title }}
- 邮箱：{{ email | lower }}
- 分数：{{ score | round(2) }}
- 标签：{{ tags | join(", ") }}
    """,
    template_format="jinja2"
)
```

**常用过滤器**:
- `title`: 首字母大写
- `lower`: 转换为小写
- `round(n)`: 四舍五入到n位小数
- `join(sep)`: 用分隔符连接列表
- `default(value)`: 提供默认值

#### 宏定义

```python
macro_template = PromptTemplate.from_template(
    """
{%- macro render_skill(skill_name, level, description="") -%}
🔧 {{ skill_name }}
   等级：{{ "⭐" * level }}{{ "☆" * (5 - level) }} ({{ level }}/5)
   {%- if description %}
   说明：{{ description }}
   {%- endif %}
{%- endmacro -%}

{{ render_skill("Python", 4, "熟练掌握面向对象编程") }}
{{ render_skill("JavaScript", 3) }}
    """,
    template_format="jinja2"
)
```

**原理**: 宏是可重用的模板片段，类似于函数，可以接受参数并生成内容

### 📝 使用示例

```python
from langchain_core.prompts import PromptTemplate

# 创建复杂的报告模板
report_template = PromptTemplate.from_template(
    """
📊 {{ title }} 分析报告

用户：{{ user.name | title }} ({{ user.role }})
评估日期：{{ date | default("今天") }}

{% if sections -%}
详细评分：
{%- for section in sections %}

{{ loop.index }}. {{ section.name }}
   得分：{{ section.score | default(0) }}/100
   {%- if section.score >= 80 %}
   状态：✅ 优秀
   {%- elif section.score >= 60 %}
   状态：⚠️ 良好
   {%- else %}
   状态：❌ 需改进
   {%- endif %}
{%- endfor %}

总评：
- 平均分：{{ average_score }}
{%- if average_score >= 80 %}
- 总体评价：🌟 表现出色！
{%- elif average_score >= 60 %}
- 总体评价：👍 表现良好
{%- else %}
- 总体评价：💪 还需努力
{%- endif %}
{%- else %}
暂无评估数据。
{%- endif %}
    """,
    template_format="jinja2"
)

# 使用数据格式化报告
data = {
    "title": "编程能力",
    "user": {"name": "alice wang", "role": "高级开发工程师"},
    "date": "2025年1月15日",
    "sections": [
        {"name": "代码质量", "score": 85},
        {"name": "算法思维", "score": 78},
        {"name": "团队协作", "score": 92}
    ],
    "average_score": 85.0
}

report = report_template.format(**data)
print(report)
```

---

## ExampleSelectors - 智能示例选择

### 💡 概念定义

示例选择器(ExampleSelectors)是Few-Shot学习的核心组件，能够根据输入动态选择最相关的示例，提高提示的效果和效率。

**官方文档**: [How to select examples](https://python.langchain.com/docs/how_to/example_selectors/)

### 🛠️ 选择器类型

#### 1. 自定义示例选择器

```python
from langchain_core.example_selectors.base import BaseExampleSelector
from typing import Dict, List

class CustomExampleSelector(BaseExampleSelector):
    """基于输入长度选择最相似长度的示例"""
    
    def __init__(self, examples: List[Dict[str, str]]):
        self.examples = examples

    def add_example(self, example: Dict[str, str]) -> None:
        """添加新示例"""
        self.examples.append(example)

    def select_examples(self, input_variables: Dict[str, str]) -> List[Dict[str, str]]:
        """根据输入变量选择示例"""
        new_word = input_variables["input"]
        new_word_length = len(new_word)

        # 找到长度最接近的示例
        best_match = None
        smallest_diff = float("inf")

        for example in self.examples:
            current_diff = abs(len(example["input"]) - new_word_length)
            if current_diff < smallest_diff:
                smallest_diff = current_diff
                best_match = example

        return [best_match] if best_match else []
```

**原理**: 继承`BaseExampleSelector`，实现`select_examples`方法定义选择逻辑

#### 2. 长度基础选择器

```python
from langchain_core.example_selectors import LengthBasedExampleSelector
from langchain_core.prompts import PromptTemplate, FewShotPromptTemplate

# 创建示例
examples = [
    {"input": "happy", "output": "sad"},
    {"input": "tall", "output": "short"},
    {"input": "energetic", "output": "lethargic"},
    {"input": "sunny", "output": "gloomy"},
]

# 示例格式模板
example_prompt = PromptTemplate(
    input_variables=["input", "output"],
    template="Input: {input}\nOutput: {output}",
)

# 创建长度基础选择器
selector = LengthBasedExampleSelector(
    examples=examples,
    example_prompt=example_prompt,
    max_length=25  # token限制
)

# 在Few-Shot模板中使用
dynamic_prompt = FewShotPromptTemplate(
    example_selector=selector,
    example_prompt=example_prompt,
    prefix="Give the antonym of every input",
    suffix="Input: {adjective}\nOutput:",
)
```

**输入**:
- `examples`: 示例列表
- `example_prompt`: 示例格式模板
- `max_length`: 最大token长度限制

**原理**: 根据输入长度和当前示例的总长度动态调整示例数量，避免超出模型上下文限制

#### 3. 语义相似度选择器

```python
from langchain_core.example_selectors import SemanticSimilarityExampleSelector
from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import FAISS

# 创建语义相似度选择器
selector = SemanticSimilarityExampleSelector.from_examples(
    examples=examples,
    embeddings=OpenAIEmbeddings(model="text-embedding-3-small"),
    vectorstore_cls=FAISS,
    k=2  # 选择最相似的2个示例
)

# 使用选择器
selected = selector.select_examples({"input": "joyful"})
```

**输入**:
- `examples`: 示例列表
- `embeddings`: 嵌入模型实例
- `vectorstore_cls`: 向量存储类
- `k`: 返回的示例数量

**原理**: 使用嵌入模型计算输入与示例的语义相似度，选择最相关的示例

#### 4. 最大边际相关性选择器

```python
from langchain_core.example_selectors import MaxMarginalRelevanceExampleSelector

# 创建MMR选择器
mmr_selector = MaxMarginalRelevanceExampleSelector.from_examples(
    examples=examples,
    embeddings=OpenAIEmbeddings(model="text-embedding-3-small"),
    vectorstore_cls=FAISS,
    k=2  # 平衡相关性和多样性
)
```

**原理**: 在保证相关性的同时考虑多样性，避免选择过于相似的示例

#### 5. N-gram重叠选择器

```python
from langchain_community.example_selectors import NGramOverlapExampleSelector

# 创建N-gram重叠选择器
example_selector = NGramOverlapExampleSelector(
    examples=examples,
    example_prompt=example_prompt,
    threshold=-1.0,  # 阈值，低于此值的示例将被排除
)

# 设置阈值排除低重叠示例
example_selector.threshold = 0.0
```

**原理**: 基于输入与示例之间的N-gram重叠度进行选择和排序

### 📝 综合使用示例

```python
from langchain_core.prompts import FewShotPromptTemplate, PromptTemplate
from langchain_core.example_selectors import LengthBasedExampleSelector

# 定义翻译任务示例
translation_examples = [
    {"chinese": "你好", "english": "hello"},
    {"chinese": "再见", "english": "goodbye"},
    {"chinese": "谢谢", "english": "thank you"},
    {"chinese": "对不起", "english": "sorry"},
    {"chinese": "早上好", "english": "good morning"},
]

# 示例格式模板
example_prompt = PromptTemplate(
    input_variables=["chinese", "english"],
    template="中文: {chinese} -> 英文: {english}",
)

# 创建动态选择器
selector = LengthBasedExampleSelector(
    examples=translation_examples,
    example_prompt=example_prompt,
    max_length=50
)

# 创建Few-Shot模板
few_shot_prompt = FewShotPromptTemplate(
    example_selector=selector,
    example_prompt=example_prompt,
    prefix="将以下中文翻译为英文：",
    suffix="中文: {chinese} -> 英文:",
    input_variables=["chinese"],
)

# 使用模板
result = few_shot_prompt.format(chinese="晚安")
print(result)
```

---

## 🔗 相关链接

- **LangChain官方文档**: [https://python.langchain.com/docs/](https://python.langchain.com/docs/)
- **提示模板指南**: [https://python.langchain.com/docs/how_to/prompts/](https://python.langchain.com/docs/how_to/prompts/)
- **对话模板**: [https://python.langchain.com/docs/how_to/chatbots/](https://python.langchain.com/docs/how_to/chatbots/)
- **示例选择器**: [https://python.langchain.com/docs/how_to/example_selectors/](https://python.langchain.com/docs/how_to/example_selectors/)
- **Few-Shot提示**: [https://python.langchain.com/docs/how_to/few_shot_examples/](https://python.langchain.com/docs/how_to/few_shot_examples/)
- **Jinja2文档**: [https://jinja.palletsprojects.com/](https://jinja.palletsprojects.com/)

---

原文链接：[CSDN](https://blog.csdn.net/qq_42464569/article/details/149637755)

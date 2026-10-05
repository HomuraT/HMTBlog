---
title: "关于transformers库验证时不进入compute_metrics方法的一些坑"
published: 2024-07-11
description: ''
image: ''
tags: ["人工智能"]
category: "技术笔记"
draft: false
lang: 'zh-CN'
---

# 生成式任务输入就是标签
transformers在进入compute_metrics前会有一个判断，源码如下：

```
# 版本 transformers==4.41.2
# 在trainer.py 的 3842 行
# Metrics!
if (
    self.compute_metrics is not None
    and all_preds is not None
    and all_labels is not None
    and not self.args.batch_eval_metrics
):
    if args.include_inputs_for_metrics:
        metrics = self.compute_metrics(
            EvalPrediction(predictions=all_preds, label_ids=all_labels, inputs=all_inputs)
        )
    else:
        metrics = self.compute_metrics(EvalPrediction(predictions=all_preds, label_ids=all_labels))
elif metrics is None:
    metrics = {}
```
生成式任务如果没有标签字段，即`labels`那么这里的`all_labels is not None`就会是false，从而无法进入compute_metrics方法。
此时可以在`TrainingArguments`中加入一个变量`label_names`把输入文本作为标签，如下：
```
training_args = TrainingArguments(
...
label_names=['input_ids'], # 这里假设我的文本输入叫 ‘input_ids’
...
)
```
这样就可以进入compute_metrics函数了。
此外，若需要将输入的变量传入compute_metrics，可以在`TrainingArguments`中设置`include_inputs_for_metrics=True`

---

原文链接：[CSDN](https://blog.csdn.net/qq_42464569/article/details/140356289)

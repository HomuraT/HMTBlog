---
title: "Q-Learning实战——找房间"
published: 2024-07-08
description: ''
image: ''
tags: ["Python", "机器学习"]
category: "学习记录"
draft: false
lang: 'zh-CN'
---

# 介绍
样例来自[A Painless Q-learning Tutorial (一个 Q-learning 算法的简明教程)
](https://blog.csdn.net/itplus/article/details/9361915)

简单来说就是**从某个房间开始，找到去目标房间的路径。**
![在这里插入图片描述](/images/csdn/71a6ce38a3410a59a181d3b2.png)
# 代码实现
```python 
import numpy as np
from tqdm import tqdm, trange

room_num = 6
room_paths = [(0, 4), (3, 4), (3, 1), (1, 5), (2, 3), (4, 5)]
target_room = 5

# Q 矩阵，默认值填充0
Q = np.zeros((room_num, room_num))
# R 矩阵，默认值填充-1
reward = np.full((room_num, room_num), -1)
# 有路径的房间，奖励设为0
for room_path in room_paths:
    if room_path[1] == target_room:
        reward[room_path[0]][room_path[1]] = 100 # 房间到达目标房间，奖励设为100
    else:
        reward[room_path[0]][room_path[1]] = 0

    # 双向路径
    if room_path[0] == target_room:
        reward[room_path[1]][room_path[0]] = 100 # 房间到达目标房间，奖励设为100
    else:
        reward[room_path[1]][room_path[0]] = 0

reward[target_room][target_room] = 100 # 目标房间奖励设为100
print("reward:")
print(reward)

max_epoch = 2000
lamma = 0.8
modes = ['one-path', 'one-step']
# one-path 一直走，直到到达目标房间
# one-step 只走一步
mode = modes[1]

for epoch in trange(max_epoch):
    new_Q = Q.copy()
    current_state = np.random.randint(0, room_num)

    def one_step(current_state, Q, reward, lamma):
        # 随机选择一个可行的动作
        p_action = (reward[current_state] >= 0).astype(int) / np.sum(reward[current_state] >= 0)
        current_action = np.random.choice(room_num, p=p_action)
        # 更新 Q 矩阵
        new_Q[current_state][current_action] = reward[current_state][current_action] + lamma * np.max(Q[current_action])
        new_state = current_action
        return new_state, new_Q

    if mode == 'one-step':
        _, new_Q = one_step(current_state, Q, reward, lamma)
    else:
        while current_state != target_room:
            current_state, new_Q = one_step(current_state, Q, reward, lamma)
    Q = new_Q

print("Q:")
print(Q.round())
```
这里有两种更新策略：
1. one-path：一直走并每一步更新，直到到达目标房间
2. one-step：每次只走一步，然后更新，然后再随机初始状态
# 运行结果
## 参考结果
![在这里插入图片描述](/images/csdn/bd0ea9bba47eb172df1ffef2.png)
来自[A Painless Q-learning Tutorial (一个 Q-learning 算法的简明教程)
](https://blog.csdn.net/itplus/article/details/9361915)
## one-path
```
Q:
[[  0.   0.   0.   0.  80.   0.]
 [  0.   0.   0.  64.   0. 100.]
 [  0.   0.   0.  64.   0.   0.]
 [  0.  80.  51.   0.  80.   0.]
 [ 64.   0.   0.  64.   0. 100.]
 [  0.   0.   0.   0.   0.   0.]]
```
这里跟参考结果不一样是因为没有考虑自环且到达目标房间后就直接结束此次寻路，因此目标房间没有更新Q的相关值。
## one-step
```
Q:
[[  0.   0.   0.   0. 400.   0.]
 [  0.   0.   0. 320.   0. 500.]
 [  0.   0.   0. 320.   0.   0.]
 [  0. 400. 256.   0. 400.   0.]
 [320.   0.   0. 320.   0. 500.]
 [  0. 400.   0.   0. 400. 500.]]
```
这次的结果跟参考的一样，因为这里只考虑走一步，不管起始房间和结束房间是哪里都无所谓，因此最终结果跟参考一致。

---

原文链接：[CSDN](https://blog.csdn.net/qq_42464569/article/details/140272454)

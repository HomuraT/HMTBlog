---
title: "SQL语句——权限管理"
published: 2021-01-07
description: ''
image: ''
tags: ["数据库"]
category: "学习记录"
draft: false
lang: 'zh-CN'
---

# SQL语句

## 授权

数据库对象的创建者通常具有与该对象相关的所有权限。创建者可以通过GRANT语句向其他用户授予操作该对象的某些权限。

**GRANT格式如下：**

```sql
GRANT <权限> [, <权限>]
[ON <对象类型> <对象名>]
TO <用户> [, <用户>]
[WITH GRANT OPTION][AS 用户]
```

其中，WITH GRANT OPTION 指定向接收权限的安全主体提供向其他安全账户授予制定权限的能力。

```sql
-- 给用户 Tom 和 Jhon 授予创建数据库和创建表的权限
GRANT CREATE DATABASE, CREATE TABLE
TO Tom, Jhon
```

## 回收权限

指收回指定用户对某个数据库对象的某种权限。回收操作可以由数据库管理员或其他授权者用REVOKE语句回收。

**REVOKE格式如下：**

```sql
REVOKE [GRANT OPTION FOR] <权限> [, <权限>]
[ON <对象类型> <对象名>]
FROM <用户> [, <用户>]
[CASCADE] [AS 用户]
```

其中，CASCADE选项是指示当前正在撤销的权限也将从其他被主体授权的主体中撤销。使用CASCADE参数时，还必须同时指定 GRANT OPTION FOR 参数，表示对授予 WITH GRANT OPTION 权限的权限执行联级撤销。

```sql
-- 将Tom和Jhon创建数据库和创建表的权限回收
REVOKE CREATE DATABASE, CREATE TABLE
FROM Tom, Jhon
```

## 拒权

拒权是指拒绝为指定用户对某个数据库对象使用某种权限。防止该主体通过组或角色成员身份继承权限。用DENY语句。

**DENY格式如下：**

```sql
DENY <权限> [, <权限>]
[ON <对象类型> <对象名>]
TO <用户> [, <用户>]
```

样例：

```sql
-- 拒绝让Tom和Jhon用户创建数据库和创建表的权限
DENY CREATE DATABASE, CREATE TABLE
TO Tom, Jhon
```

---

原文链接：[CSDN](https://blog.csdn.net/qq_42464569/article/details/112307658)

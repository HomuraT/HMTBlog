---
title: "SQL语句——视图"
published: 2021-01-06
description: ''
image: ''
tags: ["数据库"]
category: "学习记录"
draft: false
lang: 'zh-CN'
---


# SQL语句

## 视图的概述

试图（view）是数据库中的一个对象，它是数据库管理系统提供给用户的以多种角度观察数据库中数据的一种重要机制。它对应三种模式中的外模式。

在SQL中，试图是基于SQL语句的结果集的可视化的表。

视图包含行和列，就像一个真实的表。视图中的字段就是来自一个或多个数据库中的真实的表中的字段。但视图与基本表不同，试图是一个虚表。数据库中只存储视图的定义，而不存储视图所包含的数据，这些数据仍存放在原来的基本表中。这种模式有两个好处：

1. 视图数据始终与基本表数据保持一致，当基本表发生变化时，从视图中查询出的数据也会随之变化。
2. 节省存储空间。当数据量非常大时，重复存储数据非常耗费空间。

视图可以从一个基本表中提取数据，也可以从多个基本表中提取数据，甚至还可以从其他视图中提取数据，合理利用可以带来很多好处：

1. 简化数据查询。
2. 使用户能够从多角度看待同一数据。
3. 提高数据的安全性。
4. 提供了一定程度的逻辑独立性。

## 视图相关SQL语句

### 视图的定义及使用

一般格式如下：

```sql
CREATE VIEW <视图名> [(列名 [, ...n])]
AS
	SELECT语句
```

在定义视图时需要注意：

1. SELECT语句中通常不包含ORDER BY 和DISTINCT子句
2. 在定义视图时要么制定视图的全部列名，要么全部省略不写，不能只写视图的部分列名。

```sql
/*
创建一个包含‘计算机系’学生的成绩单视图，视图中应有学生的
学号、姓名、课程号、课程名和成绩
*/
CREATE VIEW V_Grade_CS
AS
	SELECT S.Sno, Sname, C.Cno, Cname, Grade
	FROM Student S, SC, Course C
	WHERE S.Sno = SC.Sno AND SC.Cno = C.Cno
		AND Sdept = '计算机系'
		
-- 使用视图，跟基本表类似
-- 查询V_Grade_CS的所有数据
SELECT * FROM V_Grade_CS
```

### 视图的修改与删除

1. 修改视图

   修改视图定义的SQL语句为ALTER VIEW，其语法如下：

   ```sql
   ALTER VIEW <视图名> [(<列名> [, ...n])]
   AS
   	SELECT语句
   ```

   样例：

	```sql
	/*
	修改上例创建的视图，使其包含学生的年龄信息
	*/
	ALTER VIEW V_Grade_CS
	AS
		SELECT S.Sno, Sname, YEAR(GETDATE())-YEAR(Sbirthday) Sage, C.Cno,
		Cname, Grade
		FROM Student S, SC, Course C
		WHERE S.Sno = SC.Sno AND SC.Con = C.Con
			AND Sdept = '计算机系'
	```
	2. 删除视图

   基本语法：

   ```sql
   DROP VIEW <视图名>
   ```

   样例：

   ```sql
   -- 删除视图V_Grade_CS
   DROP VIEW V_Grade_CS
   ```

---

原文链接：[CSDN](https://blog.csdn.net/qq_42464569/article/details/112269408)

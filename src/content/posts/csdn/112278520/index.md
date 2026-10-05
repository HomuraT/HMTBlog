---
title: "SQL语句——数据更新、修改、删除"
published: 2021-01-06
description: ''
image: ''
tags: ["数据库"]
category: "学习记录"
draft: false
lang: 'zh-CN'
---

# SQL语句

## 数据插入

### 单行插入

单行插入的INSERT语句格式如下：

```sql
INSERT [INTO] <表名> [(<列名表>)] VALUES (值列表)
```

其中，<列名表>中的列名必须是<表名>中有的列名，值列表中的值可以是常量也可以是NULL，各值之间用逗号分隔。

INSERT语句用来新增一个符合表结构的数据行，将值列表数据按表中列定义（或<列表名>中指定的顺序）逐一赋给对应的列名。

使用插入语句时应注意：

1. 值列表中的值与列名表中的列按位置顺序一一对应，它们的数据类型必须兼容。
2. 如果<表名>后边没有指明<列名表>，则值列表中值的顺序必须与<表名>中列定的顺序一致，且每个列均有值（可以为空）
3. 如果只列表中提供的值的个数或者顺序与<表名>中列个数或顺序不一样，则<列名表>部分不能省。没有为<表名>中某列提供值的列必须允许为NULL或有默认约束。

样例：

```sql
/*
向Student表中插入(1001，张三，男，1999-09-09,计算机系)的记录
*/
INSERT INTO Student
VALUES('1001', '张三', '男', '1999-09-09', '计算机系', NULL) -- 假设院校后面还有个列
```

### 多行插入

多行插入数据的INSERT语句的格式如下：

```sql
INSERT [INTO] <表名> [(列名表)] SELECT语句
```

此语句将查询产生的结果插入到表中

```sql
/*
用CREATE语句建立表StudentBAK，包含需学生的学号、姓名、院校，
然后想StudentBAK添加Student表中的计算机系学生信息
*/
-- 创建表
CREATE TABLE StudentBAK(
	Sno CHAR(4) PRIMARY KEY,
    Sname VARCHAR(20),
    Sdept VARCHAR(20)
)

-- 插入数据
INSERT INTO StudentBAK
SELECT Sno, Sname, Sdept FROM Student WHERE Sdept = '计算机系'
```

## 数据更新

UPDATE语句格式如下：

```sql
UPDATE <表名> SET <列名> = {表达式 | DEFAULT | NULL} [, ...n]
[FROM <条件表名> [, ...n]]
[WHERE <更新条件>]
```

其中：

- <表名>：指定需要更新数据的表的名称。
- SET <列名>：指定要更改的列，表达式制定修改后的新值。
- 表达式：返回单个值的常量值或表达式或嵌套的SELECT语句。表达式返回的值将替换<列名>中原有的值。
- DEFAULT：指定用为列定义的默认约束替换现有值。如果该列没有默认约束并且定义为允许NULL，则该参数也可以用于将列更改为NULL。
- FROM <条件表名>：指定用于为更新操作提供条件的表源。
- WHERE：用于指定只修改表中满足条件的记录。如果省略，将会修改全部记录。

更新语句可分为有条件更新和无条件更新。

1. 无条件更新

   ```sql
   -- 将Student表中学生的年龄加1
   UPDATE Student SET Sage = Sage+1
   ```

2. 有条件更新

   ```sql
   -- 1. 基于本表条件的更新
   -- 把‘C01’号课程学分加1
   UPDATE Course SET Credit = Credit
   WHERE Sno = 'C01'
   
   -- 2. 基于他表条件的更新
   -- 将数据库原理课程的成绩都减1
   -- 用子查询实现
   UPDATE SC SET Grade = Grade - 1
   WHERE Cno IN (
   SELECT Cno FROM Course WHERE Cname = '数据库原理'
   )
   -- 用多表连接实现
   UPDATE SC SET Grade = Grade - 1
   FROM SC JOIN Course ON SC.Cno = Course.Cno
   WHERE Cname = '数据库原理'
   ```

## 数据删除

DELETE语句语法如下：

```sql
DELETE [FROM] <表名>
[FROM <条件表名> [, ...n]]
[WHERE <删除条件>]
```

其中：

- <表名>：说明了要删除哪个表中的数据。
- FROM <条件表名>：指定用于为更新操作提供条件的表源。
- WHERE：说明只删除满足WHERE子句条件的记录。如果省略，则删除所有记录。

删除可分为无条件删除和有条件删除。

1. 无条件删除

   ```sql
   -- 删除Student中的所有数据
   DELETE FROM Student
   ```

2. 有条件删除

   ```sql
   -- 1. 基于本表条件的删除
   -- 删除学号为'1001'的学生
   DELETE FROM Student WHERE Sno = '1001'
   
   -- 2. 基于他表条件的删除
   -- 删除‘数据库原理’的选课记录
   -- 用子查询实现
   DELETE FROM SC
   WHERE Con IN (
   SELECT Cno FROM Course WHERE Cname = '数据库原理'
   )
   -- 用多表连接实现
   DELETE FROM SC
   FROM SC JOIN Course C ON SC.Cno = C.Cno
   WHERE Cname = '数据库原理'
   ```

---

原文链接：[CSDN](https://blog.csdn.net/qq_42464569/article/details/112278520)

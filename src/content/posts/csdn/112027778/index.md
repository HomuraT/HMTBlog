---
title: "SQL语句——数据库定义、架构定义、表的定义"
published: 2020-12-31
description: ''
image: ''
tags: ["数据库"]
category: "学习记录"
draft: false
lang: 'zh-CN'
---

 # SQL语句

   ## 数据库的定义

   1. 数据库的创建

      ```sql
      CREATE DATABASE <数据库名>
      [ON [PRIMARY] <文件> [, ...n]
      	[, <文件组> [, ...n]]
      	[ LOG ON <文件> [, ...n]]]
      [COLLATE <校验方式名>]
      [WITH <选项> [, ...n]][;]
      
      # 创建一个StudentCourse数据库
      CREATE DATABASE StudentCourse
      ```

   2. 数据库修改

      ```sql
      ALTER DATABASE <数据库名>
      	ADD FILE <文件名> [, ...n]
      		[ TO FILEGROUP {文件组} ]
      	| ADD LOG FILE <文件> [, ...n]
      	| REMOVE FILE <文件> [, ...n]
      	| MODIFY FILE <文件> [, ...n]
      
      /*
      将一个大小为10M的数据文件  student_Data.mdf 添加到 StudentCourse 数据库中，
      该文件的大小为10M，最大的文件大小为100M，增长速度为2MB，物理地址为D盘
      */
      ALTER DATABASE StudentCourse
      ADD FILE
      (
      	Name=student_Data,
          FILENAME='D:\sql\student_Data.mdf',
          Size=100M,
          Maxsize=100MB,
          Filegrowth=2MB
      )
      ```

   3. 数据库删除

      ```sql
      DROP DATABASE <数据库名> [, ...n][;]
      
      # 将 StudentCourse 数据库删除
      DROP DATABASE StudentCourse
      ```

   

   ## 架构的定义

   架构（SCHEMA，也称模式）是数据库下的一个逻辑命名空间，可以存放表、视图等数据对象，它是数据库对象的容器。

   1. 架构创建

      ```sql
      CREATE SCHEMA { <架构名> 
      	| AUTHORIZATION <所有者名>
      	| <架构名> AUTHORIZATION <所有者名>
      }
      [{表定义预计 | 视图定义语句 | 授权语句 | 拒绝权限语句 }][;]
      # 执行架构语句的用户必须具有数据库管理员权限，
      # 或者是获得了数据库管理员授予的 CREATE SCHEMA 的权限
      
      # 为用户 “HMT” 定义一个架构，架构名为 “S_C”
      CREATE SCHEMA S_C AUTHORIZATION HMT
      ```

   2. 架构修改

      ```sql
      # 架构修改使用 ALTER SCHEMA 语句，可用于在同一数据库中的架构之间移动安全对象
      ALTER SCHEMA <架构名>
      TRANSFER <对象名> [;]
      
      # 将表 Address 从架构 Person 传输到 HumanResources 架构
      ALTER SCHEMA HumanResources 
      TRANSFER Person.Address
      ```

   3. 删除架构

      ```sql
      DROP SCHEMA <架构名> [;]
      
      # 删除S_C 架构
      DROP SCHEMA S_C
      ```

## 表的定义

1. 表的创建

   ```sql
   CREATE TABLE [<架构名>.]<表名>
   (
   	{<列名> <数据类型> [列级完整性约束定义 [, ...n]]}
       [表级完整性约束 ][, ...n]
   )
   ```

   注意：默认时SQL语言不区分大小写。

   参数说明：

   - <表名>是所要定义表的名字。
   - <列名>是表中所包含的属性列的名字
   - 在定义表的同时还可以定义与表有关的完整性约束，这些完整性约束条件都会存储在系统的数据字典中。如果完整性约束只设计表中的一个列，则这些约束条件可以在**“列级完整性约束定义”**处定义，也可以在**“表级完整性约束定义”**处定义；但某些涉及表中多个属性列的约束，必须在**“表级完整性约束定义”**处定义。

   

   **在“列级完整性约束定义”处可以定义如下约束：**

   - NOT NULL：非空约束，限制列取值非空。
   - PRIMARY KEY：主键约束，指定本列为主键。
   - FOREIGN KEY：外建约束，定义本列为引用其他表的外建。
   - UNIQUE：唯一值约束，限制列取值不能重复。
   - DEFAULT：默认值约束，指定列的默认值。
   - CHECK：列取值范围约束，限制列的取值范围。

   

   **各约束具体语法：**

   ```sql
   # 1. 主键约束
   PRIMARY KEY [(<列名> [, ...n])]
   # 如果在列级完整性约束处，可以省略方括号中内容
   
   # 2. 外建约束
   [FOREIGN KEY (<列名>)] REFERENCES <外表名> (<外表列名>)
   # 如果在列级完整性约束处，可省略 "FOREIGN KEY (<列名>)"
   
   # 3. 唯一值约束
   UNIQUE [(<列名> [,...n])]
   /*
   注意：
   1. 唯一值约束允许有一个空值（NULL）
   2. 在一个表中可以有多个唯一值约束
   3. 可以在一个列或多个列上定义UNIQUE约束
   */
   
   /*
   4. 默认值约束。一个默认值约束只能为一个列提供默认值，
   且默认值约束必须是列级约束
   有两种，
   1.在定义表时制定默认约束，
   2.在修改表时添加默认值约束
   */
   
   # 在创建表时定义默认值约束
   DEFAULT 常量表达式
   
   # 为已经创建好的表添加默认值约束
   DEFAULT 常量表达式 FOR 列名
   
   # 5. 列取值范围约束
   CHECK (逻辑表达式)
   ```

   **使用SQL语句创建一个Student表，结构如下：**

   | 列明      | 含义     | 数据类型      | 约束                                           |
   | --------- | -------- | ------------- | ---------------------------------------------- |
   | Sno       | 学号     | char(7)       | 主键                                           |
   | Sname     | 姓名     | nchar(20)     | 非空                                           |
   | Ssex      | 性别     | nchar(2)      | 非空；默认值：男；<br />检查：只能是'男'或'女' |
   | Sbirthday | 出生日期 | smalldatetime |                                                |
   | Sdept     | 所在系   | nvarchar(20)  |                                                |

   ```sql
   CREATE TABLE Student
   (
   	Sno CHAR(7) PRIMARY KEY,
       Sname NCHAR(20) NOT NULL,
       Ssex NCHAR(2) NOT NULL DEFAULT '男' CHECK (Ssex in ('男', '女')),
       Sbirthday DATETIME,
       Sdept NVARCHAR(20)
   )
   ```

2. 表的修改

   ```sql
   ALTER TABLE [<架构名>.]<表名>
   {
   	ALTER COLUMN <列名> <新数据类型> -- 修改表定义
   	| ADD <列名> <数据类型> [约束] -- 添加新列
   	| DROP COLUMN <列名> -- 删除列
   	| ADD [CONSTRAINT <约束名>] 约束定义 -- 添加约束
   	| DROP <约束名> -- 删除约束
   }
   
   -- 为Student表添加备注(Memo)列，此列名为Memo，数据类型为text
   ALTER TABLE Student
   	ADD Memo text
   	
   -- 将Student表的Sname列的数据类型修改为 NVARCHAR(40)
   ALTER TABLE Student
   	ALTER COLUMN Sname NVARCHAR(40) -- MySQL用的是 MODIFY 而不是 ALTER
   ```

3. 表的删除

   ```sql
   DROP TABLE <表名> 
   
   -- 删除Student表
   DROP TABLE Student
   ```

---

原文链接：[CSDN](https://blog.csdn.net/qq_42464569/article/details/112027778)

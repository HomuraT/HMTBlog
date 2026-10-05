---
title: "SQL语句——查询"
published: 2021-01-05
description: ''
image: ''
tags: ["数据库"]
category: "学习记录"
draft: false
lang: 'zh-CN'
---

# SQL 语句

## 单表查询

查询语句（SELECT）是数据库中最基本的和最重要的语句之一，其功能是从数据库中检索满足条件的数据。查询的数据源可以来自一张表，也可以来自多张表甚至来自视图，查询的结果是由0行（没有满足条件的数据）或多行记录组成的一个记录集合，并允许选择一个或多个字段作为输出字段。SELECT语句还可以对查询结果进行排序、汇总等。查询语句的基本结构可描述为：

```sql
SELECT <目标列名序列> -- 需要哪些列
	FROM <表名> [JOIN <表名> ON <连接条件>] -- 来自哪些表
	[WHERE <行选择条件>] -- 根据什么条件
	[GROUP BY <分组依据列>]
	[HAVING <组选择条件>]
	[ORDER BY <排列依据列>]
```

其中：

- SELECT 子句用于指定输出的字段
- FROM 子句用于指定数据的来源
- WHERE 子句用于指定数据的行选择条件
- GROUP BY 子句用于对检索到的记录进行分组
- HAVING 子句用于指定对分组后结果的选择条件
- ORDER BY 子句用于对查询的结果进行排序

### 选择表中若干列

1. 查询指定的列

   ```sql
   -- 查询全体学生的学好与姓名
   SELECT Sno, Sname FROM Student
   ```

2. 查询全部列

   ```sql
   -- 查询全体学生的全部信息
   SELECT Sno, Sname, Ssex, Sbirthday, Sdept, Memo FROM Student
   -- 等价于
   SELECT * FROM Student
   ```

3. 查询表中没有的列

   ```sql
   -- 含表达式的列：查询全体学生的姓名及年龄（年龄的列名是空）
   SELECT Sname, YEAR(GETDATE()) - YEAR(Sbirthday) FROM Student
   
   -- 查询全体学生的姓名、年龄、字符串“今年是”以及今年的年份（给列取别名）
   SELECT Sname 姓名,
   YEAR(GETDATE()) - YEAR(Sbirthday) 年龄, 
   '今年是' 今年是, YEAR(GETDATE()) 年份 
   FROM Student
   ```

### 选择表中若干行

1. 查询满足条件的元组

   **WHERE 子句常用的查询条件：**

   | 查询条件 | 谓词                                        |
   | -------- | ------------------------------------------- |
   | 比较     | =, >, >=, <=, <, <>, !=                     |
   | 确定范围 | BETWEEN ... AND ..., NOT BETWEEN ... AND... |
   | 确定集合 | IN, NOT IN                                  |
   | 字符匹配 | LIKE, NOT LIKE                              |
   | 空值     | IS NULL, IS NOT NULL                        |
   | 多重条件 | AND, OR                                     |

   ```sql
   -- 1. 比较大小--------------------------------------------
   -- 查询计算机系所有学生的姓名
   SELECT Sname FROM Student WHERE Sdept='计算机系'
   
   -- 查询考试成绩大于90的学生的学号、课程号和成绩
   SELECT Sno, Cno, Grade FROM SC WHERE Grade > 90
   
   -- 2. 确定范围--------------------------------------------
   /*
   注意：
   BETWEEN ... AND ... ：包括边界
   NOT BETWEEN ... AND ... ：不包括边界
   */
   -- 查询学分在2～3之间的课程的课程名称、学分和开课学期
   SELECT Cname, Credit, Semester FROM Course WHERE Credit BETWEEN 2 AND 3
   -- 等价于
   SELECT Cname, Credit, Semester FROM Course 
   WHERE Credit >= 2 AND Credit <=3
   
   -- 查询学分不在2～3之间的课程的课程名称、学分和开课学期
   SELECT Cname, Credit, Semester FROM Course 
   WHERE Credit NOT BETWEEN 2 AND 3
   -- 等价于
   SELECT Cname, Credit, Semester FROM Course
   WHERE Credit < 2 OR Credit > 3
   
   -- 查询出生在1997年的学生的全部信息
   SELECT * FROM Student
   WHERE Sbirthday BETWEEN '1997-01-01' AND '1997-12-31'
   
   -- 3. 确定集合--------------------------------------------
   -- 查询‘计算机系’和‘机电系’学生的学号、姓名和所在系
   SELECT Sno, Sname, Sdept FROM Student
   WHERE Sdept IN ('计算机系', '机电系')
   
   -- 查询不在‘计算机系’和‘机电系’学生的学号、姓名和所在系
   SELECT Sno, Sname, Sdept FROM Student
   WHERE Sdept NOT IN ('计算机系', '机电系')
   
   -- 4. 字符串匹配--------------------------------------------
   /*
   匹配串中有如下四种通配符：
   _：匹配任意一个字符
   %：匹配0到多个字符
   []：匹配[ ]中任意一个字符。如[abcd]表示匹配a, b, c, d中的一个。
   	若要比较的字符是连续的，也可以用连字符'-'表达，比如匹配 abcd中任意一个
   	可写成 [a-d]
   [^ ]：不匹配[ ]中的任意一个字符，用法与[ ]一致，也可以用'-'表示连续字符
   */
   -- 查询姓‘李’的学生的学号、姓名和所在系
   SELECT Sno, Sname, Sdept FROM Student
   WHERE Sname LIKE '李%'
   
   -- 查询姓名中第二个字是‘冲’的学生的学号、姓名和所在系
   SELECT Sno, Sname, Sdept FROM Student
   WHERE Sname LIKE '_冲%'
   
   -- 查询学号最后不是‘2’或者‘3’的学生的学号、姓名和所在系
   SELECT Sno, Sname, Sdept FROM Student
   WHERE Sno NOT LIKE '%[23]'
   /*
   注：mysql的LIKE好像没有 []和 [^]的用法，但可以用 REGEXP和 NOT REGEXP
   	来用正则表达式进行匹配
   */
   -- 如mysql下，查询学号最后不是‘2’或者‘3’的学生的学号、姓名和所在系
   SELECT Sno, Sname, Sdept FROM Student 
   WHERE Sno NOT REGEXP '[23]$'
   
   /*
   ESCAPE：可以指定一个字符，将该字符后面的一个字符当作普通字符看待，
   	可以用来匹配 '_' 和 '%' 等通配符
   */
   -- 查询msg字段中包含 "30%" 的记录
   WHERE msg LIKE '%30!%%' ESCAPE '!'
   
   -- 5. 涉及空值的查询--------------------------------------------
   -- 查询还没有考试的学生的学号、相应的课程号
   SELECT Sno, Cno FROM SC
   WHERE Grade IS NULL
   
   -- 查询有备注的学生的学号、姓名和备注
   SELECT Sno, Sname, Memo FROM Student
   WHERE Memo IS NOT NULL
   
   -- 6. 多重条件查询--------------------------------------------
   -- 查询‘计算机系’有备注的学生的学好、姓名、所在系和备注
   SELECT Sno, Sname, Sdept, Memo FROM Student
   WHERE Memo IS NOT NULL AND Sdelt = '计算机系'
   
   -- 查询 ‘机电系’和‘计算机系’1997年出生的学生的学号、姓名、所在系和生日
   SELECT Sno, Sname, Sdept, Sbirthday FROM Student
   WHERE (Sdept = '计算机系' OR Sdept = '机电系')
   AND Sbirthday BETWEEN '1997-01-01' AND '1997-12-31'
   ```

2. 消除取值相同的行

   ```sql
   /*
   虽然原关系中不存在两个完全相同的元组，
   但经过一定操作后可能会出现相同的元组
   */
   -- 查询有考试挂科的学生的学号
   SELECT DISTINCT Sno FROM SC
   WHERE Grade < 60
   ```

3. 对查询结果进行排序

   ```sql
   /*
   语法格式：
   ORDER BY <列名> [ASC | DESC][, ...n]
   ASC  表示升序
   DESC 表示降序
   默认ASC
   */
   -- 将‘C01’号课程的成绩按升序排列
   SELECT Cno, Grade FROM SC
   WHERE Cno='C01' ORDER BY Grade
   
   -- 将‘1001’号学生的成绩按降序排列
   SELECT Cno, Grade FROM SC
   WHERE Sno='1001' ORDER BY Grade DESC
   ```

4. 使用聚合函数进行统计

   **SQL常用聚合函数：**

   1. COUNT(*)：统计表中元组的个数
   2. COUNT([DISTINCT] <列名>)：统计本列的列值个数，DISTINCT表示去掉重复值后再统计
   3. SUM(<列名>)：计算列值的和值（必须是数值类型）
   4. AVG(<列名>)：计算列值的平均值（必须是数值类型）
   5. MAX(<列名>)：得到列的最大值
   6. MIN(<列名>)：得到列的最小值

   注：除了COUNT(*)外，其他函数均忽略NULL值。

   统计函数的计算范围可以是满足WHERE子句条件的记录，也可以对满足条件的组进行计算。

   ```sql
   -- 统计学生总数
   SELECT COUNT(*) 学生人数总数  FROM Student
   
   -- 统计学生‘1001’的总成绩
   SELECT SUM(Grade) 总成绩 FROM SC WHERE Sno='1001'
   
   -- 统计学生‘1001’的平均成绩
   SELECT AVG(Grade) 平均成绩 FROM SC WHERE Sno='1001'
   -- 注：类型与Grade一致，如果是Grade是整型那么平均值也是整型
   
   -- 统计课程‘C01’的最高分数和最低分数
   SELECT MAX(Grade) 最高分, MIN(Grade) 最低分
   FROM SC WHERE Cno='C01'
   ```

5. 对数据进行分组

   GROUP BY 子句提供了对数据进行分组的功能，使用GROUP BY 子句可将统计控制在组这一级。分组的目的是细化聚合函数的作用对象，可以一次用多个列进行分组。

   HAVING 子句用于对分组后的统计结果再进行筛选，它一般和GROUP BY 子句一起使用，这两个子句的一般形式为：

   ```sql
   GROUP BY <分组依据列> [, ...n]
   [HAVING <组提取条件>]
   ```

   1. 使用GROUP BY 子句

      ```sql
      -- 统计每门课程的选课人数，列出课程号和选课人数
      SELECT Cno 课程号, COUNT(Sno) 选课人数
      FROM SC GROUP BY Cno
      
      -- 统计每个学生的选课门数，列出学号，选课门数和平均成绩
      SELECT Sno 学号, COUNT(Cno) 选课门数, AVG(Grade) 平均成绩
      FROM SC GROUP BY Sno
      
      -- 统计每个系的男生人数和女生人数，结果按系名升序排列
      SELECT Sdept, Ssex, COUNT(*) 人数 FROM Student
      GROUP BY Sdept, Ssex ORDER BY Sdept
      ```

   2. 使用WHERE子句的分组

      ```sql
      -- 统计每个系男生人数
      SELECT Sdept, Count(*) 男生人数 FROM Student
      WHERE Ssex = '男' GROUP BY Sdept
      /*
      注：带有WHERE的子句的分组查询是先执行WHERE子句的选择，
      	得到结果后再进行分组统计
      */
      ```

   3. 使用HAVING 子句。HAVING子句用于对分组后的统计结果再进行筛选，它的功能与WHERE类似，但它用于组而不是单个记录。在HAVING中能使用聚合函数，但在WHERE不能。

      ```sql
      -- 查询选课门数不超过3门的学生的学号和选课门数
      SELECT Sno, COUNT(*) 选课门数 FROM SC
      GROUP BY Sno HAVING COUNT(*) > 3
      
      -- 查询‘计算机系’和‘机电系’每个系的学生人数，有两种写法
      SELECT Sdept, COUNT(*) FROM Student
      GROUP BY Sdept
      HAVING Sdept IN ('计算机系', '机电系')
      
      SELECT Sdept, COUNT(*) FROM Student
      WHERE Sdept IN ('计算机系', '机电系')
      GROUP BY Sdept
      -- 其中第二种效率更高
      /*
      关于WHERE、GROUP BY、HAVING
      - WHERE 用来筛选FROM 中指定的数据源所产生的行数据
      - GROUP BY 用来对经过WHERE 筛选的结果数据进行分组
      - HAVING 用来对分组后的统计结果再进行筛选
      在分组前用先WHERE 进行筛选可以减少分组后的数据量，所以效率更好。
      */
      ```



## 多表连接查询

### 内连接

内连接是一种最常用的连接类型。使用内链接时，如果两个表的相关字段满足连接条件，则从这两个表中提取数据并组合成新的记录。

```sql
-- 查询每个学生及其选课的详细
SELECT * FROM Student JOIN SC ON Student.Sno = SC.Sno
/*
注：如果用 * 会出现重复列 Sno，要消除重复列则需要进行投影
*/

-- 查询每个学生及其选课的详细，要求去掉重复列
SELECT S.Sno, Sname, Ssex, Sbirthday, Sdept, Memo, Cno, Grade
FROM Student S JOIN SC ON S.Sno=SC.Sno
/*
注：在FROM后面写 '关系名 别名' 如 Student S，可将S替代Student，
	用来简化SQL语句
*/

/*
查询‘计算机系’选修了‘数据库原理’课程的学生成绩单，成绩单包含姓名、
课程名称、成绩
*/
SELECT Sname, Cname, Grade
FROM Student S JOIN SC ON S.Sno = SC.Sno
JOIN Course C ON SC.Cno = C.Cno
WHERE Sdept = '计算机系' AND Cname = '数据库原理'

-- 查询选修了‘数据库原理’课程的学生姓名和所在系
SELECT Sname, Sdept
FROM Student S JOIN SC ON S.Sno = SC.Sno
WHERE Cname = '数据库原理'

-- 统计每个系学生的平均成绩
SELECT Sdept, AVG(Grade) 系平均成绩
FROM Student S JOIN SC ON S.Sno = SC.Sno
JOIN Course C ON SC.Cno = C.Cno
GROUP BY Sdept

-- 统计‘计算机系’学生中每门课程的选课人数、平均分、最高分和最低分
SELECT Cno, COUNT(*) 选课人数, AVG(Grade), MAX(Grade), MIN(Grade)
FROM Student S JOIN SC ON S.Sno = SC.Sno
WHERE Sdept = '计算机系'
GROUP BY Cno
```

### 自连接

自连接是一种特殊的内连接，它是指相互连接的表在物理上是同一张表，但在逻辑上是两张表。

```sql
-- 查询课程‘数据库原理’的先修课程名
SELECT C1.Cname 课程名, C2.Cname 先修课程名
FROM Course C1 JOIN Course C2 ON C1.PreCno = C2.Cno
WHERE C1.name = '数据库原理'

-- 查询与‘张三’在同一个系学习的学生姓名和所在系
SELECT S2.Sname, S1.Sdept
FROM Student S1 JOIN Student S2 ON S1.Sdept = S2.Sdept
WHERE S1.Sname = '张三' AND S2.Sname != '张三'
```

### 外连接

有时候我们希望输出那些不满足连接条件的元组信息，就需要用外连接来实现。外连接是只限制一张表中数据必须满足连接条件，而另一张表中的数据不必满足连接条件。外连接分为左外连接和右外连接两种，语法为：

```sql
FROM 表1 LIFT | RIGHT JOIN 表2 ON <连接条件> 
```

样例：

```sql
/*
查询计算机系全体学生的选课情况，包括学号、姓名、所在系、课程编号，
包括没有选课的学生
*/
SELECT S.Sno, Sname, Sdept, SC.Cno
FROM Student S LEFT JOIN SC ON S.Sno = SC.Sno
WHERE Sdept = '计算机系'

-- 查询没有人选的课程和课程名
SELECT Cname, Sno FROM Course C LEFT JOIN SC
ON C.Cno = SC.Cno
WHERE SC.Cno IS NULL

-- 统计‘计算机系’每个学生的选课门数，包括没有选课的学生
SELECT S.Sno, COUNT(SC.Cno) 选课门数
FROM Student S LEFT JOIN SC ON S.Sno = SC.Sno
GROUP BY S.Sno

/*
统计‘计算机系’选课门数少于3门的学生的学号和选课门数，包括没选课的学生。
查询结果按选课门数降序排序。
*/
SELECT S.Sno 学号, COUNT(SC.Cno) 选课门数
FROM Student S LEFT JOIN SC ON S.Sno = SC.Sno
WHERE Sdept = '计算机系'
GROUP BY S.Sno
HAVING COUNT(SC.Cno) < 3
ORDER BY COUNT(SC.Cno) DESC
```

### TOP（LIMIT）的使用

在使用SELECT语句进行查询时，有时只希望列出结果集中的前几行，而不是全部结果。TOP格式如下：

```sql
TOP n [PERCENT] [WITH THIS]
```

- n：非负整数
- TOP n：取查询结果的前n行数据
- TOP n PERCENT：取查询结果前n%数据
- WITH THIS：包括并列的结果

TOP子句写在SELECT 后，如果有DISTINCT，则写在DISTINCT后。

```sql
-- 查询‘C01’号课程成绩的前三名的学号和成绩
SELECT TOP 3 Sno, Grade FROM SC 
WHERE Cno = 'C01' ORDER BY Grade DESC

-- 查询学分最多的四门课程的课程名称、学分和开课学期
SELECT TOP 4 Cname, Credit,  Semester
FROM Course ORDER BY Credit DESC

-- 查询选课人数最多的两门课程，列出课程号和选课人数
SELECT TOP 2 WITH THIS Cno, COUNT(*) 选课人数
FROM SC GROUP BY Cno
ORDER BY COUNT(Cno) DESC

/*
注：mysql好像没有TOP子句，而使用 LIMIT替代。LIMIT放在语句最后面。
LIMIT简单使用：
- LIMIT n：表示选取查询结果前n个
- LIMIT n,m：从第n行数据后选取m行数据
*/
-- mysql下，查询‘C01’号课程成绩的前三名的学号和成绩
SELECT Sno, Grade FROM SC 
WHERE Cno = 'C01' ORDER BY Grade DESC LIMIT 3
-- 于上面等价，从第0行数据后选取3行数据
SELECT Sno, Grade FROM SC 
WHERE Cno = 'C01' ORDER BY Grade DESC LIMIT 0,3
```

### CASE表达式

CASE表达式是一种多分支表达式，它可以根据条件列表的值返回多个可能的结果表达式中的一个。CASE表达式可以用在任何允许使用表达式的地方，它不是一个完整的语句因此不能单独执行。CASE表达式有两种格式，**简单CASE表达式**和**搜索CASE表达式**。

1. 简单CASE表达式。简单CASE表达式将一个测试表达式和一组简单表达式进行比较，如果某个简单表达式与测试表达式值相等，则返回相应的结果表达式的值。

   **简单CASE表达式的语法为：**

   ```sql
   CASE 测试表达式
   WHEN 简单表达式1 THEN 结果表达式1
   WHEN 简单表达式2 THEN 结果表达式2
   ...
   WHEN 简单表达式n THEN 结果表达式n
   [ELSE 结果表达式 n+1]
   END
   ```

   其中：

   - 测试表达式可以是一个变量名、字段名、函数或子查询。
   - 简单表达式中不能包含比较运算符，其类型必须与测试表达式相同，或者可以隐式转化为测试表达式的类型。

   **CASE表达式的执行过程：**

   1. 计算测试表达式，然后从上到下的顺序将测试表达式与每个简单表达式进行比较。
   2. 如果某个简单表达式与测试表达式匹配，则返回第一个与之匹配的WHEN子句对应的结果表达式。
   3. 如果所有简单表达式的值与测试表达式都不匹配，若指定了ELSE子句，则返回ELSE子句对应的结果表达式，否则返回空（NULL）

   ```sql
   /*
   查询全体学生的信息，并对所在系用代码显示：
   ‘计算机系’代码为‘CS’
   ‘机电系’代码为‘JD’
   ‘信息管理系’代码为‘IM’
   其他系代码为‘QT’
   */
   SELECT Sno 学号, Sname 姓名, Ssex 性别,
   CASE Sdept
   	WHEN '计算机系' THEN 'CS'
   	WHEN '机电系' THEN 'JD'
   	WHEN '信息管理系' THEN 'IM'
   	ELSE 'QT'
   END 所在系
   FROM Student
   ```

2. 搜索CASE表达式

   **搜索CASE语法格式为：**

   ```sql
   CASE
   WHEN 布尔表达式1 THEN 结果表达式1
   WHEN 布尔表达式2 THEN 结果表达式2
   ...
   WHEN 布尔表达式n THEN 结果表达式n
   [ELSE 结果表达式n+1]
   END
   ```

   **与CASE简单表达式相比，搜索CASE表达式有如下两个区别：**

   1. 在CASE关键字后没有表达式
   2. 在WHEN关键字后是布尔表达式

   **搜索CASE表达式的执行过程：**

   1. 按从上到下顺序计算每个布尔表达式。
   2. 返回第一个取值为TRUE的布尔表达式对应的结果表达式。
   3. 如果没有取值为TRUE的不而表达式，若存在ELSE，返回相应结果表达式，否则返回空（NULL）

   ```sql
   /*
   查询全体学生的信息，并对所在系用代码显示：
   ‘计算机系’代码为‘CS’
   ‘机电系’代码为‘JD’
   ‘信息管理系’代码为‘IM’
   其他系代码为‘QT’
   */
   SELECT Sno 学号, Sname 姓名, Ssex 性别,
   CASE
   	WHEN Sdept = '计算机系' THEN 'CS'
   	WHEN Sdept = '机电系' THEN 'JD'
   	WHEN Sdept = '信息管理系' THEN 'IM'
   	ELSE 'QT'
   END 所在系
   FROM Student
   ```

3. 一些CASE样例

   ```sql
   /*
   查询‘C01’号课程的考试情况，列出学号和成绩，同时对成绩进行处理
   如果成绩大于等于90，则显示‘优’
   如果成绩在80到89之间，则显示‘良’
   如果成绩在70到79之间，则显示‘中’
   如果成绩在60到69之间，则显示‘合格’
   如果成绩小于60，则显示不合格
   */
   SELECT Sno, Grade
   CASE
   	WHEN Grade >= 90 THEN '优'
   	WHEN Grade BETWEEN 80 AND 89 THEN '良'
   	WHEN Grade BETWEEN 70 AND 79 THEN '中'
   	WHEN Grade BETWEEN 60 AND 69 THEN '及格'
   	WHEN Grade < 60 THEN '不及格'
   END 等级
   FROM SC
   WHERE Cno='C01'
   
   /*
   统计‘计算机系’每个学生的选课门数，包括没有选课的学生。
   列出学号、选课门数和选课情况，其中对选课情况的处理为：
   如果选课门数超过4门，则选课情况为‘多’
   如果选课门数在2～4之间，则为‘一般’
   如果选课门数在1～2,则为‘少’
   如果没有选课，则为‘未选’
   并将查询结果按选课门数降序排序
   */
   SELECT Sno 学号, COUNT(SC.Cno) 选课门数,
   CASE
   	WHEN COUNT(SC.Cno) > 3 THEN '多'
   	WHEN COUNT(SC.Cno) BETWEEN 2 AND 3 THEN '一般'
   	WHEN COUNT(SC.Cno) = 1 THEN '少'
   	WHEN COUNT(SC.Cno) = 0 THEN '未选'
   END 选课情况
   FROM Student S LEFT JOIN SC ON S.Sno = SC.Sno
   WHERE Sdept = '计算机系'
   GROUP BY S.Sno
   ```

### 将查询结果保存到表中

SELECT语句产生的查询结果是保存在内存中的，如果希望将查询结果永久保存，比如保存在一个物理表中，可以通过在SELECT语句中使用INTO子句。

**包含INTO子句的SELECT语句语法格式为：**

```sql
SELECT 查询列表序列 INTO <新表名>
FROM 数据源
[...] -- 其他条件子句、分组子句等

/*
注：在MYSQL中，没有SELECT ... INTO 语句，有以下替代方法
*/
-- 创建一个新表，并将查询结果存入表中
CREATE TABLE <新表名> <SELECT 语句>
-- 将查询结果插入到已存在的表中
INSERT INTO <表名> <SELECT 语句>
```

这个语句包含如下3个功能：

1. 执行查询语句产生结果集。
2. 根据查询结果创建一个新表，新表中各列的列名就是查询结果集中的列名，类型就是该列在原表中定义的类型，如果查询结果是聚合函数或表达式等经过计算的结果，则新表中对应的列的数据类型是这些函数或表达式返回的数据类型。
3. 将查询结果集按列对应顺序保存到该新表中。

```sql
-- 将‘计算机系’学生的学号、姓名、性别、年龄保存到新表Student_CS中
SELECT Sno, Sname, Ssex, YEAR(GETDATE())-YEAR(Sbirthday) Sage
INTO Student_CS
FROM Student
WHERE Sdept = '计算机系'
```

### 子查询

在SQL语言中，一个SELECT-FROM-WHERE语句称为一个查询块。如果一个SELECT语句嵌套在一个SELECT、INSERT、UPDATE或DELETE语句中，则称之为**子查询(subquery)**或内层查询；而包含子查询的语句称为**主查询**或外层查询。子查询可以出现在任何能够使用表达式的地方，但通常情况下，子查询语句通常出现在主查询的WHERE子句或HAVING子句，与比较运算符或逻辑运算符一起构成查询条件。

**写在WHERE子句中的子查询通常有如下几种形式：**

- WHERE <列名> [NOT] IN (子查询)
- WHERE <列名> 比较运算符 (子查询)
- WHERE EXISTS (子查询)

1. 使用子查询进行基于集合的测试

   使用子查询进行基于集合的测试时，通过运算符IN或 NOT IN，将一个列的值与子查询的结果集进行比较。通常形式为：

   WHERE <列名> [NOT] IN (子查询)

   注：在使用IN运算符的子查询时，由该子查询返回的结果集中的列的个数、类型以及语义必须与外层一致。

   ```sql
   -- 查询与‘张三’在同一个系学习的学生学号、姓名、性别、所在系
   SELECT Sno, Sname, Ssex, Sdept FROM Student
   WHERE Sdept IN (
   SELECT Sdept FROM Student WHERE Sname = '张三'
   )
   ```

2. 使用子查询进行比较测试

   使用子查询进行比较测试时，通过比较运算符(=, !=, <, >, <=, >=)，将一个列的值与子查询返回的结果进行比较。通常形式为：

   WHERE <列名> 比较运算符 (子查询)

   注：使用子查询进行比较测试时，要求子查询必须是返回单值的查询语句。

   ```sql
   -- 查询选了'C01'课程且成绩高于平均值的学生的学号和成绩
   SELECT Sno, Grade FROM SC
   WHERE Cno='C01' AND Grade > (
       SELECT AVG(Grade) FROM SC WHERE Cno='C01'
   )
   ```

3. 带有ANY或ALL的子查询

   当子查询返回多个值时，可以使用ANY或ALL的子查询，它的具体含义如下：

   | 运算符 | 含义                       |
   | ------ | -------------------------- |
   | >  ANY | 大于子查询结果中某个值     |
   | < ANY  | 小于子查询结果中某个值     |
   | >= ANY | 大于等于子查询结果中某个值 |
   | <= ANY | 小于等于子查询结果中某个值 |
   | = ANY  | 等于子查询结果中某个值     |
   | != ANY | 不等于子查询结果中某个值   |
   | > ALL  | 大于子查询结果中所有值     |
   | < ALL  | 小于子查询结果中所有值     |
   | >= ALL | 大于等于子查询结果中所有值 |
   | <= ALL | 小于等于子查询结果中所有值 |
   | != ALL | 不等于子查询结果中所有值   |

   ```sql
   -- 查询比‘C01’课程成绩都高的选了‘C02’课程的学生的学号和成绩
   SELECT Sno, Grade FROM SC
   WHERE Cno='C01' AND Grade > ALL
   (
   SELECT Grade FROM SC WHERE Cno='C02'
   )
   ```

4. 带EXISTS谓词的子查询

   EXISTS代表存在量词$\exists$。使用带EXISTS谓词的子查询可以进行存在性测试，其基本使用形式为：

   WHERE [NOT] EXISTS

   带EXISTS谓词的子查询不返回查询的数据，只产生逻辑真值或假值。

   - EXISTS的含义：当子查询中有满足条件的数据时，返回真值，否则返回假值。
   - NOT EXISTS的含义：当子查询中有满足条件的数据时，返回假值，否则返回真值。

   ```sql
   -- 查询选了'C01'号课程的学生姓名
   SELECT Sname FROM Student
   WHERE EXISTS
   (
   SELECT * FROM SC
   WHERE SC.Sno = Student.Sno AND Cno='C04'
   )
   ```

   **带有EXISTS谓词的子查询需注意：**

   1. 带EXISTS谓词的子查询是先执行外层查询，然后再执行内层查询。由外层查询决定内层查询的结果，外层查询的结果决定内层查询的执行次数。

      **上列过程如下：**

      1. 无条件执行外层查询，在外层查询的结果集中取第一行结果，得到Sno中的一个当前值，然后根据此Sno值处理内层查询。
      2. 将外层的Sno值作为已知值执行内层查询，如果在内层查询中有满足其WHERE条件的记录存在，则EXISTS返回TRUE，表示在外层查询中当前行数据为满足条件的结果，否则返回FALSE
      3. 顺序处理外层表Student中第2、3...行数据，知道处理完所有行。

   2. 由于EXISTS的子查询只返回真值或假值，因此在子查询中执行列名没意义。

   样例：

   ```sql
   -- 查询至少选修了第三学期开设的全部课程的学生姓名
   SELECT Sname FROM Student
   WHERE NOT EXISTS (
   	SELECT * FROM Course
       WHERE Semester=3 AND NOT EXISTS (
       	SELECT * FROM SC
           WHERE SC.Sno = Student.Sno AND Course.Cno = SC.Cno
       )
   )
   
   /*
   此样例可理解为：不存在第三学期课程没有选的学生姓名
   */
   ```

### 查询的集合运算

SQL也提供了与关系代数中集合运算并、交和差对应的谓词，分别是UNION、INTERSECT、EXCEPT，当使用这些操作进行查询时，参与运算的两个查询需要分别用括号扩起来。

```sql
-- 查询‘计算机系’和‘机电系’的所有学生信息
(SELECT Sno, Sname, Ssex, Sdept
 FROM Student WHERE Sdept = '计算机系'
)
UNION
(SELECT Sno, Sname, Ssex, Sdept
 FROM Student WHERE Sdept = '机电系'
)

-- 查询同时选修了‘C01’与‘C02’课程的学生学号
(SELECT Sno FROM SC WHERE Cno='C01'
)
INTERSECT
(SELECT Sno FROM SC WHERE Cno='C02'
)

-- 查询选修了‘C01’但没选‘C02’课程的学生的学号
(SELECT Sno FROM SC WHERE Cno = 'C01'
)
EXCEPT
(SELECT Sno FROM SC WHERE Cno='C02'
)
```

注：mysql没有INTERSECT和EXCEPT语句，但可以用一些条件语句实现

---

原文链接：[CSDN](https://blog.csdn.net/qq_42464569/article/details/112249866)

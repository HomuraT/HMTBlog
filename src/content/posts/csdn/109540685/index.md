---
title: "二叉树排序树插入、创建、删除和查找"
published: 2020-11-08
description: ''
image: ''
tags: ["数据结构", "算法"]
category: "学习记录"
draft: false
lang: 'zh-CN'
---



# 二叉树排序树插入、创建、删除和查找

## 二叉排序树的概念

​	二叉排序树又称二叉查找树，它或者是一棵空树，或者是具有下列性质的二叉树

1. 若它的左子树不为空，则左子树上**所有**结点的值均小于根结点的值
2. 若它的右子树不为空，则右子树上**所有**结点的值均小于根节点的值
3. 它的左右子树也同样是二叉排序树



## 二叉排序树的插入

​	二叉排序树的插入就是按照二叉树的定义将新结点放到相应位置



**实现代码：**

```c
// 二叉排序树插入
void search_createBinarySortTree_insert(TreeNode* r, int value)
{
    int v = 0;
    while(1)
    {
        v = r->value;
        
        if(value < v)
        {
            // 当value小于当前结点的值时
            
            if(r->lchild == NULL)
            {
                // 若当前结点没有左子树，将value赋给当前节点的左子树
                
                // 创建一个二叉树结点并添加到当前结点的相应位置
                addTreeNodeChild(r, createTreeNode(value), 'l');
                return;
            }
            else
            {
                // 当当前节点有左子树，去左子树找
                r = r->lchild;
            }
        }
        else
        {
            // 当value大于当前节点的值时
            
            if(r->rchild == NULL)
            {
                // 若当前节点没有右子树，将value赋给当前节点的左子树
                
                addTreeNodeChild(r, createTreeNode(value), 'r');
                return;
            }
            else
            {
                // 当当前节点有右子树时，去右子树找
                r = r->rchild;
            }
        }
    }
}
```



## 通过数组创建二叉排序树

​	按顺序遍历数组，对每个元素进行二叉排序树插入操作



**实现代码：**

```c
// 生成二叉排序树
TreeNode* search_createBinarySortTree(int* arr, int len)
{
    // 因为一开始是空树，所有先创建一个根节点
    TreeNode* root = createTreeNode(arr[0]);
    
    // 对剩下的元素进行插入
    for(int i = 1; i < len; i ++)
    {
        search_createBinarySortTree_insert(root, arr[i]);
    }
    return root;
}

```



## 二叉排序树的删除

​	二叉排序树的删除有三种情况，叶子结点、有两棵子树的结点、有一棵子树的结点

1. **叶子结点**

   直接删除即可

2. **有两棵子树的结点**

   有几种方法可以实现，如①用左子树的最右结点替代当前结点、②用右子树的最左结点替代当前结点。

3. **有一棵子树的结点**

   用子树替代当前结点即可



**实现代码：**

```c
// 二叉排序树删除节点
/*
target：要删除的结点
parent：双亲结点
targetIs：要删除的结点是双亲的左孩子还是右孩子，'r'表示右孩子；'l'表示左孩子。为了看起来方便没用0，1表示但发现写起来还是用0，1舒服
*/
void search_createBinarySortTree_delete(TreeNode* target, TreeNode* parent, char targetIs)
{
    if(target->lchild == NULL && target->rchild == NULL)
    {
        // 是叶子结点，直接删除
        deleteTreeNodeChild(parent, targetIs);
    }
    else if(target->lchild && target->rchild)
    {
        TreeNode* tmp;
        TreeNode* tmp_past = NULL;
        // 有两个孩子结点

        /*
        用右子树的最左边结点替代当前结点
        */
        tmp = target->rchild;
        while(tmp->lchild)
        {
            tmp_past = tmp;
            tmp = tmp->lchild;
        }

        // 将要替换的结点从树中删除
        deleteTreeNodeChild(tmp_past? tmp_past:target, tmp_past? 'l':'r');

        // 替换要删除的节点
        // 替换子树
        tmp->rchild = target->rchild;
        tmp->lchild = target->lchild;
        // 替换双亲
        addTreeNodeChild(parent, tmp, targetIs);
    }
    else
    {
        // 当前结点只有一个子树
        char haveChild;
        if(target->lchild)
            haveChild = 'l';
        else
            haveChild = 'r';

        // 让子树替代当前节点的位置
        addTreeNodeChild(parent, deleteTreeNodeChild(target, haveChild), targetIs);
    }

    // 将要删除节点的子树置空
    deleteTreeNodeChild(target, 'r');
    deleteTreeNodeChild(target, 'l');
}
```



## 二叉树查找

​	查找相关的结点，若找到，删除并将其返回，否则返回空



**实现代码：**

```c
// 二叉树查找
// 返回删除的节点
TreeNode* search_binarySortTreeSearch(TreeNode* root, int value)
{
    // 用来存放要删除结点的双亲
    TreeNode* r_past = root;
    //RL：用来表示要删除的结点相对于双亲是左子树还是右子树
    char RL; 
    while(1)
    {
        // 未找到，返回空
        if(root == NULL) return NULL;

        // 找到，退出循环
        if(root->value == value)
        {
            break;
        }
        else if(value < root->value)
        {
            r_past = root;
            root = root->lchild;
            RL = 'l';
        }
        else
        {
            r_past = root;
            root = root->rchild;
            RL = 'r';
        }
    }

    // 删除相应结点，并返回
    search_createBinarySortTree_delete(root, r_past, RL);
    return root;
}
```



## 代码测试

**测试代码：**

```c
/*
测试数据：-1,5,2,7,1,4,6,8,3
因为忘记写根节点处理了，所有加个-1结点
*/

/*
tree：二叉排序树
value：要查找的树
*/
void print_result(TreeNode* tree, int value)
{
    tree = search_binarySortTreeSearch(tree, value);
    if(tree)
    {
        printf("找到值为 %d 的元素\n", tree->value);
    }
    else
    {
        printf("没找到值为 %d 的元素\n", value);
    }
    // 通过先序遍历和中序遍历确认树结构
    printf("\n先序遍历：");
    preOrder(tree, "%d ");
    printf("\n中序遍历：");
    inOrder(tree, "%d ");
}
```

**样例结构：**
![在这里插入图片描述](/images/csdn/708c75a1f3fbbcb21e980924.png)



**测试样例：**

1. 删除叶子结点

   删除 **8** 结点
   
   **结果：**
   
   ![在这里插入图片描述](/images/csdn/88f7aff5d3eaa40537896196.png) 

2. 有两个子树的结点

   删除 **5** 结点

   **结果：**

   ![在这里插入图片描述](/images/csdn/7d589b4ad26519fda4fd9d0b.png) 
![在这里插入图片描述](/images/csdn/cd88d985cd052e59ebbd41b2.png)

3. 有一个子树的结点

   删除 **4** 结点

   **结果：**

   ![在这里插入图片描述](/images/csdn/9092fc5b9215c989ee583d9a.png) 

4. 无效结点

   删除 **0** 结点

   **结果：**

   ![在这里插入图片描述](/images/csdn/a29b4290fa22e2cab2237141.png)

---

原文链接：[CSDN](https://blog.csdn.net/qq_42464569/article/details/109540685)

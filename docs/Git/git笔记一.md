### 1. 基础命令
```
$  git init      
//  初始化仓库，建立.git目录，又叫工作树，存储了管理当前目录所需的仓库数据

$  git status
//  查看当前工作树的状态 

$  git add
//  向暂存区添加文件，暂存区是提交之前的一个临时区域

$  git commit
//  从暂存区提交文件至本地仓库，git commit -m 'first commit'

$  git log
//  查看以往仓库中提交的日志，每个提交信息都会记录一个相应的 hash 值

$  git diff
//  查看工作树、暂存区、最新提交之间的差别

$  git remote add 
//  在推送远程仓库之前，需要添加远程仓库，本地仓库与远程仓库建立链接
//  示例 git remote add origin git@github.com:xxxxx，orgin可以理解为远程仓库的一个别名

$  git push
//  将本地仓库内容推送至远程仓库
//  示例 git push -u origin marster 其中 -u 可以在推送的同时与远程分支做关联，默认此分支为推送与拉取的远程分支的信息
```

- 对以上基础命令的补充拓展 
>`git log --pretty=short` 只显示第一行提交信息
`git log <fileName>`   只显示相应文件的提交日志
`git diff HEAD` 查看本次提交与上次提交之间有什么差别，HEAD 是指向当前分支中最新一次提交的指针（好习惯）
### 2. git 分支命令
在日常协作开发中，通常会建立不同的分支，不同的分支中，可以进行完全不同的作业，等到该分支作业完成后再与主分支 marster 合并
- `git branch` 显示分支一览表
列出当前仓库所有分支列表，第一个前面有 * 的为当前所在分支

- `git checkout -b` 创建，切换到其它分支
示例：创建名为 feature-A 的分支
  ```
  $  git checkout -b feature-A
  //  也可以使用下面的两条命令代替
  $  git branch feature-A
  $  git checkout feature-A
   ```
- `git merge` 合并分支
  >特性分支：集中实现单一功能主题的分支，除此之外不进行任何作业，如 feature-A
主干分支：特性分支的原点，主干分支中没有开发到一半的代码，可随时供他人查看，如 marster
|
*如果特性分支任务完成，需要将其合并至主干分支*
  ```
  //  将 feature-A 分支合并至 marster，首先要切换至 marster 分支
  $  git branch marster
  $  git merge --no-ff feature-A
  ```
  >  **! 注意：**   --no-ff 参数是禁止快进式合并，如果不加该参数，git 合并两个分支时，如果顺着 marster 可以到达 feature-A，就会简单的把 HEAD（最新一次 commit 记录） 指针移动到 feature-A 上，并没有创建 commit，如果删除分支的话会导致丢失信息；
- `git log --graph` 以图表的形式查看分支
使用该命令可以清晰地看到从第一次 commit 到当前状态的分支变化过程，可以借此命令输出提交日志
### 3. 进阶命令
- `git reset` 回溯历史版本（后悔药）
示例：回溯到创建特性分支 feature-A 之前，并且新创建一个 fix-B 分支

  ```
  $  git reset --hard 5894c5738cd2f23156f2992f983e8a8fcba6411f
  ```
  >**!注意：**
-- hard 后面的是想要回溯到时间点的 hash 值，可以通过 git log 查看；
使用该命令后，就完全回溯至指定版本了，同时指定版本以外的文件内容都会丢失，使用之前可以先将工作区内容 commit，**慎用！**；
可以通过 git pull origin marster 的方式重新更新至线上最新版本

  此时，创建一个新的特性分支 fix-B：`git checkout -b fix-B`，任务完成，这是需要回到回溯之前的时间点，但是 git log 只能展示以当前状态为最新状态的日志，这样就拿不到回溯之前的 hash 值，怎么办？
- `git reflog` 查看当前仓库执行过的所有的操作日志
使用 git reflog 可以找到回溯之前在特性分支 feature-A 合并之后时间点的 hash 值，继续使用 git reset --hard 回溯（推进）历史，到达回溯之前的状态，这时候需要将 fix-B 分支合并至主干分支，但是由于 feature-A 和 fix-B 更改的部分会产生冲突，所以需要解决冲突后再合并，最后提交解决后的结果。
- `git commit --amend` 修改提交信息
想要修改上一次提交信息可以使用此命令，在打开的编辑器中修改提交信息后保存关闭。
- `git rebase -i` 压缩提交历史
有时候我们提交完一次后发现有些小问题需要小修改，修改完之后又要提交一次，但是不想要这次提交信息出现在日志里，想要保证提交日志的连贯整洁。就需要将这次‘小修改’的提交压缩至上一次提交：
  ```
  $  git rebase -i HEAD~2
  //  HEAD~2 表示压缩的范围为 HEAD 所指的最新提交和上一次提交
  ```
   >执行此命令后，在自动打开的编辑器中将需要被压缩的提交‘小修改’的前缀 pick 改为 fixup 保存退出，压缩完毕，此时执行 git log 会发现‘小修改’不见了，但是修改的内容还在。

  *推荐常用此命令可以保持 git 提交日志的整洁性*

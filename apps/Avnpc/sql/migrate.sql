INSERT INTO avnpc.eva_blog_tags ( id, tagName)
SELECT  id, tagName
FROM    avnpc_old.eva_blog_tags;


INSERT INTO avnpc.	eva_blog_tags_posts ( tagId, postId)
SELECT  tag_id, post_id
FROM    avnpc_old.eva_blog_tags_posts;

INSERT INTO avnpc.	eva_blog_posts 
       ( `id`, `title`, `status`, `flag`, `visibility`, `codeType`, `language`, `parentId`, `slug`,      `createdAt`,                              `userId`, `username`,   `updatedAt`,                              `editorId`,  `editorName`, `commentStatus`, `commentType`)
SELECT  `id`, `title`, `status`, `flag`, `visibility`,  `codeType`, `language`, `parentId`,  `urlName`,  UNIX_TIMESTAMP(`createTime`)  + 3600 * 8, `user_id`, `user_name`,  UNIX_TIMESTAMP(`updateTime`) + 3600 * 8, `editor_id`, `editor_name`, `commentStatus`, `commentType`
FROM    avnpc_old.eva_blog_posts;

INSERT INTO avnpc.	eva_blog_texts ( postId, content)
SELECT  post_id, content
FROM    avnpc_old.eva_blog_texts;

INSERT INTO avnpc.	eva_comment_threads ( id, uniqueKey, permalink, title, defaultCommentStatus)
SELECT  id, CONCAT('post_', id), CONCAT('http://avnpc.com/pages/', slug), title, 'approved'
FROM    avnpc.eva_blog_posts;

INSERT INTO avnpc.	eva_comment_comments (
 `id`,  `threadId`,               `status`,  `codeType`, `content`, `rootId`,  `parentId`, `userId`, `username`, `email`, `userSite`)
SELECT
  id,   post_id, 'approved', 'markdown', content,  rootId,    parentId,   user_id,   user_name, email,   site
FROM    avnpc_old.eva_blog_comments;
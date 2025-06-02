export const buildCommentTree = (comments) => {
  // React Query からのデータを直接変更しないようにディープコピーを作成
  const cloned = comments.map(c => ({ ...c, replies: [] }))

  const commentMap = {}
  const roots = []

  cloned.forEach(comment => {
    commentMap[comment._id] = comment
  })

  cloned.forEach(comment => {
    if (comment.parent) {
      const parent = commentMap[comment.parent]
      if (parent) {
        parent.replies.push(comment)
      }
    } else {
      roots.push(comment)
    }
  })

  return roots
}

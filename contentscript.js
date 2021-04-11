
const {storage, tabs, runtime} = chrome

function findAllUsers() {
  const userLinkNodes = document.querySelectorAll('.comment-user .comment-user-right-top > a')
  const usersNamesArr = Array.from(userLinkNodes).map(v => v.innerText)
  const uniqueUserNames = [...new Set(usersNamesArr)]

  return uniqueUserNames
}

const allNames = findAllUsers()
if (allNames) {
  storage.sync.set({allNames})
}


function hideUsersComments(userNamesObject) {
  const commentsCollection = document.querySelectorAll('.comment-user')

  commentsCollection.forEach(comment => {
      const text = comment.querySelector('.comment-user-right-top > a')?.text
      const userNamesArr = Object.keys(userNamesObject)
        .filter(userId => userNamesObject[userId])
        .map(v => v.trim())

      if (userNamesArr.includes(text)) {
          comment.style.display = 'none'
      }
  })
}

storage.sync.get(['selectedUsers'], function(res) {
  if (res.selectedUsers) {
    hideUsersComments(res.selectedUsers)
  } else {
    console.log('There are no banned users in the storage')
  }
})

runtime.onMessage.addListener((request, sender, sendResponse) => {
    if(request && request.selectedUsers) {
      hideUsersComments(request.selectedUsers)
    }
});

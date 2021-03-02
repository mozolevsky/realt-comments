const userNamesInput = document.getElementById('user-names-id')
const saveBannedUsers = document.getElementById('save-banned-users')

const {storage, tabs} = chrome

const code = ([...userNames]) => `
function hideUsersComments(userNames) {
    const commentsCollection = document.querySelectorAll('.comment-user')
    let commentCollectionToHide = []

    commentsCollection.forEach(comment => {
        const text = comment.querySelector('.comment-user-right-top > a')?.text
        const userNamesArr = userNames.replace(' ', '').split(',')

        if (userNamesArr.includes(text)) {
            comment.style.display = 'none'
        }
    })
}

hideUsersComments('${userNames}')
`

const executeOnActiveTab = names => {
    tabs.query({active: true, currentWindow: true}, function(tabsElement) {
        tabs.executeScript(
            tabsElement[0].id,
            {code: code(names)}
        );
    });
}

saveBannedUsers.onclick = function(element) {
    const userNames = (userNamesInput.value || '').split(',')
    
    if (userNames.length) {
        storage.sync.set({names: userNames}, function() {
            storage.sync.get(['names'], function(res) {
                executeOnActiveTab(res.names)
            })
        });
    }
}

document.addEventListener("DOMContentLoaded", () => {
    storage.sync.get(['names'], function(res) {
        const {names} = res

        userNamesInput.value = names.length > 1 ? names.join(',') : names
        executeOnActiveTab(res.names)
    })
})






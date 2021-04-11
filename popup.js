const userForm = document.getElementById('user-names-id')
const checkboxParent = document.getElementById('checkbox-parent')
const saveBannedUsers = document.getElementById('save-banned-users')

const { storage, tabs, runtime } = chrome


/**
 * Store checkboxes state
 */
 let selectedUsers = {}
 storage.sync.get(['selectedUsers'], res => {
    if (res.selectedUsers) {
        selectedUsers = res.selectedUsers
    }
 })

const setStateInCheckboxes = () => {
    storage.sync.get(['selectedUsers'], function (res) {
        const { selectedUsers } = res

        Array.from(checkboxParent.children).forEach(({name, id}, idx) => {

            if (name === 'user' && selectedUsers[id]) {
                checkboxParent.children[idx].checked = selectedUsers[id]
            }
        })

    })
}

/**
 * Create UI checkboxes
*/
storage.sync.get(['allNames'], function (res) {
    const { allNames } = res

    allNames.forEach((name) => {
        const checkbox = document.createElement('input')
        checkbox.type = 'checkbox'
        checkbox.name = 'user'
        checkbox.value = name
        checkbox.id = name

        const label = document.createElement('label')
        label.for = name
        label.innerHTML = name

        const br = document.createElement('br')

        checkboxParent.insertBefore(checkbox, saveBannedUsers)
        checkboxParent.insertBefore(label, saveBannedUsers)
        checkboxParent.insertBefore(br, saveBannedUsers)
    })

    setStateInCheckboxes()
})

/**
 * Update selected users, when user click on check boxes
 */
checkboxParent.addEventListener('click', e => {
    const {target: {name, id, checked}} = e

    if (name === 'user') {
        selectedUsers = {
            ...selectedUsers,
            [id]: checked
        }
    }
})

/**
 * Save selected users and notify content script
 */
 userForm.addEventListener('submit', event => {
    event.preventDefault()

    if (selectedUsers) {
        storage.sync.set({ selectedUsers }, function () {
            tabs.query({ active: true, currentWindow: true }, function (tabs) {
                chrome.tabs.sendMessage(
                    tabs[0].id,
                    { selectedUsers },
                    response => {
                        console.log('Selected users were saved', response)
                    }
                )
            })
        })
    }
})

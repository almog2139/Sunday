import { httpService } from './httpService'
import { utilService } from './utilService'



export const userService = {
    login,
    logout,
    signup,
    getUsers,
    getUserById,
    remove,
    update,
    getLoggedinUser,
    updateNotifications,
    cleanNotifications,
    updateReadNotifications
}


function getUsers(txt) {
    var queryStr = (!txt) ? '' : `?fullname=${txt}`
    return httpService.get(`user${queryStr}`)
}

async function getUserById(userId) {

    const user = await httpService.get(`user/${userId}`)
    return user
}
function remove(userId) {
    return httpService.delete(`user/${userId}`)

}

async function update(user) {
    return await httpService.put(`user/${user._id}`, user)
    // Handle case in which admin updates other user's details
    // if (getLoggedinUser()._id === user._id) _saveLocalUser(user)
}



async function login(userCred) {
    try {
        // const users = await storageService.query('users')
        // const user = users.find(user => user.username === userCred.username && user.password === userCred.password)
        // if (user) return _saveLocalUser(user)
        // else throw new Error('not match')
        const user = await httpService.post('auth/login', userCred)
        if (user) return _saveLocalUser(user)
    } catch (err) {
        throw new Error('Could\'nt find users')
    }
}

async function signup(userCred) {
    const user = await httpService.post('auth/signup', userCred)
    return _saveLocalUser(user)
}

async function logout() {
    await httpService.post('auth/logout')
    sessionStorage.clear()
    return
}

function _saveLocalUser(user) {
    sessionStorage.setItem('loggedinUser', JSON.stringify(user))
    return user
}

function getLoggedinUser() {
    return JSON.parse(sessionStorage.getItem('loggedinUser'))
}

async function updateNotifications({ member, notificationTxt, user }) {


        const notification = {
            id: utilService.makeId(),
            notificationTxt,
            isRead: false,
            createdAt: Date.now(),
            byMember: {
                _id: user._id,
            fullname: user.fullname,
            imgUrl: user.imgUrl ? user.imgUrl : null
        }
    }
    
    const memberToAdd = await getUserById(member._id)
    
    if (!memberToAdd.notifications) {
        memberToAdd.notifications = [notification]
        
    } else {
        memberToAdd.notifications = [notification, ...memberToAdd.notifications]
    }
    return update(memberToAdd)

    
}

function updateReadNotifications(memberToUpdate) {
    if (memberToUpdate.notifications) {
        memberToUpdate.notifications.forEach(notification => notification.isRead = true);
        return update(memberToUpdate)
    }
}
async function cleanNotifications(userId) {
    const memberToUpdate = await getUserById(userId)
    memberToUpdate.notifications = []
    return update(memberToUpdate)
}

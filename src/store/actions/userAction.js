import { socketService } from '../../services/socketService.js';
import { userService } from '../../services/userService.js'

//function get some txt and search match names of app members return users in they name includes the txt 
export function query(txt) {
    return async () => {
        try {
            return await userService.getUsers(txt)
        } catch (err) {
        }
    }
}
//get curr user by the id
export function getUserById(userId) {
    return async () => {
        try {
            return await userService.getUserById(userId)
        } catch (err) {
        }
    }
}
//function get msg show in the modal
export function setMsg(msg) {
    return (dispatch) => {
        let action = {
            type: 'SET_MSG',
            msg
        }
        dispatch(action)
        setTimeout(() => {
            action = {
                type: 'CLEAR_MSG'
            }
            dispatch(action)
        }, 2000)
    }
}
//clear the msg 
export function clearMsg() {
    return (dispatch) => {
        const action = {
            type: 'CLEAR_MSG',

        }
        dispatch(action)
    }
}

//A function gets a username and password and checks if there is such a user in Mongo DB
export function checkLogin(credentials) {
    return async (dispatch) => {
        try {
            const user = await userService.login(credentials)
            const action = {
                type: 'SET_LOOGED_IN_USER',
                user
            }

            dispatch(action)
            return user
        } catch (err) {
            throw err
        }
    }
}
//A function receives a user and registers it for the application
export function signup(credentials) {
    return async (dispatch) => {
        try {
            const user = await userService.signup(credentials)
            const action = {
                type: 'SET_LOOGED_IN_USER',
                user
            }
            dispatch(action)
            return user
        } catch (err) {
            throw err
        }
    }
}

//log out the curr user from app
export function logOut() {
    return async (dispatch) => {
        try {
            await userService.logout()
            dispatch({ type: 'LOG_OUT' })
            dispatch({ type: 'SET_BOARDS', boards: [] })
            dispatch({ type: 'SET_CURR_BOARD', board: null })
        } catch (err) {
        }
    }
}
//update the user 
export function updateUser(newUserInfo) {
    return async (dispatch) => {
        try {
            const user = await userService.update(newUserInfo)
            const action = {
                type: 'SET_LOOGED_IN_USER',
                user
            }
            dispatch(action)
            return user
        } catch (err) {
            throw err
        }
    }
}
//update User Notifications
export function updateUserNotifications(user) {
    console.log('user action');
    return (dispatch) => {

        const action = {
            type: 'SET_LOOGED_IN_USER',
            user
        }
        dispatch(action)
    }
}
// clean Notifications
export function cleanNotifications(user) {

    return async () => {
        try {
            const userToUpdate = await userService.cleanNotifications(user)
            return (dispatch) => {

                const action = {
                    type: 'SET_LOOGED_IN_USER',
                    user: userToUpdate
                }
                dispatch(action)
            }

        } catch (err) {
            console.log(err);
        }
    }

}
// update Read Notifications
export function updateReadNotifications(user) {

    return async () => {
        try {
            const userToUpdate = await userService.updateReadNotifications(user)
            return (dispatch) => {

                const action = {
                    type: 'SET_LOOGED_IN_USER',
                    user: userToUpdate
                }
                dispatch(action)
            }

        } catch (err) {
            console.log(err);
        }
    }

}

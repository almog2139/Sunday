import { utilService } from "../../services/utilService"
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import moment from 'moment'
import DeleteOutlineOutlinedIcon from '@material-ui/icons/DeleteOutlineOutlined';
import { ClickAwayListener } from '@material-ui/core';
import { userService } from "../../services/userService";

export function UserNotification({ notifications,onRemoveNotifications ,onToggleUserNotifications,onUpdateNotifications}) {

    return (
        <ClickAwayListener onClickAway={() => {
            onUpdateNotifications()
            onToggleUserNotifications()
        }
        }>
            <section className="user-notifications">
                <header className="flex space-between align-center">
                    {notifications?.length ?
                        (<>
                            <h1>Notifications</h1>
                            <DeleteOutlineOutlinedIcon onClick={onRemoveNotifications}  />
                        </>)
                        : (<h1>You have no notifications</h1>)}

                </header>


                {notifications?.length > 0 && (notifications.map((notification, idx) => {

                    return <div key={idx} className="notification-details">
                        <div className="flex">
                            {notification.byMember.imgUrl ? <img src={notification.byMember.imgUrl} className="user-thumbnail" alt="" /> :
                                <span className="user-thumbnail">{utilService.getNameInitials(notification.byMember.fullname)}</span>
                            }
                            <p>{notification?.notificationTxt}</p>
                        </div>
                        <div className="time flex"> <AccessTimeIcon /><h4>{moment(notification.createdAt).from(Date.now())}</h4></div>
                    </div>
                })
                )}
            </section>
        </ClickAwayListener>

    )


}

import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { utilService } from '../services/utilService'
import moment from 'moment'
import { boardService } from '../services/boardService'
import SearchIcon from '@material-ui/icons/Search';

export class BoardActivities extends Component {

    state = {

        txt: '',

    }

    handleChange = (ev) => {

        this.setState({ txt: ev.target.value })

    }

    setActivitiesForDisplay = () => {
        const { activities } = this.props
        const filterRegex = new RegExp(this.state.txt, 'i');
        const filteredActivities = activities.filter(activity => filterRegex.test(activity.txt) || filterRegex.test(activity.byMember.fullname))
        return filteredActivities
    }
    render() {
        const { content, user, title, clear } = this.props
        const activities = this.setActivitiesForDisplay()
        return (<div>
            {title && <div className="activity-filter">
            <h2 className="activities-board-title"><span>{title}</span> Activities</h2>
                <div className="search-field relative">
                    <SearchIcon />
                    <input type="text" name="activity" placeholder="search" autoComplete="off" onChange={this.handleChange} />
                </div>
                <button onClick={clear}>Clear</button>
            </div>}
            <h3>{content}</h3>
            <div className="activity-list">
                {activities.map(activity => {
                    return <div key={activity.id} className="activity">
                        <div>
                            <h4>{moment(activity.createdAt).from(Date.now())}</h4>
                            <Link to={`/user/${activity.byMember._id}`}>  {activity.byMember.imgUrl ? <img src={activity.byMember.imgUrl} className="user-thumbnail" alt="" /> :
                                <div className="user-thumbnail">{utilService.getNameInitials(activity.byMember.fullname)}</div>}</Link>
                            <h2>{activity.byMember.fullname}</h2>
                        </div>
                        <div>
                            <h4 >{`${activity.byMember.fullname === user.fullname ? 'You' : activity.byMember.fullname} ${activity.txt}`}</h4>
                        </div>
                    </div>
                })}
            </div>
        </div>
        )
    }
}

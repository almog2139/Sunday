
import { Component } from 'react'
// import Badge from '@material-ui/core/Badge';
import { EditableElement } from './EditableElement';
import PeopleOutlineIcon from '@material-ui/icons/PeopleOutline';
import ReactTooltip from "react-tooltip";
import { BoardFilter } from './BoardFilter';
import { BoardMembers } from './BoardMembers';
import { BoardActivities } from './BoardActivities';
import { boardService } from '../services/boardService';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';



export class BoardHeader extends Component {


    state = {
        isShowBoardMember: false,
        isShowActivities: false
    }



    toggleMembersModal = () => {
        this.setState({ isShowBoardMember: !this.state.isShowBoardMember })
    }


    showActivities = () => {
        this.setState({ isShowActivities: false })
        boardService.updateActivities(this.props.board)
    }

    render() {

        const { board, onAddGroup, onChangeTitle, onChangeBoardMemebrs, onSetFilter, changeBoardView, user } = this.props
        const { isMobileFiltersOpen } = this.state;
        const unReadActivities = board.activities.filter(activity => !activity.isRead)
        const activities = board.activities.filter(activity => activity.isRead)
        if (!board) return <h1>Loading...</h1>
        return (

            <section className="board-header flex column space-between">
                <div className="flex align-center board-header-top-section">
                    <div className="board-name-and-owner">
                        <h2><EditableElement onChangeTitle={onChangeTitle}>{board.title}</EditableElement></h2>
                        <h4>{''}Owner :{board.createdBy.fullname}</h4>
                    </div>
                    <div className="flex space-between relative">
                        <span className="board-member-status top-section-item" data-tip data-for="members"
                            onClick={this.toggleMembersModal}> <PeopleOutlineIcon />/{board.members.length}</span>
                        {this.state.isShowBoardMember && <BoardMembers board={board}
                            onChangeBoardMemebrs={onChangeBoardMemebrs} onCloseModalMembers={this.toggleMembersModal} />}

                        <span className="activity-display top-section-item" onClick={() => this.setState({ isShowActivities: true })}> Activities
                         <span style={{ color: unReadActivities.length ? '#0085ff' : '' }}>{unReadActivities.length}</span>/{board.activities.length}</span>

                        <div className={`${this.state.isShowActivities ? 'close-Activities' : ''}`} onClick={this.showActivities}>
                        </div>
                        <div className={`activities ${this.state.isShowActivities ? 'open' : ''}`}>
                            <ArrowBackIcon onClick={this.showActivities} />
                            <BoardActivities activities={unReadActivities} user={user} clear={() => boardService.updateActivities(board, true)}
                                title={board.title} content={`New Activities ${unReadActivities.length}`} />
                            <BoardActivities activities={activities} user={user} content={`Activities Read ${activities.length}`} />
                        </div>

                    </div>
                </div>

                <div className=" flex space-between align-flex-end">
                    <div className="switch-view" >
                        <select onChange={changeBoardView} name="">
                            <option value="board">Board</option>
                            <option value="dashboard">DashBoard</option>
                        </select>
                    </div>
                    <div className="board-options flex align-flex-end relative">
                        <BoardFilter onSetFilter={onSetFilter} board={board} isMobileFiltersOpen={isMobileFiltersOpen} />
                        <button className="add-item" onClick={() => onAddGroup()}>New group</button>
                    </div>
                </div>
                <ReactTooltip className="sunday-tooltip" id="members" place="bottom" effect="solid">
                    Who is on this board?
      </ReactTooltip>
            </section>
        )
    }
}



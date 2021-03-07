import React, { Component } from 'react'
import { connect } from 'react-redux'
import { MainSideBar } from '../cmps/MainSideBar'
import { BoardSideBar } from '../cmps/BoardSideBar'
import { BoardPreview } from '../cmps/BoardPreview'
import { loadBoards, removeBoard, getBoardById, addBoard, updateBoards } from '../store/actions/boardAction.js'
import { logOut, setMsg, updateReadNotifications,cleanNotifications } from '../store/actions/userAction.js'
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import { boardService } from '../services/boardService'
import { socketService } from '../services/socketService'
import { Route } from 'react-router-dom';
import { Redirect } from 'react-router-dom'
import { CardUpdates } from '../cmps/CardUpdates'
import { DashBoard } from '../cmps/DashBoard'



class _BoardApp extends Component {
    state = {
        isBoardSideBarOpen: true,
        currBoard: null,
        boardTitle: '',

    }


    async componentDidMount() {
        const { loggedInUser, boards } = this.props
        socketService.setup()
        if (!loggedInUser) {
            this.props.history.push('/')
            return
        }
        socketService.on('boardUpdate', this.props.updateBoards)

        const { boardId } = this.props.match.params;
        if (!boardId) {
            const userBoards = await this.props.loadBoards(loggedInUser._id)
            if (userBoards.length) this.props.history.push(`/board/${userBoards[0]._id}`)
        }
        else if (!boards.length && boardId) await this.props.loadBoards(loggedInUser._id)

        if (boardId) {
            this.loadBoardById(boardId)
        }
    }

    componentWillUnmount() {
        socketService.off('boardUpdate', this.props.updateBoards)
        socketService.off('updateUser', this.props.updateUserNotifications)
        socketService.terminate()
    }

    async componentDidUpdate(prevProps) {
        if (prevProps.match.params.boardId !== this.props.match.params.boardId || prevProps.boards !== this.props.boards) {
            const { boardId } = this.props.match.params
            if (!boardId) return
            else {
                this.loadBoardById(boardId)
            }
        }
    }

    //get board from store
    loadBoards = () => {
        const { loadBoards, loggedInUser } = this.props
        loadBoards(loggedInUser._id)
    }
    //loading board by curr boardId
    loadBoardById = async (boardId) => {
        await this.props.getBoardById(boardId)
        // this.setState({ currBoard })
    }
    //make toggle on componemt
    toggleBoardSideBar = () => {
        this.setState({ isBoardSideBarOpen: !this.state.isBoardSideBarOpen })
    }
   //remove board from data  check if there another board move to  
    onDeleteBoard = async (boardId, boardIdx) => {

        await this.props.removeBoard(boardId)
        const { boards } = this.props
        const currBoardId = boardService.getBoardIdByIdx(boardIdx, boards)
        if (currBoardId) this.props.history.push(`/board/${currBoardId}`)
        else this.props.history.push('/board')
        this.props.setMsg('Board Successfully Deleted')
    }
    //adding new board 
    onAddBoard = (boardTitle) => {
        this.props.addBoard(boardTitle, this.props.loggedInUser)
        this.props.setMsg('Board Successfully Added')
    }

    //log out the user from loggedinuser
    onLogOut = async () => {
        await this.props.logOut()
    }
    //function that get board title from the input and set them on state
    onSetFilter = (boardTitle) => {
        this.setState({ boardTitle })
    }
    //funcion that get all boards from store and retrun only the board with boardTitle the exists on state
    getBoardsForDisplay = () => {
        const { boardTitle } = this.state
        const { boards } = this.props
        const filterRegex = new RegExp(boardTitle, 'i');
        const copyBoards = boards.filter(board => filterRegex.test(board.title));
        return copyBoards
    }
    //function that clean the notification 
    onCleanNotifications = () => {
        console.log('remove notifications');
        this.props.cleanNotifications(this.props.loggedInUser)

    }
    //function that update  the notification 
    onUpdateNotifications = () => {
        this.props.updateReadNotifications(this.props.loggedInUser)
    }



    render() {

        const { match, loggedInUser, msg, board } = this.props
        const { currBoard, isBoardSideBarOpen } = this.state
        if (!this.props.loggedInUser) return <Redirect exact to="/" />

        return <div>
            <div className="main-sidebar-container mobile">
                <MainSideBar onLogOut={this.onLogOut} user={loggedInUser}
                 onCleanNotifications={this.onCleanNotifications} onUpdateNotifications={this.onUpdateNotifications} />
            </div>
            <div className="board-app-container flex">
                <div className="main-sidebar-container desktop">
                    <MainSideBar onLogOut={this.onLogOut} user={loggedInUser} 
                     onCleanNotifications={this.onCleanNotifications} 
                    onUpdateNotifications={this.onUpdateNotifications} />
                </div>
                <div className={`board-sidebar-container ${!isBoardSideBarOpen ? 'closed' : ''}`}>
                    <button className="toggle-board-sidebar" onClick={this.toggleBoardSideBar}>
                        {isBoardSideBarOpen ? <ArrowBackIcon /> : <ArrowForwardIcon />}
                    </button>
                    <BoardSideBar boards={this.getBoardsForDisplay()} onDeleteBoard={this.onDeleteBoard} onAddBoard={this.onAddBoard} user={loggedInUser} onSetFilter={this.onSetFilter} />
                </div>
                <div className="board-preview-container">
                    {board && <BoardPreview />}
                </div>
                <div>
                    <Route path={`${match.path}/card/:cardId`} render={(props) => {
                        return <CardUpdates board={board} {...props} />
                    }} />
                </div>
                {msg && <div className="snackbar slide-top">{msg}</div>}
            </div>
        </div>
    }

}

const mapGlobalStateToProps = (state) => {
    return {
        loggedInUser: state.userReducer.loggedInUser,
        boards: state.boardReducer.boards,
        msg: state.userReducer.msg,
        board: state.boardReducer.board
    }
}
const mapDispatchToProps = {
    removeBoard,
    loadBoards,
    getBoardById,
    logOut,
    addBoard,
    updateBoards,
    setMsg,
    updateReadNotifications,
    cleanNotifications


}


export const BoardApp = connect(mapGlobalStateToProps, mapDispatchToProps)(_BoardApp);




import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import { Link } from 'react-router-dom'
import { Component } from 'react'
import { BoardSearch } from './BoardSearch';
import { TextField } from '@material-ui/core';
import { ConfirmModal } from './ConfirmModal';
import HomeIcon from '@material-ui/icons/Home';
import { SignalCellularNullRounded } from '@material-ui/icons';

export class BoardSideBar extends Component {

    state = {
        isAddBoard: false,
        boardTitle: '',
        isDelete: false,
        txt: '',
        idxBoardRemov:'',
        boardToRemove:null,
    }

    //function get the ev from the oninput  and set them on state 
    onInputChange = (ev) => {
        const value = ev.target.value;
        this.setState({ boardTitle: value });
    };
    //function add board
    onAddBoard = (ev) => {
        ev.preventDefault()
        if (!this.state.boardTitle) return
        this.props.onAddBoard(this.state.boardTitle)
        this.setState({ isAddBoard: false, boardTitle: '' })
    }
    //function that show the input adding board 
    toggleEditBoard = () => {
        this.setState({ isAddBoard: !this.state.isAddBoard });
    }
    
    //show the confirmmodal 
    onShowConfirmModal = (idx,board) => {
        this.setState({idxBoardRemov:idx,boardToRemove:board })
    }
    //function remove board 
    onDeleteBoard = (boardId, idx) => {
        this.setState({ idxBoardRemov: null }, () => this.props.onDeleteBoard(boardId, idx))

    }


    render() {

        const { boards, onDeleteBoard, user, onSetFilter } = this.props;
        const { boardTitle } = this.state
        return (
            <section className="board-side-bar">
                <div className="main-workspace-title flex">
                    <span className="letter flex">
                        <span>M</span>
                        <HomeIcon />
                    </span>
                    <span>Main workspace</span>
                </div>
                <div className="board-sidebar-controlles">
                    <BoardSearch onSetFilter={onSetFilter} />
                    {!this.state.isAddBoard && <span className="board-sidebar-action-btn" onClick={this.toggleEditBoard}><AddIcon />Add</span>}
                    {this.state.isAddBoard &&
                        <form onSubmit={this.onAddBoard}>
                            <TextField placeholder=" Board Name" autoFocus type="text" autoComplete="off"
                                value={boardTitle} onChange={this.onInputChange} />
                        </form>
                    }
                </div>
                <div>
                    <h3 className="board-sidebar-title" >My boards</h3>
                    <div>
                        {boards.map((board, idx) => {
                            return <div className="board-sidebar-row" key={board._id} >
                                <Link to={`/board/${board._id}`}>{board.title}</Link>
                                {(user._id === board.createdBy._id) && <DeleteIcon onClick={()=>this.onShowConfirmModal(idx,board)} />}
                                {/* {this.state.isDelete && <ConfirmModal id={board._id} arg={idx}
                            delete={this.onDeleteBoard} close={() => this.setState({ isDelete: false })} title={board.title} type={'Board'} />} */}
                            </div>
                        })}
                        {this.state.boardToRemove && <ConfirmModal id={this.state.boardToRemove?._id} arg={this.state.idxBoardRemov}
                            delete={this.onDeleteBoard} close={() => this.setState({ isDelete: false })} title={this.state.boardToRemove?.title} type={'Board'} />}
                    </div>
                </div>
            </section >

        )
    }
}

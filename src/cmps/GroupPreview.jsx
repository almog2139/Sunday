import { CardPreview } from "./CardPreview";
import React, { Component } from 'react'
import { EditableElement } from "./EditableElement";
import { Colors } from "./Colors.jsx";
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import ArrowDropDownOutlinedIcon from '@material-ui/icons/ArrowDropDownOutlined';
import DeleteIcon from '@material-ui/icons/Delete';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import BorderColorOutlinedIcon from '@material-ui/icons/BorderColorOutlined';
import SortIcon from '@material-ui/icons/Sort';
import { boardService } from "../services/boardService";
import { ConfirmModal } from "./ConfirmModal";
import ReactTooltip from "react-tooltip";
import { utilService } from "../services/utilService";
import DragIndicatorIcon from '@material-ui/icons/DragIndicator';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';



export class GroupPreview extends Component {
    state = {
        cardTitle: '',
        placeholder: '+ Add',
        isMenuShown: false,
        isMenuOnHover: false,
        isShowColors: false,
        sortGroupBy: '',
        isShowSortOptions: false,
        isSortActive: false,
        isDelete: false,
        isShowSortModal: false
    }

    componentDidUpdate(prevProps, prevState) {
        if (!prevProps.onDrag && this.props.onDrag) this.setState({ sortGroupBy: '' })
    }



    handleChange = (ev) => {
        const { value } = ev.target
        this.setState({ cardTitle: value })
    }

    //function allow add new card to group check if not have card title or this title only contains only spaces this show appropriate message
    onAddCard = async (ev) => {
        ev.preventDefault()
        const { onAddCard, group } = this.props
        if (!this.state.cardTitle || !this.state.cardTitle.replace(/\s/g, '').length) {
            this.setState({ placeholder: 'Activity required', cardTitle: '' })
            setTimeout(() => this.setState({ placeholder: '+Add Activity' }), 1000)
            return
        }
        onAddCard(this.state.cardTitle, group.id)
        this.setState({ cardTitle: '' })
    }

    //function get new  group title and change the prev title
    onChangeTitle = (groupTitle) => {
        const { group, onChangeGroupTitle } = this.props
        onChangeGroupTitle(groupTitle, group.id)
    }
    
    //function that affects the  main menu in the group
    onToggleMenu = () => {
        this.setState({ isMenuShown: !this.state.isMenuShown }, () => {
            if (this.state.isShowColors) this.toggleColorPallette();
        })
    }
    
    //function that affects the menu showing when the user moving the group
    toggleMenuHover = (toggleValue) => {
        this.setState({ isMenuOnHover: toggleValue });
    }
    
    //function that affects the appearance of a  menu color
    toggleColorPallette = () => {
        this.setState({ isShowColors: !this.state.isShowColors })
    }
    
    // onShowMemuOption = () => {
    //     console.log('2');
    //     this.setState({ isShowSortOptions: !this.state.isShowSortOptions })
    // }
    
    //A function that receives a parameter by which it knows what to sort by
    onSetGroupSort = (sortBy) => {
        this.setState({ sortGroupBy: sortBy, isSortActive: true, isShowSortModal: false })
    }
    
    //function that affects the appearance of a sort options menu
    onToggleMenuSort = () => {
        this.setState({ isShowSortModal: !this.state.isShowSortModal })
    }
    //A function that takes accordingly checks that we are not in a 
    //state of moving and sends to a service that will perform the appropriate visualization
    getGroupForDisplay = () => {
        const { sortGroupBy } = this.state
        const { group, onDrag } = this.props
        const copyGroup = JSON.parse(JSON.stringify(group))
        let cards;

        if (sortGroupBy && !onDrag) {

            if (sortGroupBy === 'name') cards = boardService.sortByTitle(copyGroup.cards)
            else cards = boardService.sortCardByDate(copyGroup.cards)

            copyGroup.cards = cards
        }


        return copyGroup
    }

    //function runing on all cards in group and set every status in object map
    get countStatus() {
        const group = this.getGroupForDisplay()
        var statusCount = group.cards.reduce((acc, card) => {
            // acc[card.status.text] = acc[card.status.text] ? acc[card.status.text] + 1 : 1;
            acc[card.status.text] = acc[card.status.text] ?
                { color: card.status.color, count: acc[card.status.text].count + 1 } : { color: card.status.color, count: 1 };
            return acc;
        }, {})

        Object.keys(statusCount).forEach(key => {
            // if (key === 'No status yet') statusCount[key].count = 0
            statusCount[key].count = Math.round((statusCount[key].count / group.cards.length) * 100);
        })
        return statusCount
    }
    //function that change group color
    onChangeGroupColor = (color, groupId) => {
        const { onChangeGroupColor } = this.props
        this.setState({ isShowColors: false, isMenuShown: false }, () => {
            onChangeGroupColor(color, groupId)
        })
    }
    //function effect confirm modal
    onShowConfirmModal = () => {
        this.setState({ isDelete: true, isMenuShown: false })
    }

    render() {
        const { onDeleteCard, onRemoveGroup, idx, onDrag } = this.props
        const group = onDrag ? this.props.group : this.getGroupForDisplay()
        const statusCount = this.countStatus
        const { color } = group.style;
        const { isMenuOnHover } = this.state;
        return (

            <Draggable draggableId={group.id} index={idx}>
                {(provided) => (
                    <div className="group-container flex column"
                        {...provided.draggableProps}
                        ref={provided.innerRef}>
                        <div className="group-header">
                            <ArrowDropDownOutlinedIcon onMouseEnter={() => this.toggleMenuHover(true)} onMouseLeave={() => this.toggleMenuHover(false)}
                                className="group-menu-icon" style={{
                                    backgroundColor: isMenuOnHover ? '#f9f9f9' : color, color: !isMenuOnHover ?
                                        '#f9f9f9' : color, border: `1px solid ${color}`
                                }}
                                onClick={this.onToggleMenu} />
                            {this.state.isMenuShown && <ClickAwayListener onClickAway={this.onToggleMenu}>
                                <MenuList className="group-modal">

                                    <MenuItem onClick={this.toggleColorPallette}>
                                        <ListItemIcon>
                                            <BorderColorOutlinedIcon className="btn-change-group-color" />
                                        </ListItemIcon>
                                        <span> Change Group Color</span>
                                    </MenuItem>

                                    <MenuItem onClick={this.onShowConfirmModal}>
                                        <ListItemIcon >
                                            <DeleteIcon className="group-modal-icon" />
                                        </ListItemIcon>
                                        <span>Delete Group</span>
                                    </MenuItem>

                                    <MenuItem onClick={this.onToggleMenuSort} className="relative">
                                        <ListItemIcon >
                                            <SortIcon className="group-modal-icon" />
                                        </ListItemIcon>
                                        <span>Sort By</span>
                                    </MenuItem>


                                    {this.state.isShowSortModal && <ClickAwayListener onClickAway={this.onToggleMenuSort}>
                                        <MenuList className="group-sort-modal">

                                            <MenuItem onClick={() => { this.onSetGroupSort('date') }}>
                                                <ListItemIcon>
                                                    <span>Date</span>
                                                </ListItemIcon>
                                            </MenuItem>

                                            <MenuItem onClick={() => this.onSetGroupSort('name')}>
                                                <ListItemIcon >
                                                    <span>Name</span>
                                                </ListItemIcon>
                                            </MenuItem>
                                        </MenuList>
                                    </ClickAwayListener>
                                    }
                                    {this.state.isShowColors &&
                                        <ClickAwayListener onClickAway={this.toggleColorPallette}>
                                            <Colors onChangeColor={this.onChangeGroupColor} data={group.id} />
                                        </ClickAwayListener>
                                    }


                                </MenuList>
                            </ClickAwayListener>
                            }


                            {this.state.isDelete && <ConfirmModal id={group}
                                delete={onRemoveGroup} close={() => this.setState({ isDelete: false })} title={group.title} type={'Group'} />}
                            <div className="drag-icon" {...provided.dragHandleProps}>
                                <DragIndicatorIcon />
                            </div>
                            <h2 style={{ color: group.style.color }}><EditableElement onChangeTitle={this.onChangeTitle}>{group.title}</EditableElement></h2>
                            <h4>Members</h4>
                            <h4>Status</h4>
                            <h4 onClick={() => { this.onSetGroupSort('date') }} style={{ cursor: 'pointer' }} data-tip data-for='sort-by-date'>Due-Date</h4>
                            <h4>Working Days</h4>
                            <h4>Priority</h4>
                            <ReactTooltip className="sunday-tooltip" id="sort-by-date" place="top" effect="solid">Sort By Date</ReactTooltip>
                        </div>

                        <Droppable droppableId={group.id} isCombineEnabled type='card'>
                            {(provided) => (
                                <div
                                    {...provided.dragHandleProps}
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}>
                                    {provided.placeholder}

                                    {group.cards.map((card, idx) => {
                                        return (

                                            <CardPreview  key={card.id} card={card} idx={idx} group={group} onDeleteCard={onDeleteCard}
                                                cardColor={this.state.cardColor} />
                                        )
                                    })}

                                </div>
                            )}
                        </Droppable>
                        <div className="group-bottom-section-input">
                            <div style={{ backgroundColor: group.style.color }}></div>
                            <form onSubmit={this.onAddCard}>
                                <input className="add-card-input" type="text" placeholder={this.state.placeholder} name="activity"
                                    autoComplete="off" value={this.state.cardTitle} onChange={this.handleChange} />
                            </form>
                            <div style={{ backgroundColor: '#E6E9EF' }}></div>
                        </div>
                        <div className="group-bottom-section-utils">
                            <div className="progress-status">
                                {Object.keys(statusCount).map((key, idx) => {
                                    let id = utilService.makeId()
                                    return < div key={idx} style={{ width: statusCount[key].count + '%', background: statusCount[key].color }} data-tip data-for={id}>
                                        <ReactTooltip className="sunday-tooltip" id={id} place="bottom" effect="solid">
                                            <span className="tool-tip-txt"> {`${key} ${Math.floor(statusCount[key].count)}% ${Math.ceil((statusCount[key].count * group.cards.length) / 100)}/${group.cards.length}`}</span>
                                        </ReactTooltip>
                                    </div>
                                })}
                            </div>
                        </div>


                    </div>
                )
                }
            </Draggable>


        )


    }
}


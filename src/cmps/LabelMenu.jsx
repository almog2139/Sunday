import React, { Component } from 'react'
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import { Colors } from './Colors';
import { TextField } from '@material-ui/core';


export class LabelMenu extends Component {

    state = {
        currLabel: null,
        isOpen: false,
        isAddLabelOpen: false,
        isColorPalletteOpen: false,
        showAddLabelError: false,
        newLabel: {
            text: '',
            color: null
        }
    }

    componentWillUnmount() {
        this.setState({ newLabel: { text: '', color: null } });
    }


    //function that effect of label menu  show
    toggleMenu = () => {
        const { isOpen } = this.state;
        this.setState({ isOpen: !isOpen });
    }
    
    //function  effect of label menu ( add label)
    toggleAddNewLabel = () => {
        const { isAddLabelOpen } = this.state;
        this.setState({ isAddLabelOpen: !isAddLabelOpen });
    }

    //check the new label get text and color if not set error msg 
    toggleAddLabelError = () => {
        this.setState({ showAddLabelError: true }, () => {
            setTimeout(() => {
                this.setState({ showAddLabelError: false });
            }, 1500);
        });
        this.props.msg('yoy must fill text and color!')
    }

    //when user click on some label this funcion get the label and check if label text is the same close the menu ,else set the new label to the curr label
    setCurrLabel = (newLabel) => {
        console.log('newLabel',newLabel);
        const { currLabel } = this.props
        if (currLabel.text === newLabel.text) {
            this.toggleMenu();
            return
        }
        this.setState({ currLabel: newLabel }, () => {
            this.props.onSaveLabel(newLabel, this.props.labelName);
            this.toggleMenu();
        });
    }

    //function change label color
    setNewLabelColor = (color) => {
        const { newLabel } = this.state
        newLabel.color = color;
        this.setState({ newLabel })
    }
    
    //fuction that alow to add label and check that all field are complete
    addLabel = (ev) => {
        ev.preventDefault();
        const { onAddLabel, labelGroup } = this.props;
        const { newLabel } = this.state;
        if (!newLabel.text || !newLabel.color) {
            this.toggleAddLabelError();
            return;
        }
        onAddLabel(newLabel, labelGroup);
        this.toggleAddNewLabel();
    }
    //change label text every ev oninput on input
    handleInput = (ev) => {
        console.log('handleInput');
        const { name, value } = ev.target
        const { newLabel } = this.state;
        newLabel[name] = value;
        this.setState({ newLabel })
    }

    render() {
        const { labels, currLabel, enableAdding } = this.props;
        const { isAddLabelOpen, isOpen, showAddLabelError, newLabel } = this.state;
        return <div className="labels-menu-container">
            <div className="labels-menu-chosen-item" onClick={this.toggleMenu} style={{ backgroundColor: currLabel.color }}>
                {currLabel.text}
                <span className="fold"></span>
            </div>
            {isOpen &&
                <ClickAwayListener onClickAway={this.toggleMenu}>
                    <div onBlur={this.toggleMenu} className="labels-menu-floating-container">
                        <div className="labels-grid">
                            {labels.map((label, idx) => {
                                return <div key={idx} className="labels-menu-item" onClick={() => this.setCurrLabel(label)}
                                    style={{ backgroundColor: label.color }}>
                                    {label.text}
                                </div>
                            })}
                            {enableAdding &&
                                <div className="labels-menu-item new-label" onClick={this.toggleAddNewLabel}>
                                    Add {this.props.labelName}
                                </div>}
                        </div>
                        {(isAddLabelOpen && enableAdding) && <div className="add-new-label-container">
                            <div className="flex space-between">
                                <span onClick={this.toggleAddNewLabel}>Cancel</span>
                                <span onClick={this.addLabel}>Save</span>
                            </div>
                            <form onSubmit={this.addLabel} className="relative">
                                <span style={{ backgroundColor: `${newLabel.color ? newLabel.color : ''}` }} className="color-preview"></span>
                                <TextField name="text" autoComplete="off" placeholder={showAddLabelError ? "Please enter label + color" : "Enter label"} onChange={this.handleInput} />
                            </form>
                            <Colors onChangeColor={this.setNewLabelColor} />
                        </div>}

                    </div>
                </ClickAwayListener>
            }
        </div>
    }
}



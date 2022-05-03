import React, { Component } from 'react';
import PT from 'prop-types';

import {
	ActionDropdownBed, DropdownTrigger, DropdownItemsWrapper, DropdownItem, DropdownItemTitleBed, DropdownItemLabel,
	DropdownItemIcon, DropdownItemDescription
} from './actionDropdown.styled';
import { Popper } from "@material-ui/core";

const uuid = require('uuid/v4');

export const getItemNameByContext = (items, context, placeholder) => {
	const item = items.find(i=>i.context == context)
	return item ? item.label : placeholder;
};


class ActionDropdown extends Component {
	constructor(props) {
		super(props);

		this.state = {
			anchorEl: null
		};

		this.dropdownTriggerRef = React.createRef();
		this.dropdownItemsWrapperRef = React.createRef();
		this.dropdownBedRef = React.createRef();
	}

	componentWillUnmount() {
		document.removeEventListener('mousedown', this.handleDocumentClick, false);
	}

	onDropdownButtonClicked = (event, type) => {
		const {anchorEl} = this.state;
		const {onClick, disabled} = this.props;

		if (!disabled) {
			if (Boolean(anchorEl)) {
				this.hideDropdown();
			}
			else {
				this.showDropdown(event, type);
			}
		}

		if (onClick) {
			onClick();
		}

		event.stopPropagation();
	};

	onDropdownItemClicked = (item) => {
		this.hideDropdown();
		item.onClick(item.context);
	};

	onKeydown = (event) => {
		if (event.key === 'Escape') {
			this.hideDropdown();
		}
	};

	hideDropdown = () => {
		document.removeEventListener('mousedown', this.handleDocumentClick, false);
		document.addEventListener('keydown', this.onKeydown);
		this.setState({anchorEl: null});
	};

	showDropdown = (event, type) => {
		document.addEventListener('mousedown', this.handleDocumentClick, false);
		document.addEventListener('keydown', this.onKeydown);
		this.setState({anchorEl: event.target}, () => {
			if (type === 'keypress') {
				this.dropdownItemsWrapperRef.current.firstChild.focus();
			}
		});
	};

	handleDocumentClick = (event) => {
		event.stopPropagation();
		event.preventDefault();

		if (this.dropdownItemsWrapperRef.current && this.dropdownItemsWrapperRef.current.contains(event.target)) {
			return;
		}

		if (this.dropdownTriggerRef.current && this.dropdownTriggerRef.current.contains(event.target)) {
			return;
		}

		this.hideDropdown();
	};

	render() {
		const {anchorEl} = this.state;
		const {disablePortal, children, items, id, disabled, width, placement, align} = this.props;
		const open = Boolean(anchorEl);
		let alignConvertPlacement = null;
		if (align) {
			alignConvertPlacement = align === 'LEFT' ? 'bottom-start' : 'bottom-end';
		}

		return (
			<ActionDropdownBed id={id} role="menu" ref={this.dropdownBedRef}>
				<DropdownTrigger ref={this.dropdownTriggerRef} disabled={disabled}>
					{
						React.cloneElement(children, {
							onClick: this.onDropdownButtonClicked,
							'aria-haspopup': 'true',
						})
					}
				</DropdownTrigger>
					<Popper id={id} open={open} anchorEl={anchorEl} style={{zIndex: 10000}} disablePortal={disablePortal} placement={alignConvertPlacement || placement}>
						<DropdownItemsWrapper name="popover-content"
						                      width={width}
						                      ref={this.dropdownItemsWrapperRef}>
							{items.map((item, index) => (
								<DropdownItem
									key={uuid()}
									name={item.key || item.label}
									showBottomBorder={!!item.description && index !== items.length - 1}
									onClick={(event) => {
										event.preventDefault();
										event.stopPropagation();
										this.onDropdownItemClicked(item);
									}}
								>
									<DropdownItemTitleBed isDestructive={!!item.isDestructive}>
										{item.iconClass && <DropdownItemIcon className={item.iconClass}/>}
										<DropdownItemLabel bold={!!item.description}>{item.label}</DropdownItemLabel>
									</DropdownItemTitleBed>
									{item.description &&
									<DropdownItemDescription>{item.description}</DropdownItemDescription>}
								</DropdownItem>
							))}
						</DropdownItemsWrapper>
					</Popper>

			</ActionDropdownBed>
		);
	}
}

ActionDropdown.Align = {
	RIGHT: 'RIGHT',
	LEFT: 'LEFT',
};

ActionDropdown.propTypes = {
	children: PT.node,
	onClick: PT.func,
	items: PT.arrayOf(PT.shape({label: PT.string, onClick: PT.func})).isRequired,
	disablePortal: PT.bool,
	disabled: PT.bool,
	width: PT.string,
	align: PT.oneOf(Object.values(ActionDropdown.Align), null),
	placement: PT.oneOf(['auto-start', 'auto', 'bottom-end', 'bottom-start', 'bottom', 'left-end', 'left-start', 'left', 'right-end', 'right-start', 'right', 'top-end', 'top-start', 'top'])
};

ActionDropdown.defaultProps = {
	children: <div/>,
	disablePortal: false,
	disabled: false,
	width: 'auto',
	align: null,
	placement: 'bottom-start'
};

export { ActionDropdown };

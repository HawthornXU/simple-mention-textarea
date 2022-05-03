import styled from 'styled-components';
import { Button } from '../../../spond-frontend/spond-web-common-js/src/js/components/button';

const ActionDropdownBed = styled.div`
  display: inline-flex;
  position: relative;
`;

const DropdownTrigger = styled.div`
  display: flex;
  opacity: ${({disabled}) => disabled ? 0.7 : 1};
`;

const DropdownButton = styled(Button)`
  padding: .2em .4em;
  background-color: transparent;
`;

const LargeDropdownButton = styled(Button)`
  background-color: transparent;

  &:hover {
    box-shadow: ${({theme}) => theme.border.outline.regular};
  }

  &:focus {
    box-shadow: ${({theme}) => `${theme.border.outline.regular} !important`};
  }
`;

const DropdownItemsWrapper = styled.div`
  background-color: white;
  border: 1px solid ${({theme}) => theme.border.color.light};
  border-radius: ${({theme}) => theme.border.radius.menu};
  box-shadow: ${({theme}) => theme.border.shadow.regular};
  display: flex;
  flex-direction: column;
  list-style: none;
  padding: 0.5em;
  margin-top: 5px;
  min-width: 220px;
  width: ${({width}) => width};
  text-align: left;
`;

const DropdownItem = styled.div`
  align-content: flex-start;
  background-color: transparent;
  border: 0;
  cursor: pointer;
  padding: .5em;
  text-decoration: none;
  width:100%;
  text-align: left;

  &:focus {
    box-shadow: ${({theme}) => theme.state.focus.outline};
    outline: 0;
  }

  &:hover {
    background-color: ${({theme}) => theme.background.color.hover};
    cursor: pointer;
  }

  border-bottom:${({theme, showBottomBorder}) => showBottomBorder ? ` 1px solid ${theme.border.color.light}` : 'none'};
`;

const DropdownItemTitleBed = styled.div`
  display: flex;
  align-items: center;
  color: ${({theme, isDestructive}) => isDestructive ? theme.text.color.red : theme.text.color.dark};
  i {
    color: ${({theme, isDestructive}) => isDestructive ? theme.text.color.red : theme.text.color.dark};
  }
`;

const DropdownItemLabel = styled.div`
  font-size: ${({theme}) => theme.text.size.regular};
  font-weight: ${({theme, bold}) => bold ? theme.text.weight.bold : theme.text.weight.regular};
`;

const DropdownItemDescription = styled.div`
  font-size: ${({theme}) => theme.text.size.subBase};
  color: ${props => props.theme.text.color.medium};
  padding: 0.5em 0;
`;

const DropdownItemIcon = styled.i`
  font-size: ${({theme}) => theme.text.size.heading1};
  color: ${props => props.theme.text.color.dark};
  margin-right: 1rem;
`;

const ActionIndicator = styled.div`
  color: ${({theme}) => theme.text.color.medium};
  padding-right: 10px;
  font-weight: ${({theme}) => theme.text.weight.bold};
`;


export {
	ActionDropdownBed, DropdownTrigger, DropdownItemTitleBed, DropdownItemsWrapper, DropdownItem, DropdownButton,
	LargeDropdownButton, DropdownItemLabel, DropdownItemIcon, DropdownItemDescription, ActionIndicator
};

import styled, { css } from 'styled-components';
import { TextareaStyle } from './textarea.styled'

const placeholder = css`
  &::before {
    content: attr(placeholder);
    pointer-events: none;
    color: ${({theme}) => theme.text.color.light};
    position: absolute;
  }
`

export const Textarea = styled.div<{ref:any, hasEmpty: boolean, disabled?: boolean, marginTop?: string, fontSize?: string, minHeight?: string}>`
  ${TextareaStyle};
  display: block;
  outline: none;
  user-select: text;
  white-space: pre-wrap;
  overflow-wrap: break-word;

  ${({hasEmpty}) => hasEmpty ? placeholder : ''}


`

export const MentionItemsWrapper = styled.div<{ref: any, name: string, width: number | undefined}>`
  background-color: white;
  border-radius: ${({theme}) => theme.border.radius.menu};
  box-shadow: ${({theme}) => theme.border.shadow.regular};
  display: flex;
  overflow-y: auto;
  flex-direction: column;
  list-style: none;
  min-width: 300px;
  width: ${({width}) => width || 'auto'};
  max-height: 175px;
  text-align: left;
`

export const DropdownItem = styled.div<{isIntended: boolean}>`
  flex:0 0 50px;
  display: flex;
  background-color: ${({isIntended, theme}) => isIntended ? theme.state.color.elementSelected : 'transparent'};
  user-select: none;
  cursor: pointer;
`;

export const AvatarBed = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 0 0 64px;
`

export const DropdownItemTextBed = styled.div`
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  border-bottom: 1px solid ${({theme}) => theme.border.color.light};
`
export const DropdownItemTitle = styled.div`
`;
export const DropdownItemSubtitle = styled.div`
  font-size: ${({theme}) => theme.text.size.miniBase};
  color: ${({theme}) => theme.text.color.medium};
`;

export const HighlightedMark = styled.mark`
  font-weight: ${({theme}) => theme.text.weight.bold};
`;
export const MentionSpan = styled.span`
  color: ${({theme}) => theme.text.color.primary};
  cursor: pointer;
`;

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

const Textarea = styled.div<{ref:any, hasEmpty: boolean, disabled?: boolean, marginTop?: string, fontSize?: string, minHeight?: string}>`
  ${TextareaStyle};
  display: block;

  ${({hasEmpty}) => hasEmpty ? placeholder : ''}


`
const MentionMarkSpan = styled.span`
  color: ${({theme}) => theme.text.color.primary};
`

export const MentionItemsWrapper = styled.div<{ref: any, name: string, width: number | undefined}>`
  background-color: white;
  border: 1px solid ${({theme}) => theme.border.color.light};
  border-radius: ${({theme}) => theme.border.radius.menu};
  box-shadow: ${({theme}) => theme.border.shadow.regular};
  display: flex;
  overflow-y: auto;
  flex-direction: column;
  list-style: none;
  margin-top: 5px;
  min-width: 300px;
  width: ${({width}) => width || 'auto'};
  max-height: 175px;
  text-align: left;
`

export const DropdownItem = styled.div`
  flex:0 0 50px;
  display: flex;
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

export { Textarea, MentionMarkSpan }

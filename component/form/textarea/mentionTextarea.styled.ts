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
  flex-direction: column;
  list-style: none;
  padding: 0.5em;
  margin-top: 5px;
  min-width: 220px;
  width: ${({width}) => width || 'auto'};
  text-align: left;
`

export const DropdownItem = styled.div`
`;
export const DropdownItemTitle = styled.div`
`;
export const DropdownItemSubtitle = styled.div`
`;

export { Textarea, MentionMarkSpan }

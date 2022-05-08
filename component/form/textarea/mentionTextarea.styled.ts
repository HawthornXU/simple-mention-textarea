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

export { Textarea, MentionMarkSpan }

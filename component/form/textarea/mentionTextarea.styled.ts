import styled from 'styled-components';
import { TextareaStyle } from './textarea.styled'

const Textarea = styled.div<{ref:any, disabled?: boolean, marginTop?: string, fontSize?: string, minHeight?: string}>`
  ${TextareaStyle};
  display: block;
`
const MentionMarkSpan = styled.span`
  color: ${({theme}) => theme.text.color.primary};
`

export { Textarea, MentionMarkSpan }

import styled from 'styled-components';
import { TextareaStyle } from './textarea.styled'

const Textarea = styled.div<{ref:any, disabled?: boolean, marginTop?: string, fontSize?: string, minHeight?: string}>`
  ${TextareaStyle};
  display: block;
`

export { Textarea }

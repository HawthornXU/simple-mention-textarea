import styled from 'styled-components';

const TextareaBed = styled.div`
  display: flex;
  width: ${({size = 'MD', theme}) => theme.sizeChart.input[size]};
  
  &:after {
    align-self: center;
    background-color: ${({theme}) => theme.state.color.error};
    border-radius: 10px;
    content: '!';
    color: white;
    display: ${({error}) => (error ? 'flex' : 'none')};
    font-weight: ${({theme}) => theme.text.weight.bold};
    font-size: ${({theme}) => theme.text.size.subBase};
    height: 17px;
    justify-content: center;
    margin-left: 4px; 
    z-index: 2;
    width: 17px;
  }
`;

const Textarea = styled.textarea`
  appearance: none;
  background-color: ${({theme, disabled}) => {
	if (disabled) {
		return theme.state.color.disabled;
	}
	return 'white';
}};
  box-sizing: border-box;
  border-radius: ${({theme}) => theme.border.radius.formElement};
  margin: .5em 0 0 0;
  margin-top: ${({marginTop}) => marginTop || '.5em'};
  border: 1px solid ${({theme}) => theme.border.color.light};
  box-shadow: ${({theme}) => theme.border.shadow.input};
  color: ${({theme}) => theme.text.color.dark};
  display: flex;
  font-size: ${({fontSize}) => fontSize};
  min-height: ${({minHeight}) => minHeight || ''};
  height: auto;
  outline: 0;
  padding: .6em;
  position: relative;
  width: 100%;

  &:focus {
    box-shadow: ${({theme}) => theme.state.focus.outline};
  }
`;

export { Textarea, TextareaBed };

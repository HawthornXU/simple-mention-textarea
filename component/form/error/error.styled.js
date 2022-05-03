import styled from 'styled-components';

const ErrorBed = styled.div`
  color: ${({theme}) => theme.state.color.error};
  margin: ${({noMargin = false, indent}) => {
	if (noMargin) {
		return '0';
	}
	return indent ? `.1em 0 .5em ${indent}` : '.1em 0 .5em 0em';
}};
`;

export { ErrorBed };

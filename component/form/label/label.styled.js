import styled from 'styled-components';

const Label = styled.label`
  display: flex;
  font-weight: ${({theme}) => theme.text.weight.regular};
  color: ${({theme}) => theme.text.color.medium};
  
  &:after {
    content: '•';
    display: ${({isRequired}) => (isRequired ? 'flex' : 'none')};
    color: #4b634f;
    margin: -3px 0 0 3px;
  }
`;

export { Label };

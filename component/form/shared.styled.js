import styled from 'styled-components';
// import Info from './info.svg';

const FormFieldWrapper = styled.div`
  margin-bottom: ${({type, isInTable}) => ((type === 'hidden' || isInTable) ? '0em' : '0.5em')};
  margin-top: ${({offsetWhenError, error}) => (offsetWhenError && error ? '25px !important' : '0')};
  width: ${({isInTable, width}) => (width || (isInTable ? 'auto' : '100%'))};
`;

const FieldLayout = styled.div`
  display: flex;
  flex-direction: ${({direction = 'column'}) => direction};
  flex-wrap: wrap;
  align-items: ${({alignMiddle = false}) => (alignMiddle ? 'center' : 'flex-start')};

  & > div {
    margin-right: 1em;
  }
`;

// const DataInformation = styled.div`
//   color: ${({theme}) => theme.text.color.medium};
//   background-image: url(${Info});
//   background-size: 12px 12px;
//   background-position: left center;
//   background-repeat: no-repeat;
//   padding-left: 18px;
//   line-height: 20px;
//   margin-top: 0.2em;
// `;

const Explanation = styled.label`
  display: block;
  font-weight: ${({theme}) => theme.text.weight.regular};
  color: ${({theme}) => theme.text.color.medium};
  margin-top: 0.15em;
  line-height: 1.4em;
`;

const Footnote = styled.label`
  display: block;
  font-weight: ${({theme}) => theme.text.weight.regular};
  color: ${({theme}) => theme.text.color.medium};
  font-size: ${({theme}) => theme.text.size.subBase};
  margin-top: 0.15em;
  line-height: 1.4em;
`;

export { FormFieldWrapper, FieldLayout, Explanation, Footnote };

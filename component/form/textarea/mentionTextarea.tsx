import { FC, forwardRef, ReactNode, useEffect, useRef } from 'react';
import { MentionMarkSpan, Textarea } from './mentionTextarea.styled';

interface MentionTextarea {
  mentionOption: {

  },
  value:any,
  onChange(event: Event): void,
}

const defaultMentionOption = {

}

const MentionMark: FC = ({children}) => {

  return (<MentionMarkSpan contentEditable={false}>
    {children}
  </MentionMarkSpan>)
}

export const MentionTextarea: FC<MentionTextarea> = forwardRef((props, ref) => {
  const {mentionOption, value, onChange} = props;
  const textareaRef = useRef<ReactNode>(ref);
  const textareaObserver = new MutationObserver((mutationRecord, observer) => {
    const textareaElement = mutationRecord[0]?.target?.parentElement;
    const changedValue = textareaElement?.innerText;

    // textareaElement.getSelection()
    // console.log(changedValue);
    // console.log(observer.takeRecords());
  });

  useEffect(() => {
    textareaObserver.observe(textareaRef.current as Node, {  attributes: true, childList: true, subtree: true, characterData: true });

    return () => textareaObserver.disconnect();
  }, []);

  return (
    <Textarea {...props} onChange={e => console.log(e)} contentEditable={true} suppressContentEditableWarning={true}  ref={textareaRef}>
      {value}
      <MentionMark>@titor Xu</MentionMark>
    </Textarea>
  );
})

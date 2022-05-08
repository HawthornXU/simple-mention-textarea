import { FC, forwardRef, ReactNode, useEffect, useRef, useState } from 'react';
import { MentionMarkSpan, Textarea } from './mentionTextarea.styled';

interface MentionTextarea {
  mentionOption: {
    mentionDenotationChar: string,
  },
  value:any,
  onChange(event: Event): void,
}

const defaultMentionOption = {
  mentionDenotationChar: '@'
}

// @ts-ignore
const MentionMark = (props) => {
  const {children, mentionOption} = props;
  return <><MentionMarkSpan contentEditable={false}>{mentionOption.mentionDenotationChar}{children}</MentionMarkSpan>&#8203;</>
}

export const MentionTextarea: FC<MentionTextarea> = forwardRef((props, ref) => {
  const {mentionOption = defaultMentionOption, value, onChange} = props;
  const textareaRef = useRef<ReactNode>(ref);
  const [hasEmpty, setHasEmpty] = useState<boolean>(false);
  const textareaObserver = useRef(new MutationObserver((mutationRecord, observer) => {
    const textareaElement = mutationRecord[0]?.target?.parentElement;
    const innerText = textareaElement?.innerText;
    const range = getSelection();
    const isInnerTextEmpty = (innerText == null || innerText == '');
    (isInnerTextEmpty != hasEmpty) && setHasEmpty(isInnerTextEmpty);
    if (hasEmpty || range == null) {
      return;
    }
    const textBeforeCursor = getTextBeforeCursor(range.anchorNode);
    const mentionCharIndex = textBeforeCursor.lastIndexOf(mentionOption.mentionDenotationChar);
    if (hasValidMentionCharIndex()) {

    } else {

    }
    console.log('range', range);
    console.dir( textareaElement);
    console.log('innerText', innerText);
    console.log('innerTextLength', innerText?.length);
    console.log('textBeforeCursor', textBeforeCursor);

    // textareaElement.getSelection()
    // console.log(changedValue);
    // console.log(observer.takeRecords());
  }));

  const getTextBeforeCursor = (nodeBeforeCursor: Node | null) => {
    let text = ''
    while (nodeBeforeCursor != null) {
      text += nodeBeforeCursor.textContent;
      nodeBeforeCursor = nodeBeforeCursor.previousSibling;
    }
    return text;
  }
  const hasValidMentionCharIndex = () => {
    return false
  }

  useEffect(() => {
    textareaObserver.current.observe(textareaRef.current as Node, { childList: true, subtree: true, characterData: true });

    return () => textareaObserver.current.disconnect();
  }, []);

  return (
    <Textarea {...props} hasEmpty={hasEmpty} onChange={e => console.log(e)} contentEditable={true} suppressContentEditableWarning={true}  ref={textareaRef}>
      {value}
      <MentionMark mentionOption={mentionOption}>titor Xu</MentionMark>
      {value}
      <MentionMark mentionOption={mentionOption}>titor Xu</MentionMark>
    </Textarea>
  );
})

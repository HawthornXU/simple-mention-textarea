import { FC, forwardRef, ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import {
  AvatarBed,
  DropdownItem,
  DropdownItemSubtitle,
  DropdownItemTextBed,
  DropdownItemTitle,
  MentionItemsWrapper,
  MentionMarkSpan,
  Textarea
} from './mentionTextarea.styled';
import * as _ from 'lodash';
import { Avatar, Popper } from '@material-ui/core';

interface MentionTextarea {
  mentionOption: {
    mentionDenotationChar: string,
    canMentionList: Array<MentionItem>,
    listWidth?: number,
  },
  value: any,
}

export interface MentionItem {
  id: string,
  name: string,
  subTitle: string,
  avatarUrl: string,
  context: any
}

export const defaultMentionOption = {
  mentionDenotationChar: '@',
  canMentionList: [],
  listWidth: undefined
};

// @ts-ignore
const MentionMark = (props) => {
  const { children, mentionOption } = props;
  return <>
    <MentionMarkSpan contentEditable={false}>{mentionOption.mentionDenotationChar}{children}</MentionMarkSpan>&#8203;</>;
};

export const MentionTextarea: FC<MentionTextarea> = forwardRef((props, ref) => {
  const { mentionOption, value } = props;
  const textareaRef = useRef<ReactNode>(ref);
  const [hasEmpty, setHasEmpty] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const isOpen = useMemo(()=> !!anchorEl, [anchorEl]);
  const [validMentionList, setValidMentionList] = useState<Array<MentionItem>>([]);
  const mentionItemsWrapperRef = useRef();

  useEffect(() => {
    console.log('validMentionList', validMentionList);

  }, [validMentionList]);

  const textareaObserver = useRef(new MutationObserver((mutationRecord, observer) => doSomething()));

  const doSomething = () => {
    const textareaElement = textareaRef.current as HTMLDivElement;
    const innerText = textareaElement?.innerText;
    const range = getSelection();
    const isInnerTextEmpty = [undefined, '', '\u200B'].includes(innerText);
    setHasEmpty(isInnerTextEmpty);

    if (isInnerTextEmpty || range?.anchorNode == null) {
      return;
    }
    const pureTextBeforeCursor = range.anchorNode.textContent?.slice(0, range.anchorOffset);
    const textBeforeCursor = getTextBeforeCursor(range.anchorNode, range.anchorOffset);
    const mentionCharIndex = textBeforeCursor.lastIndexOf(mentionOption.mentionDenotationChar);
    const validMentions = getValidMentionList(pureTextBeforeCursor);
    setValidMentionList(validMentions);
    if (!_.isEmpty(validMentions)) {

      if (!isOpen) {
        return showDropdown();
      }
    }

    if (!!isOpen) {
      hideDropdown();
    }
    // console.log('range', range);
    // console.dir( textareaElement);
    // console.log('innerText', innerText);
    // console.log('innerTextLength', innerText?.length);
    // console.log('textBeforeCursor', textBeforeCursor);
    console.log('isOpen', isOpen)
    console.log('validMentions', validMentions);
    console.log('pureTextBeforeCursor', pureTextBeforeCursor);
  }

  const showDropdown = () => {
    document.addEventListener('mousedown', handleDocumentClick, false);
    document.addEventListener('keydown', onKeydown);
    // @ts-ignore
    setAnchorEl(textareaRef.current);
  };

  const hideDropdown = () => {
    document.removeEventListener('mousedown', handleDocumentClick, false);
    document.addEventListener('keydown', onKeydown);
    setAnchorEl(null);
  };

  const handleDocumentClick = (e: Event) => {

  };

  const onKeydown = (e: Event) => {

  };

  const getTextBeforeCursor = (nodeBeforeCursor: Node | null | undefined, lastNodeCursorIndex: number) => {
    let text = nodeBeforeCursor?.textContent?.slice(0, lastNodeCursorIndex);
    nodeBeforeCursor = nodeBeforeCursor?.previousSibling;
    while (nodeBeforeCursor != null && text != null) {
      text = nodeBeforeCursor.textContent + text;
      nodeBeforeCursor = nodeBeforeCursor.previousSibling;
    }
    return text || '';
  };

  const getValidMentionList = (pureTextBeforeCursor: string | undefined) => {
    if (pureTextBeforeCursor?.includes(mentionOption.mentionDenotationChar)) {
      const toBeMatchedText = pureTextBeforeCursor.split(mentionOption.mentionDenotationChar).pop();
      console.log('toBeMatchedText', toBeMatchedText);
      if (toBeMatchedText && toBeMatchedText !== '') {
        return mentionOption.canMentionList.filter(mentionItem => (mentionItem.name + mentionItem.subTitle).search(new RegExp(toBeMatchedText,'i')) !== -1);
      } else  {
        return mentionOption.canMentionList;
      }
    }
    return [];
  };

  useEffect(() => {
    textareaObserver.current.observe(textareaRef.current as Node, {
      childList: true,
      subtree: true,
      characterData: true
    });

    return () => textareaObserver.current.disconnect();
  }, []);

  return (<>
      <Textarea {...props} hasEmpty={hasEmpty} contentEditable={true} suppressContentEditableWarning={true} ref={textareaRef}>
        {value}
        <MentionMark mentionOption={mentionOption}>titor Xu</MentionMark>
        {value}
        <MentionMark mentionOption={mentionOption}>titor Xu</MentionMark>
      </Textarea>
      <Popper open={!!anchorEl} anchorEl={anchorEl} style={{ zIndex: 10000 }} disablePortal={false} placement={'top-start'}>
        <MentionItemsWrapper name='popover-content'
          width={mentionOption.listWidth}
          ref={mentionItemsWrapperRef}>
          {validMentionList.map(item => (
            <DropdownItem key={item.id}>
              <AvatarBed>
                <Avatar alt={item.name} src={item.avatarUrl}/>
              </AvatarBed>
              <DropdownItemTextBed>
                <DropdownItemTitle>{item.name}</DropdownItemTitle>
                <DropdownItemSubtitle>{item.subTitle}</DropdownItemSubtitle>
              </DropdownItemTextBed>
            </DropdownItem>
          ))}
        </MentionItemsWrapper>
      </Popper>
    </>
  );
});

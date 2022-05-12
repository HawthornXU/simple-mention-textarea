import { FC, forwardRef, ReactNode, useEffect, useMemo, useRef, useState, Fragment } from 'react';
import {
  AvatarBed,
  DropdownItem,
  DropdownItemSubtitle,
  DropdownItemTextBed,
  DropdownItemTitle,
  MentionItemsWrapper,
  MentionMarkSpan,
  Textarea,
  HighlightedMark
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

const Highlighted = ({ text = "", highlight = "" }) => {
  if (!highlight.trim()) {
    return <Fragment>{text}</Fragment>;
  }
  const regex = new RegExp(`(${highlight})`, "gi");
  const parts = text.split(regex);

  return (
    <Fragment>
      {parts.filter(String).map((part, i) => {
        return regex.test(part) ? (
          <HighlightedMark key={i}>{part}</HighlightedMark>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        );
      })}
    </Fragment>
  );
};
// @ts-ignore
const MentionMark = (props) => {
  const { children, mentionOption } = props;
  return <>
    <MentionMarkSpan contentEditable={false}>{mentionOption.mentionDenotationChar}{children}</MentionMarkSpan>&#8203;</>;
};

export const MentionTextarea: FC<MentionTextarea> = forwardRef((props, ref) => {
  const { mentionOption, value } = props;

  const [hasEmpty, setHasEmpty] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [validMentionList, setValidMentionList] = useState<Array<MentionItem>>([]);
  const [searchText, setSearchText] = useState('');

  const textareaRef = useRef<ReactNode>(ref);
  const mentionItemsWrapperRef = useRef();
  const proxyRef = useRef({anchorEl});

  useEffect(() => {
    textareaObserver.current.observe(textareaRef.current as Node, {
      childList: true,
      subtree: true,
      characterData: true
    });

    return () => textareaObserver.current.disconnect();
  }, []);

  useEffect(() => {
    proxyRef.current.anchorEl = anchorEl;
  }, [anchorEl])

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
      if (!!proxyRef.current.anchorEl) {
        hideDropdown();
      }
      return;
    }
    const pureTextBeforeCursor = range.anchorNode.textContent?.slice(0, range.anchorOffset);
    const textBeforeCursor = getTextBeforeCursor(range.anchorNode, range.anchorOffset);
    const mentionCharIndex = textBeforeCursor.lastIndexOf(mentionOption.mentionDenotationChar);
    const validMentions = getValidMentionList(pureTextBeforeCursor);
    setValidMentionList(validMentions);
    if (!_.isEmpty(validMentions)) {
      if (!proxyRef.current.anchorEl) {
        showDropdown();
      }
    }
    else if (!!proxyRef.current.anchorEl) {
      hideDropdown();
    }
    // console.log('range', range);
    // console.dir( textareaElement);
    // console.log('innerText', innerText);
    // console.log('innerTextLength', innerText?.length);
    // console.log('textBeforeCursor', textBeforeCursor);
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
    document.removeEventListener('keydown', onKeydown);
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
      setSearchText(toBeMatchedText || '');
      if (toBeMatchedText && toBeMatchedText !== '') {
        return mentionOption.canMentionList.filter(mentionItem => (mentionItem.name + mentionItem.subTitle).search(new RegExp(toBeMatchedText,'i')) !== -1);
      } else  {
        return mentionOption.canMentionList;
      }
    }
    return [];
  };


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
                <DropdownItemTitle> <Highlighted text={item.name} highlight={searchText} /></DropdownItemTitle>
                <DropdownItemSubtitle><Highlighted text={item.subTitle} highlight={searchText} /></DropdownItemSubtitle>
              </DropdownItemTextBed>
            </DropdownItem>
          ))}
        </MentionItemsWrapper>
      </Popper>
    </>
  );
});

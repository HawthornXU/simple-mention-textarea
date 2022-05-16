import { FC, forwardRef, ReactNode, useEffect, useRef, useState, Fragment, useCallback } from 'react';
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
  const [intendedKey, setIntendedKey] = useState<number>(0)

  const textareaRef = useRef<ReactNode>(ref);
  const mentionItemsWrapperRef = useRef();
  const proxyRef = useRef({anchorEl, validMentionList, intendedKey, mentionCharIndex: 0});

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
    proxyRef.current.validMentionList = validMentionList;
  }, [validMentionList]);

  useEffect(() => {
    proxyRef.current.intendedKey = intendedKey;
  }, [intendedKey]);

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
    proxyRef.current.mentionCharIndex = textBeforeCursor.lastIndexOf(mentionOption.mentionDenotationChar);
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
    e.preventDefault();
  };

  const onKeydown = (e: KeyboardEvent) => {
    const {key} = e;
    if (key === 'Escape') {
      return hideDropdown();
    }

    if (key === 'ArrowUp' || key === 'ArrowDown') {
      e.preventDefault();
      return cycleSelection(key === 'ArrowUp' ? -1 : 1);
    }

    if (key === 'Enter') {
      e.preventDefault();
      appendMentionMark(proxyRef.current.validMentionList[proxyRef.current.intendedKey])
    }

  };

  const appendMentionMark = (item: MentionItem) => {
    const textareaElement = textareaRef.current as any;
    console.log('new Range', new Range())
    console.log('createRange', document.createRange())
    console.log('getSelection()', document.getSelection())
    console.log('getRangeAt()', document.getSelection()?.getRangeAt(0))
    console.log(textareaElement.setRangeText);
    // const range = getSelection();
    // range?.getRangeAt(0).deleteContents()
    // try {
    //   console.log('getRangeAt', range?.getRangeAt(0));
    //   console.log('rangeCount', range?.rangeCount);
    // }
    // catch (e) {
    //   console.error(e);
    // }

    // range.removeRange(range.getRangeAt(1))
  }

  const cycleSelection = (dir: 1 | -1) => setIntendedKey(prevState => {
    let countIntendedKey = prevState + dir;
    if (countIntendedKey === proxyRef.current.validMentionList.length) {
      countIntendedKey = 0;
    }
    else if (countIntendedKey < 0) {
      countIntendedKey = proxyRef.current.validMentionList.length - 1;
    }
    return countIntendedKey;
  });

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
      </Textarea>
      <Popper open={!!anchorEl} anchorEl={anchorEl} style={{ zIndex: 10000 }} disablePortal={false} placement={'top-start'}>
        <MentionItemsWrapper name='popover-content'
          width={mentionOption.listWidth}
          ref={mentionItemsWrapperRef}>
          {validMentionList.map((item, i) => (
            <DropdownItem key={item.id} isIntended={intendedKey === i} onMouseEnter={() => setIntendedKey(i)} onClick={(e) => appendMentionMark(item)}>
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

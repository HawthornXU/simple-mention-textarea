import { FC, forwardRef, ReactNode, useEffect, useRef, useState, Fragment, useCallback, useContext } from 'react';
import {
  AvatarBed,
  DropdownItem,
  DropdownItemSubtitle,
  DropdownItemTextBed,
  DropdownItemTitle,
  MentionItemsWrapper,
  Textarea,
  HighlightedMark
} from './mentionTextarea.styled';
import * as _ from 'lodash';
import { Avatar, Popper } from '@material-ui/core';
import { useTheme } from 'styled-components';

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

const Highlighted = ({ text = '', highlight = '' }) => {
  if (!highlight.trim()) {
    return <Fragment>{text}</Fragment>;
  }
  const regex = new RegExp(`(${highlight})`, 'gi');
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

export const MentionTextarea: FC<MentionTextarea> = forwardRef((props, ref) => {
  const { mentionOption, value } = props;

  const [hasEmpty, setHasEmpty] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<any>(null);
  const [validMentionList, setValidMentionList] = useState<Array<MentionItem>>([]);
  const [searchText, setSearchText] = useState('');
  const [intendedKey, setIntendedKey] = useState<number>(0);

  const textareaRef = useRef<ReactNode>(ref);
  const mentionItemsWrapperRef = useRef();
  const proxyRef = useRef({ anchorEl, validMentionList, intendedKey, searchText: '' });

  const theme = useTheme();


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
  }, [anchorEl]);

  useEffect(() => {
    proxyRef.current.validMentionList = validMentionList;
  }, [validMentionList]);

  useEffect(() => {
    proxyRef.current.intendedKey = intendedKey;
    // if (mentionItemsWrapperRef.current) {
    //   const mentionItemsWrapper = mentionItemsWrapperRef.current as Element;
    //   (mentionItemsWrapper.childNodes[intendedKey] as Element).scrollIntoView(false);
    // }
  }, [intendedKey]);

  useEffect(() => {
    proxyRef.current.searchText = searchText;
  }, [searchText]);

  const textareaObserver = useRef(new MutationObserver((mutationRecord, observer) => {
    const textareaElement = textareaRef.current as HTMLDivElement;
    const innerText = textareaElement?.innerText;
    const range = getSelection();
    const isInnerTextEmpty = [undefined, '', '\u200B'].includes(innerText);
    setHasEmpty(isInnerTextEmpty);

    if (isInnerTextEmpty || range?.anchorNode?.nodeName !== '#text') {
      if (!!proxyRef.current.anchorEl) {
        hideDropdown();
      }
      return;
    }
    const pureTextBeforeCursor = range.anchorNode.textContent?.slice(0, range.anchorOffset);
    const validMentions = getValidMentionList(pureTextBeforeCursor);
    if (!validMentions) {
      return;
    }
    setValidMentionList(validMentions);
    if (!_.isEmpty(validMentions)) {
      if (!proxyRef.current.anchorEl) {
        showDropdown();
      }
    }
    else if (!!proxyRef.current.anchorEl) {
      hideDropdown();
    }
  }));

  const showDropdown = () => {
    document.addEventListener('mousedown', handleDocumentClick, false);
    document.addEventListener('keydown', onKeydown);
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
    const { key } = e;
    if (key === 'Escape') {
      return hideDropdown();
    }

    if (key === 'ArrowUp' || key === 'ArrowDown') {
      e.preventDefault();
      return cycleSelection(key === 'ArrowUp' ? -1 : 1);
    }

    if (key === 'Enter') {
      e.preventDefault();
      appendMentionMark(proxyRef.current.validMentionList[proxyRef.current.intendedKey]);
      hideDropdown();
    }

  };

  const appendMentionMark = (item: MentionItem) => {
    removeDenotationCharAndSearchText();
    const mentionSpan = document.createElement('span');
    mentionSpan.style.color = (theme as any)['text'].color.primary;
    mentionSpan.innerText = mentionOption.mentionDenotationChar + item.name;
    mentionSpan.contentEditable = 'false';
    // mentionSpan.style.userSelect = 'none';
    (mentionSpan as any).mentionData = item;
    const cursorRange = getSelection()?.getRangeAt(0);

    cursorRange?.insertNode(mentionSpan);

    getSelection()?.collapse((getSelection()?.anchorNode?.nextSibling?.nextSibling as Node), 0);
    getSelection()?.getRangeAt(0)?.insertNode(document.createTextNode('\u00A0'));
    getSelection()?.collapseToEnd();
  };

  const removeDenotationCharAndSearchText = () => {
    const range = getSelection()?.getRangeAt(0);
    if (!range) {
      return;
    }
    const rangeText = range.endContainer.textContent;
    const cursorPos = range.endOffset;
    const searchText = proxyRef.current.searchText;
    range.endContainer.textContent = String(rangeText?.slice(0, cursorPos - (searchText.length + 1))) + String(rangeText?.slice(cursorPos, rangeText.length + 1));
    getSelection()?.collapse(range.endContainer, cursorPos - (searchText.length + 1));
  };

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

  const getValidMentionList = (pureTextBeforeCursor: string | undefined) => {
    if (pureTextBeforeCursor?.includes(mentionOption.mentionDenotationChar)) {
      const toBeMatchedText = pureTextBeforeCursor.split(mentionOption.mentionDenotationChar).pop();
      if (toBeMatchedText?.search(/[°"§%()\[\]{}=\\?´`'#<>|,;.:+_-]+/g) != -1) {
        if (!!proxyRef.current.anchorEl) {
          hideDropdown();
        }
        return null;
      }
      setSearchText(toBeMatchedText || '');
      if (toBeMatchedText && toBeMatchedText !== '') {
        return mentionOption.canMentionList.filter(mentionItem => (mentionItem.name + mentionItem.subTitle).search(new RegExp(`(${toBeMatchedText})`, 'gi')) !== -1);
      }
      else {
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
                <Avatar alt={item.name} src={item.avatarUrl} />
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

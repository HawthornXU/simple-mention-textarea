import { FC, forwardRef, Fragment, ReactNode, useEffect, useRef, useState } from 'react';
import { AvatarBed, DropdownItem, DropdownItemSubtitle, DropdownItemTextBed, DropdownItemTitle, HighlightedMark, MentionItemsWrapper, Textarea } from './mentionTextarea.styled';
import * as _ from 'lodash';
import { Avatar, Popper } from '@material-ui/core';
import { useTheme } from 'styled-components';

interface MentionSpan extends HTMLSpanElement {
  getMentionData?(): MentionItem;
}

interface MentionTextarea {
  mentionOption: {
    mentionDenotationChar: string,
    canMentionList: Array<MentionItem>,
    listWidth?: number,
  },

  onMentionClick(e: MouseEvent, mentionData: MentionItem): void,

  value: any,
  placeholder?: string
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
  const { mentionOption, value, onMentionClick, placeholder } = props;

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
    const editableTextarea = textareaRef.current as HTMLDivElement;
    textareaObserver.current.observe(editableTextarea, {
      childList: true,
      subtree: true,
      characterData: true
    });

    editableTextarea.addEventListener('paste', (e) => {
      e.preventDefault();
      const text = e.clipboardData?.getData('text/plain');
      text && document.execCommand('insertText', false, text);
    });

    const innerText = editableTextarea?.innerText;
    setHasEmpty(!!!innerText?.trim());

    (editableTextarea as any).getMentionData = getMentionData();

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
  }, [intendedKey]);

  useEffect(() => {
    proxyRef.current.searchText = searchText;
  }, [searchText]);

  useEffect(() => {
    getMentionData()

  }, [value]);

  const textareaObserver = useRef(new MutationObserver((mutationRecord, observer) => {
    const textareaElement = textareaRef.current as HTMLDivElement;
    const innerText = textareaElement?.innerText;
    const isInnerTextEmpty = !!!innerText?.trim();
    getMentionData();
    const range = getSelection();
    setHasEmpty(isInnerTextEmpty);
    if (isInnerTextEmpty || range?.anchorNode?.nodeName !== '#text') {
      return hideDropdown();
    }

    const pureTextBeforeCursor = range.anchorNode.textContent?.slice(0, range.anchorOffset);
    const searchText = getSearchText(pureTextBeforeCursor);
    if (searchText == null) {
      return hideDropdown();
    }

    const validMentions = getValidMentionList(searchText);
    setValidMentionList(validMentions);
    if (!_.isEmpty(validMentions)) {
      showDropdown();
    }
    else {
      hideDropdown();
    }
  }));

  const getMentionData = () => {
    const textareaElement = textareaRef.current as HTMLDivElement;
    let text = '';
    const mentions: Array<MentionItem> = [];
    // do something;
    return {
      text,
      mentions
    };
  }

  const showDropdown = () => {
    if (!!!proxyRef.current.anchorEl) {
      document.addEventListener('mousedown', handleDocumentClick, false);
      document.addEventListener('keydown', onKeydown);
      setAnchorEl(textareaRef.current);
    }
  };

  const hideDropdown = () => {
    if (!!proxyRef.current.anchorEl) {
      document.removeEventListener('mousedown', handleDocumentClick, false);
      document.removeEventListener('keydown', onKeydown);
      setAnchorEl(null);
    }
  };

  const handleDocumentClick = (e: Event) => {
    e.preventDefault();
  };

  const onKeydown = (e: KeyboardEvent) => {
    const { key } = e;
    if (key === 'Escape' || key === 'ArrowLeft' || key === 'ArrowRight') {
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
    const mentionSpan: MentionSpan = document.createElement('span');
    mentionSpan.style.color = (theme as any)['text'].color.primary;
    mentionSpan.style.cursor = 'pointer';
    mentionSpan.innerText = mentionOption.mentionDenotationChar + item.name;
    mentionSpan.contentEditable = 'false';
    mentionSpan.getMentionData = () => item;
    mentionSpan.addEventListener('click', (e) => onMentionClick(e, item));
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
    setIntendedNodeIntoView(countIntendedKey);
    return countIntendedKey;
  });

  const setIntendedNodeIntoView = (index: number) => {
    if (mentionItemsWrapperRef.current) {
      const mentionItemsWrapper = mentionItemsWrapperRef.current as HTMLDivElement;
      const intendedNode = mentionItemsWrapper.childNodes[index] as HTMLDivElement;
      if (intendedNode.offsetTop + intendedNode.offsetHeight > mentionItemsWrapper.clientHeight) {
        intendedNode.scrollIntoView(false);
      }
      else if (intendedNode.offsetTop === 0) {
        intendedNode.scrollIntoView(true);
      }
    }
  };

  const getValidMentionList = (toBeMatchedText: string): Array<MentionItem> => {
    if (toBeMatchedText && toBeMatchedText !== '') {
      return mentionOption.canMentionList.filter(mentionItem => (mentionItem.name + mentionItem.subTitle).search(new RegExp(`(${toBeMatchedText})`, 'gi')) !== -1);
    }
    else {
      return mentionOption.canMentionList;
    }
  };

  const getSearchText = (pureTextBeforeCursor: string | undefined): string | undefined => {
    let toBeMatchedText = undefined;
    if (pureTextBeforeCursor?.includes(mentionOption.mentionDenotationChar)) {
      toBeMatchedText = pureTextBeforeCursor.split(mentionOption.mentionDenotationChar).pop();
      if (toBeMatchedText?.search(/[°"§%()\[\]{}=\\?´`'#<>|,;:+]+/g) != -1) {
        toBeMatchedText = undefined;
      }
    }
    setSearchText(toBeMatchedText || '');
    return toBeMatchedText;
  };


  return (<>
      <Textarea {...props} placeholder={placeholder} hasEmpty={hasEmpty} role="textbox" aria-multiline="true" contentEditable={true} suppressContentEditableWarning={true} ref={textareaRef}>
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
                <DropdownItemTitle><Highlighted text={item.name} highlight={searchText} /></DropdownItemTitle>
                <DropdownItemSubtitle><Highlighted text={item.subTitle} highlight={searchText} /></DropdownItemSubtitle>
              </DropdownItemTextBed>
            </DropdownItem>
          ))}
        </MentionItemsWrapper>
      </Popper>
    </>
  );
});

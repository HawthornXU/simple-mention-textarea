import { createElement, FC, forwardRef, Fragment, ReactNode, useEffect, useRef, useState } from 'react';
import {
  AvatarBed,
  DropdownItem,
  DropdownItemSubtitle,
  DropdownItemTextBed,
  DropdownItemTitle,
  HighlightedMark,
  MentionItemsWrapper, MentionSpan,
  Textarea
} from './mentionTextarea.styled';
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

  onMentionClick?(e: MouseEvent, mentionData: MentionItem): void,

  value: MentionInputValue,
  placeholder?: string,
  style?: any,
  minHeight?: any,
  size: any
}

interface MentionInputValue {
  text: string,
  mentions: Array<MentionItem>
}

export interface MentionItem {
  id: string,
  name: string,
  avatarUrl: string,
  subTitle?: string,
  context?: any
}

export const defaultMentionOption = {
  mentionDenotationChar: '@',
  canMentionList: [],
  listWidth: undefined
};

const getEscapeSearchText = (searchText: string) => searchText?.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const RestoreContent: FC<{ value: MentionInputValue, mentionOption: {mentionDenotationChar: string} }>= ({value, mentionOption}) => {
  const {text, mentions} = value;
  if (!text.trim() || !text.includes('\uE001')) {
    return <Fragment>{text}</Fragment>;
  }
  const textPart = text.split('\uE001');
  const mergePart = [];
  for (let i = 0; i < textPart.length; i++) {
    mergePart.push(textPart[i]);
    mentions[i] && mergePart.push(mentions[i]);
  }
  return (<>{mergePart.map((part, i) => {
    return typeof part === 'string' ? <Fragment key={i}>{part}</Fragment> : <MentionSpan key={i}>{mentionOption.mentionDenotationChar + part.name}</MentionSpan>})}
  </>)
}

const Highlighted = ({ text = '', highlight = '' }) => {
  if (!highlight.trim()) {
    return <Fragment>{text}</Fragment>;
  }
  const regex = new RegExp(`(${getEscapeSearchText(highlight)})`, 'gi');
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
  const { mentionOption, value, onMentionClick, placeholder, style } = props;

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

    init();

    (editableTextarea as any).getMentionData = getMentionData;

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

  const init = () => {
    setIntendedKey(0);
    setSearchText('');
    const editableTextarea = textareaRef.current as HTMLDivElement;
    const innerText = editableTextarea?.innerText;
    setHasEmpty(!!!innerText?.trim());
  }

  const textareaObserver = useRef(new MutationObserver((mutationRecord, observer) => {
    const textareaElement = textareaRef.current as HTMLDivElement;
    const innerText = textareaElement?.innerText;
    const isInnerTextEmpty = !!!innerText?.trim();
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
    } else {
      hideDropdown();
    }
  }));

  const getMentionData = () => {
    const textareaElement = textareaRef.current as HTMLDivElement;
    let text = '';
    const mentions: Array<MentionItem> = [];
    let parseList: Array<any> = [];
    parseList = parseRichNodeList(parseList, mentions, textareaElement.childNodes);
    text = parseList.join('');
    return {
      text,
      mentions
    };
  };

  const parseRichNodeList = (list: Array<any>, mentions: Array<any>, childNodes: any) => {
    childNodes.forEach((item: any, index: number) => {
      if (item.nodeName === '#text') {
        list.push(item.data);
      } else if (item.nodeName === 'BR') {
        list.push('\br');
      } else if (item.nodeName === 'DIV') {
        if (list[index - 1] !== '\br') {
          list.push('\br');
        }
        list = parseRichNodeList(list, mentions, item.childNodes);
      } else if (item.nodeName === 'SPAN') {
        list.push('\uE001');
        mentions.push(item.getMentionData());
      }
    });

    return list;
  };

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
      init();
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
    onMentionClick && mentionSpan.addEventListener('click', (e) => onMentionClick(e, item));
    const cursorRange = getSelection()?.getRangeAt(0);

    cursorRange?.insertNode(mentionSpan);

    getSelection()?.collapse((getSelection()?.anchorNode?.nextSibling?.nextSibling as Node), 0);
    getSelection()?.getRangeAt(0)?.insertNode(document.createTextNode('\u200B'));
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
    } else if (countIntendedKey < 0) {
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
      } else if (intendedNode.offsetTop === 0) {
        intendedNode.scrollIntoView(true);
      }
    }
  };

  const getValidMentionList = (toBeMatchedText: string): Array<MentionItem> => {
    if (toBeMatchedText && toBeMatchedText !== '') {
      return mentionOption.canMentionList.filter(mentionItem => (mentionItem.name + mentionItem.subTitle).search(new RegExp(`(${getEscapeSearchText(toBeMatchedText)})`, 'gi')) !== -1);
    } else {
      return mentionOption.canMentionList;
    }
  };

  const getSearchText = (pureTextBeforeCursor: string | undefined): string | undefined => {
    let toBeMatchedText = undefined;
    if (pureTextBeforeCursor?.includes(mentionOption.mentionDenotationChar)) {
      toBeMatchedText = pureTextBeforeCursor.split(mentionOption.mentionDenotationChar).pop();
    }
    setSearchText(toBeMatchedText || '');
    return toBeMatchedText;
  };


  return (<>
      <Textarea {...props} style={style} placeholder={placeholder} hasEmpty={hasEmpty} role='textbox' aria-multiline='true' contentEditable={true} suppressContentEditableWarning={true} ref={textareaRef}>
        {<RestoreContent value={value} mentionOption={mentionOption}/>}
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

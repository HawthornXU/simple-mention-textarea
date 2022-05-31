import React, {
  DOMAttributes,
  FC,
  forwardRef,
  Fragment,
  MutableRefObject,
  useEffect,
  useRef,
  useState
} from 'react';
import {
  AvatarBed,
  DropdownItem,
  DropdownItemSubtitle,
  DropdownItemTextBed,
  DropdownItemTitle,
  HighlightedMark,
  MentionItemsWrapper,
  RichTextarea,
  MentionSpan
} from './mentionTextarea.styled';
import * as _ from 'lodash';
import { Avatar, Popper } from '@material-ui/core';
import { ThemedCssFunction, useTheme } from 'styled-components';

interface MentionSpan extends HTMLSpanElement {
  getMentionData?(): MentionItem;
}

interface MentionTextarea extends DOMAttributes<HTMLDivElement>{
  mentionOption: {
    mentionDenotationChar: string,
    canMentionList: Array<MentionItem>,
    listWidth?: number,
  },

  onValueChange?(value: { text: string, mentions: Array<MentionItem> }): void,

  onMentionClick?(e: Event | React.MouseEvent<Element, MouseEvent>, mentionData: MentionItem): void,

  value?: MentionValue,
  marginTop?: string,
  fontSize?: string,
  minHeight?: string,
  name?: string,
  placeholder?: string,
  maxLength?: number
}

type RestoreContentInput = Pick<MentionTextarea, 'mentionOption' | 'onMentionClick' | 'value'> & {
  mentionStyle?: ThemedCssFunction<object>
};

interface MentionValue {
  text: string,
  mentions?: Array<MentionItem>
}

export interface MentionItem {
  id: string,
  name: string,
  type?: 'PROFILE' | 'MEMBERSHIP',
  avatarUrl?: string,
  subtitle?: string,
  disabled?: boolean,
}

export interface MentionTextareaRef extends HTMLDivElement {
  getMentionData?(): MentionValue,

  /***
   * only init component can use it when value !== ''
   * @param value : MentionValue
   */
  setInnerValue?(value: MentionValue): void
}

const getEscapeText = (searchText: string) => searchText?.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const RestoreMentionText: FC<RestoreContentInput> = ({value, mentionOption, onMentionClick, mentionStyle}) => {
  if (!!!value) {
    return <></>;
  }
  const {text, mentions} = value;
  if (!text.trim() || !text.includes('\uE001')) {
    return <Fragment>{text}</Fragment>;
  }
  const textPart = text.split('\uE001');
  return <>{
    textPart.map((part, i) => (<Fragment key={i}>
        {part}
        {mentions && mentions[i] && <MentionSpan mentionStyle={mentionStyle} onClick={(e) => onMentionClick && onMentionClick(e, mentions[i])}
                                                 ref={(ref) => {
                                                   (ref) && ((ref as any).getMentionData = () => mentions[i]);
                                                 }}>{mentionOption.mentionDenotationChar + mentions[i].name}</MentionSpan>}
      </Fragment>)
    )
  }</>;
};

const Highlighted = ({text = '', highlight = ''}) => {
  if (!highlight.trim()) {
    return <Fragment>{text}</Fragment>;
  }
  const regex = new RegExp(`(${getEscapeText(highlight)})`, 'gi');
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
export const MentionTextarea = forwardRef((props: MentionTextarea, ref: MutableRefObject<MentionTextareaRef>) => {
  const {mentionOption, onMentionClick, onValueChange} = props;

  const [hasEmpty, setHasEmpty] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<any>(null);
  const [validMentionList, setValidMentionList] = useState<Array<MentionItem>>([]);
  const [searchText, setSearchText] = useState('');
  const [intendedKey, setIntendedKey] = useState<number>(0);
  const [innerValue, setInnerValue] = useState<MentionValue>({text: '', mentions: []});

  const mentionItemsWrapperRef = useRef();

  // fix stale-closure issue: in closure will captures stale state value
  const proxyRef = useRef({anchorEl, validMentionList, intendedKey, searchText: '', mentionOption});

  const theme = useTheme();


  useEffect(() => {
    const editableTextarea = ref.current;
    textareaObserver.current.observe(editableTextarea, {
      childList: true,
      subtree: true,
      characterData: true
    });

    // Remove styles from pasted text
    editableTextarea.addEventListener('paste', (e) => {
      e.preventDefault();
      const text = e.clipboardData?.getData('text/plain');
      text && document.execCommand('insertText', false, text);
    });

    editableTextarea.getMentionData = getMentionData;
    editableTextarea.setInnerValue = (value) => {
      editableTextarea.innerHTML !== '' && (editableTextarea.innerHTML = '');
      value.text !== '' && setInnerValue(value);
    };

    init();

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
    proxyRef.current.mentionOption = mentionOption;
  }, [mentionOption]);


  const init = () => {
    setIntendedKey(0);
    setSearchText('');
    const innerText = ref.current?.innerText;
    setHasEmpty([undefined, '', '\u200B'].includes(innerText));
  };

  const textareaObserver = useRef(new MutationObserver((mutationRecord, observer) => {
    onValueChange && onValueChange(getMentionData());
    const textareaElement = ref.current;
    const innerText = textareaElement?.innerText;
    const range = getSelection();
    const isInnerTextEmpty = [undefined, '', '\u200B'].includes(innerText);
    setHasEmpty(isInnerTextEmpty);

    if (range?.anchorNode?.parentNode?.nodeName === 'SPAN') {
      const currentNode = range?.anchorNode?.parentNode;
      const currentNodeText = range?.anchorNode.textContent;
      // @ts-ignore
      const mentionText = (currentNode as MentionSpan).getMentionData().name + mentionOption.mentionDenotationChar
      // @ts-ignore
      if (mentionText.length >= currentNodeText?.length) {
        range?.anchorNode?.parentNode?.parentNode?.removeChild(currentNode);
        document.execCommand('insertText',false, mentionOption.mentionDenotationChar);
        setTimeout(() => {
          setSearchText('');
          setValidMentionList(mentionOption.canMentionList);
          console.log(mentionOption.canMentionList);
          showDropdown();
        }, 200);

      }
      // @ts-ignore
      else if (mentionText.length < currentNodeText?.length)  {
        const cursorOffset = getSelection()?.getRangeAt(0)?.startOffset;
        range?.anchorNode?.parentNode?.parentNode?.removeChild(currentNode);
        const changeTextNode = document.createTextNode((currentNodeText as string));
        getSelection()?.getRangeAt(0)?.insertNode(changeTextNode);
        getSelection()?.collapse(changeTextNode,cursorOffset)
      }
      return

    }

    // if text before cursor
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
    const textareaElement = ref.current;
    let text = '';
    const mentions: Array<MentionItem> = [];
    let parseList: Array<any> = [];
    parseList = parseNodeList(parseList, mentions, textareaElement.childNodes);
    text = parseList.join('');
    return {
      text,
      mentions
    };
  };

  const parseNodeList = (list: Array<any>, mentions: Array<any>, childNodes: any) => {
    childNodes.forEach((item: any, index: number) => {
      if (item.nodeName === '#text') {
        list.push(item.data);
      }
      else if (item.nodeName === 'BR') {
        list.push('\n');
      }
      else if (item.nodeName === 'DIV') {
        if (list[index - 1] !== '\br') {
          list.push('\n');
        }
        list = parseNodeList(list, mentions, item.childNodes);
      }
      else if (item.nodeName === 'SPAN') {
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
      setAnchorEl(ref.current);
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
    const {key} = e;
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
    mentionSpan.innerText = proxyRef.current.mentionOption.mentionDenotationChar + item.name;
    mentionSpan.getMentionData = () => item;
    onMentionClick && mentionSpan.addEventListener('click', (e) => onMentionClick(e, item));
    const cursorRange = getSelection()?.getRangeAt(0);
    cursorRange?.insertNode(mentionSpan);

    // move cursor to mentionSpan after
    getSelection()?.collapse((getSelection()?.anchorNode?.nextSibling?.nextSibling as Node), 0);
    // add zero width space in cursor
    getSelection()?.getRangeAt(0)?.insertNode(document.createTextNode('\u200B'));
    // move cursor into space after
    getSelection()?.collapseToEnd();
    // add space in cursor
    getSelection()?.getRangeAt(0)?.insertNode(document.createTextNode('\u00A0'));
    // move cursor into space after
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
      return proxyRef.current.mentionOption.canMentionList.filter(mentionItem => (mentionItem.name + mentionItem.subtitle).search(new RegExp(`(${getEscapeText(toBeMatchedText)})`, 'gi')) !== -1);
    }
    else {
      return proxyRef.current.mentionOption.canMentionList;
    }
  };

  const getSearchText = (pureTextBeforeCursor: string | undefined): string | undefined => {
    let toBeMatchedText = undefined;
    if (pureTextBeforeCursor?.includes(proxyRef.current.mentionOption.mentionDenotationChar)) {
      toBeMatchedText = pureTextBeforeCursor.split(proxyRef.current.mentionOption.mentionDenotationChar).pop();
    }
    setSearchText(toBeMatchedText || '');
    return toBeMatchedText;
  };


  return (<>
      <RichTextarea {...props} hasEmpty={hasEmpty} role="textbox" aria-multiline="true" contentEditable={true}
                    suppressContentEditableWarning={true} ref={ref}>
        {<RestoreMentionText value={innerValue} mentionOption={mentionOption} onMentionClick={onMentionClick}/>}
      </RichTextarea>
      <Popper open={!!anchorEl} anchorEl={anchorEl} style={{zIndex: 10000}} disablePortal={false}
              placement={'top-start'}>
        <MentionItemsWrapper name="popover-content"
                             width={mentionOption.listWidth}
                             ref={mentionItemsWrapperRef}>
          {validMentionList.map((item, i) => (
            <DropdownItem key={item.id} isIntended={intendedKey === i} disabled={item.disabled}
                          onMouseEnter={() => setIntendedKey(i)} onClick={(e) => appendMentionMark(item)}>
              <AvatarBed>
                <Avatar alt={item.name} src={item.avatarUrl} />
              </AvatarBed>
              <DropdownItemTextBed>
                <DropdownItemTitle disabled={item.disabled}><Highlighted text={item.name}
                                                                         highlight={searchText}/></DropdownItemTitle>
                <DropdownItemSubtitle><Highlighted text={item.subtitle}
                                                   highlight={searchText}/></DropdownItemSubtitle>
              </DropdownItemTextBed>
            </DropdownItem>
          ))}
        </MentionItemsWrapper>
      </Popper>
    </>
  );
});

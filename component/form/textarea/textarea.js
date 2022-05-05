import React, { useEffect, useRef } from 'react';
import { Field } from 'formik';
import PT from 'prop-types';

import { TextareaBed, Textarea } from './textarea.styled';
import { Label } from '../label/label.styled';
import { Explanation, FormFieldWrapper } from '../shared.styled';
import { getErrorFromObject } from '../error/helper';

import { SizeChart } from '../sizeChart';
import { Error } from '../error/error';
import { MentionTextarea } from './mentionTextarea';

const PureTextarea = (props) => {
	const {
		name,
		error,
		label,
		disabled,
		size,
		value,
		height,
		placeholder,
		onSetRef,
		onBlur,
		onFocus,
		explanation,
		isRequired,
		maxLength,
		isInTable,
		onChange,
		autoGrow,
		minHeight,
		fontSize,
		marginTop,
    mentionOption
	} = props;
	const errorFieldID = `${name}_error`;
	let myRef = React.createRef();

	useEffect(() => {
		updateHeight();
	}, [value]);

	const updateHeight = () => {
		if (autoGrow) {
			myRef.style.cssText = 'height:auto; padding:0';
			myRef.style.cssText = `height: ${myRef.scrollHeight}px`;
		}
	};

	const onChangeHandler = (event) => {
    console.log(event);
    updateHeight();

		if (onChange) {
			onChange(event);
		}
	};

	return (
		<FormFieldWrapper isInTable={isInTable}>
			{label && <Label htmlFor={name} isRequired={isRequired}>
				{label}
			</Label>}
			{explanation && <Explanation htmlFor={name}>{explanation}</Explanation>}
			<TextareaBed size={size} error={error} style={{height: height}} id={'1'}>
        {!mentionOption && <Textarea
          id={name}
          name={name}
          disabled={disabled}
          aria-describedby={errorFieldID}
          ref={(ref) => {
            myRef = ref;
            ref && onSetRef(ref);
          }}
          onChange={onChangeHandler}
          onBlur={onBlur}
          onFocus={onFocus}
          minHeight={minHeight}
          value={value}
          placeholder={placeholder}
          maxLength={maxLength}
          fontSize={fontSize}
          marginTop={marginTop}
        />}
        {mentionOption && <MentionTextarea
          id={name}
          name={name}
          disabled={disabled}
          aria-describedby={errorFieldID}
          ref={(ref) => {
            myRef = ref;
            ref && onSetRef(ref);
          }}
          onChange={onChangeHandler}
          onBlur={onBlur}
          onFocus={onFocus}
          minHeight={minHeight}
          value={value}
          placeholder={placeholder}
          maxLength={maxLength}
          fontSize={fontSize}
          marginTop={marginTop}
        />
        }
			</TextareaBed>
			{error && <Error id={errorFieldID}>{error}</Error>}
		</FormFieldWrapper>
	);

};

PureTextarea.propTypes = {
	autoGrow: PT.bool,
	disabled: PT.bool,
	error: PT.string,
	explanation: PT.string,
	isRequired: PT.bool,
	label: PT.string,
	maxLength: PT.number,
	name: PT.string.isRequired,
	onBlur: PT.func,
	onFocus: PT.func,
	onChange: PT.func,
	onSetRef: PT.func,
	autoFocus: PT.bool,
	placeholder: PT.string,
	fontSize: PT.string,
	minHeight: PT.string,
	marginTop: PT.string,
	size: PT.oneOf(Object.keys(SizeChart)),
	value: PT.string,
};

PureTextarea.defaultProps = {
	autoGrow: false,
	disabled: false,
	error: '',
	explanation: '',
	isRequired: false,
	maxLength: null,
	onBlur: () => {
	},
	onFocus: () => {
	},
	onChange: () => {
	},
	onSetRef: () => {
	},
	autoFocus: false,
	placeholder: '',
	fontSize: '1rem',
	marginTop: '.5em',
	size: SizeChart.MD,
	minHeight: '38px',
	value: '',
};

const FormikTextarea = (props) => {
	const {name, mentionOption} = props;
	return (
		<Field
			name={name}
			type="text">
			{({field, form}) => {
				const {errors} = form;
				const errorText = getErrorFromObject(name, errors);
				const {validationWasForced} = form.status || {};
				const error = form.submitCount || validationWasForced > 0 ? errorText : '';
				return <PureTextarea {...field} {...props} error={error}/>;
			}}
		</Field>
	);
};

export { PureTextarea, FormikTextarea as Textarea };

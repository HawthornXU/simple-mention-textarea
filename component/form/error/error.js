import React from 'react';
import PT from 'prop-types';

import { ErrorBed } from './error.styled';

const Error = (props) => {
	const {children, id, noMargin, indent} = props;
	return (
		<ErrorBed id={id} noMargin={noMargin} indent={indent} role="alert">
			{children}
		</ErrorBed>
	);
};

Error.propTypes = {
	children: PT.node.isRequired,
	id: PT.string.isRequired,
	noMargin: PT.bool,
	indent: PT.string,
};

Error.defaultProps = {
	noMargin: false,
	indent: null,
};

export { Error };

import { getErrorFromObject } from './helper';

describe('Form Error helper', () => {
	describe('getErrorFromObject', () => {
		test('retrieves the error message from a nested object', () => {
			const mock = {
				foo: {
					bar: {
						sunshine: 'Need sunshine to thrive.',
					},
				},
			};

			const errorName = 'foo.bar.sunshine';

			const expectedResult = 'Need sunshine to thrive.';

			expect(getErrorFromObject(errorName, mock)).toEqual(expectedResult);
		});

		test('retrieves the error message from a nested object containing custom field', () => {
			const mock = {
				foo: {
					bar: {
						'803C5A00C06A47DCB96E870623061BE3': 'Need sunshine to thrive.',
					},
				},
			};

			const errorName = 'foo.bar.803C5A00C06A47DCB96E870623061BE3';

			const expectedResult = 'Need sunshine to thrive.';

			expect(getErrorFromObject(errorName, mock)).toEqual(expectedResult);
		});

		test('retrieves error from a nested array', () => {
			const mock = {
				foo: {
					bar: [
						{
							sunshine: 'Need sunshine to thrive.',
						},
						{
							darkness: 'Need darkness to thrive.',
						},
					],
				},
			};

			const errorName = 'foo.bar[1].darkness';

			const expectedResult = 'Need darkness to thrive.';

			expect(getErrorFromObject(errorName, mock)).toEqual(expectedResult);
		});

		test('retrieves error from a complicated mixed object', () => {
			const mock = {
				foo: {
					bar: [
						{default: 'no weather'},
						{
							types: [
								{
									sunshine: {
										temperature: '40 degrees',
										humidity: '100%',
									},
								},
								{
									thunder: {
										loudness: 'high',
										scaryness: 'medium',
									},
								},
							],
						},
					],
				},
			};

			const errorName = 'foo.bar[1].types[0].sunshine.humidity';

			const expectedResult = '100%';

			expect(getErrorFromObject(errorName, mock)).toEqual(expectedResult);
		});

		test('handles no errors (ie missing properties)', () => {
			const mock = {
				foo: {
					bar: [
						{
							sunshine: 'Need sunshine to thrive.',
						},
						{
							darkness: 'Need darkness to thrive.',
						},
					],
				},
			};

			const errorName = 'foo.bar[2].dusk';

			const expectedResult = '';

			expect(getErrorFromObject(errorName, mock)).toEqual(expectedResult);
		});
	});
});

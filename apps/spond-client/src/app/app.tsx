import { SizeChart } from 'component/form/sizeChart';
import { Formik } from 'formik';
import { AppTheme } from '../../../../component/app.theme';
import { Textarea } from '../../../../component/form/textarea'
import * as Yup from 'yup';
import { FormikHelpers } from 'formik/dist/types';
import { defaultMentionOption, MentionItem } from '../../../../component/form/textarea/mentionTextarea';
import styled from 'styled-components';

export const TextareaBed = styled.div`
  margin-top: 200px;
`

interface Values {
  textarea: string,
  normal: string
}

const mentionList: Array<MentionItem> = [
  {id: '1', name: 'Paul Johnson', subTitle: 'Guardian for Robert Johnson', avatarUrl: '', context: {}},
  {id: '2', name: 'Robert Johnson', subTitle: 'child of Paul Johnson', avatarUrl: '', context: {}},
  {id: '3', name: 'John Titor', subTitle: '', avatarUrl: '', context: {}},
]


export function App() {
  const initialValues = {
    textarea : '111',
    normal: ''
  }
  const FormSchema = Yup.object().shape({})

  const onFormSubmit = (values: Values, formikHelpers: FormikHelpers<Values>) => {

  }

  const onChangevalue = (values: Values) => {
    console.log(values);

  }
  return (
    <AppTheme>
      <Formik
        onSubmit={(values, formik) => onFormSubmit(values, formik)}
        initialValues={initialValues}
        validationSchema={FormSchema}>{
        (props) => (
          <form onSubmit={props.handleSubmit} onChange={() => onChangevalue(props.values)}>
            <TextareaBed>
              <Textarea
                style={{marginTop: '300px'}}
                placeholder="有什么想和大家分享的？"
                name="textarea"
                minHeight="76px"
                size={SizeChart.FULL}
                mentionOption={{mentionDenotationChar: defaultMentionOption.mentionDenotationChar, canMentionList: mentionList}}
                maxLength={10000}/>
            </TextareaBed>


            <Textarea
              placeholder="有什么想和大家分享的？"
              name="normal"
              minHeight="76px"
              size={SizeChart.FULL}
              maxLength={10000}/>
          </form>
        )
      }

      </Formik>
    </AppTheme>
  );
}

export default App;

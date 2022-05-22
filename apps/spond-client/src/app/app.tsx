import { SizeChart } from 'component/form/sizeChart';
import { Formik } from 'formik';
import { AppTheme } from '../../../../component/app.theme';
import { Textarea } from '../../../../component/form/textarea'
import * as Yup from 'yup';
import { FormikHelpers } from 'formik/dist/types';
import {
  defaultMentionOption,
  MentionItem,
  MentionTextarea
} from '../../../../component/form/textarea/mentionTextarea';
import styled from 'styled-components';

export const TextareaBed = styled.div`
  margin-top: 200px;
`

interface Values {
  textarea: any,
  normal: string
}

const mentionList: Array<MentionItem> = [
  {id: '1', name: 'Paul Johnson', subTitle: 'Guardian for Robert Johnson', avatarUrl: 'http://placekitten.com/34/34', context: {}},
  {id: '2', name: 'Robert Johnson', subTitle: 'child of Paul Johnson', avatarUrl: 'http://placekitten.com/34/34', context: {}},
  {id: '3', name: 'John Titor', subTitle: '', avatarUrl: 'http://placekitten.com/34/34', context: {}},
  {id: '4', name: 'Titor Xu', subTitle: '', avatarUrl: 'http://placekitten.com/34/34', context: {}},
  {id: '5', name: 'Tito()r Xu', subTitle: '', avatarUrl: 'http://placekitten.com/34/34', context: {}},
  {id: '4', name: 'Tito\\r Xu', subTitle: '', avatarUrl: 'http://placekitten.com/34/34', context: {}},
]


export function App() {
  const initialValues = {
    textarea : {
      text: 'Commenting twice with \uE001 mentioned, along with \uE001',
      mentions: [{
        "id": "08A4AF93BD56AA031F1E2DEDA34BBA2A",
        name: 'Paul Johnson', subTitle: 'Guardian for Robert Johnson', avatarUrl: 'http://placekitten.com/34/34',
        "type": "PROFILE"
      },
        {
          "id": "9ACBC34819C54FC381EAADC363F94E78",
          name: 'Robert Johnson', subTitle: 'child of Paul Johnson', avatarUrl: 'http://placekitten.com/34/34',
          "type": "MEMBERSHIP"
        }

      ]
    },
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
              <MentionTextarea
                style={{marginTop: '300px'}}
                placeholder="有什么想和大家分享的？"
                value={{      text: 'Commenting twice with \uE001 mentioned, along with \uE001',
                  mentions: [{
                    "id": "08A4AF93BD56AA031F1E2DEDA34BBA2A",
                    name: 'Paul Johnson', subTitle: 'Guardian for Robert Johnson', avatarUrl: 'http://placekitten.com/34/34',
                  },
                    {
                      "id": "9ACBC34819C54FC381EAADC363F94E78",
                      name: 'Robert Johnson', subTitle: 'child of Paul Johnson', avatarUrl: 'http://placekitten.com/34/34',
                    }

                  ]}}
                minHeight="76px"
                size={SizeChart.FULL}
                mentionOption={{mentionDenotationChar: defaultMentionOption.mentionDenotationChar, canMentionList: mentionList}} />
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

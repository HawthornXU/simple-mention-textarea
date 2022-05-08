import { SizeChart } from 'component/form/sizeChart';
import { Formik } from 'formik';
import { AppTheme } from '../../../../component/app.theme';
import { Textarea } from '../../../../component/form/textarea'
import * as Yup from 'yup';
import { FormikHelpers } from 'formik/dist/types';

interface Values {
  textarea: string,
  normal: string
}

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
          <Textarea
            placeholder="有什么想和大家分享的？"
            name="textarea"
            minHeight="76px"
            size={SizeChart.FULL}
            mentionOption={{}}
            maxLength={10000}/>

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

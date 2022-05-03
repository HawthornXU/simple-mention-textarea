import { SizeChart } from 'component/form/sizeChart';
import { Formik } from 'formik';
import { AppTheme } from '../../../../component/app.theme';
import { Textarea } from '../../../../component/form/textarea'
import * as Yup from 'yup';
import { FormikHelpers } from 'formik/dist/types';

interface Values {
  textarea: string
}

export function App() {
  const initialValues = {
    textarea : ''
  }
  const FormSchema = Yup.object().shape({})

  const onFormSubmit = (values: Values, formikHelpers: FormikHelpers<Values>) => {

  }
  return (
    <AppTheme>
      <Formik
        onSubmit={(values, formik) => onFormSubmit(values, formik)}
        initialValues={initialValues}
        validationSchema={FormSchema}>{
        (props) => (
          <form onSubmit={props.handleSubmit}>
          <Textarea
            name="textarea"
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

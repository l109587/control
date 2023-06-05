import { ProFormDateTimeRangePicker } from '@ant-design/pro-components'
import moment from 'moment'
import styles from './index.less'

export default function dtRangePicker(props) {
  const defaultFormat = 'YYYY-MM-DD HH:mm:ss'
  const { dateFormat = defaultFormat, changeTime } = props
  const begDate = moment().subtract(1, 'months').format(dateFormat)
  const endDate = moment().format(dateFormat)
  return (
    <>
      <div className={styles.rangepicker}>
        <ProFormDateTimeRangePicker
          fieldProps={{
            defaultValue: [
              moment(begDate, dateFormat),
              moment(endDate, dateFormat),
            ],
            onChange: (_, time) => {
              changeTime(time)
            },
            format: dateFormat,
          }}
        />
      </div>
    </>
  )
}

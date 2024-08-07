import { localeProps } from '../../utils'

const name = 'tableFormColumn'

export default {
  icon: 'icon-cell',
  name,
  drag: true,
  dragBtn: false,
  mask: false,
  rule({ t }: any) {
    return {
      type: name,
      props: {
        label: t('com.tableFormColumn.label'),
        width: 'auto',
      },
      children: [],
    }
  },
  props(_: any, { t }: any) {
    return localeProps(t, `${name}.props`, [
      {
        type: 'input',
        field: 'label',
      },
      {
        type: 'input',
        field: 'width',
      },
      {
        type: 'ColorInput',
        field: 'color',
      },
    ])
  },
}

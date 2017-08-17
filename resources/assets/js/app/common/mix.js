export default {
  data () {
    return {
      constants: {
        type_theme: 0,
        type_font: 5,
        type_scene: 6
      }
    }
  },
  methods: {
    _pickProps (obj, ...props) {
      let newObj = {}
      props.forEach(data => {
        newObj[data] = obj[data]
      })
      return newObj;
    },

    _dateToDatetime (date) {
      return date.toLocaleString('zh-CN', {hour12: false}).replace(/\//g, '-').replace(/\b\d\b/g, '0$&').replace(/\s(\d{1,2}\:)*\d{1,2}/, '')
    }
  },

  filters: {
    typeTrack (value, trackedValue) {
      return typeof trackedValue === 'number' ? +value : '' + value
    }
  }
}

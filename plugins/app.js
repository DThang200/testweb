import constant from '@/config/constant'

export default (context, inject) => {

  const timezone = new Date().getTimezoneOffset()

  function cleanParamSearch(obj) {
    const fieldsToDelete = [];

    for (const key in obj) {
      if (key.endsWith('From')) {
        const baseField = key.slice(0, -4); // Lấy tên trường gốc (bỏ 'From')
        const toField = `${baseField}To`;

        if (obj.hasOwnProperty(toField) && obj.hasOwnProperty(baseField)) {
          fieldsToDelete.push(baseField);
        }
      }
    }

    fieldsToDelete.forEach(field => {
      delete obj[field];
    });

    return obj;
  }

  context.$axios.setHeader('timezone', '' + timezone)

  context.$axios.$get = async (url, config = {}) => {
    try {
      if (config.params) {
        config.params = cleanParamSearch(config.params)
      }
      const res = await context.$axios.get(url, config)
      return res.data
    } catch (e) {
      context.$h.toast('error', 'Something wrong');
      return false
    }
  }

  context.$apiUrl = process.env.API_URL

  function convertEmptyStringsToNull(obj) {
    if (typeof obj !== 'object' || obj === null) {
      return obj;
    }

    const result = Array.isArray(obj) ? [] : {};

    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (obj[key] === "") {
          result[key] = null;
        } else if (typeof obj[key] === 'object') {
          result[key] = convertEmptyStringsToNull(obj[key]);
        } else {
          result[key] = obj[key];
        }
      }
    }

    return result;
  }

  context.$axios.$post = async (url, data, config) => {
    try {
      /* ---------- Remove clientDataURL in postData (when upload files) { ---------- */
      for (let k in data) {
        if (data.hasOwnProperty(k) && data[k] instanceof Array) {
          for (let item of data[k]) {

            if (item.clientDataURL) {
              delete item.clientDataURL
            }

            /* Deal with hasMany items (repeat one more time) { */
            for (let i in item) {
              if (item.hasOwnProperty(i) && item[i] instanceof Array) {
                for (let sub of item[i]) {
                  if (sub.clientDataURL) {
                    delete sub.clientDataURL
                  }
                }
              }
            }
            /* Deal with hasMany items } */
          }
        }
      }
      /* ---------- Remove clientDataURL in postData (when upload files) } ---------- */

      data = convertEmptyStringsToNull(data)
      const res = await context.$axios.post(url, data, config)
      return res.data
    } catch (e) {
      context.$h.toast('error', 'Something wrong');
      return false
    }
  }

  context.$put = async (url, data, config) => {
    try {
      const res = context.$axios.$put(url, config)
      return res.data
    } catch (e) {
      return false
    }
  }

  context.$delete = async (url, config) => {
    try {
      return await context.$axios.$delete(url, config)
    } catch (e) {
      return false
    }
  }

  inject('c', constant)  // $c = constant
  inject('h', {          // $h = helper

    getUrlImage(url) {
      return `${context.$config.BASE_URL_IMAGE}/${url}`
    },
    getUrlHtml(url) {
      return `${context.$config.BASE_URL_IMAGE}/${url}`
    },
    async getList(list, params) {
      let queryParams = {};
      for (let item in list) {
        queryParams[item] = ''
      }

      if (params !== undefined) {
        queryParams = {...queryParams, ...params} // merge 2 params
      }

      return await context.$axios.$get('/common/list', {params: queryParams})
    },

    async refreshAuth() {
      const res = await context.$axios.$get('auth/refresh')
      await context.$auth.setUserToken(res.token)
    },

    /**
     * Show the toast
     * @param type (success | warning | error | info)
     * @param message message to display
     */
    toast(type, message) {},

    /**
     * Show the confirm delete alert box
     * @param callback the function callback execute when click 'Confirm'
     */
    confirmDelete(callback) {
      initApp.playSound('media/sound', 'messagebox')

      bootbox.confirm({
        title: "<em class='" + myapp_config.appIconPrefix + " fa-exclamation-triangle text-danger mr-2'></em>" + 'Are you sure' + " ?",
        message: " ",
        centerVertical: true,
        swapButtonOrder: true,
        buttons: {
          confirm: {
            label: 'Confirm',
            className: 'btn-danger shadow-0'
          },
          cancel: {
            label: 'Cancel',
            className: 'btn-secondary'
          }
        },
        className: "modal-alert",
        closeButton: false,
        callback: function (result) {
          if (result === true) {
            callback()
          }
        }
      })
    },

    confirmWarning(callback) {
      initApp.playSound('media/sound', 'messagebox')

      bootbox.confirm({
        title: "<em class='" + myapp_config.appIconPrefix + " fa-exclamation-triangle text-warning mr-2'></em> Are you sure?",
        message: " ",
        centerVertical: true,
        swapButtonOrder: true,
        buttons: {
          confirm: {
            label: 'Confirm',
            className: 'btn-primary shadow-0'
          },
          cancel: {
            label: 'Cancel',
            className: 'btn-secondary'
          }
        },
        className: "modal-alert",
        closeButton: false,
        callback: function (result) {
          if (result === true) {
            callback()
          }
        }
      })
    },
    confirmSwitcher(callback) {
      initApp.playSound('media/sound', 'messagebox')

      bootbox.confirm({
        title: `<div class="title-full" style="width: 100%">${'<div style="width: 100%">Attention !</div>' + " <em class='" + myapp_config.appIconPrefix + " fa-exclamation-triangle text-danger mr-2'></em>" + 'Do you want to change the active status ?'}</div>`,
        message: " ",
        centerVertical: true,
        swapButtonOrder: true,
        buttons: {
          confirm: {
            label: 'Confirm',
            className: 'btn-danger shadow-0'
          },
          cancel: {
            label: 'Cancel',
            className: 'btn-secondary'
          }
        },
        className: "modal-alert",
        closeButton: false,
        callback: function (result) {
          if (result === true) {
            callback()
          }
        }
      })
    },

    getDate(date, format) {
      date = '' + date
      if (context.$moment(date, context.$moment.ISO_8601).isValid()) return date
      return context.$moment(date).isValid() ? (format ? context.$moment(date).format(format) : context.$moment(date)) : ''
    },

    formatNumber(number = 0, letter = ' ') {
      if (number !== null) {
        return number.toString().split(/(?=(?:\d{3})+(?:.|$))/g).join(letter)
      } else {
        return null
      }
    },

    vt(value) {
      return value
    },

    arrToListTagConfig(data) {
      let result = [];
      Object.keys(data).forEach(function (item, index) {
        result.push({id: item, text: this.vt(data[item])})
      })
      return result;
    },

    arrToListTagJson(data) {
      let result = [];
      for (let index in data) {
        let text = this.vt(data[index]['name']);
        result.push({id: data[index]['id'], text: text});
      }
      return result;
    },

    isJsonString(text) {
      if (!isNaN(text)) return false
      return !!(text && /^[\],:{}\s]*$/.test(text.replace(/\\["\\\/bfnrtu]/g, '@').replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').replace(/(?:^|:|,)(?:\s*\[)+/g, '')))
    },

    nl2br(text) {
      return text ? text.replace(/(?:\\r\\n|\\r|\\n)/g, '<br />') : ''
    },

    getSlug(str, lang = '') {
      if (this.isJsonString(str)) {
        str = JSON.parse(str);
        for (let key in str) {
          str[key] = lang ? this.slug(str[lang]) : this.slug(str[key])
        }
        return JSON.stringify(str)
      }
      return JSON.stringify(this.slug(str));
    },

    slug(str) {
      let slug = str.toLowerCase()
      slug = slug.replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, 'a')
      slug = slug.replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, 'e')
      slug = slug.replace(/i|í|ì|ỉ|ĩ|ị/gi, 'i')
      slug = slug.replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, 'o')
      slug = slug.replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, 'u')
      slug = slug.replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, 'y')
      slug = slug.replace(/đ/gi, 'd')
      slug = slug.replace(/\`|\~|\!|\@|\#|\||\$|\%|\^|\&|\*|\(|\)|\+|\=|\,|\.|\/|\?|\>|\<|\'|\"|\:|\;|_/gi, '')
      slug = slug.replace(/ /gi, '-')
      slug = slug.replace(/\-\-\-\-\-/gi, '-')
      slug = slug.replace(/\-\-\-\-/gi, '-')
      slug = slug.replace(/\-\-\-/gi, '-')
      slug = slug.replace(/\-\-/gi, '-')
      slug = '@' + slug + '@'
      slug = slug.replace(/\@\-|\-\@|\@/gi, '')
      return slug
    }
  })

  inject('p', {          // $p = permission
    has(pers) {
      if (!context.$auth.user || !context.$auth.user.permissions) return false
      if (typeof pers === "string") {
        if (context.$auth.user.permissions.includes(pers)) {
          return true
        }
      } else {
        for (let per of pers) {
          if (context.$auth.user.permissions.includes(per)) {
            return true
          }
        }
      }

      return false
    },

    isComplex() {
      return !context.$auth.user.display_simple
    },
  })

  context.$axios.onError((error) => {
    switch (error.response.status) {
      case 422:

        if (typeof error.response.data.error !== 'undefined') {
          context.$h.toast('error', context.store.$i18n.t(error.response.data.error))
        } else {
          context.$h.toast('error', context.store.$i18n.t('please_check_your_input_data'))
        }

        handleValidateErrors(error.response.data)
        break
      case 404:

        if (typeof error.response.data.error !== 'undefined') {
          context.$h.toast('error', context.store.$i18n.t(error.response.data.error))
        } else {
          context.$h.toast('error', context.store.$i18n.t('data_not_found'))
        }

        // window.location.href = '/'
        break
      case 403:
        if (typeof error.response.data.error !== 'undefined') {
          context.$h.toast('error', context.store.$i18n.t(error.response.data.error))
        } else {
          context.$h.toast('error', context.store.$i18n.t('invalid_user_authorization'))
        }

        // window.location.href = '/'
        break
      case 401:
        context.$h.toast('error', context.store.$i18n.t('Vui lòng kiểm tra lại thông tin'))
        // window.location.href = '/'
        break

      default:
        break
    }
  })

  context.$axios.onResponse((res) => {
    if (res.status === 200 && res.data.success) {
      context.$h.toast('success', res.data.success)
    }
  })

  const handleValidateErrors = (errors) => {
    $.each(errors, async (key, mess) => {
      await $('.invalid-feedback').remove()
      await $('.is-invalid').removeClass('is-invalid')

      const str = Array.isArray(mess) ? mess[0] : mess
      const trans = str
      const divErrorMessage = `<div class="invalid-feedback">${trans}</div>`

      let input = null

      if (key.includes('.')) {
        const splitKey = key.split('.')
        // has many form
        if (splitKey.length === 3) {
          let [group, number, fieldName] = splitKey
          input = $(`[data-group=${group}] [data-name=${fieldName}]`).not('has(>input)').eq(number)
            .add($(`[data-group=${group}] select[data-name=${fieldName}]`).not('has(>input)').eq(number).next())
        }
        // has one form
        if (splitKey.length === 2) {
          let [group, fieldName] = splitKey
          input = $(`[data-group=${group}] [data-name=${fieldName}]

          )`)
            .add($(`[data-group=${group}] select[data-name=${fieldName}]

            )`).next())
        }
        if (input) {
          input.addClass('is-invalid')
          input.parent().append(divErrorMessage)
        }
      }
      // simple form
      else {
        input = $(`input[name=${key}], textarea[name=${key}], select[name=${key}], div[name=${key}] .cke_2, div[name=${key}].media-selector .clearfix`)
          .add($(`select[name=${key}]`).next())

        input.addClass('is-invalid')

        if (input.parent('.input-group').length === 1) {
          input.parent().append(divErrorMessage)
        } else {
          input.parent().append(divErrorMessage)
        }
      }
      if (input) {
        input.on('input change DOMSubtreeModified', () => {
          hideErrorWhenFirstFocus(input)
        })
      }
    })
  }

  const hideErrorWhenFirstFocus = (ele) => {
    ele.removeClass('is-invalid')
    ele.closest('.invalid-feedback').remove()
    if (!ele.hasClass('select2')) {
      ele.off('input change')
    }
  }

}

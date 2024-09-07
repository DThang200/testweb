import flatten from 'lodash/flatten'

export default function({ $axios, store }) {

    let handleValidate = (error) => {
        if (!error.response || !error.response.data || !error.response.data.message) return
        const errors = error.response.data.message
        $('.has-error').removeClass('has-error');
        $('small.help-block.help-block-from-server').remove();

        $.each(errors, (key, mess) => {
            let str = ''
            if (typeof  mess === 'object' && mess.index) {
                str = mess['message']
            } else if (typeof mess === 'object') {
                str = mess[0]
            } else if (typeof mess === 'string') {
                str = mess
            }
            // const str = typeof mess === 'object' && mess.index ? mess['message'] : mess[0]
            const trans = str
            if (key === 'error-message') {
                $('[role="content"]').prepend(`<div id="error-message" class="alert alert-block alert-danger"><p>${trans}</p></div>`);
            }
            else if (mess.index) {
                if (mess.index.search(',') !== -1) {
                    const arr = mess.index.split(',')
                    arr.forEach((e) => {
                        let eleInput = $($(`input[name=${key}]`)[e - 1]);
                        eleInput.closest('div').addClass('has-error');
                        if (eleInput.parent('.input-group').length === 1) {
                            eleInput.parent().after(`<small class="help-block help-block-from-server">${trans}</small>`);
                        }
                        else {
                            eleInput.after(`<small class="help-block help-block-from-server">${trans}</small>`);
                        }


                        let eleText = $($(`textarea[name=${key}]`)[mess.index - 1]);
                        eleText.closest('div').addClass('has-error');
                        if (eleText.parent('.input-group').length === 1) {
                            eleText.parent().after(`<small class="help-block help-block-from-server">${trans}</small>`);
                        }
                        else {
                            eleText.after(`<small class="help-block help-block-from-server">${trans}</small>`);
                        }
                    })

                } else {
                    let eleInput = $($(`input[name=${key}]`)[mess.index - 1]);
                    eleInput.closest('div').addClass('has-error');
                    if (eleInput.parent('.input-group').length === 1) {
                        eleInput.parent().after(`<small class="help-block help-block-from-server">${trans}</small>`);
                    }
                    else {
                        eleInput.after(`<small class="help-block help-block-from-server">${trans}</small>`);
                    }

                    let eleText = $($(`textarea[name=${key}]`)[mess.index - 1]);
                    eleText.closest('div').addClass('has-error');
                    if (eleText.parent('.input-group').length === 1) {
                        eleText.parent().after(`<small class="help-block help-block-from-server">${trans}</small>`);
                    }
                    else {
                        eleText.after(`<small class="help-block help-block-from-server">${trans}</small>`);
                    }
                }
            }
            else {
                let eleInput = $(`input[name=${key}]`).not('.item-has-many');
                eleInput.closest('div').addClass('has-error');

                if (eleInput.parent('.input-group').length === 1) {
                    eleInput.parent().after(`<small class="help-block help-block-from-server">${trans}</small>`);
                }
                else {
                    eleInput.after(`<small class="help-block help-block-from-server">${trans}</small>`);
                }
            }
        });
    }

    $axios.setHeader('lang', 'en')

    $axios.onError((error) => {
        switch (error.response.status) {
            case 500:
                store.dispatch('setError', ['Something wrong'])
                break

            case 422:
                handleValidate(error)
                store.dispatch('setError', flatten(Object.values(error.response.data)))
                break

            case 400:
                handleValidate(error)
                store.dispatch('setError', flatten(Object.values(error.response.data)))
                break

            case 401:
                handleValidate(error)
                store.dispatch('setError', flatten(Object.values(error.response.data)))
                break

            case 403:
                store.dispatch('setError', ['Operation not allowed'])
                break

            case 404:
                break

            case 409:
                handleValidate(error)
                store.dispatch('setError', flatten(Object.values(error.response.data)))
                break

            default:
                break
        }
    })
}

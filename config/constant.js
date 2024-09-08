export default (context, inject) => {
    const i18n = context.store.$i18n

    const c = { // Constant
        TYPE_OF_LINK_MENU_FORM: [
            {'id': 1, 'name': 'Internal'},
            {'id': 2, 'name': 'External'},
        ],
        TYPE_OF_MENU_FORM: [
            {'id': 1, 'name': 'Menu'},
            {'id': 2, 'name': 'Sub-Menu'},
        ],
        POST_RECOMMEND_FORM: [
            {'id': 0, 'name': 'No'},
            {'id': 1, 'name': 'Yes'},
        ],
        POST_RECOMMEND_FILTER: [
          "No",
          "Yes"
        ],
        GENDER_FILTER: [
            {'id': 0, 'name': 'Female'},
            {'id': 1, 'name': 'Male'},
            {'id': 2, 'name': 'Others'},
        ],
        STATUS_FILTER: [ // Bind the post of category to this menu
            {'id': 0, 'name': 'No'},
            {'id': 1, 'name': 'Yes'},
        ],
        LANGUAGE_TYPE: [ // Bind the post of category to this menu
            {'id': 'glo', 'name': 'GLO'},
            {'id': 'vie', 'name': 'VIE'},
        ],
        LOCATION_FILTER: [
            {'id': 'glo', 'name': 'GLO'},
            {'id': 'vie', 'name': 'VIE'},
        ],
        BLOCK_FILTER: [
            {'id': 0, 'name': 'Blocked'},
            {'id': 1, 'name': 'Active'}
        ],
        TYPE_FILTER: [
            {'id': 0, 'name': 'Video'},
            {'id': 1, 'name': 'Post'}
        ],
        CONTRACT_FILTER: [
            {'id': 1, 'name': 'Advertisement'},
            {'id': 2, 'name': 'Business Partner'}
        ],
        BANNER_TYPE: [
            {'id': 1, 'name': 'Main Banner'},
            {'id': 2, 'name': 'Post Banner'}
        ],

        // Menu type
        MENU_TYPE_NONE: 1,
        MENU_TYPE_INTERNAL: 2,
        MENU_TYPE_EXTERNAL: 3,

        // Menu Internal type
        MENU_TYPE_INTERNAL_CATEGORY: 1,
        MENU_TYPE_INTERNAL_POST: 2,
        MENU_TYPE_INTERNAL_ABOUT: 3,
        MENU_TYPE_INTERNAL_NEW: 4,
        MENU_TYPE_INTERNAL_INDIVIDUAL_CLIENT: 11,
        MENU_TYPE_INTERNAL_INSTITUTIONAL_CLIENT: 12,
        MENU_TYPE_INTERNAL_CORPORATE_CLIENTS: 13,

        active: [
            {'id': 0, 'name': 'Inactive'},
            {'id': 1, 'name': 'Active'},
        ],

        news: {
            status: [
                {'id': 1, 'name': 'Pending'},
                {'id': 2, 'name': 'Approved'},
            ],
        },

        status_of_new: {
            1: 'Pending',
            2: 'Approved',
        },

        contact: {
            status: [
                {'id': 1, 'name': 'Not contact yet'},
                {'id': 2, 'name': 'Contacted'},
            ],
        },
        status_of_contact: {
            1: 'Not contact yet',
            2: 'Contacted',
        },

        type_banners: {
            Status: [
                {'id': 1, 'name': 'Open Account'},
                {'id': 2, 'name': 'Chưa rõ'},
            ],
        },
        type_of_banner: {
            1: 'Open Account',
            2: 'Chưa rõ',
        },

        type_services: {
            Status: [
                {'id': 1, 'name': 'Securities Services'},
                {'id': 2, 'name': 'Investment Banking Services'},
            ],
        },

        // General
        FORMAT_DATE: 'YYYY-MM-DD',
        FORMAT_MONTH: 'YYYY-MM',
        FORMAT_DATETIME: 'YYYY-MM-DD HH:mm',

        // List status
        STATUS_NEW: 1,
        STATUS_AWAITING_APPROVAL: 2,
        STATUS_REJECTED: 3,
        STATUS_APPROVED: 4,

        // List sample
        SAMPLE_TYPE_A: 1,
        SAMPLE_TYPE_B: 2,

        // List Permissions
        // PERMISSION_PERMISSION: 'permission',
        PERMISSION_GROUP: 'group',
        PERMISSION_ROLE: 'role',
        PERMISSION_USER: 'user',
        PERMISSION_MASTER: 'master',
        PERMISSION_CONTENT: 'content',

        // File responsive
        FILE_UPLOAD: context.$axios.defaults.baseURL + '/files/upload/',
        FILE_MEDIA_BASE: context.$axios.defaults.baseURL + '/files/media/base/',
        FILE_MEDIA_THUMB: context.$axios.defaults.baseURL + '/files/media/thumb/',
        BASE_API: context.$axios.defaults.baseURL + '/',
    }

    const list = { // Constant in list
        'ListPage': [5, 10, 20, 30, 40, 50],
        'Common': {
            'status': {
                [c.STATUS_NEW]: ('status_new'),
                [c.STATUS_AWAITING_APPROVAL]: ('awaiting_approval'),
                [c.STATUS_REJECTED]: ('rejected'),
                [c.STATUS_APPROVED]: ('approved'),
            },

            'permissions': [
                {
                    'name': ('Chức năng hệ thống'),
                    'list': {
                        // [c.PERMISSION_PERMISSION]: ('Chức năng'),
                        [c.PERMISSION_GROUP]: ('Nhóm - Phòng ban'),
                        [c.PERMISSION_USER]: ('Người dùng - Nhân sự'),
                        [c.PERMISSION_ROLE]: ('Vai trò - Vị trí'),
                        [c.PERMISSION_MASTER]: ('Master data'),
                    }
                },
            ]
        },

        'Sample': {
            'type': {
                [c.SAMPLE_TYPE_A]: ('type_a'),
                [c.SAMPLE_TYPE_B]: ('type_b'),
            }
        },
    }

    inject('c', {...c, ...list})  // $c = constant
}

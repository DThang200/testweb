export default {
    target: "static",
    ssr: false,
    server: {
        port: process.env.PORT_BUILD || 3000,
        host: '0.0.0.0'
    },
    publicRuntimeConfig: {
        axios: {
            baseURL: process.env.API_URL
        },
        API_URL: process.env.API_URL,
        BASE_DOMAIN: process.env.BASE_DOMAIN,
        API_ROBLOX: process.env.API_ROBLOX,
        TOKEN_ROBLOX: process.env.TOKEN_ROBLOX,
        INTERVAL_TIME: process.env.INTERVAL_TIME,
        API_ROBLOX_ACCOUNT: process.env.API_ROBLOX_ACCOUNT
    },
    head: {
        title: 'Management Information System',
        meta: [
            {charset: 'utf-8'},
            {name: 'viewport', content: 'width=device-width, initial-scale=1'},
            {hid: 'description', name: 'description', content: ''}
        ],
        link: [
            {rel: 'icon', href: '/favicon.png'},
            {rel: 'stylesheet', href: '/css/vendors.bundle.css'},
            {rel: 'stylesheet', href: '/css/app.bundle.css'},
            {rel: 'stylesheet', href: '/css/skins/skin-master.css'},
            {rel: 'stylesheet', href: '/css/formplugins/select2/select2.bundle.css'},
            {rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/fancybox/3.3.5/jquery.fancybox.css'},
            {rel: 'stylesheet', href: '/css/flag.css'},
            {rel: 'stylesheet', href: '/css/themes/cust-theme-8.css'},
            {rel: 'stylesheet', href: '/css/custom-template.css'},
            {rel: 'stylesheet', href: '/css/custom.css'},

        ],
        script: [
        ],
        bodyAttrs: {
            class: 'mod-bg-1'
        }
    },

    // Global CSS (https://go.nuxtjs.dev/config-css)
    css: [
        'bootstrap-vue/dist/bootstrap-vue.css'
    ],

    // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
    plugins: [
        {src: '~plugins/app.js'},
        {src: '~plugins/axios.js'},
        {src: '~config/constant.js'},
    ],

    // Auto import components (https://go.nuxtjs.dev/config-components)
    components: {
        dirs: [
            '~/components',
            '~/components/@core',
            {path: '~/pages', pattern: '**/components/*.vue'}
        ]
    },

    // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
    buildModules: [
        '@nuxtjs/moment',
        'bootstrap-vue/nuxt'
    ],

    // Modules (https://go.nuxtjs.dev/config-modules)
    modules: [
        '@nuxtjs/axios',
        '@nuxtjs/proxy',
    ],
    i18n: {
        locales: [
            {
                code: 'en',
                iso: 'en-US',
                name: 'English',
                shortName: 'EN',
                file: 'en.json'
            },
            {
                code: 'vn',
                iso: 'vn-VN',
                name: 'Vietnamese',
                shortName: 'VIE',
                file: 'vn.json'
            }],
        defaultLocale: 'vn',
        seo: false,
        lazy: true,
        detectBrowserLanguage: {
            cookieKey: 'redirected',
            useCookie: true
        },
        langDir: 'config/locales/',
        parsePages: false,
        pages: {},
        strategy: 'no_prefix',
        vueI18n: {
            fallbackLocale: 'vn',
            silentTranslationWarn: true, // Disable warning
            silentFallbackWarn: true, // Disable warning
        }
    },

    axios: {
        baseURL: process.env.API_URL,
    },

    moment: {
        defaultTimezone: 'Asia/Ho_Chi_Minh',
        locales: ['vi']
    },

    router: {
        extendRoutes(routes, resolve) {
            routes.push({
                name: 'custom',
                path: '*',
                component: resolve(__dirname, 'pages/404.vue')
            })
        }
    },

    build: {
        babel: {
            compact: true,
            presets({isServer}) {
                const targets = isServer ? {node: 'current'} : {ie: 11}
                return [
                    [require.resolve("@babel/preset-env"), {targets}]
                ]
            },
            plugins: [
                "@babel/syntax-dynamic-import",
                "@babel/transform-runtime",
                "@babel/transform-async-to-generator",
                '@babel/plugin-proposal-optional-chaining'
            ]
        }
    },
}

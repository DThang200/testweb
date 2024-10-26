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
        'link_private' :
            [
                {
                    "name": "2",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=40485808830933982493627210731414"
                },
                {
                    "name": "3",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=13541927201667921415622883232813"
                },
                {
                    "name": "4",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=11682881909160578179235634315887"
                },
                {
                    "name": "5",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=77990525419574555836365259565082"
                },
                {
                    "name": "6",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=25177760124803179013498892482195"
                },
                {
                    "name": "7",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=40551396895864895741712591080709"
                },
                {
                    "name": "8",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=01875745944736205272228503620800"
                },
                {
                    "name": "9",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=53111474900907073598507029517452"
                },
                {
                    "name": "10",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=37988102519471987059948653921499"
                },
                {
                    "name": "11",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=60637834140693866860410092892538"
                },
                {
                    "name": "12",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=31553660665247146221819425847415"
                },
                {
                    "name": "13",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=74447090920130052052706115194683"
                },
                {
                    "name": "14",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=44179821935537315677241683915268"
                },
                {
                    "name": "15",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=47802595943084529557378654857108"
                },
                {
                    "name": "16",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=74498395294960136668345060360063"
                },
                {
                    "name": "17",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=04079908633059570285865365501421"
                },
                {
                    "name": "18",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=85565964166012334866939269927189"
                },
                {
                    "name": "19",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=30092196865561958808955721441382"
                },
                {
                    "name": "20",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=10697160316457411832566130598472"
                },
                {
                    "name": "21",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=84212955785407522295251070098884"
                },
                {
                    "name": "22",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=93380265598117416650420269978333"
                },
                {
                    "name": "23",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=27931277821465715262088657069770"
                },
                {
                    "name": "24",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=18046009030005623364358443469372"
                },
                {
                    "name": "25",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=05553503915632183852603625347345"
                },
                {
                    "name": "26",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=87686190558161597446024835869014"
                },
                {
                    "name": "27",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=42103263513332093739159673662777"
                },
                {
                    "name": "28",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=14408417487627752216019586494009"
                },
                {
                    "name": "29",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=28211476156231567228011536335169"
                },
                {
                    "name": "30",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=56199234457187872143017940297630"
                },
                {
                    "name": "31",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=62617859210007714403588634726291"
                },
                {
                    "name": "32",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=71231733548948612274358680251841"
                },
                {
                    "name": "33",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=05586561560078118279466230166604"
                },
                {
                    "name": "34",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=73765898932336995596855313828136"
                },
                {
                    "name": "35",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=25915914651775148647064689320445"
                },
                {
                    "name": "36",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=54235157986620607958351694245234"
                },
                {
                    "name": "37",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=72470220947972867926853177658948"
                },
                {
                    "name": "38",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=80649163925413407589748231110410"
                },
                {
                    "name": "39",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=53976776334211427420799969681756"
                },
                {
                    "name": "40",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=77307974697071246730685310240502"
                },
                {
                    "name": "41",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=22070526823488683762899416782461"
                },
                {
                    "name": "42",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=22035316434613309314366627491983"
                },
                {
                    "name": "43",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=23462626136044451847546046522650"
                },
                {
                    "name": "44",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=49147076285562339357624539855626"
                },
                {
                    "name": "45",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=93353539813034165408907417954009"
                },
                {
                    "name": "46",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=88231361576197646225798682691455"
                },
                {
                    "name": "47",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=06217397992050229923918992569573"
                },
                {
                    "name": "48",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=88970722450913955804781624935498"
                },
                {
                    "name": "49",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=30217645068082646547749126485635"
                },
                {
                    "name": "50",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=71106974463055452422120201106238"
                },
                {
                    "name": "51",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=58839520399288830012615967293237"
                },
                {
                    "name": "52",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=90903885939426599511573017672783"
                },
                {
                    "name": "53",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=10007547918222045868516439315880"
                },
                {
                    "name": "54",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=50356989635643813397752319996189"
                },
                {
                    "name": "55",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=37184974309682913777910778035400"
                },
                {
                    "name": "56",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=68896204469666921212907692286891"
                },
                {
                    "name": "57",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=42542141395586205018995289944667"
                },
                {
                    "name": "58",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=12754013918035213313885291110334"
                },
                {
                    "name": "59",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=03451960476945243521539890737423"
                },
                {
                    "name": "60",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=10182345236639035539851472208493"
                },
                {
                    "name": "61",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=29900357911364532367918789580643"
                },
                {
                    "name": "62",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=32588483125857248410402245773898"
                },
                {
                    "name": "63",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=51191747812097746285764538794293"
                },
                {
                    "name": "64",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=55386153611357376925606650080903"
                },
                {
                    "name": "65",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=40475983614261328581099561811870"
                },
                {
                    "name": "66",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=36886135464551394369672679945322"
                },
                {
                    "name": "67",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=47396847525103371033372524724482"
                },
                {
                    "name": "68",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=44577686178170311546347732530665"
                },
                {
                    "name": "69",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=04027934200127311742553272699737"
                },
                {
                    "name": "70",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=45727437616675047983594867179334"
                },
                {
                    "name": "71",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=52895092300140966340165549809912"
                },
                {
                    "name": "72",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=83729528051672683147760383682662"
                },
                {
                    "name": "73",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=99127210189304250186217599569993"
                },
                {
                    "name": "74",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=49219092045631209518020472210975"
                },
                {
                    "name": "75",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=41696064769161668164141645502050"
                },
                {
                    "name": "76",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=98108754348226991886059958350253"
                },
                {
                    "name": "77",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=15987576697404704343461879384470"
                },
                {
                    "name": "78",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=15987576697404704343461879384470"
                },
                {
                    "name": "79",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=31571037327760829250726041294241"
                },
                {
                    "name": "80",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=14045789630758313638525560356236"
                },
                {
                    "name": "81",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=14317004597039704725267839293565"
                },
                {
                    "name": "82",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=89107063085171839800725400439093"
                },
                {
                    "name": "83",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=64724797614084171747998873620646"
                },
                {
                    "name": "84",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=19084699185120226140372823980218"
                },
                {
                    "name": "85",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=71365336753764800261641991517713"
                },
                {
                    "name": "86",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=48892557171292530011378087973909"
                },
                {
                    "name": "87",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=66614456608788003855396015123077"
                },
                {
                    "name": "88",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=64939035303352338500744983312604"
                },
                {
                    "name": "89",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=57950221415391615007810999222196"
                },
                {
                    "name": "90",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=04772198812986051662529829890132"
                },
                {
                    "name": "91",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=81140008852013487507108257699045"
                },
                {
                    "name": "92",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=33013539721029886190384742737490"
                },
                {
                    "name": "93",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=77596840079583542902572174435762"
                },
                {
                    "name": "94",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=05785101212146860973140196257314"
                },
                {
                    "name": "95",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=33664305300769392991312918180187"
                },
                {
                    "name": "96",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=97571359767416095900420658581480"
                },
                {
                    "name": "97",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=32442888931060572927341385723275"
                },
                {
                    "name": "98",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=78409195036442887366435325365681"
                },
                {
                    "name": "99",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=84843606666560062857604749965968"
                },
                {
                    "name": "100",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=90103035263145198119585400774395"
                },
                {
                    "name": "101",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=64448904419818291669349159724112"
                },
                {
                    "name": "102",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=76577380881023291874262181236541"
                },
                {
                    "name": "103",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=71883165475020460160558468578417"
                },
                {
                    "name": "104",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=02627391753818797982758692239117"
                },
                {
                    "name": "105",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=90658890479127742921297352454679"
                },
                {
                    "name": "106",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=23457745549415537721437515267139"
                },
                {
                    "name": "107",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=64177814830056051216483723638324"
                },
                {
                    "name": "108",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=07060608608606113622335731767090"
                },
                {
                    "name": "109",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=04547889923345768681083924811876"
                },
                {
                    "name": "110",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=66828595409202164141673591694061"
                },
                {
                    "name": "111",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=04993548803608252247054529119536"
                },
                {
                    "name": "112",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=66778515994119463540006595343728"
                },
                {
                    "name": "113",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=74536075882849885664567112641650"
                },
                {
                    "name": "114",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=65434028260776192798361577654207"
                },
                {
                    "name": "115",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=40835907980483868485168041451566"
                },
                {
                    "name": "116",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=31361078214451282591351556687986"
                },
                {
                    "name": "117",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=77068298654151356916813744155035"
                },
                {
                    "name": "118",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=97398863864617702905695204501832"
                },
                {
                    "name": "119",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=13937309569715814273601388865762"
                },
                {
                    "name": "120",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=97768015001864791121522145774617"
                },
                {
                    "name": "121",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=46212104634875856802262748306385"
                },
                {
                    "name": "122",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=37149612623312083520066550223699"
                },
                {
                    "name": "123",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=47169537732849614423701829824254"
                },
                {
                    "name": "124",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=96060070822425789774356704832151"
                },
                {
                    "name": "125",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=47013749221881311919864337693464"
                },
                {
                    "name": "126",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=15271398137520040339015576217175"
                },
                {
                    "name": "127",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=14954447645684076173681454755030"
                },
                {
                    "name": "128",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=38557091098980924001641928908387"
                },
                {
                    "name": "129",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=92172140161756933823811560679567"
                },
                {
                    "name": "130",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=83066244781995720909193205517398"
                },
                {
                    "name": "131",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=91314460240637132034095704979779"
                },
                {
                    "name": "132",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=95433223131508944029334309544938"
                },
                {
                    "name": "133",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=04477158254560238508097881435289"
                },
                {
                    "name": "134",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=39903207213754809840264320843679"
                },
                {
                    "name": "135",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=58015644775844873802525692298039"
                },
                {
                    "name": "136",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=65970954893723066644605775600813"
                },
                {
                    "name": "137",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=24962625524265406434546984952144"
                },
                {
                    "name": "138",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=81877035962741257465045121660050"
                },
                {
                    "name": "139",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=59339390444788564302151676521874"
                },
                {
                    "name": "140",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=10340557420824152497260438151761"
                },
                {
                    "name": "141",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=99367559420772052665808758151912"
                },
                {
                    "name": "142",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=05291556423577217054429441277615"
                },
                {
                    "name": "143",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=25627975649002698640459949527912"
                },
                {
                    "name": "144",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=06290942003793534886557793178380"
                },
                {
                    "name": "145",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=72646688876648445928587740020342"
                },
                {
                    "name": "146",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=72358644175928061519821151539464"
                },
                {
                    "name": "147",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=12728364645130931456627834929218"
                },
                {
                    "name": "148",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=27648494840188538494076163410455"
                },
                {
                    "name": "149",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=77414839947793040574152821819797"
                },
                {
                    "name": "150",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=35480758177215169620425719105048"
                },
                {
                    "name": "151",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=61141705591445551527778137949903"
                },
                {
                    "name": "152",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=42968542918681770779998842986585"
                },
                {
                    "name": "153",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=48900538897001899333800030928800"
                },
                {
                    "name": "154",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=00063030909551715185054274237230"
                },
                {
                    "name": "155",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=10733026696849875025347593440663"
                },
                {
                    "name": "156",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=69196554584737462866213882157193"
                },
                {
                    "name": "157",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=39314051480849700323349367131757"
                },
                {
                    "name": "158",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=09797007772986433246632010656697"
                },
                {
                    "name": "159",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=60178238841446628570244468900632"
                },
                {
                    "name": "160",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=20449916445616290039302252851404"
                },
                {
                    "name": "161",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=07591345030647462871946163401639"
                },
                {
                    "name": "162",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=77205140258966421182493089528063"
                },
                {
                    "name": "163",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=51788429312649926373337197382049"
                },
                {
                    "name": "164",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=17088290652553320758994035329113"
                },
                {
                    "name": "165",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=70323902178067157063147383899616"
                },
                {
                    "name": "166",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=69022494834511911525053740003741"
                },
                {
                    "name": "167",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=11413186052599930127497723796104"
                },
                {
                    "name": "168",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=34309724391947796453787610608536"
                },
                {
                    "name": "169",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=06979781998835584796178126142024"
                },
                {
                    "name": "170",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=40767729790106675152741172771075"
                },
                {
                    "name": "171",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=27660375851378234427141219105968"
                },
                {
                    "name": "172",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=41144720935806030289631377742208"
                },
                {
                    "name": "173",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=83214026117253358668742498515220"
                },
                {
                    "name": "174",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=41521806783886403108878825009177"
                },
                {
                    "name": "175",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=28946831624095236084548646206156"
                },
                {
                    "name": "176",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=08608227295922489178348779826123"
                },
                {
                    "name": "177",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=04586018554315875563938844069584"
                },
                {
                    "name": "178",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=02837166684088478976904941853736"
                },
                {
                    "name": "179",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=73079855356911964389140753221360"
                },
                {
                    "name": "180",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=46668948579857902136942074294652"
                },
                {
                    "name": "181",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=99534963623325627358255253594629"
                },
                {
                    "name": "182",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=76125047694592251784612202272849"
                },
                {
                    "name": "183",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=64114889088976337408458667846968"
                },
                {
                    "name": "184",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=92639813192274749491758928649819"
                },
                {
                    "name": "185",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=62104006174611857820346137014086"
                },
                {
                    "name": "186",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=21931594463970303601862892498444"
                },
                {
                    "name": "187",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=11113293624568687881300954478182"
                },
                {
                    "name": "188",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=25487193500656925800307829853455"
                },
                {
                    "name": "189",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=76233245112326390687477425681615"
                },
                {
                    "name": "190",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=72377328729257297033582008242318"
                },
                {
                    "name": "191",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=37572840894163974562872638074246"
                },
                {
                    "name": "192",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=05709106088470942758413001808686"
                },
                {
                    "name": "193",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=64897990807278997517207499449996"
                },
                {
                    "name": "194",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=31041351439620332774261697700949"
                },
                {
                    "name": "195",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=22073431348623340451495253354824"
                },
                {
                    "name": "196",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=35350787247124515369423510651998"
                },
                {
                    "name": "197",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=82490753001744383872401380497987"
                },
                {
                    "name": "198",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=79512865513759261425422378310889"
                },
                {
                    "name": "199",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=99352237838457255010657074273947"
                },
                {
                    "name": "200",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=23305428120792697467583158727844"
                },
                {
                    "name": "201",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=17281882124776704442728055809641"
                },
                {
                    "name": "202",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=05507835419332021460277703790323"
                },
                {
                    "name": "203",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=37972525196857782715590813875291"
                },
                {
                    "name": "204",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=93020546241659164450022091025691"
                },
                {
                    "name": "205",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=39511216474673239811489654295886"
                },
                {
                    "name": "206",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=79438595317492424883269471961757"
                },
                {
                    "name": "207",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=07227142869797734491211104860139"
                },
                {
                    "name": "208",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=12215690537829651663619736761672"
                },
                {
                    "name": "209",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=61265560999337132566612687097944"
                },
                {
                    "name": "210",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=62216745036143940930204546143553"
                },
                {
                    "name": "211",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=26745110566665918298165267133280"
                },
                {
                    "name": "212",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=34976198949166252086719388473812"
                },
                {
                    "name": "213",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=93768764970252522066901158881335"
                },
                {
                    "name": "214",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=96346944201954492962344948248571"
                },
                {
                    "name": "215",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=45382035095106742531585591906293"
                },
                {
                    "name": "216",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=92440469742711267523264384255652"
                },
                {
                    "name": "217",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=11767571286969247473196285845870"
                },
                {
                    "name": "218",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=34507673542978696705275809302561"
                },
                {
                    "name": "219",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=76146296188560509571454825376768"
                },
                {
                    "name": "220",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=07259662019938056089196593902532"
                },
                {
                    "name": "221",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=94373677775671348592127809442908"
                },
                {
                    "name": "222",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=20497497274870820696608312597375"
                },
                {
                    "name": "223",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=18916850614479901936488417989490"
                },
                {
                    "name": "224",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=52279673218252614443945331266488"
                },
                {
                    "name": "225",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=52279673218252614443945331266488"
                },
                {
                    "name": "226",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=47983857490675001815714872275547"
                },
                {
                    "name": "227",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=16475496851176231079361971651730"
                },
                {
                    "name": "228",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=84372148391841732058199817099282"
                },
                {
                    "name": "229",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=17133180133088205064180498121137"
                },
                {
                    "name": "230",
                    "link": "https:\/\/www.roblox.com\/games\/17017769292\/Anime-Defenders?privateServerLinkCode=77332633153025638579675477969260"
                }
            ]

    }

    inject('c', {...c, ...list})  // $c = constant
}

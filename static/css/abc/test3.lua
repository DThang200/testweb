coroutine.wrap(function()
    wait(7200)
    player:Kick("You have been kicked after 120 minutes.")
end)()
getgenv().Config = {
    ["Time To Sell"] = 35,
    ["Craft Event"] = {
        ["Crafters Seed Pack"] = true,
        ["Anti Bee Egg"] = true,
        ["Ancient Seed Pack"] = true
    },
    ["Dont Open Pack"] = false,
    ["Dont Use Flower Seed Pack"] = true,
    ["Mode Plant"] = "Auto", -- "Custom"
    ["Seed"] = {
        ["Carrot"] = 44,
        ["Strawberry"] = 5,
        ["Blueberry"] = 5,
        ["Orange Tulip"] = 5,
        ["Corn"] = 5,
        ["Daffodil"] = 5,
        ["Coconut"] = 5,
        ["Apple"] = 5,
        ["Tomato"] = 5,
        ["Watermelon"] = 5,
        ["Mushroom"] = 5,
        ["Pumpkin"] = 5,
        ["Pepper"] = 5,
        ["Cacao"] = 5,
        ["Dragon Fruit"] = 5,
        ["Mango"] = 10,
        ["Loquat"] = 10,
        ["Cactus"] = 10,
        ["Beanstalk"] = 10,
        ["Grape"] = 10,
        ["Bell Pepper"] = 10,
        ["Bamboo"] = 10,
        ["Feijoa"] = 10,
        ["Avocado"] = 10,
        ["Prickly Pear"] = 10,
        ["Kiwi"] = 10,
        ["Foxglove"] = 20,
        ["Sugar Apple"] = 20,
        ["Lilac"] = 20,
        ["Lilac"] = 20,
        ["Pink Lily"] = 20,
        ["Rose"] = 20,
        ["Purple Dahlia"] = 20,
        ["Paradise Petal"] = 10,
        ["Horned Dinoshroom"] = 10,
        ["Firefly Fern"] = 10,
        ["Fossilight Fruit"] = 10,
        ["Amber Spine"] = 10,
        ["Bone Blossom"] = 10,
        ["Burning Bud"] = 10,

    },
    ["Keep Seed"] = { "Dragon Pepper", "Elephant Ears", "Sunflower", "Candy Blossom", "Bone Blossom" },
    ["Egg"] = {
        ["Mythical Egg"] = {
            ["Buy"] = true,
            ["Place"] = true,
            ["Priority"] = 5
        },
        ["Oasis Egg"] = {
            ["Place"] = true,
            ["Priority"] = 6
        },
        ["Anti Bee Egg"] = {
            ["Place"] = true,
            ["Priority"] = 1
        },
        ["Night Egg"] = {
            ["Place"] = true,
            ["Priority"] = 4
        },
        ["Bug Egg"] = {
            ["Buy"] = true,
            ["Place"] = false,
            ["Priority"] = 2
        },
        ["Paradise Egg"] = {
            ["Buy"] = true,
            ["Place"] = true,
            ["Priority"] = 3
        },
        ["Bee Egg"] = {
            ["Buy"] = true,
            ["Place"] = false,
            ["Priority"] = 3
        },
        ["Dinosaur Egg"] = {
            ["Place"] = false,
            ["Priority"] = 6
        }
    },

    ["Sprinkler"] = {
        ["Place Sprinkler"] = true,
        ["Buy Sprinkler"] = true,
        ["Basic Sprinkler"] = true,
        ["Advanced Sprinkler"] = true,
        ["Master Sprinkler"] = true,
        ["Godly Sprinkler"] = true
    },
    ["Plant Candy"] = false,
    ["PetNeedSend"] = { "Dragonfly", "Raccoon", "Disco Bee", "Butterfly", "Mimic Octopus", "Fennec Fox", "T-Rex", "Spinosaurus" },
    ["Destroy Mode"] = {
        ["Auto Destroy when have money"] = 500000000, -- its will destroy all trees select when money >= select
        ["Mode Destroy"] = "Auto", -- "Custom"
        ["Trees"] = { "Strawberry", "Blueberry", "Orange Tulip", "Corn", "Tomato", "Apple", "Banana", "Carrot" }
        ["Rarity Destroy Auto"] = {"Common", "Uncommon", "Rare", "Legendary"},
["Destroy Untill"] = 150
},
["Dino Quest Farm"] = true,
["Url"] = "https://discord.com/api/webhooks/1394750086432559226/UnnnaVhaNGV87ztf9tMFGu3WskhulaOEt7sK-JHvS9bidUX2mDNvw9XeMKkGoSkx4m7m", -- Webhook

["Boost FPS"] = false,
["Black Screen"] = false,
["Dino Event"] = {
["Auto Claim Quest"] = true,
["Auto Restart Quest"] = true,
["Auto Submit"] = true,
["Auto Trade Eggs"] = true,
["Pet Dont Trade"] = {"Queen Bee", "Red Fox", "Dragonfly", "Raccoon", "Disco Bee", "Butterfly", "Mimic Octopus",
"Sand Snake", "Fennec Fox", "Axolotl", "Hyacinth Macaw", "Hamster",
"Golden Lab", "T-Rex", "Spinosaurus"}
},
["Note"] = "Cyndral Hub",
["Pet Mode"] = {
["Sell Pet"] = false,
["Equip Pet"] = true,
["Name Pet Equip"] = {
["Night Owl"] = true,
["Chicken"] = true
},
["Max Slot Pet To Sell"] = 1, -- If Total Pet In Inventory >= ["Max Slot Pet To Sell"] script will sell pet
["Upgrade Slot Egg"] = {
["Enable"] = true,
["Black List Pet For Upgrade Slots"] = {"Queen Bee", "Red Fox", "Dragonfly", "Raccoon", "Disco Bee",
"Butterfly", "Mimic Octopus", "Meerkat", "Sand Snake", "Fennec Fox",
"Axolotl", "Hyacinth Macaw", "Hamster", "T-Rex", "Spinosaurus"}
},
["Pet Dont Delete"] = {"Ostrich", "Peacock", "Capybara", "Scarlet Macaw", "Mimic Octopus", "Meerkat", "Sand Snake", "Triceratops", "Stegosaurus", "Pterodactyl", "Raptor",
"Brontosaurus", "Pachycephalosaurus", "Iguanodon", "Brown Mouse", "Grey Mouse", "Caterpillar", "Giant Ant", "Praying Mantis", "Red Fox",
"Snail", "Squirrel", "Hyacinth Macaw", "Axolotl", "Ankylosaurus", "Dilophosaurus", "Queen Bee", "Disco Bee", "Butterfly", "Dragonfly", "Fennec Fox", "T‑Rex", "Spinosaurus"},
["Dont Sell Pet If Weight > x"] = 10 -- Script dont sell pet if this weight >= 10
},
["Webhook Mode"] = {
["Enable Send Pet Weight"] = true,
["Weight"] = 20 -- if Weight >= 10 they will send wh

},
["Rejoin Mode"] = {
["Auto Rejoin When Error Module Egg"] = true,
["Auto rejoin on script update"] = true,
["Enable Rejoin After X Time"] = true,
["Rejoin After X Time"] = 60 -- Minutes
},
["Limit Tree"] = 250,
["White Screen"] = true
}
script_key = "grPApANcmFyFWdDFPtCZDubYlEJxGQQb";
loadstring(game:HttpGet("https://api.luarmor.net/files/v3/loaders/153a62fe6e6f165f8aa4643955297d65.lua"))()

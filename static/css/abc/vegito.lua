repeat wait() until game:IsLoaded()
local Players = game:GetService("Players")
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local LocalPlayer = Players.LocalPlayer
local function safeRequire(m)
    local ok, mod = pcall(require, m)
    if ok then return mod end
    warn("StartQuest require error:", mod)
    return nil
end
local function waitForPath(root, parts, timeoutPerStep)
    local node = root
    for _, name in ipairs(parts) do
        node = node:WaitForChild(name, timeoutPerStep or 10)
        if not node then return nil end
    end
    return node
end

local function getCurrencies()
    local ch = safeRequire(game.StarterPlayer.Modules.Gameplay.CurrencyHandler)
    if ch and typeof(ch.GetCurrencies) == "function" then
        local ok, tbl = pcall(ch.GetCurrencies)
        if ok and typeof(tbl) == "table" then
            return tbl
        end
    end
    return {}
end

local function num(v) return (typeof(v) == "number") and v or 0 end

local function fire(remotePath, args)
    local ok, remote = pcall(function()
        return waitForPath(ReplicatedStorage, remotePath, 10)
    end)
    if not ok or not remote then
        warn("not found remote:", table.concat(remotePath, "/"))
        return false
    end
    local ok2, err = pcall(function()
        remote:FireServer(unpack(args))
    end)
    if not ok2 then
        warn("error run remote:", err)
        return false
    end
    return true
end

local function pickOneUnitName()
    local unitsFolder = waitForPath(LocalPlayer, {
        "PlayerGui","Windows","Units","Holder","Main","Units"
    }, 10)
    if not unitsFolder then return nil end

    local ignore = {
        UICorner = true,
        UIGridLayout = true,
        UIPadding = true,
        BuyMoreSpace = true,
    }

    for _, child in ipairs(unitsFolder:GetChildren()) do
        if not ignore[child.Name] then
            return child.Name
        end
    end
    return nil
end
function StartQuest()
    local markName = ("%s_startquest.txt"):format(LocalPlayer.Name)
    if isfile and isfile(markName) then
        return
    end
    fire({"Networking", "DailyRewardEvent"}, {
        [1] = "Claim",
        [2] = { "Anniversary", 1 }
    })
    task.wait(0.3)
    fire({"Networking", "BattlepassEvent"}, {
        [1] = "ClaimAll"
    })
    task.wait(0.3)
    local c = getCurrencies()
    local gems = num(c.Gems or c.Gem or c.gems)
    local rerolls = num(c.TraitRerolls or c["Trait Rerolls"] or c.traitrerolls)
    if gems >= 50 and rerolls > 0 then
        fire({"Networking","Units","SummonEvent"}, {
            [1] = "SummonMany",
            [2] = "Special",
            [3] = 1
        })
        task.wait(0.5)
        local unitId = pickOneUnitName()
        if unitId then
            fire({"Networking","Units","TraitEvent"}, {
                [1] = "Reroll",
                [2] = { unitId, "Trait" }
            })
        else
            warn("Not found unit.")
        end
        task.wait(0.3)
        if unitId then
            local args = {
                [1] = "All",
                [2] = unitId
            }

            game:GetService("ReplicatedStorage").Networking.StatRerollFunction:InvokeServer(unpack(args))
        end
        if writefile then
            local ok, err = pcall(function()
                writefile(markName, "done quest")
            end)
            if not ok then
                warn("Error write file:", err)
            end
        else
            warn("Chill.")
        end
    else
        warn("Not enough gem or reroll.")
    end
end
StartQuest()
getgenv().Key = "${nousigi}"

getgenv().Config = {
    ["Auto Join Equipper"] = {
        ["Macro Equipper"] = {
            ["Enable"] = false
        },
        ["Team Equipper"] = {
            ["Enable"] = false
        }
    },
    ["Gold Buyer"] = {
        ["Enable"] = false
    },
    ["Dungeon Joiner"] = {
        ["Auto Join"] = false
    },
    ["Stage Joiner"] = {
        ["Join Highest"] = false,
        ["Join Lowest Clear"] = false,
        ["Auto Join"] = true,
        ["Nightmare Mode"] = false,
        ["Stage"] = "Planet Namak",
        ["Act"] = "Act1"
    },
    ["Macros"] = {
        ["Macro Retry Limit"] = 0,
        ["Ignore Macro Timing"] = true,
        ["Play"] = false,
        ["Auto Equip"] = false,
        ["No Ignore Sell Timing"] = true
    },
    ["Summer Event"] = {
        ["Summer Event Joiner"] = {
            ["Auto Join"] = false
        }
    },
    ["Webhook"] = {
        ["Unit Summoned"] = false,
        ["Trait Rerolled"] = false,
        ["URL"] = "https://discord.com/api/webhooks/1410629253262872676/f4VsUnjK4mu1Xx5cgFz3ASeIDgyAElMIg9M-8KwRj56R0hpAOWGtFmhmPRkTseJwjRL6",
        ["Unit Stat Potential"] = false,
        ["Stage Finished"] = true,
        ["Stat Potential Rerolled"] = false,
        ["Match Restarted"] = false
    },
    ["Boss Event Joiner"] = {
        ["Auto Join"] = false,
        ["Nightmare Mode"] = false
    },
    ["Trait Reroller"] = {
        ["Enable"] = disable,
        ["Trait"] = {
            ["Vigor 3"] = true,
            ["Fortune"] = true,
            ["Swift 2"] = true,
            ["Vigor 1"] = true,
            ["Range 2"] = true,
            ["Blitz"] = true,
            ["Ethereal"] = true,
            ["Swift 3"] = true,
            ["Vigor 2"] = true,
            ["Swift 1"] = true,
            ["Solar"] = true,
            ["Scholar"] = true,
            ["Range 3"] = true,
            ["Range 1"] = true,
            ["Monarch"] = true,
            ["Deadeye"] = true,
            ["Marksman"] = true
        }
    },
    ["Odyssey Joiner"] = {
        ["Second Team"] = 2,
        ["Auto Join"] = false,
        ["Cash Out Floor"] = 5,
        ["Intensity"] = 200,
        ["First Team"] = 1
    },
    ["Summer Portal Joiner"] = {
        ["Buy if out of Portal"] = false,
        ["Tier Cap"] = 10,
        ["Auto Join"] = false,
        ["Ignore Modifier"] = {
            ["Strong"] = false,
            ["Thrice"] = false,
            ["Regen"] = false,
            ["Fast"] = false,
            ["Revitalize"] = false,
            ["Drowsy"] = false,
            ["Exploding"] = false,
            ["Dodge"] = false,
            ["Quake"] = false,
            ["Immunity"] = false,
            ["Shielded"] = false,
            ["Champions"] = false
        },
        ["Auto Next"] = false,
        ["Portal Reward Picker"] = {
            ["Enable"] = false,
            ["Ignore Modifier"] = {
                ["Strong"] = false,
                ["Thrice"] = false,
                ["Regen"] = false,
                ["Fast"] = false,
                ["Revitalize"] = false,
                ["Drowsy"] = false,
                ["Exploding"] = false,
                ["Dodge"] = false,
                ["Quake"] = false,
                ["Immunity"] = false,
                ["Shielded"] = false,
                ["Champions"] = false
            }
        }
    },
    ["Claimer"] = {
        ["Auto Claim Collection Milestone"] = true,
        ["Auto Claim Quest"] = true,
        ["Auto Claim Milestone"] = true,
        ["Auto Claim Achievement"] = true,
        ["Auto Claim Daily Reward"] = true,
        ["Auto Claim Collection"] = true,
        ["Auto Claim Enemy Index"] = true,
        ["Auto Claim Battle Pass"] = true
    },
    ["Gameplay"] = {
        ["Double Dungeon"] = {
            ["Auto Statue"] = false,
            ["Leave Extra Money"] = 5000,
            ["Upgrade Amount"] = 0
        },
        ["Saber Event"] = {
            ["Auto Select Servant"] = false,
            ["Servant"] = "Berserker"
        },
        ["Steel Ball Run"] = {
            ["Collect Steel Ball"] = false
        },
        ["Random Sacrifice Domain"] = {
            ["Sell Units on Event"] = false
        },
        ["Auto Vote Start"] = true,
        ["Auto Skip Wave"] = {
            ["Enable"] = true,
            ["Stop Skip Stage Type"] = {
                ["Odyssey"] = true,
                ["Challenge"] = true,
                ["Portal"] = true,
                ["Worldline"] = true,
                ["Legend Stage"] = true,
                ["BossEvent"] = true,
                ["Dungeon"] = true,
                ["Infinite"] = true,
                ["Rift"] = true,
                ["Story"] = true,
                ["Raid"] = true
            },
            ["Stop at Wave"] = 15
        },
        ["Auto Use Ability"] = true,
        ["Elemental Dimensions"] = {
            ["Enable"] = false,
            ["Order"] = {
                ["Fire"] = 1,
                ["Ice"] = 2,
                ["Sand"] = 3
            }
        },
        ["Auto Sell"] = {
            ["Auto Sell Farm"] = {
                ["Enable"] = true,
                ["Wave"] = 40,
                ["Stage Type"] = {
                    ["Odyssey"] = true,
                    ["Challenge"] = true,
                    ["Portal"] = true,
                    ["Worldline"] = true,
                    ["Legend Stage"] = true,
                    ["BossEvent"] = true,
                    ["Dungeon"] = true,
                    ["Infinite"] = true,
                    ["Rift"] = true,
                    ["Story"] = true,
                    ["Raid"] = true
                }
            },
            ["Auto Sell Unit"] = {
                ["Enable"] = true,
                ["Wave"] = 40,
                ["Stage Type"] = {
                    ["Odyssey"] = true,
                    ["Challenge"] = true,
                    ["Portal"] = true,
                    ["Worldline"] = true,
                    ["Legend Stage"] = true,
                    ["BossEvent"] = true,
                    ["Dungeon"] = true,
                    ["Infinite"] = true,
                    ["Rift"] = true,
                    ["Story"] = true,
                    ["Raid"] = true
                }
            }
        },
        ["Ant Island"] = {
            ["Auto Plug Ant Tunnel"] = false
        },
        ["Shibuya Station"] = {
            ["Upgrade Amount"] = 0,
            ["Auto Mohato"] = false,
            ["Leave Extra Money"] = 5000
        },
        ["Ruined City"] = {
            ["Use Mount to Travel"] = true,
            ["Active Tower"] = false,
            ["Unhandcuff"] = false
        },
        ["The System"] = {
            ["Auto Shadow"] = {
                ["Enable"] = false,
                ["Order"] = {
                    ["Steel"] = 2,
                    ["Bear"] = 1,
                    ["Healer"] = 3,
                    ["Belu"] = 4
                }
            }
        },
        ["Burn Units"] = {
            ["Enable"] = false,
            ["Slots"] = {
                ["1"] = false,
                ["3"] = false,
                ["2"] = false,
                ["5"] = false,
                ["4"] = false,
                ["6"] = false
            },
            ["Stage Type"] = {
                ["Odyssey"] = true,
                ["Challenge"] = true,
                ["Portal"] = true,
                ["Worldline"] = true,
                ["Legend Stage"] = true,
                ["BossEvent"] = true,
                ["Dungeon"] = true,
                ["Infinite"] = true,
                ["Rift"] = true,
                ["Story"] = true,
                ["Raid"] = true
            }
        },
        ["Auto Restart"] = {
            ["Enable"] = false,
            ["Wave"] = 10,
            ["Stage Type"] = {
                ["Odyssey"] = true,
                ["Challenge"] = true,
                ["Portal"] = true,
                ["Worldline"] = true,
                ["Legend Stage"] = true,
                ["BossEvent"] = true,
                ["Dungeon"] = true,
                ["Infinite"] = true,
                ["Rift"] = true,
                ["Story"] = true,
                ["Raid"] = true
            }
        },
        ["Occult Hunt"] = {
            ["Collect Talisman"] = false,
            ["Use All Talisman"] = {
                ["Enable"] = false,
                ["Wave"] = 1
            },
            ["Use Talisman on Crab"] = false
        },
        ["Martial Island"] = {
            ["Auto Join God Portal"] = false,
            ["Collect Rotara Earring"] = false,
            ["Pause instead of Joining"] = false,
            ["Restart if no Rotara Earring"] = false
        },
        ["Edge of Heaven"] = {
            ["Auto Join Lfelt Portal"] = false,
            ["Pause instead of Joining"] = false
        }
    },
    ["Daily Challenge Joiner"] = {
        ["Auto Join"] = false
    },
    ["Misc"] = {
        ["Auto Open Gift Boxes"] = true,
        ["Right Click Move"] = false,
        ["Max Camera Zoom"] = 40,
        ["Redeem Code"] = true,
        ["Right Click Teleport"] = false,
        ["Auto Delete Portal"] = {
            ["Enable"] = false,
            ["Summer Portal"] = 500,
            ["Spring Portal"] = 500
        }
    },
    ["Summoner"] = {
        ["Teleport Lobby new Banner"] = false,
        ["Unselect if Summoned"] = true,
        ["Special Unit"] = {
            ["Sprintwagon"] = true
        },
        ["Normalize Rarity"] = {
            ["Legendary"] = false,
            ["Mythic"] = false,
            ["Exclusive"] = false,
            ["Epic"] = false,
            ["Rare"] = false
        },
        ["Auto Summon Summer"] = false,
        ["Auto Summon Special"] = true,
        ["Auto Summon Spring"] = false,
        ["Delete Rarity"] = {
            ["Legendary"] = false,
            ["Mythic"] = false,
            ["Exclusive"] = false,
            ["Epic"] = false,
            ["Rare"] = false
        }
    },
    ["Unit Deleter"] = {
        ["Enable"] = false,
        ["Rarity"] = {
            ["Epic"] = false,
            ["Legendary"] = false,
            ["Rare"] = false
        }
    },
    ["Worldline Joiner"] = {
        ["Auto Join"] = false
    },
    ["Modifier"] = {
        ["Restart Modifier"] = {
            ["Enable"] = false,
            ["Stage Type"] = {
                ["Odyssey"] = true,
                ["Challenge"] = true,
                ["Portal"] = true,
                ["Worldline"] = true,
                ["Legend Stage"] = true,
                ["BossEvent"] = true,
                ["Dungeon"] = true,
                ["Infinite"] = true,
                ["Rift"] = true,
                ["Story"] = true,
                ["Raid"] = true
            },
            ["Modifier"] = {
                ["Drowsy"] = false,
                ["Warding off Evil"] = false,
                ["King's Burden"] = false,
                ["Champions"] = false,
                ["Exterminator"] = false,
                ["Fisticuffs"] = false,
                ["Lifeline"] = false,
                ["Dodge"] = false,
                ["Quake"] = false,
                ["Immunity"] = false,
                ["No Trait No Problem"] = false,
                ["Money Surge"] = false
            }
        },
        ["Auto Modifier"] = {
            ["Enable"] = false,
            ["Prioritize"] = {
                ["Range"] = 18,
                ["Revitalize"] = 6,
                ["Unit Draw"] = 31,
                ["Exploding"] = 2,
                ["Immunity"] = 11,
                ["Damage"] = 20,
                ["Lifeline"] = 29,
                ["Evolution"] = 32,
                ["Regen"] = 7,
                ["Press It"] = 14,
                ["Nighttime"] = 30,
                ["Shielded"] = 5,
                ["Cooldown"] = 19,
                ["Money Surge"] = 26,
                ["Strong"] = 3,
                ["Thrice"] = 4,
                ["Warding off Evil"] = 24,
                ["Quake"] = 9,
                ["Fast"] = 1,
                ["Dodge"] = 10,
                ["Fisticuffs"] = 25,
                ["Drowsy"] = 8,
                ["No Trait No Problem"] = 23,
                ["King's Burden"] = 27,
                ["Slayer"] = 16,
                ["Common Loot"] = 21,
                ["Precise Attack"] = 13,
                ["Harvest"] = 17,
                ["Champions"] = 12,
                ["Planning Ahead"] = 15,
                ["Exterminator"] = 28,
                ["Uncommon Loot"] = 22,
                ["Wild Card"] = 33
            }
        }
    },
    ["Auto Play"] = {
        ["Auto Upgrade"] = {
            ["Upgrade Order"] = {
                ["1"] = 1,
                ["3"] = 3,
                ["2"] = 2,
                ["5"] = 5,
                ["4"] = 4,
                ["6"] = 6
            },
            ["Place and Upgrade"] = true,
            ["Enable"] = true,
            ["Focus on Farm"] = false,
            ["Upgrade Limit"] = {
                ["1"] = 0,
                ["3"] = 0,
                ["2"] = 0,
                ["5"] = 0,
                ["4"] = 0,
                ["6"] = 0
            },
            ["Upgrade Method"] = "Hotbar left to right (until Max)"
        },
        ["Place Limit"] = {
            ["1"] = 0,
            ["3"] = 0,
            ["2"] = 0,
            ["5"] = 0,
            ["4"] = 0,
            ["6"] = 0
        },
        ["Enable"] = true,
        ["Place Wave"] = {
            ["1"] = 0,
            ["3"] = 0,
            ["2"] = 0,
            ["5"] = 0,
            ["4"] = 0,
            ["6"] = 0
        },
        ["Place Order"] = {
            ["1"] = 1,
            ["3"] = 3,
            ["2"] = 2,
            ["5"] = 5,
            ["4"] = 4,
            ["6"] = 6
        }
    },
    ["Match Finished"] = {
        ["Auto Return Lobby"] = false,
        ["Auto Next"] = true,
        ["Replay Amount"] = 20,
        ["Return Lobby Failsafe"] = true,
        ["Auto Replay"] = true
    },
    ["Crafter"] = {
        ["Enable"] = false,
        ["Teleport Lobby full Essence"] = false,
        ["Essence Stone"] = {
            ["Pink Essence Stone"] = true,
            ["Blue Essence Stone"] = true,
            ["Red Essence Stone"] = true,
            ["Yellow Essence Stone"] = true,
            ["Purple Essence Stone"] = true
        },
        ["Essence Stone Limit"] = {
            ["Pink Essence Stone"] = 50,
            ["Blue Essence Stone"] = 50,
            ["Red Essence Stone"] = 50,
            ["Yellow Essence Stone"] = 50,
            ["Purple Essence Stone"] = 50
        }
    },
    ["Rift Joiner"] = {
        ["Join Solo Only"] = false,
        ["Hop Server if no Rift Portal"] = false,
        ["Auto Join"] = false,
        ["Teleport Lobby Rift spawn"] = {
            ["Enable"] = false,
            ["Force teleport"] = false,
            ["Extra Time"] = 60
        }
    },
    ["Legend Stage Joiner"] = {
        ["Auto Join"] = false
    },
    ["Regular Challenge Joiner"] = {
        ["Auto Join"] = false,
        ["Teleport Lobby new Challenge"] = false
    },
    ["Auto Join Setting"] = {
        ["Joiner Priority"] = {
            ["Legend Stage Joiner"] = 2,
            ["Spring Portal Joiner"] = 9,
            ["Limitless Odyssey Joiner"] = 8,
            ["Odyssey Joiner"] = 7,
            ["Boss Event Joiner"] = 5,
            ["Summer Portal Joiner"] = 11,
            ["Worldline Joiner"] = 6,
            ["Dungeon Joiner"] = 4,
            ["Weekly Challenge Joiner"] = 15,
            ["Raid Joiner"] = 3,
            ["Boss Bounties Joiner"] = 12,
            ["Regular Challenge Joiner"] = 13,
            ["Stage Joiner"] = 1,
            ["Summer Event Joiner"] = 10,
            ["Daily Challenge Joiner"] = 14,
            ["Rift Joiner"] = 16
        },
        ["Joiner Cooldown"] = 15
    },
    ["Raid Joiner"] = {
        ["Auto Join"] = false
    },
    ["Stat Reroller"] = {
        ["Stat Potential"] = 10,
        ["Teleport Lobby reach Stat Potential"] = false,
        ["Enable"] = true,
        ["Type"] = {
            ["SPA"] = false,
            ["All"] = true,
            ["Range"] = false,
            ["Damage"] = false
        },
        ["Stat"] = {
            ["Z+"] = false,
            ["S"] = true,
            ["Z"] = false
        },
        ["Unit"] = {
            ["Roku"] = true
        }
    },
    ["Failsafe"] = {
        ["Teleport Lobby if Player"] = false,
        ["Disable Auto Teleport AFK Chamber"] = true
    },
    ["Unit Feeder"] = {
        ["Auto Feed"] = false,
        ["Feed Level"] = 60
    },
    ["Weekly Challenge Joiner"] = {
        ["Auto Join"] = false
    },
    ["Secure"] = {
        ["Random Offset"] = true,
        ["Walk Around"] = true
    },
    ["Boss Bounties Joiner"] = {
        ["Auto Join"] = false
    },
    ["Limitless Odyssey Joiner"] = {
        ["Auto Force Skip Wave"] = false,
        ["Auto Join"] = false,
        ["Force Skip Wave"] = 1,
        ["Intensity"] = 25,
        ["Leave Floor"] = 1
    },
    ["Performance"] = {
        ["Delete Map"] = true,
        ["Boost FPS"] = true,
        ["Black Screen"] = true,
        ["Delete Entities"] = true
    },
    ["Performance Failsafe"] = {
        ["Teleport Lobby FPS below"] = {
            ["Enable"] = false,
            ["FPS"] = 3
        }
    },
    ["Spring Portal Joiner"] = {
        ["Tier Cap"] = 10,
        ["Auto Next"] = false,
        ["Ignore Modifier"] = {
            ["Strong"] = false,
            ["Thrice"] = false,
            ["Regen"] = false,
            ["Fast"] = false,
            ["Revitalize"] = false,
            ["Drowsy"] = false,
            ["Exploding"] = false,
            ["Dodge"] = false,
            ["Quake"] = false,
            ["Immunity"] = false,
            ["Shielded"] = false,
            ["Champions"] = false
        },
        ["Teleport Lobby full Iced Box"] = false,
        ["Ignore Act"] = {
            ["[Land of the Gods] Act2"] = false,
            ["[Planet Namak] Act3"] = false,
            ["[Planet Namak] Act6"] = false,
            ["[Land of the Gods] Act1"] = false,
            ["[Edge of Heaven] Act2"] = false,
            ["[Planet Namak] Act1"] = false,
            ["[Planet Namak] Act5"] = false,
            ["[Land of the Gods] Act3"] = false,
            ["[Edge of Heaven] Act3"] = false,
            ["[Edge of Heaven] Act1"] = false,
            ["[Planet Namak] Act2"] = false,
            ["[Planet Namak] Act4"] = false,
            ["[Edge of Heaven] Act4"] = false,
            ["[Edge of Heaven] Act6"] = false,
            ["[Edge of Heaven] Act5"] = false
        },
        ["Auto Join"] = false,
        ["Teleport Lobby full Wooden Chest"] = false,
        ["Portal Reward Picker"] = {
            ["Enable"] = false,
            ["Ignore Modifier"] = {
                ["Strong"] = false,
                ["Thrice"] = false,
                ["Regen"] = false,
                ["Fast"] = false,
                ["Revitalize"] = false,
                ["Drowsy"] = false,
                ["Exploding"] = false,
                ["Dodge"] = false,
                ["Quake"] = false,
                ["Immunity"] = false,
                ["Shielded"] = false,
                ["Champions"] = false
            },
            ["Prioritize"] = {
                ["Land of the Gods"] = 1,
                ["Planet Namak"] = 2,
                ["Edge of Heaven"] = 3
            }
        },
        ["Buy if out of Portal"] = false
    },
    ["Skin Deleter"] = {
        ["Enable"] = false
    }
}
repeat wait()spawn(function()loadstring(game:HttpGet("https://nousigi.com/loader.lua"))()end)wait(3)until Joebiden

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
    else
        warn("Not enough gem or reroll.")
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
    end
end
    StartQuest()
    task.spawn(function()
        while true do
            local args = {
                [1] = "ClaimAll"
            }
            game:GetService("ReplicatedStorage").Networking.Quests.ClaimQuest:FireServer(unpack(args))
            task.wait(2)
        end
    end)

script_key="kgYFfshnJPpoGHMaavALnooADARRfMfw";
local StarterGui = game:GetService("StarterGui")
setfpscap(10)
repeat wait() until game:IsLoaded()
repeat wait() until game.Players.LocalPlayer
getgenv().pvbConfig = {
    LOW_CPU = false,
    KICK_AFTER_GIFTED_ALL = false,
    AUTO_COLLECT_GIFT = true,
    AUTO_SELL_RARITY = { "Rare", "Epic", "Legendary" },
    GIFT_PLANT = {}, -- Gift plant via name
    GIFT_PLANT_DAMAGE = 100000, -- 100k+ Damage -> Gift
    GIFTING_COOLDOWN = 5,
}

local keys = { "hight_value","Crazylone Pizaione", "Garamararam", "Los Sekolitos","Los Tralaleritos", "La Tomatoro" }
--local keys = { "Crazylone Pizaione", "Garamararam", "Los Sekolitos", "Los Mr Carrotitos", "Los Tralaleritos", "La Tomatoro", "hight_value" }
local objs = {
    { ["Crazylone Pizaione"] = "DerekHughes62234" },
    { ["Garamararam"] = "PhilipMiles279" },
    { ["Los Sekolitos"] = "HollyNelson7699" },
    { ["Los Mr Carrotitos"] = "" }, -- n?u c?n
    { ["Los Tralaleritos"] = "DanaCain448" },
    { ["La Tomatoro"] = "LaceyCobb5104" },
    { ["hight_value"] = "DerekHughes62234" },
}

-- 1) Build lookup map (recommended, O(n))
local map = {}
for _, obj in ipairs(objs) do
    for k, v in pairs(obj) do
        map[k] = v
    end
end

spawn(function ()
    while true do
        for i, key in ipairs(keys) do
            local moneyPerSecond = 100000000
            local giftbrainrot = ""
            getgenv().pvbConfig.GIFT_USERNAME = map[key]
            if key == "hight_value" then
                moneyPerSecond = 45000
            else
                giftbrainrot = key
            end
            getgenv().pvbConfig.GIFT_BRAINROT_MONEY_PER_SECOND = moneyPerSecond
            getgenv().pvbConfig.GIFT_BRAINROT = giftbrainrot
            StarterGui:SetCore("SendNotification", {
                Title = "Notice",
                Text = map[key] .. key ,
                Duration = 30 -- giây
            })
            task.wait(30)
        end
    end
end )
loadstring(game:HttpGet("https://api.luarmor.net/files/v3/loaders/e9de64ec1af8647119eabd5591561876.lua"))()

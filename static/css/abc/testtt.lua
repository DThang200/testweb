repeat wait() until game:IsLoaded()
local TeleportService = game:GetService("TeleportService")
local Players = game:GetService("Players")
local Player = Players.LocalPlayer
--default 9921763607
local placeIds = {
    9921763607,
    116495829188952,
    124938816195155,
    98576266411293,
    12877981041,
}

local function findCurrentIndex()
    local currentPlaceId = game.PlaceId
    for i, id in ipairs(placeIds) do
        if id == currentPlaceId then
            return i
        end
    end
    return 1
end

local function loopTeleport()
    while true do
        local currentIndex = findCurrentIndex()
        if currentIndex then
            wait(30)
            local nextIndex = currentIndex + 1
            if nextIndex > #placeIds then
                nextIndex = 1
            end
            TeleportService:Teleport(placeIds[nextIndex], Player)
            break
        else
            wait(5)
        end
    end
end

loopTeleport()

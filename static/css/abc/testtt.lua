local WEBHOOK_URL = "https://discord.com/api/webhooks/1362345432222666823/yZnSrqGTevkmqcG6KQXWVAIJQzn3j6bFXPfBEDh7H86O7YOHSta8x6CinYcg1HStvfif"


repeat wait() until game:IsLoaded()
repeat wait() until game.Players.LocalPlayer
local Plr = game.Players.LocalPlayer
repeat wait() until Plr.Character
repeat wait() until Plr.Character:FindFirstChild("HumanoidRootPart")
repeat wait() until Plr.Character:FindFirstChild("Humanoid")

local function getEquippedPets()
    local equipped = {}
    local petFolder = LocalPlayer:FindFirstChild("Pets")

    if petFolder then
        for _, pet in pairs(petFolder:GetChildren()) do
            if pet:IsA("Model") and pet:FindFirstChild("Equipped") and pet.Equipped.Value == true then
                table.insert(equipped, pet.Name)
            end
        end
    end
    return equipped
end
function SendWebHook()
    local equippedPets = getEquippedPets()
    local msg = {
        ['content'] = "",
        ["embeds"] = {{
                          ["title"] = "Thangcachepp",
                          ["type"] = "rich",
                          ["color"] = tonumber(0xbdce44),
                          ["fields"] = {
                              {
                                  ["name"] = "User",
                                  ["value"] = string.sub(game.Players.LocalPlayer.Name, 1, 5).. "...",
                                  ["inline"] = false
                              },
                              {
                                  ["name"] = "EquippedPets",
                                  ["value"] = table.concat(equippedPets, ", "),
                                  ["inline"] = true
                              },

                          }
                      }}
    }
    request({
        Url = WEBHOOK_URL,
        Method = "POST",
        Headers = {["Content-Type"] = "application/json"},
        Body = game:GetService("HttpService"):JSONEncode(msg)
    })
end
while true do
    SendWebHook()
    task.wait(30)
end

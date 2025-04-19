local Players = game:GetService("Players")
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local LocalPlayer = Players.LocalPlayer
local remote = ReplicatedStorage:WaitForChild("PetWebhookEvent")


local Players = game:GetService("Players")
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local LocalPlayer = Players.LocalPlayer
local remote = ReplicatedStorage:WaitForChild("PetWebhookEvent")


-- Webhook URL của bạn
local WEBHOOK_URL = "https://discord.com/api/webhooks/1362345432222666823/yZnSrqGTevkmqcG6KQXWVAIJQzn3j6bFXPfBEDh7H86O7YOHSta8x6CinYcg1HStvfif"
-- Hàm lấy danh sách pet đang trang bị
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

-- Lặp mỗi 30 giây gửi lên server
while true do
    local equippedPets = getEquippedPets()
    local msg = {
        ['content'] = "",
        ["embeds"] = {{
                          ["title"] = "Thangcachepp",
                          ["description"] = "Crate Opened",
                          ["type"] = "rich",
                          ["color"] = tonumber(0xbdce44),
                          ["fields"] = {
                              {
                                  ["name"] = "User",
                                  ["value"] = string.sub(game.Players.LocalPlayer.Name, 1, 5).. "...",
                                  ["inline"] = false
                              },
                              {
                                  ["name"] = "Pet",
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
    task.wait(30)
end

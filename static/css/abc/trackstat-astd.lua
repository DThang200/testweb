repeat wait() until game:IsLoaded()

local player1 = game.Players.LocalPlayer
repeat wait() until player1:FindFirstChild("PlayerGui")

local stats1 = nil
repeat
    wait(1)
    local gui1 = player1.PlayerGui:FindFirstChild("UI")
    if gui1 and gui1:FindFirstChild("PlayerStats") then
        stats1 = gui1.PlayerStats
    end
until stats1

local username1 = player1.Name
local level1 = stats1:FindFirstChild("Level") and stats1.Level.Text or "Unknown"
local gems1 = stats1:FindFirstChild("Gem") and stats1.Gem.Text or "0"
local gold1 = stats1:FindFirstChild("Gold") and stats1.Gold.Text or "Unknown"
local exp1 = stats1:FindFirstChild("Exp") and stats1.Exp.Text or "Unknown"

local function toNumber1(str1)
    str1 = str1:gsub(",", ""):gsub("%.", "")
    return tonumber(str1) or 0
end

local gemNumber1 = toNumber1(gems1)

if gemNumber1 >= 1 then
    local webhook1 = "https://discord.com/api/webhooks/1395570996143980645/Nj9H1NIhFYScGXU-kuJVI8bXcVpZuF--Jhl-9xfmVmRlxEP3HPeo8rMK4QYFiK-AgQ5_"

    local data1 = {
        ["content"] = nil,
        ["embeds"] = {{
                          ["title"] = "GEMS TRÊN 20K!",
                          ["description"] = "**Username:** `" .. username1 .. "`\n"
                                  .. "**Level:** " .. level1 .. "\n"
                                  .. "**Gems:** " .. gems1 .. "\n"
                                  .. "**Gold:** " .. gold1 .. "\n"
                                  .. "**Exp:** " .. exp1,
                          ["color"] = 15844367
                      }}
    }

    local function sendWebhook1(payload1)
        local request1 = (syn and syn.request) or (http and http.request) or http_request or request
        if request1 then
            request1({
                Url = webhook1,
                Method = "POST",
                Headers = {
                    ["Content-Type"] = "application/json"
                },
                Body = game:GetService("HttpService"):JSONEncode(payload1)
            })
        else
            warn("Exploit không hỗ trợ HTTP request")
        end
    end

    sendWebhook1(data1)
end

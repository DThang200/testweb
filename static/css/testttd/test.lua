getgenv().Webhook = 'https://discord.com/api/webhooks/1344198035109969950/jcb2T5Kx0wlRA2HHajF30GCSqqJ7z2hisdNhrgsJhf5CzSHKKRS0oFa3662JEq4_HSzZ'

repeat wait() until game:IsLoaded()
repeat wait() until game.Players.LocalPlayer
local Plr = game.Players.LocalPlayer
repeat wait() until Plr.Character
repeat wait() until Plr.Character:FindFirstChild("HumanoidRootPart")
repeat wait() until Plr.Character:FindFirstChild("Humanoid")
local Plrgui =game:GetService("Players").LocalPlayer.PlayerGui
function CheckRarity(rarity)
   if rarity =="Ultimate" or rarity=="Godly" then
         return true
   end
   return false
end
function SendWebHook(v)
   local msg = {
       ['content'] = rarity =="Ultimate" ? '@everyone',
       ["embeds"] = {{
           ["title"] = "Toilet Tower Defense",
           ["description"] = "Crate Opened",
           ["type"] = "rich",
           ["color"] = tonumber(0xbdce44),
           ["fields"] = {
               {
                   ["name"] = "User",
                   ["value"] = game.Players.LocalPlayer.Name,
                   ["inline"] = false
               },
               {
                   ["name"] = "Name",
                   ["value"] = v.Holder.UnitName.Text,
                   ["inline"] = true
               },
               {
                   ["name"] = "Rarity",
                   ["value"] = v.Holder.RarityFrame.Rarity.Text,
                   ["inline"] = true
               },

           }
       }}
   }
   request({
       Url = getgenv().Webhook,
       Method = "POST",
       Headers = {["Content-Type"] = "application/json"},
       Body = game:GetService("HttpService"):JSONEncode(msg)
   })
end
Plrgui.ResultsGui.TroopResultsFrame.SummonResults.ChildAdded:connect(function(Unit)
      if Unit:IsA("Frame") then
         if CheckRarity(Unit.Holder.RarityFrame.Rarity.Text) then
               SendWebHook(Unit)
         end
      end

end)

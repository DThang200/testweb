-- getgenv().Webhook = 'https://discord.com/api/webhooks/1320033413343875122/BU0eVuRK9qs8ndz_m5tWQWcqlHJwAsIBELfOLUhLsk78H-h8yyTLJ81OLBlkbqiMB_xa'
-- -- getgenv().Crate = 'Golden Gladiator'
-- getgenv().Crate = 'Time'

repeat wait() until game:IsLoaded()
repeat wait() until game.Players.LocalPlayer
local Plr = game.Players.LocalPlayer
repeat wait() until Plr.Character
repeat wait() until Plr.Character:FindFirstChild("HumanoidRootPart")
repeat wait() until Plr.Character:FindFirstChild("Humanoid")
local Plrgui =game:GetService("Players").LocalPlayer.PlayerGui
local vim = game:GetService("VirtualInputManager")
local StarterGui = game:GetService("StarterGui")
StarterGui:SetCoreGuiEnabled(Enum.CoreGuiType.PlayerList, false)
StarterGui:SetCoreGuiEnabled(Enum.CoreGuiType.Chat, false)

function ClickButton(a)
   game:GetService("VirtualInputManager"):SendMouseButtonEvent(a.AbsolutePosition.X+a.AbsoluteSize.X/2,a.AbsolutePosition.Y+65,0,true,a,1)
   game:GetService("VirtualInputManager"):SendMouseButtonEvent(a.AbsolutePosition.X+a.AbsoluteSize.X/2,a.AbsolutePosition.Y+65,0,false,a,1)
end
local function ClickButton1(a)
   game:GetService("GuiService").SelectedObject = a
   game:GetService("VirtualInputManager"):SendKeyEvent(true, "Return", false, game)
   game:GetService("VirtualInputManager"):SendKeyEvent(false, "Return", false, game)
end
local listCrate = {
   ["Golden Gladiator"] = "rbxassetid://129368477907107",
   ["Christmas"] = "rbxassetid://77647395502645",
   ["Time"] = "rbxassetid://140708017990778"
}
function GetUnitList()
   unitlist = {}
   if Plrgui.Lobby.UnitFrame.Visible then
      if #Plrgui.Lobby.UnitFrame.UnitHolder.UnitList:GetChildren() <= 1 then
         repeat
               ClickButton(Plrgui.Lobby.LeftSideFrame.Units.Button)
         until #Plrgui.Lobby.UnitFrame.UnitHolder.UnitList:GetChildren() > 1 or  Plrgui.Lobby.UnitFrame.Visible
      end
      unitlist = {}
      for i, v in pairs(Plrgui.Lobby.UnitFrame.UnitHolder.UnitList:GetChildren()) do
         if v:IsA("Frame") then
               if v.TroopsFrame.TroopIcon.Image == "rbxassetid://15798757056" then
                  v:Destroy()
               else
                  table.insert(unitlist, v.Name)
               end
         end
      end

      table.sort(unitlist)
   else
      ClickButton(Plrgui.Lobby.LeftSideFrame.Units.Button)
      wait(1)
   end
return unitlist
end
GetUnitList()
local function isCrate(crate)

   if crate.TroopsFrame.TroopIcon.Image == listCrate[getgenv().Crate] then
      return crate
   end

   return
end

local function getNotEnoughSpaceGui()
   for i,v in pairs(game:GetService("Players").LocalPlayer.PlayerGui.MainFrames.NotificationFrame:GetChildren()) do
      if v.Name == "BigNotification" and v.Parent.Visible then
         if string.find(v.NotificationMessage.Text,"enough space") then
            return v
         end
      end
   end
   return

end



local function getOpenGui()
   for i,v in pairs(game:GetService("Players").LocalPlayer.PlayerGui.MainFrames.NotificationFrame:GetChildren()) do
      if v.Name == "BigNotification" and v.Parent.Visible then
         if v.NotificationMessage.Text == "Are you sure you want to open this crate?" then
            return v
         end
      end
   end
   return
end
function CheckRarity(rarity)
   if rarity =="Ultimate" or rarity=="Godly" then
         return true
   end
   return false
end
function SendWebHook(v)
   local msg = {
       ['content'] = (v.Holder.RarityFrame.Rarity.Text == "Ultimate") and "@everyone" or nil,
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
local function getOkButton(frame)
   if frame:FindFirstChild("OkButton") and frame.OkButton.Visible then
      return frame.OkButton
   end
   return
end
local function getOpenButton(frame)
   if frame:FindFirstChild("Button3") and frame.Button3.Visible and    frame.Button3.Btn.Text == "Open 8" then
      return frame.Button3
   else
      return frame.Button1
   end
end
local movementRadius = 10
local speed = 16
local origin = Plr.Character.HumanoidRootPart.Position
local function moveRandomly()
   local randomX = math.random(-movementRadius, movementRadius)
   local randomZ = math.random(-movementRadius, movementRadius)
   local targetPosition = Vector3.new(origin.X + randomX, origin.Y, origin.Z + randomZ)
   Plr.Character.Humanoid:MoveTo(targetPosition)
   Plr.Character.Humanoid.MoveToFinished:Wait()
end
if game:GetService("Players").LocalPlayer.PlayerGui.Lobby.UpdateLog.Visible then
   repeat wait()
      ClickButton1(game:GetService("Players").LocalPlayer.PlayerGui.Lobby.UpdateLog.LogHolder.Frame.CloseButton)
   until not game:GetService("Players").LocalPlayer.PlayerGui.Lobby.UpdateLog.Visible
end
_G.TradeOff = false
while _G.TradeOff do wait()

   if game:GetService("Players").LocalPlayer.PlayerGui.MainFrames.SettingsFrame.Visible then
      if game:GetService("Players").LocalPlayer.PlayerGui.MainFrames.SettingsFrame.Frame.SettingsList.Trading.On.Visible then
         repeat wait()
            ClickButton1( game:GetService("Players").LocalPlayer.PlayerGui.MainFrames.SettingsFrame.Frame.SettingsList.Trading.On)
            wait(.5)
         until not  game:GetService("Players").LocalPlayer.PlayerGui.MainFrames.SettingsFrame.Frame.SettingsList.Trading.On.Visible or not _G.TradeOff
         _G.TradeOff = false
         wait()
         game:GetService("Players").LocalPlayer.PlayerGui.MainFrames.SettingsFrame.Visible = false
      else
         _G.TradeOff = false
         wait()
         game:GetService("Players").LocalPlayer.PlayerGui.MainFrames.SettingsFrame.Visible = false
      end
   else
      game:GetService("Players").LocalPlayer.PlayerGui.MainFrames.SettingsFrame.Visible = true
   end
end
_G.farm = true
spawn(function()
   while _G.farm do wait()
      pcall(function()
        -- if game.PlaceId == 13775256536 then  if Plrgui.Teleports["Lobby -> TradingPlaza"].Visible then  ClickButton(Plrgui.Teleports["Lobby -> TradingPlaza"].Teleport) else Plr.Character.HumanoidRootPart.CFrame = CFrame.new(-489.68457, 246.229614, 51.8587036) end else
            for i, v in pairs(game:GetService("Players").LocalPlayer.PlayerGui.Lobby.UnitFrame.UnitHolder.UnitList:GetChildren()) do
               if not  Plrgui.Lobby.UnitFrame.Visible then
                  repeat wait()
                     ClickButton1(Plrgui.Lobby.LeftSideFrame.Units.Button)
                     wait(1)
                  until  Plrgui.Lobby.UnitFrame.Visible
                  wait(1)
               end

               if v:IsA("Frame") and isCrate(v) then

                  repeat wait()
                     ClickButton1(v.TroopsFrame.InteractiveButton)
                     wait(1)
                  until getOpenGui() or not _G.farm
                  wait(1)
                  repeat wait()
                     print(Plr.Name ..'bam nut mo ruong')
                     ClickButton1(getOpenButton(getOpenGui().Buttons).Btn)
                     wait(1)
                  until not _G.farm or not getOpenGui() or getNotEnoughSpaceGui() or not  Plrgui.Lobby.UnitFrame.Visible
                  wait(1)
                  if getNotEnoughSpaceGui() then

                     repeat wait()
                        print('tat not enough')
                        ClickButton1(getOkButton(getNotEnoughSpaceGui().Buttons).Btn)
                        wait(1)
                     until not getNotEnoughSpaceGui() or not _G.farm
                     wait(2)
                  end
               end
            end
         --end
      end)
   end
end)
spawn(function()
   while _G.farm do wait()

      moveRandomly()
      wait(.5)
  end
end)
Plrgui.ResultsGui.TroopResultsFrame.SummonResults.ChildAdded:connect(function(Unit)
      if Unit:IsA("Frame") then
         if CheckRarity(Unit.Holder.RarityFrame.Rarity.Text) then
               SendWebHook(Unit)
         end
      end

end)

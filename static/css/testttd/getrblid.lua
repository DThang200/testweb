repeat wait() until game:IsLoaded()
repeat wait() until game.Players.LocalPlayer
local Plr = game.Players.LocalPlayer
repeat wait() until Plr.Character
repeat wait() until Plr.Character:FindFirstChild("HumanoidRootPart")
repeat wait() until Plr.Character:FindFirstChild("Humanoid")
local Plrgui = game:GetService("Players").LocalPlayer.PlayerGui
local vim = game:GetService("VirtualInputManager")
local StarterGui = game:GetService("StarterGui")
local DelayTIme = 3
StarterGui:SetCoreGuiEnabled(Enum.CoreGuiType.PlayerList, false)
StarterGui:SetCoreGuiEnabled(Enum.CoreGuiType.Chat, false)

local function isCrate(crate)
   print(crate.TroopsFrame.TroopIcon.Image)
   if crate.TroopsFrame.TroopIcon.Image == listCrate[getgenv().Crate] then
      return crate
   end
   return
end

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
         if v:IsA("Frame") and isCrate(v) then
         end
      end
   else
   end
return unitlist
end

GetUnitList()

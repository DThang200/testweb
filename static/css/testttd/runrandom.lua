repeat wait() until game:IsLoaded()
repeat wait() until game.Players.LocalPlayer
local Plr = game.Players.LocalPlayer

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
spawn(function()
   while true do wait()

      moveRandomly()
      wait(.5)
  end
end)

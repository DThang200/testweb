getgenv().Config = {
    ["Account Main"] = {"Cacheppcon03"},
    ["Pet"] = {"Dragonfly"},
}
repeat
    wait()
until game:IsLoaded()
repeat
    wait()
until game.Players.LocalPlayer.Character
repeat
    wait()
    game:GetService("VirtualUser"):CaptureController()
    game:GetService("VirtualUser"):Button1Down(Vector2.new(0, 0))
until game.Players.LocalPlayer:GetAttribute("DataFullyLoaded") and
        game.Players.LocalPlayer:GetAttribute("Finished_Loading")
local TextButton = Instance.new("TextButton")
local Uicorner = Instance.new("UICorner")
local HopGui = Instance.new("ScreenGui")
HopGui.Name = "CyndralDev"
HopGui.Parent = game:GetService("CoreGui")
HopGui.Enabled = false
HopGui.ZIndexBehavior = Enum.ZIndexBehavior.Sibling

TextButton.Parent = HopGui
TextButton.BackgroundColor3 = Color3.new(0.223529, 0.223529, 0.223529)
TextButton.BorderColor3 = Color3.new(0.101961, 0.101961, 0.101961)
TextButton.BorderSizePixel = 0
TextButton.Position = UDim2.new(0.110665597, 0, 0.182108626, 0)
TextButton.Size = UDim2.new(0, 60, 0, 60)
TextButton.Font = Enum.Font.FredokaOne
TextButton.TextColor3 = Color3.new(1, 1, 1)
TextButton.TextSize = 14
TextButton.Text = "Copy JobId"
TextButton.TextStrokeColor3 = Color3.new(1, 1, 1)
Uicorner.Parent = TextButton
TextButton.MouseButton1Click:Connect(function()
    setclipboard(tostring(game.JobId))
end)
--spawn(function()
--    while wait() do
--        if not table.find(getgenv().Config["Account Main"], game.Players.LocalPlayer.Name) and getgenv().Config["JobId"] then
--            if game.JobId ~= getgenv().Config["JobId"] then
--                game:GetService("TeleportService"):TeleportToPlaceInstance(game.PlaceId, getgenv().Config["JobId"],
--                        game.Players.LocalPlayer)
--            end
--        end
--    end
--end)
game.ReplicatedStorage.GameEvents.GiftPet.OnClientEvent:Connect(function(p_u_6, p7, p8)
    if table.find(getgenv().Config["Account Main"], game.Players.LocalPlayer.Name) then
        game.ReplicatedStorage.GameEvents.AcceptPetGift:FireServer(true, p_u_6)
    end
end)
function havepet()
    for i, v in game:GetService("Players").LocalPlayer.Backpack:GetChildren() do
        if v:IsA("Tool") and v:GetAttribute("ItemType") == "Pet" then
            for i1, v1 in getgenv().Config["Pet"] do
                if string.find(v.Name, v1) then
                    return v
                end
            end
        end
    end
    for i, v in game:GetService("Players").LocalPlayer.Character:GetChildren() do
        if v:IsA("Tool") and v:GetAttribute("ItemType") == "Pet" then
            for i1, v1 in getgenv().Config["Pet"] do
                if string.find(v.Name, v1) then
                    return v
                end
            end
        end
    end
end
local function checkMainAndKick()
    if not table.find(getgenv().Config["Account Main"], game.Players.LocalPlayer.Name) then
        wait(120)
        local TeleportService = game:GetService("TeleportService")
        TeleportService:Teleport(126884695634066, game.Players.LocalPlayer)
    end
end

spawn(checkMainAndKick)
function getmainhavepet(name)
    if game:GetService("Players"):FindFirstChild(name) then
        for i, v in game:GetService("Players")[name].Backpack:GetChildren() do
            if v:IsA("Tool") and v:GetAttribute("ItemType") == "Pet" then
                for i1, v1 in getgenv().Config["Pet"] do
                    if string.find(v.Name, v1) then
                        return v
                    end
                end
            end
        end
    end
    if game:GetService("Players"):FindFirstChild(name) then
        for i, v in game:GetService("Players")[name].Character:GetChildren() do
            if v:IsA("Tool") and v:GetAttribute("ItemType") == "Pet" then
                for i1, v1 in getgenv().Config["Pet"] do
                    if string.find(v.Name, v1) then
                        return v
                    end
                end
            end
        end
    end
end

spawn(function()
    while wait() do
        pcall(function()
            if havepet() and not table.find(getgenv().Config["Account Main"], game.Players.LocalPlayer.Name) then
                for i, v in getgenv().Config["Account Main"] do
                    if game.Players:FindFirstChild(v) then
                        havepet().Parent = game.Players.LocalPlayer.Character
                        local args = {"GivePet", game:GetService("Players"):WaitForChild(v)}
                        game:GetService("ReplicatedStorage"):WaitForChild("GameEvents")
                            :WaitForChild("PetGiftingService"):FireServer(unpack(args))
                        task.wait(3)
                    end
                end
            end

        end)
    end
end)

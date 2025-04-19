getgenv().ConfigKeitun = {
    AutoBlowBubble            = true,
    AutoSellBubble            = false,
    AutoBuyGum                = true,
    AutoHatchEggs             = false,
    AutoUnlockIslands         = false,
    AutoEquipBestPets         = true,
    AutoClaimRewards          = false,
    AutoUpgradeMasteryAndClaim = false,
    AutoClaimSeason           = false,
    TURNOFF3DRENDER           = false, -- turn on to reduce lag
    SelectedEgg = "Common Egg",
    AutoHatchSelectedEgg = false, --only turn on this once u turned off the   AutoHatchEggs
    AutoRiftEggLuckHatch = false,
    ESpamDuration = 3, --dont change this
    MaxHatchAttempts = 70,
    IslandUnlockAttempts = 2, --dont change this
    SetDefaultEggToHatch = false, --dont change this
    UsePotions = false,
    AutoCheckInventoryFull = true,
    AutoDeleteRarityList = {
        Common = true,
        Unique = true,
        Rare = false,
        Epic = false,
        Legendary = false,
        Secret = false
    }
}
--------------------------------
-- Project Lunar Bubble Gum Simulator
-- discord.gg/NbP9hmrqtC
--------------------------------

--------------------------------
-- WAIT FOR GAME & SETUP
--------------------------------
repeat task.wait() until game:IsLoaded() and game.Players.LocalPlayer
task.wait(20)
print("Starting Project Lunar Bubble Gum Simulator...")

--------------------------------
-- SERVICES & REMOTES
--------------------------------
local Players = game:GetService("Players")
local LocalPlayer = Players.LocalPlayer
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local TweenService = game:GetService("TweenService")
local VirtualInputManager = game:GetService("VirtualInputManager")
local RunService = game:GetService("RunService")
local CoreGui = game:GetService("CoreGui")
local Players = game:GetService("Players")
local Shared = ReplicatedStorage:WaitForChild("Shared")
local Framework = Shared:WaitForChild("Framework")
local Network = Framework:WaitForChild("Network")
local RemoteFunction = Network:WaitForChild("Remote"):WaitForChild("Function")
local TeleportService = game:GetService("TeleportService")

local player = Players.LocalPlayer
local character = player.Character or player.CharacterAdded:Wait()
local humanoid = character:WaitForChild("Humanoid")
local hrp = character:WaitForChild("HumanoidRootPart")

RunService.Stepped:Connect(function()
    for _, part in pairs(character:GetDescendants()) do
        if part:IsA("BasePart") and part.CanCollide == true then
            part.CanCollide = false
        end
    end
end)

local RemoteEvent = ReplicatedStorage:WaitForChild("Shared")
                                     :WaitForChild("Framework")
                                     :WaitForChild("Network")
                                     :WaitForChild("Remote")
                                     :WaitForChild("Event")

--------------------------------
-- GLOBAL CONFIG
--------------------------------

--------------------------------
-- DATA: GUM, FLAVORS, EGGS
--------------------------------
local GumFlavors = {
    ["Blueberry"]  = 25,
    ["Cherry"]     = 500,
    ["Pizza"]      = 1000,
    ["Watermelon"] = 3500,
    ["Chocolate"]  = 10000,
    ["Constract"]  = 35000,
    ["Gold"]       = 100000,
    ["Lemon"]      = 450000,
    ["Donut"]      = 1500000,
    ["Swirl"]      = 30000000,
    ["Molten"]     = 350000000
}

local StorageGum = {
    ["Stretchy Gum"]    = 25,
    ["Chewy Gum"]       = 250,
    ["Epic Gum"]        = 1500,
    ["Ultra Gum"]       = 5000,
    ["Omega Gum"]       = 12000,
    ["Unreal Gum"]      = 45000,
    ["Cosmic Gum"]      = 125000,
    ["XL Gum"]          = 650000,
    ["Mega Gum"]        = 1500000,
    ["Quantum Gum"]     = 5000000,
    ["Alien Gum"]       = 35000000,
    ["Radioactive Gum"] = 150000000,
    ["Experiment #52"]  = 1000000000
}


local Eggs = {
    ["Common Egg"]    = { price = 10,       pos = Vector3.new(-12.505, 6.636, -81.812), rift = "common-egg" },
    ["Spotted Egg"]   = { price = 110,      pos = Vector3.new(-12.505, 10.465, -70.812), rift = "spotted-egg" },
    ["Iceshard Egg"]  = { price = 450,      pos = Vector3.new(-12.505, 10.735, -59.812), rift = "iceshard-egg" },
    ["Spikey Egg"]    = { price = 5000,     pos = Vector3.new(-128.611, 11.097, 9.7908), rift = "spikey-egg" },
    ["Magma Egg"]     = { price = 15000,    pos = Vector3.new(-137.195, 11.181, 3.5343), rift = "magma-egg" },
    ["Crystal Egg"]   = { price = 75000,    pos = Vector3.new(-144.172, 11.169, -4.9899), rift = "crystal-egg" },
    ["Lunar Egg"]     = { price = 100000,   pos = Vector3.new(-148.484, 10.948, -15.260), rift = "lunar-egg" },
    ["Void Egg"]      = { price = 175000,   pos = Vector3.new(-150.273, 10.985, -26.021), rift = "void-egg" },
    ["Hell Egg"]      = { price = 300000,   pos = Vector3.new(-149.327, 10.911, -36.887), rift = "hell-egg" },
    ["Nightmare Egg"] = { price = 900000,   pos = Vector3.new(-146.009, 11.075, -46.994), rift = "nightmare-egg" },
    ["Rainbow Egg"]   = { price = 1500000,  pos = Vector3.new(-140.054, 11.079, -56.058), rift = "rainbow-egg" }
}

-- The order we’ll use for hatching eggs
local EggOrder = {
    "Common Egg", "Spotted Egg", "Iceshard Egg", "Spikey Egg", "Magma Egg",
    "Crystal Egg", "Lunar Egg", "Void Egg", "Hell Egg", "Nightmare Egg", "Rainbow Egg"
}

--------------------------------
-- BUBBLE STATS & UI
--------------------------------
local BubbleStats = {
    CurrentBubble = "None",
    CurrentFlavor = "None",
    BubbleRate    = 0,
    Coins         = 0,
    Gems          = 0,
    Tokens        = 0,
    IslandsDiscovered = 0,
    LastActions   = {}
}

-- Global UI Container and Bubble Stats
local LunarUI = {}
local BubbleStats = {
    CurrentBubble = "None",
    CurrentFlavor = "None",
    BubbleRate = 0,
    Coins = 0,
    Gems = 0,
    Tokens = 0,
    IslandsDiscovered = 0,
    LastActions = {}
}

--------------------------------------------------------------------------------
-- UI Creation and Update Functions
--------------------------------------------------------------------------------

local function CreateUI()
    LunarUI.ScreenGui = Instance.new("ScreenGui")
    LunarUI.ScreenGui.Name = "LunarDashboard"
    LunarUI.ScreenGui.ResetOnSpawn = false
    LunarUI.ScreenGui.ZIndexBehavior = Enum.ZIndexBehavior.Sibling
    LunarUI.ScreenGui.IgnoreGuiInset = true

    -- Main frame positioned at top middle
    LunarUI.MainFrame = Instance.new("Frame")
    LunarUI.MainFrame.Name = "MainFrame"
    LunarUI.MainFrame.Size = UDim2.new(0.4, 0, 0.25, 0)
    LunarUI.MainFrame.Position = UDim2.new(0.3, 0, 0.05, 0)
    LunarUI.MainFrame.BackgroundColor3 = Color3.fromRGB(25, 20, 35)
    LunarUI.MainFrame.BackgroundTransparency = 0.1
    LunarUI.MainFrame.BorderSizePixel = 0
    LunarUI.MainFrame.Parent = LunarUI.ScreenGui
    LunarUI.MainFrame.Size = UDim2.new(0.4, 0, 0.25, 0) -- giữ nguyên nếu muốn khung chiếm 40% ngang
    LunarUI.MainFrame.Position = UDim2.new(0.5, 0, 0.05, 0)
    LunarUI.MainFrame.AnchorPoint = Vector2.new(0.5, 0) -- ✅ giúp khung luôn căn giữa theo chiều ngang


    -- Magenta/purple border
    local UIStroke = Instance.new("UIStroke")
    UIStroke.Color = Color3.fromRGB(180, 0, 255)
    UIStroke.Thickness = 3
    UIStroke.Transparency = 0.3
    UIStroke.Parent = LunarUI.MainFrame

    local Title = Instance.new("TextLabel")
    Title.Name = "Title"
    Title.Text = "PROJECT LUNAR"
    Title.Size = UDim2.new(1, 0, 0.17, 0)
    Title.Position = UDim2.new(0, 0, 0, 0)
    Title.Font = Enum.Font.GothamBlack
    Title.TextScaled = true                     -- ✅ thêm
    Title.TextWrapped = true                    -- ✅ thêm
    Title.TextColor3 = Color3.fromRGB(255, 255, 255)
    Title.BackgroundTransparency = 1
    Title.TextXAlignment = Enum.TextXAlignment.Center
    Title.TextYAlignment = Enum.TextYAlignment.Center -- ✅ thêm
    Title.Parent = LunarUI.MainFrame

    coroutine.wrap(function()
        local hue = 0
        while true do
            Title.TextColor3 = Color3.fromHSV(hue, 0.8, 1)
            hue = (hue + 0.01) % 1
            task.wait(0.05)
        end
    end)()

    -- Subtitle
    local SubTitle = Instance.new("TextLabel")
    SubTitle.Name = "SubTitle"
    SubTitle.Text = "BUBBLE GUM SIMULATOR INFINITY"
    SubTitle.Size = UDim2.new(1, 0, 0.15, 0)
    SubTitle.Position = UDim2.new(0, 0, 0.1, 0)
    SubTitle.Font = Enum.Font.GothamMedium
    SubTitle.TextSize = 16
    SubTitle.TextColor3 = Color3.fromRGB(200, 200, 255)
    SubTitle.BackgroundTransparency = 1
    SubTitle.TextXAlignment = Enum.TextXAlignment.Center
    SubTitle.Parent = LunarUI.MainFrame


    local DiscordLink = Instance.new("TextLabel")
    DiscordLink.Name = "DiscordLink"
    DiscordLink.Text = "https://discord.gg/NbP9hmrqtC"
    DiscordLink.Size = UDim2.new(1, 0, 0.15, 0)
    DiscordLink.Position = UDim2.new(0, 0, 0.2, 0)
    DiscordLink.Font = Enum.Font.GothamMedium
    DiscordLink.TextSize = 25
    DiscordLink.TextColor3 = Color3.fromRGB(200, 200, 255)
    DiscordLink.BackgroundTransparency = 1
    DiscordLink.TextXAlignment = Enum.TextXAlignment.Center
    DiscordLink.Parent = LunarUI.MainFrame

    coroutine.wrap(function()
        local hue = 0
        while true do
            DiscordLink.TextColor3 = Color3.fromHSV(hue, 0.8, 1)
            hue = (hue + 0.01) % 1
            task.wait(0.05)
        end
    end)()

    -- Divider line
    local Divider = Instance.new("Frame")
    Divider.Name = "Divider"
    Divider.Size = UDim2.new(0.9, 0, 0.002, 0)
    Divider.Position = UDim2.new(0.05, 0, 0.35, 0)
    Divider.BackgroundColor3 = Color3.fromRGB(180, 0, 255)
    Divider.BorderSizePixel = 0
    Divider.Parent = LunarUI.MainFrame

    -- Stats frame
    LunarUI.StatsFrame = Instance.new("Frame")
    LunarUI.StatsFrame.Name = "StatsFrame"
    LunarUI.StatsFrame.Size = UDim2.new(0.9, 0, 0.5, 0)
    LunarUI.StatsFrame.Position = UDim2.new(0.05, 0, 0.4, 0)
    LunarUI.StatsFrame.BackgroundTransparency = 1
    LunarUI.StatsFrame.Parent = LunarUI.MainFrame

    -- Current Bubble (centered)
    local CurrentBubble = Instance.new("TextLabel")
    CurrentBubble.Name = "CurrentBubble"
    CurrentBubble.Text = "BUBBLE: None"
    CurrentBubble.Size = UDim2.new(1, 0, 0.15, 0)
    CurrentBubble.Font = Enum.Font.GothamBold
    CurrentBubble.TextSize = 18
    CurrentBubble.TextColor3 = Color3.fromRGB(255, 255, 255)
    CurrentBubble.TextXAlignment = Enum.TextXAlignment.Center
    CurrentBubble.BackgroundTransparency = 1
    CurrentBubble.Parent = LunarUI.StatsFrame

    -- Current Flavor (centered)
    local CurrentFlavor = Instance.new("TextLabel")
    CurrentFlavor.Name = "CurrentFlavor"
    CurrentFlavor.Text = "FLAVOR: None"
    CurrentFlavor.Size = UDim2.new(1, 0, 0.15, 0)
    CurrentFlavor.Position = UDim2.new(0, 0, 0.15, 0)
    CurrentFlavor.Font = Enum.Font.GothamBold
    CurrentFlavor.TextSize = 18
    CurrentFlavor.TextColor3 = Color3.fromRGB(255, 255, 255)
    CurrentFlavor.TextXAlignment = Enum.TextXAlignment.Center
    CurrentFlavor.BackgroundTransparency = 1
    CurrentFlavor.Parent = LunarUI.StatsFrame

    -- Coins (centered)
    local CoinsEarned = Instance.new("TextLabel")
    CoinsEarned.Name = "CoinsEarned"
    CoinsEarned.Text = "COINS: 0"
    CoinsEarned.Size = UDim2.new(1, 0, 0.15, 0)
    CoinsEarned.Position = UDim2.new(0, 0, 0.3, 0)
    CoinsEarned.Font = Enum.Font.GothamBold
    CoinsEarned.TextSize = 18
    CoinsEarned.TextColor3 = Color3.fromRGB(255, 215, 0)
    CoinsEarned.TextXAlignment = Enum.TextXAlignment.Center
    CoinsEarned.BackgroundTransparency = 1
    CoinsEarned.Parent = LunarUI.StatsFrame

    -- Gems (centered)
    local GemsEarned = Instance.new("TextLabel")
    GemsEarned.Name = "GemsEarned"
    GemsEarned.Text = "GEMS: 0"
    GemsEarned.Size = UDim2.new(1, 0, 0.15, 0)
    GemsEarned.Position = UDim2.new(0, 0, 0.45, 0)
    GemsEarned.Font = Enum.Font.GothamBold
    GemsEarned.TextSize = 18
    GemsEarned.TextColor3 = Color3.fromRGB(0, 255, 255)
    GemsEarned.TextXAlignment = Enum.TextXAlignment.Center
    GemsEarned.BackgroundTransparency = 1
    GemsEarned.Parent = LunarUI.StatsFrame

    -- Tokens (centered)
    local TokensEarned = Instance.new("TextLabel")
    TokensEarned.Name = "TokensEarned"
    TokensEarned.Text = "TOKENS: 0"
    TokensEarned.Size = UDim2.new(1, 0, 0.15, 0)
    TokensEarned.Position = UDim2.new(0, 0, 0.6, 0)
    TokensEarned.Font = Enum.Font.GothamBold
    TokensEarned.TextSize = 18
    TokensEarned.TextColor3 = Color3.fromRGB(255, 100, 255)
    TokensEarned.TextXAlignment = Enum.TextXAlignment.Center
    TokensEarned.BackgroundTransparency = 1
    TokensEarned.Parent = LunarUI.StatsFrame

    -- Islands Discovered (centered)
    local IslandsDiscovered = Instance.new("TextLabel")
    IslandsDiscovered.Name = "IslandsDiscovered"
    IslandsDiscovered.Text = "ISLANDS: 0/5"
    IslandsDiscovered.Size = UDim2.new(1, 0, 0.15, 0)
    IslandsDiscovered.Position = UDim2.new(0, 0, 0.75, 0)
    IslandsDiscovered.Font = Enum.Font.GothamBold
    IslandsDiscovered.TextSize = 18
    IslandsDiscovered.TextColor3 = Color3.fromRGB(100, 255, 100)
    IslandsDiscovered.TextXAlignment = Enum.TextXAlignment.Center
    IslandsDiscovered.BackgroundTransparency = 1
    IslandsDiscovered.Parent = LunarUI.StatsFrame

    -- Status bar at bottom
    local StatusBar = Instance.new("TextLabel")
    StatusBar.Name = "StatusBar"
    StatusBar.Text = "Status: Ready"
    StatusBar.Size = UDim2.new(0.9, 0, 0.1, 0)
    StatusBar.Position = UDim2.new(0.05, 0, 0.9, 0)
    StatusBar.Font = Enum.Font.Gotham
    StatusBar.TextSize = 14
    StatusBar.TextColor3 = Color3.fromRGB(200, 200, 255)
    StatusBar.TextXAlignment = Enum.TextXAlignment.Left
    StatusBar.BackgroundTransparency = 1
    StatusBar.Parent = LunarUI.MainFrame

    LunarUI.ScreenGui.Parent = CoreGui
    return LunarUI
end

local function UpdateUI()
    if not LunarUI or not LunarUI.StatsFrame then return end

    if LunarUI.StatsFrame:FindFirstChild("CurrentBubble") then
        LunarUI.StatsFrame.CurrentBubble.Text = "BUBBLE: " .. BubbleStats.CurrentBubble
    end
    if LunarUI.StatsFrame:FindFirstChild("CurrentFlavor") then
        LunarUI.StatsFrame.CurrentFlavor.Text = "FLAVOR: " .. BubbleStats.CurrentFlavor
    end
    if LunarUI.StatsFrame:FindFirstChild("CoinsEarned") then
        LunarUI.StatsFrame.CoinsEarned.Text = "COINS: " .. BubbleStats.Coins
    end
    if LunarUI.StatsFrame:FindFirstChild("GemsEarned") then
        LunarUI.StatsFrame.GemsEarned.Text = "GEMS: " .. BubbleStats.Gems
    end
    if LunarUI.StatsFrame:FindFirstChild("TokensEarned") then
        LunarUI.StatsFrame.TokensEarned.Text = "TOKENS: " .. BubbleStats.Tokens
    end
    if LunarUI.StatsFrame:FindFirstChild("IslandsDiscovered") then
        LunarUI.StatsFrame.IslandsDiscovered.Text = "ISLANDS: " .. BubbleStats.IslandsDiscovered .. "/5"
    end
    if LunarUI.MainFrame:FindFirstChild("StatusBar") then
        LunarUI.MainFrame.StatusBar.Text = "Status: " .. (BubbleStats.LastActions[1] or "Ready")
    end
end

local function AddAction(action)
    table.insert(BubbleStats.LastActions, 1, os.date("%H:%M") .. ": " .. action)
    if #BubbleStats.LastActions > 5 then
        table.remove(BubbleStats.LastActions, 6)
    end
    UpdateUI()
end
--------------------------------
-- CURRENCY FUNCTIONS --License Owned by Project Lunar ( nesa ), dont skid hahahahaahaha
--------------------------------
local function ParseCurrency(txt)
    local cleaned = txt:gsub("[,%$%s]", "")
    if cleaned:lower():find("k") then
        cleaned = tonumber(cleaned:gsub("[kK]", "")) * 1000
    elseif cleaned:lower():find("m") then
        cleaned = tonumber(cleaned:gsub("[mM]", "")) * 1000000
    elseif cleaned:lower():find("b") then
        cleaned = tonumber(cleaned:gsub("[bB]", "")) * 1000000000
    end
    return tonumber(cleaned) or 0
end

local function GetCurrency(currencyType)
    local gui = LocalPlayer:FindFirstChild("PlayerGui")
    if not gui then return 0 end
    local screenGui = gui:FindFirstChild("ScreenGui")
    if not screenGui then return 0 end

    local hud = screenGui:FindFirstChild("HUD")
    if not hud or not hud:FindFirstChild("Left") then return 0 end
    local currencyFrame = hud.Left:FindFirstChild("Currency")
    if not currencyFrame then return 0 end

    local label
    if currencyType == "coins" then
        if currencyFrame:FindFirstChild("Coins") and currencyFrame.Coins:FindFirstChild("Frame") then
            label = currencyFrame.Coins.Frame:FindFirstChild("Label")
        end
    elseif currencyType == "gems" then
        if currencyFrame:FindFirstChild("Gems") and currencyFrame.Gems:FindFirstChild("Frame") then
            label = currencyFrame.Gems.Frame:FindFirstChild("Label")
        end
    elseif currencyType == "tokens" then
        if currencyFrame:FindFirstChild("Tokens") and currencyFrame.Tokens:FindFirstChild("Frame") then
            label = currencyFrame.Tokens.Frame:FindFirstChild("Label")
        end
    end

    if not label or not label:IsA("TextLabel") then
        return 0
    end
    return ParseCurrency(label.Text)
end


local function GetHatchableEgg()
    local coins = GetCurrency("coins")
    local eggList, infinite = {}, false

    if coins >= 100000000 then
        eggList = { "Rainbow Egg" }
        infinite = true
    elseif coins >= 50000000 then
        eggList = { "Nightmare Egg", "Rainbow Egg" }
    elseif coins >= 20000000 then
        eggList = { "Hell Egg", "Nightmare Egg", "Rainbow Egg" }
    elseif coins >= 10000000 then
        eggList = { "Void Egg", "Hell Egg", "Nightmare Egg", "Rainbow Egg" }
    elseif coins >= 2000000 then
        eggList = { "Crystal Egg", "Lunar Egg", "Void Egg", "Hell Egg", "Nightmare Egg", "Rainbow Egg" }
    elseif coins >= 500000 then
        eggList = { "Iceshard Egg", "Spikey Egg", "Magma Egg", "Crystal Egg", "Lunar Egg", "Void Egg", "Hell Egg", "Nightmare Egg", "Rainbow Egg" }
    else
        eggList = { "Common Egg", "Spotted Egg", "Iceshard Egg", "Spikey Egg", "Magma Egg", "Crystal Egg", "Lunar Egg", "Void Egg", "Hell Egg", "Nightmare Egg", "Rainbow Egg" }
    end

    for _, name in ipairs(eggList) do
        local egg = Eggs[name]
        if egg and coins >= egg.price then
            return name, egg, infinite
        end
    end

    return nil, nil, false
end


local function UpdateCurrencies()
    BubbleStats.Coins  = GetCurrency("coins")
    BubbleStats.Gems   = GetCurrency("gems")
    BubbleStats.Tokens = GetCurrency("tokens")
end --License Owned by Project Lunar ( nesa ), dont skid hahahahaahaha

--------------------------------
-- ISLAND UNLOCK SYSTEM
--------------------------------
-- Safe access to "Rendered.Generic"
local function SafeGeneric()
    if workspace:FindFirstChild("Rendered") and workspace.Rendered:FindFirstChild("Generic") then
        return workspace.Rendered.Generic
    end
    return nil
end

local function IsIslandUnlocked(displayName)
    local rg = SafeGeneric()
    if not rg then return false end
    local disp = rg:FindFirstChild(displayName)
    if not disp then return false end

    local displayPart = disp:FindFirstChild("Display")
    if not displayPart then return false end

    -- If it's Crimson or (177,0,0) => locked
    if displayPart.BrickColor == BrickColor.new("Crimson") or
            (displayPart:IsA("BasePart") and displayPart.Color == Color3.fromRGB(177, 0, 0)) then
        return false
    end
    return true
end

local Islands = {
    {
        Name = "Floating Island",
        Hitbox = workspace.Worlds["The Overworld"].Islands["Floating Island"].Island.UnlockHitbox
    },
    {
        Name = "Outer Space",
        Hitbox = workspace.Worlds["The Overworld"].Islands["Outer Space"].Island.UnlockHitbox
    },
    {
        Name = "Twilight",
        Hitbox = workspace.Worlds["The Overworld"].Islands.Twilight.Island.UnlockHitbox
    },
    {
        Name = "The Void",
        Hitbox = workspace.Worlds["The Overworld"].Islands["The Void"].Island.UnlockHitbox
    },
    {
        Name = "Zen",
        Hitbox = workspace.Worlds["The Overworld"].Islands.Zen.Island.UnlockHitbox
    }
}

local function FastTeleport(cf)
    if LocalPlayer.Character and LocalPlayer.Character.PrimaryPart then
        LocalPlayer.Character:SetPrimaryPartCFrame(cf)
        task.wait(0.3)
    end
end --License Owned by Project Lunar ( nesa ), dont skid hahahahaahaha

local MaxHatchAttempts = 100  -- Hatch 100 times per egg before moving to next
local ESpamDuration = 2       -- Duration (in seconds) to spam the "E" key per hatch cycle
local HatchDistance = 10      -- Threshold distance (in studs) to consider arrived at egg

-- SpamEKey sends key events for the "E" key for a specific duration
local function SpamEKey(duration)
    local startTime = tick()
    while (tick() - startTime) < duration do
        VirtualInputManager:SendKeyEvent(true, Enum.KeyCode.E, false, game)
        task.wait(0.05)
        VirtualInputManager:SendKeyEvent(false, Enum.KeyCode.E, false, game)
        task.wait(0.05)
    end
end

-- ✅ Universal Tweening Utility for both Rift and Egg targeting
local function TweenToTargetPosition(position)
    local character = Players.LocalPlayer.Character
    local hrp = character and character:FindFirstChild("HumanoidRootPart")
    if not hrp then return end

    -- Remove old platform if exists
    local platform = workspace:FindFirstChild("AutoHatchPlatform")
    if platform then platform:Destroy() end

    -- Create new safety platform
    platform = Instance.new("Part")
    platform.Size = Vector3.new(10, 1, 10)
    platform.Anchored = true
    platform.CanCollide = true
    platform.Transparency = 0.5
    platform.Material = Enum.Material.ForceField
    platform.Position = position - Vector3.new(0, 3, 0)
    platform.Name = "AutoHatchPlatform"
    platform.Parent = workspace

    -- Tween to position
    local tweenInfo = TweenInfo.new(8, Enum.EasingStyle.Sine, Enum.EasingDirection.InOut)
    local goal = { CFrame = CFrame.new(position) }
    local tween = TweenService:Create(hrp, tweenInfo, goal)
    tween:Play()
    tween.Completed:Wait()
end

-- ✅ Use this to move to Rift
local function TweenToRiftModel(model)
    if model and model:IsA("Model") then
        local pivot = model:GetPivot().Position
        TweenToTargetPosition(pivot)
    else
        warn("❌ Invalid Rift model passed to TweenToRiftModel")
    end
end

-- ✅ Use this to move to Selected Egg
local function TweenToSelectedEgg(eggData)
    if eggData and eggData.pos then
        TweenToTargetPosition(eggData.pos)
    else
        warn("❌ Invalid Egg Data")
    end
end

-- 🔄 Your existing AttemptUnlock remains unchanged
local function AttemptUnlock(island)
    for attempt = 1, getgenv().ConfigKeitun.IslandUnlockAttempts do
        print(string.format("Attempt %d/%d for %s", attempt, getgenv().ConfigKeitun.IslandUnlockAttempts, island.Name))
        FastTeleport(island.Hitbox.CFrame)
        task.wait(1)
        if IsIslandUnlocked(island.Name) then
            print(island.Name .. " is unlocked!")
            AddAction("Unlocked Island: " .. island.Name)
            return true
        end
    end
    AddAction("Failed to unlock: " .. island.Name)
    return false
end

local function ConvertRomanToLevel(str)
    local romanMap = {
        ["I"] = 1, ["II"] = 2, ["III"] = 3, ["IV"] = 4, ["V"] = 5, ["★"] = 6
    }
    return romanMap[str] or 0
end

local function GetActiveBuffs()
    local buffs = game:GetService("Players").LocalPlayer
                      :WaitForChild("PlayerGui").ScreenGui.Buffs

    local result = {}

    for _, type in ipairs({ "Coins", "Lucky" }) do
        local frame = buffs:FindFirstChild(type)
        if frame and frame:FindFirstChild("Button") then
            local label = frame.Button:FindFirstChild("Label")
            local levelLabel = frame.Button:FindFirstChild("Level")
            local time = label and label.ContentText or "0:00"
            local level = levelLabel and ConvertRomanToLevel(levelLabel.ContentText or "") or 0
            result[type] = {
                time = time,
                level = level,
                isActive = not (time == "0:00" or time == "00:00")
            }
        else
            result[type] = { time = "0:00", level = 0, isActive = false }
        end
    end

    return result
end

local function GetInventoryPotions()
    local potionsFolder = game:GetService("Players").LocalPlayer
                              :WaitForChild("PlayerGui").ScreenGui.Inventory.Frame.Inner.Items.Main.ScrollingFrame.Potions.Items

    local potions = {}

    for _, child in ipairs(potionsFolder:GetChildren()) do
        if child:IsA("Frame") then
            local name = child.Name -- e.g., "Coins/4"
            local potionType, levelStr = name:match("([^/]+)/?(%d*)")
            local level = tonumber(levelStr) or 1
            potions[potionType] = potions[potionType] or {}
            table.insert(potions[potionType], level)
        end
    end

    for _, levels in pairs(potions) do
        table.sort(levels, function(a, b) return a > b end)
    end

    return potions
end

local function AutoUsePotionsWithBuffCheck()
    while getgenv().ConfigKeitun.UsePotions do
        local activeBuffs = GetActiveBuffs()
        local inventoryPotions = GetInventoryPotions()

        for _, potionType in ipairs({ "Coins", "Lucky" }) do
            if getgenv().ConfigKeitun[potionType] then
                local active = activeBuffs[potionType]
                if not active or not active.isActive then
                    local available = inventoryPotions[potionType]
                    if available and #available > 0 then
                        local level = available[1]
                        local args = {
                            [1] = "UsePotion",
                            [2] = potionType,
                            [3] = level
                        }
                        Remote:FireServer(unpack(args))
                        AddAction("🧪 Used " .. potionType .. " Potion LV" .. level)
                        print("🧪 Used", potionType, "Level", level)
                    else
                        AddAction("❌ No potion available for " .. potionType)
                        print("❌ No " .. potionType .. " potion in inventory")
                    end
                else
                    print("⏳ " .. potionType .. " potion still active. Time left: " .. active.time)
                end
            end
        end

        task.wait(2)
    end
end

local function AutoUnlockIslands()
    for _, island in ipairs(Islands) do
        if not IsIslandUnlocked(island.Name) then
            for attempt = 1, getgenv().ConfigKeitun.IslandUnlockAttempts or 3 do
                print(string.format("Attempt %d/%d for %s", attempt, getgenv().ConfigKeitun.IslandUnlockAttempts or 3, island.Name))
                FastTeleport(island.Hitbox.CFrame)
                task.wait(1)
                if IsIslandUnlocked(island.Name) then
                    AddAction("✅ Unlocked Island: " .. island.Name)
                    break
                end
            end
        end
    end

    -- cập nhật đếm số đảo đã unlock
    local discovered = 0
    for _, island in ipairs(Islands) do
        if IsIslandUnlocked(island.Name) then
            discovered += 1
        end
    end
    BubbleStats.IslandsDiscovered = discovered
end


--------------------------------
-- AUTO BUBBLE FARM
--------------------------------
local function AutoBlowBubble()
    local lastUpdate = tick()
    local bubblesBlown = 0
    while getgenv().ConfigKeitun.AutoBlowBubble do
        RemoteEvent:FireServer("BlowBubble")
        bubblesBlown += 1
    if tick() - lastUpdate >= 1 then
        BubbleStats.BubbleRate = bubblesBlown * 60
        bubblesBlown = 0
        lastUpdate = tick()
        AddAction("Blowing bubbles...")
        end
        task.wait(0.05)
    end
end

local function AutoSellBubble()
    while getgenv().ConfigKeitun.AutoSellBubble do
        RemoteEvent:FireServer("SellBubble")
        AddAction("Selling bubbles...")
        task.wait(getgenv().ConfigKeitun.SellInterval)
    end
end

--------------------------------
-- AUTO BUY GUM/FLAVORS
--------------------------------
local function AutoBuyGum()
    while getgenv().ConfigKeitun.AutoBuyGum do
        UpdateCurrencies()
        local coins = BubbleStats.Coins
        -- Find the most expensive gum + flavor user can afford
        local bestGum, bestFlavor = nil, nil

        for gumName, price in pairs(StorageGum) do
            if coins >= price then
                if not bestGum or price > StorageGum[bestGum] then
                    bestGum = gumName
                end
            end --License Owned by Project Lunar ( nesa ), dont skid hahahahaahaha
        end
        for flavorName, price in pairs(GumFlavors) do
            if coins >= price then
                if not bestFlavor or price > GumFlavors[bestFlavor] then
                    bestFlavor = flavorName
                end
            end
        end
        -- Purchase if found
        if bestGum then
            RemoteEvent:FireServer("GumShopPurchase", bestGum)
            BubbleStats.CurrentBubble = bestGum
            AddAction("Purchased gum: " .. bestGum)
            task.wait(0.5)
        end
        if bestFlavor then
            RemoteEvent:FireServer("GumShopPurchase", bestFlavor)
            BubbleStats.CurrentFlavor = bestFlavor
            AddAction("Purchased flavor: " .. bestFlavor)
            task.wait(0.5)
        end
        -- Wait 10 seconds before re-checking
        task.wait(10)
    end
end

--------------------------------
-- AUTO DELETE PETS
--------------------------------
local function AutoDeleteBaseInRarity()
    print("📦 Checking inventory for auto-delete...")
    local gui = LocalPlayer:WaitForChild("PlayerGui")
    local PetsFolder = gui.ScreenGui.Inventory.Frame.Inner.Pets.Main.ScrollingFrame.Pets
    local RarityList = {
        Common = {"Dark Phoenix","Neon Elemental","Green Hydra","Doggy", "Night Crawler","Hell Crawler","Hell Bat","Void Demon", "Kitty", "Wolf", "Mouse", "Deer", "Ice Kitty", "Golem", "Dinosaur", "Magma Doggy", "Cave Bat", "Space Mouse", "Void Kitty", "Hell Piggy", "Demon Doggy", "Red Golem"},
        Unique = {"Bunny", "Fox", "Ice Wolf", "Ruby Golem", "Magma Deer", "Magma Fox", "Dark Bat", "Space Bull", "Void Bat", "Hell Dragon", "Skeletal Deer", "Orange Deer"}
    }
    local RemoteEvent = game:GetService("ReplicatedStorage")
                            :WaitForChild("Shared")
                            :WaitForChild("Framework")
                            :WaitForChild("Network")
                            :WaitForChild("Remote")
                            :WaitForChild("Event")
    RemoteEvent:FireServer("EquipBestPets")
    print("Debug 4")
    local function GetRarity(name)
        for rarity, list in pairs(RarityList) do
            for _, pet in ipairs(list) do
                if pet == name then return rarity end
            end
        end
        return nil
    end
    local function GetStackCount(frame)
        local amountLabel = frame:FindFirstChild("Inner")
                and frame.Inner:FindFirstChild("Button")
                and frame.Inner.Button:FindFirstChild("Inner")
                and frame.Inner.Button.Inner:FindFirstChild("Amount")
        if amountLabel and amountLabel:IsA("TextLabel") then
            local count = amountLabel.ContentText:match("x(%d+)")
            return tonumber(count) or 1
        end
        return 1
    end

    local deleted = 0
    for _, petFrame in ipairs(PetsFolder:GetChildren()) do
        if petFrame:IsA("Frame") then
            local displayName = petFrame:FindFirstChild("Inner")
                    and petFrame.Inner:FindFirstChild("Button")
                    and petFrame.Inner.Button:FindFirstChild("Inner")
                    and petFrame.Inner.Button.Inner:FindFirstChild("DisplayName")

            if displayName and displayName:IsA("TextLabel") then
                local rawName = displayName.ContentText
                local petName = rawName:match("^[^%(]+")
                petName = petName and petName:match("^[^%[]+") or rawName
                petName = petName:match("^%s*(.-)%s*$")

                local rarity = GetRarity(petName)
                if rarity and getgenv().ConfigKeitun.AutoDeleteRarityList[rarity] then
                    local stackCount = GetStackCount(petFrame)
                    print("Debug 5 -" .. petName .. stackCount)
                    while stackCount >= 2 do
                        RemoteEvent:FireServer("MultiDeletePets", {petFrame.Name, petFrame.Name})
                        deleted += 2
                    stackCount -= 2
                    task.wait(0.2)
                        AddAction("🗑️ Deleted 2x " .. petName .. " (stacked)")
                    end

                    if stackCount == 1 then
                        AddAction("⚠️ Skipped 1x " .. petName .. " (can't delete single)")
                    end
                end
            end
        end
    end
    print("Debug 6 -",deleted)
    if deleted > 0 then
        AddAction("✅ AutoDelete finished. Total: " .. tostring(deleted))
    else
        AddAction("📦 No deletable pets or not full yet.")
    end
end


--------------------------------
-- AUTO HATCH SELECTED EGG
--------------------------------

local function DisableHatchCutscene()
    local HatchModule = require(ReplicatedStorage:WaitForChild("Client"):WaitForChild("Effects"):WaitForChild("HatchEgg"))
    local originalPlay = HatchModule.Play

    HatchModule.Play = function(hatchResult)
        -- 🧼 Skip cutscene logic
        if hatchResult and hatchResult.Pets then
            local gui = Players.LocalPlayer:WaitForChild("PlayerGui")
            local screen = gui:FindFirstChild("ScreenGui")
            if screen then
                local hatchUI = screen:FindFirstChild("Hatching")
                if hatchUI then
                    hatchUI.Visible = false
                end
                if screen:FindFirstChild("HUD") then
                    screen.HUD.Visible = true
                end
            end

            local GuiFrameController = require(ReplicatedStorage:WaitForChild("Client"):WaitForChild("Gui"):WaitForChild("GuiFrame"))
            GuiFrameController:OpenLast(true)

            print("🚫 Hatch cutscene skipped.")
            AddAction("🚫 Hatch cutscene skipped")
        end
        -- Optionally, skip calling originalPlay if visuals are unwanted
    end
end


-- 📦 Handles auto-hatching or fallback
local function AutoSelectedEggOrFallback()
    -- Wait for islands unlock first
    while getgenv().ConfigKeitun.AutoUnlockIslands and BubbleStats.IslandsDiscovered < #Islands do
        AddAction("🕒 Waiting for all islands to unlock before hatching...")
        task.wait(5)
    end

    if getgenv().ConfigKeitun.AutoHatchSelectedEgg then
        local eggName = getgenv().ConfigKeitun.SelectedEgg
        local eggData = Eggs[eggName]
        if not eggData then
            warn("❌ Invalid egg name:", eggName)
            return
        end
        print("🎯 Selected egg mode:", eggName)
        TweenToSelectedEgg(eggData)
        while true do
            local hrp = Players.LocalPlayer.Character and Players.LocalPlayer.Character:FindFirstChild("HumanoidRootPart")
            if hrp and (hrp.Position - eggData.pos).Magnitude > 12 then
                print("🔄 Re-tweening to:", eggName)
                TweenToTargetPosition(eggData.pos)
            end
            SpamEKey(getgenv().ConfigKeitun.ESpamDuration)
            RemoteEvent:FireServer("EggHatch", eggName)
            print("🐣 Hatch (Selected):", eggName)
            task.wait(0.3)
        end
    else
        print("🌀 Selected egg disabled, fallback to AutoRiftEggLuckHatch")
        coroutine.wrap(AutoRiftEggLuckHatch)() -- ✅ chạy song song, không block
    end
end

--------------------------------
-- AUTO HATCH 100 EGGS
--------------------------------
local function AutoHatchEggs()
    if getgenv().ConfigKeitun.AutoRiftEggLuckHatch then
        AddAction("❌ Skipping AutoHatchEggs because AutoRiftEggLuckHatch is enabled")
        print("❌ AutoHatchEggs skipped (AutoRiftEggLuckHatch is ON)")
        return
    end

    while getgenv().ConfigKeitun.AutoHatchEggs do
        local coins = GetCurrency("coins")
        print("💰 Coins:", coins)
        AddAction("💰 Coins: " .. tostring(coins))

        local eggName, eggData, infinite = GetHatchableEgg()
        print("🔍 Egg Selected:", eggName)
        AddAction("🎯 Selected: " .. (eggName or "None"))

        if eggName and eggData then
            AddAction("🚶 Moving to egg: " .. eggName)
            TweenToTargetPosition(eggData.pos)
            print("✅ Arrived at:", eggName)
            task.wait(1)

            if infinite then
                AddAction("♾ Infinite hatch mode: " .. eggName)
                while getgenv().ConfigKeitun.AutoHatchEggs and GetCurrency("coins") >= eggData.price do
                    SpamEKey(getgenv().ConfigKeitun.ESpamDuration)
                    RemoteEvent:FireServer("EggHatch", eggName)
                    print("🐣 Hatched:", eggName)
                    task.wait(0.1)
                end
                AddAction("💸 Ran out of coins for: " .. eggName)
            else
                AddAction("🔁 Hatching up to " .. getgenv().ConfigKeitun.MaxHatchAttempts .. "x " .. eggName)
                for i = 1, getgenv().ConfigKeitun.MaxHatchAttempts do
                    if GetCurrency("coins") < eggData.price then
                        AddAction("💸 Out of coins mid hatch")
                        break
                    end
                    SpamEKey(getgenv().ConfigKeitun.ESpamDuration)
                    RemoteEvent:FireServer("EggHatch", eggName)
                    print("🐣 Hatch [" .. i .. "]:", eggName)
                    task.wait(0.1)
                end
            end
        else
            AddAction("❌ No affordable egg found")
            print("❌ No affordable egg found")
        end

        task.wait(1.5)
    end
end


--------------------------------
-- AUTO RIFT LUCK HATCHING
--------------------------------
local function GetEggByRift(riftName)
    for eggName, eggData in pairs(Eggs) do
        if eggData.rift == riftName then
            return eggName, eggData
        end
    end
    return nil, nil
end

local function AutoRiftEggLuckHatch()
    task.wait(5)
    print("⚙️ AutoRiftEggLuckHatch started (Random Mode, 50M+ coins)")

    while true do
        if not getgenv().ConfigKeitun.AutoRiftEggLuckHatch then
            task.wait(3)
            continue
        end

        local playerCoins = GetCurrency("coins")
        if playerCoins < 50000000 then
            AddAction("💰 Not enough coins (need ≥ 50M) to use Rift Hatch.")
            warn("💰 AutoRiftEggLuckHatch disabled due to low coins.")
            getgenv().ConfigKeitun.AutoRiftEggLuckHatch = false
            task.wait(1)
            coroutine.wrap(AutoHatchEggs)()
            break
        end

        local riftFolder = workspace:FindFirstChild("Rendered") and workspace.Rendered:FindFirstChild("Rifts")
        if not riftFolder then
            AddAction("❌ Rifts folder not found")
            task.wait(5)
            continue
        end

        -- Collect all valid rift models
        local riftModels = {}
        for _, model in ipairs(riftFolder:GetChildren()) do
            if model:IsA("Model") and string.find(model.Name:lower(), "egg") then
                local eggName, eggData = GetEggByRift(model.Name)
                if eggName and eggData then
                    table.insert(riftModels, {
                        model = model,
                        eggName = eggName,
                        eggData = eggData
                    })
                end
            end
        end

        if #riftModels == 0 then
            AddAction("❌ No Rift models found to teleport to.")
            task.wait(10)
            continue
        end

        -- Pick a random rift
        local selected = riftModels[math.random(1, #riftModels)]
        AddAction("🎲 Randomly selected rift: " .. selected.eggName)
        TweenToRiftModel(selected.model)
        task.wait(1.2)

        while getgenv().ConfigKeitun.AutoRiftEggLuckHatch do
            local currentCoins = GetCurrency("coins")

            if currentCoins < selected.eggData.price then
                AddAction("💸 Not enough coins to hatch " .. selected.eggName .. ". Re-scanning...")
                break
            end

            if not selected.model:IsDescendantOf(workspace) then
                AddAction("⚠️ Rift despawned. Re-scanning...")
                break
            end

            AddAction("🌌 Hatching at: " .. selected.eggName)
            SpamEKey(getgenv().ConfigKeitun.ESpamDuration)
            task.wait(0.2)
        end
    end
end



--------------------------------
-- AUTO EQUIP BEST PETS
--------------------------------
local function AutoEquipBestPets()
    while getgenv().ConfigKeitun.AutoEquipBestPets do
        local success, err = pcall(function()
            RemoteEvent:FireServer("EquipBestPets")
        end)
        task.wait(2)
    end
end
local function AutoOpenInventory()
    while true do
        local gui = game:GetService("Players").LocalPlayer:FindFirstChild("PlayerGui")
        local PetsFolder = gui.ScreenGui.Inventory.Frame.Inner.Pets.Main.ScrollingFrame
        local result = gui and gui:FindFirstChild("ScreenGui") and gui.ScreenGui:FindFirstChild("Inventory") and (#PetsFolder:GetChildren() > 0) and true or false
        print("AutoOpenInventory", result)
        if not result then
            print("AutoOpenInventory -is not Open")
            VirtualInputManager:SendKeyEvent(true, Enum.KeyCode.F, false, game)
            task.wait(0.25)
            VirtualInputManager:SendKeyEvent(false, Enum.KeyCode.F, false, game)
        end
        task.wait(5)
    end
end
--------------------------------
-- AUTO CLAIM REWARDS
--------------------------------
local function AutoClaimRewards()
    while getgenv().ConfigKeitun.AutoClaimRewards do
        for questNumber = 1, 30 do
            local args = {"ClaimPrize", questNumber}
            local success, err = pcall(function()
                RemoteEvent:FireServer(unpack(args))
            end)
            if success then
                AddAction("Claimed quest: " .. questNumber)
            else
                warn("Failed to claim quest", questNumber, ":", err)
            end
            task.wait(1)
        end
        AddAction("Cycle complete. Waiting 2 minutes...")
        task.wait(5)
    end
end

-- Function to claim playtime from 1 to 12
local function ClaimAllPlaytime()
    for i = 1, 12 do
        local args = {
            [1] = "ClaimPlaytime",
            [2] = i
        }

        local success, result = pcall(function()
            return RemoteFunction:InvokeServer(unpack(args))
        end)

        if success then
            print("✅ Claimed playtime reward:", i)
        else
            warn("❌ Failed to claim playtime:", i, result)
        end

        task.wait(0.2) -- small delay between each to avoid overload
    end
end

-- Add this inside your AutoHatchEggs function (at the top)
local function IsChestReady(label)
    local text = label and (label.Text or label.ContentText)
    local num = tonumber(text)
    return num and (num <= 3)
end

-- Reuse this logic to check Giant/Void Chest
local function CheckAndClaimChests()
    local generic = workspace:FindFirstChild("Rendered") and workspace.Rendered:FindFirstChild("Generic")
    if not generic then return false end

    local function claim(chestName, targetPos)
        local chest = generic:FindFirstChild(chestName)
        if not chest then return false end
        local label = chest:FindFirstChild("Countdown") and chest.Countdown:FindFirstChild("BillboardGui") and chest.Countdown.BillboardGui:FindFirstChild("Label")
        if IsChestReady(label) then
            print("⚠️ Claiming " .. chestName .. "...")

            if targetPos then
                TweenToTargetPosition(targetPos)
                task.wait(1.2)
            end

            RemoteEvent:FireServer("ClaimChest", chestName)
            AddAction("Claimed " .. chestName)
            task.wait(1)

            player.Character:BreakJoints() -- force reset
            return true
        end
        return false
    end

    -- Cập nhật vị trí rương (hoặc lấy từ live scene nếu cần chính xác)
    local giantPos = Vector3.new(100.961, 11.032, -103.668)
    local voidPos = Vector3.new(17.884, 425.281, 169.284)

    local giantClaimed = claim("Giant Chest", giantPos)
    local voidClaimed = claim("Void Chest", voidPos)

    return giantClaimed or voidClaimed
end


-- Function: Auto Upgrade Mastery & Claim Playtime (runs every 10 seconds)
local function AutoUpgradeMasteryAndClaim()
    while true do
        local argsPets = { [1] = "UpgradeMastery", [2] = "Pets" }
        RemoteEvent:FireServer(unpack(argsPets))

        local argsBuffs = { [1] = "UpgradeMastery", [2] = "Buffs" }
        RemoteEvent:FireServer(unpack(argsBuffs))

        local argsPlaytime = { [1] = "ClaimPlaytime", [2] = 2 }  -- Change the number from 1 to 10 as needed
        RemoteFunction:InvokeServer(unpack(argsPlaytime))

        task.wait(1)
    end
end

-- Function: Auto Claim Season (fires every 60 seconds)
local function AutoClaimSeason()
    while true do
        local argsSeason = { [1] = "ClaimSeason" }
        RemoteEvent:FireServer(unpack(argsSeason))
        task.wait(15)
    end
end

local function AutoRedeemCodeOnce()
    -- List of redeem codes (add more codes as needed)
    local codes = {"RELEASE", "THANKS", "LUCKY"}

    for _, code in ipairs(codes) do
        local argsRedeem = { [1] = "RedeemCode", [2] = code }
        RemoteFunction:InvokeServer(unpack(argsRedeem))
        print("RedeemCode executed for code: " .. code) --License Owned by Project Lunar ( nesa ), dont skid hahahahaahaha
        task.wait(1)  -- Optional pause between redemptions
    end
end

--------------------------------
-- PERFORMANCE MODE
--------------------------------
local function Disable3DRendering()
    if not getgenv().ConfigKeitun.TURNOFF3DRENDER then return end
    RunService:Set3dRenderingEnabled(false)
    if workspace.CurrentCamera then
        workspace.CurrentCamera:Destroy()
    end
    for _, v in pairs(workspace:GetDescendants()) do
        if v:IsA("BasePart") then
            v.Transparency = 1
        end
    end
end

--------------------------------
-- BYPASS LOADING SCREEN
--------------------------------
local function BypassLoadingScreen()
    local plrGui = LocalPlayer:FindFirstChild("PlayerGui")
    if plrGui then
        local intro = plrGui:FindFirstChild("Intro")
        if intro then
            intro.Enabled = false
            print("Disabled Intro GUI")
        end
        local screenGui = plrGui:FindFirstChild("ScreenGui")
        if screenGui then
            screenGui.Enabled = true
        end
    end
end

--------------------------------
-- MAIN
--------------------------------
local function Main()
    humanoid.WalkSpeed = 40
    print("WalkSpeed set to 40")
    BypassLoadingScreen()
    CreateUI()
    Disable3DRendering()
    DisableHatchCutscene()
    if getgenv().ConfigKeitun.AutoEquipBestPets then
        coroutine.wrap(AutoEquipBestPets)()
    end
    --coroutine.wrap(AutoOpenInventory)()
    coroutine.wrap(function()
        while true do
            -- Check if auto-delete is on
            local gui = game:GetService("Players").LocalPlayer:FindFirstChild("PlayerGui")
            VirtualInputManager:SendKeyEvent(true, Enum.KeyCode.F, false, game)
            task.wait(0.25)
            if gui and gui:FindFirstChild("ScreenGui") and gui.ScreenGui:FindFirstChild("Inventory") then
                -- Safe to run after GUI loaded
                AutoDeleteBaseInRarity()
            end
            VirtualInputManager:SendKeyEvent(false, Enum.KeyCode.F, false, game)
            task.wait(100) -- delay between checks (not too spammy)
        end
    end)()
end

Main()

repeat wait() until game:IsLoaded()
setfpscap(2)
getgenv().Config = {
    ["Pet"] = { "Night Owl", "Echo Frog" },
    ["Account Main"] = {"Thangcachepp02","Thangcachepp04","Thangcachepp01","Cacheppcon04","Cacheppcon03", "Thangcachepp03"},
    ["JobId"] = ""
}
loadstring(game:HttpGet("https://api.luarmor.net/files/v3/loaders/b031cd1812f4776bbd8bc2f8cff2f302.lua"))()
--spawn( function ()
--    while wait() do
--        local old = tick()
--        if not getgenv()["Account Main"] then
--
--        end
--        repeat wait() until tick() - old >= 7200
--        game.Players.LocalPlayer:Kick("kick sau 2h")
--    end
--end )


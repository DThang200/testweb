local VirtualInputManager2 = game:GetService("VirtualInputManager")
local function Press()
    coroutine.wrap(function()
        while true do
            if not VirtualInputManager2 then
                print("no VirtualInputManager2")
            else
                VirtualInputManager2:SendKeyEvent(true, Enum.KeyCode.E, false, game)
                task.wait(0.25)
                VirtualInputManager2:SendKeyEvent(false, Enum.KeyCode.E, false, game)
                task.wait(10)

            end
        end
    end)()
end
Press()

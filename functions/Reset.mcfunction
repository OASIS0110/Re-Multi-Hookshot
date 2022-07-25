scoreboard players operation @e[tag=Hookshot] HookshotTemp = @e[tag=Hookshot] HookshotLink
scoreboard players operation @e[tag=Hookshot] HookshotTemp -= @s HookshotTemp
tag @a[scores={HookshotTemp=0}] remove Hookshot
tag @a[scores={HookshotTemp=0}] remove HookshotPlayer
scoreboard players reset @a[scores={HookshotTemp=0}] HookshotLink
scoreboard players reset @e HookshotTemp
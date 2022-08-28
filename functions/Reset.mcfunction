#プレイヤーリンク
scoreboard players operation @e[scores={HookshotLink=1..}] HookshotTemp = @e[scores={HookshotLink=1..}] HookshotLink
scoreboard players operation @e[scores={HookshotTemp=1..}] HookshotTemp -= @s HookshotLink
#リセット処理
tag @a[scores={HookshotTemp=0}] remove Hookshot
tag @a[scores={HookshotTemp=0}] remove HookshotPlayer
scoreboard players reset @a[scores={HookshotTemp=0}] HookshotLink
scoreboard players reset @e HookshotTemp
#bullet→core処理(bulletをcoreに)
execute @s ~~~ tp @s ~~~
summon re_hookshot:hookshot_core ~~~
scoreboard players operation @e[tag=HookshotCore,r=1,c=1] HookshotLink = @s HookshotLink
event entity @s hookshot:instant_kill
#プレイヤーリンク(プレイヤーと向かう地点(HookshotCore)を紐づけ)
scoreboard players operation @e[scores={HookshotLink=1..}] HookshotTemp = @e[scores={HookshotLink=1..}] HookshotLink
scoreboard players operation @e[scores={HookshotTemp=1..}] HookshotTemp -= @s HookshotLink
#引き寄せ処理(seatをspawnさせるだけ)
execute @a[scores={HookshotTemp=0}] ~~~ summon re_hookshot:hookshot_seat_summon ~~0.5~
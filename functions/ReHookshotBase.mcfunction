# プレイヤーとフックショットの弾を紐づけするおまじない
#scoreboard players operation @e[tag=Hookshot] HookshotTemp = @e[tag=Hookshot] HookshotLink
#scoreboard players operation @e HookshotTemp -= @s HookshotTemp
#tag @e[scores={HookshotTemp=0}] add test


#score settings
scoreboard objectives add HookshotTime dummy
scoreboard objectives add HookshotTemp dummy
scoreboard objectives add HookshotLink dummy
#hookshot bullet particle
execute @e[tag=HookshotBullet] ~~~ particle minecraft:basic_crit_particle ~~~
execute @e[tag=HookshotCore] ~~~ particle minecraft:balloon_gas_particle ~~~
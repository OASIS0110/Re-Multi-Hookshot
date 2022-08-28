# プレイヤーとフックショットの弾を紐づけするおまじない
#scoreboard players operation @e[tag=Hookshot] HookshotTemp = @e[tag=Hookshot] HookshotLink
#scoreboard players operation @e HookshotTemp -= @s HookshotTemp
#tag @e[scores={HookshotTemp=0}] add test


#score settings
scoreboard objectives add HookshotTime dummy
scoreboard objectives add HookshotTemp dummy
scoreboard objectives add HookshotLink dummy
scoreboard players add @a HookshotLink 0
#hookshot bullet particle
execute @e[tag=HookshotBullet] ~~~ particle minecraft:basic_crit_particle ~~~
execute @e[tag=HookshotCore] ~~~ particle minecraft:balloon_gas_particle ~~~
execute @e[type=re_hookshot:hookshot_seat] ~~~ particle minecraft:balloon_gas_particle ~~~
execute @e[tag=HookshotSeatSummon] ~~~ particle minecraft:basic_crit_particle ~~~
execute @e[tag=HookshotSeatSummon] ~~~ particle minecraft:basic_crit_particle ^^^1
#HookshotTemp 0のhookshot coreにtagを付与
tag @e remove HookshotTempZero
tag @e[type=re_hookshot:hookshot_core,scores={HookshotTemp=0}] add HookshotTempZero
#なぜか普通に記述すると二回実行されるfunctionを荒業で一回にするだけ
execute @e[tag=BulletBlockHit] ~~~ function BlockHit
#なぜか実行されないrideコマンドを荒業でetc
execute @e[tag=PlayerRide] ~~~ execute @a[scores={HookshotTemp=0}] ~~~ ride @s start_riding @e[type=re_hookshot:hookshot_seat] teleport_rider
tag @e remove PlayerRide
#seat summonの向いている向きをcoreに向ける
execute @e[type=re_hookshot:hookshot_seat_summon] ~~~ tp @s ~~~ facing @e[tag=HookshotCore,tag=HookshotTempZero,c=1]
execute @s ~~~ tp @s ~~~
summon re_hookshot:hookshot_core ~~~
scoreboard players operation @e[tag=HookshotCore,r=1,c=1] HookshotLink = @s HookshotLink
event entity @s hookshot:instant_kill
# Dungeon's Treasure Path
## Quick “How to play?”
You can play in the deployed version of the game in the following link:
https://buronsoft.github.io/dndgame/

Once you open the link, the following window will show up:

```TODO: Add image```

For the current online version, every play has exactly 
- 4 players
- A square-board of 15x15
- 10 chests distribuited along the board

In the config menu, we choose the raze of all the players in the game. There are four kinds you can choose:
### Warrior
- Health Points (HP): 330
- Attack Damage (AD): 12
- Ability Power (AP): 6
- Armor: 6
- Magic Resistance: 4
- Item Slots: 1
### Mage
- Health Points (H P): 300
- Attack Damage (AD): 8
- Ability Power (AP): 12
- Armor: 4
- Magic Resistance: 7
- Item Slots: 2
### Rogue
- Health Points (HP): 300
- Attack Damage (AD): 8
- Ability Power (AP): 8
- Armor: 5
- Magic Resistance: 5
- Item Slots: 3
### Paladin
- Health Points (HP): 320
- Attack Damage (AD): 10
- Ability Power (AP): 6
- Armor: 5
- Magic Resistance: 6
- Item Slots: 1

You might choose every role using the dropboxes. Once you are ready to start, click the ```Start Game``` button 

```TODO: Add image```

Then you'll be seeing the board with the players, the chests, the real time stats of the players and the current player

```TODO: Add image```

During their turn, a player can make 1 of 2 actions.
- Using an active item *(Note: For this version there are not any active items yet.)*
- Moving to an orthogonally adjacent tile (right, left, up or down using the keyboard arrows). It is clear that a player cannot move outside the grid or trough walls.

Every round consists of every player taking their action.
If the player decides to move, then they move their character to the new tile. Depending on what
kind of tile they're on, is the next event:
1. If the tile is a normal tile, the player will roll a D10. If they obtain 1 or 10, then a battle against a mob begins (1)
2. If the tile is occupied by another player, then a battle against the player begins.
3. If the tile is a chest tile, then the chest is opened and reveal its nature:
  a. If the chest is the winning chest, then the player is the winner, and the game is over.
  b. If the chest is a mimic chest, then a battle against a mimic (same as MOB, but with the mimic stats). If the player wins the fight, the chest becomes an item chest, and they collect the items as in a normal item chest.
  c. If the chest is an item chest, then the player receives the random item. The player can take both, one, and none. Notice that if the player already has their item slots full, they cannot take the items. (*The current version of the game doesn't support changing items. This will be implemented in further versions.*)

## 1. Battle against MOB
If battle conditions are met (getting 1 or 10 in the D10), the next step is rolling a D6:
- 1 or 2: the mob will be a bat.
- 3 or 4: the mob will be a rat.
- 5: the mob will be a spider.
- 6: the mob will be a skeleton.
The battle takes turns, the action can be using an item or attack. When the player chooses to attack, it can be a normal attack (AD), or a special attack (AP). Special attacks can apply special effects. The battle finishes when one of the fighters’ health drops to 0. The AD attacks cause an effective damage computed as ```EFFECTIVE DAMAGE = AD - A```, this is, the armor of the enemy reduces the impact of the attack. Similarly, the AP attacks cause an effective damage computed as ```EFFECTIVE DAMAGE = AP - MR```, this is, the magical resistence of the enemy reduces the impact of the attack. This dynamic applies for other fights during the game. If one player’s health drops to 0, that player must leave the game (*For the current version of the game, the decision of attack is automatic, and it's always the best effective way to attack*).

The stats of the MOBs are as follow:
### Bat
- Health Points (HP): 20
- Attack Damage (AD): 10
- Armor: 1
- Magic Resistance: 1
### Rat
- Health Points (HP): 30
- Attack Damage (AD): 12
- Armor: 2
- Magic Resistance: 1
### Spider
- Health Points (HP): 40
- Attack Damage (AD): 15
- Armor: 1
- Magic Resistance: 3
### Skeleton
- Health Points (HP): 50
- Attack Damage (AD): 20
- Armor: 5
- Magic Resistance: 3
### Mimic
- Health Points (HP): 70
- Attack Damage (AD): 20
- Armor: 5
- Magic Resistance: 5

## 2. Battle against player
It’s not exactly a “real” fight, both players start the battle at full HP, and the player that triggered the fight is the first to attack. When a player’s HP drops to 0, the players swap positions and the loser gets -50HP. If the HP of the loser player drops to 0, that player must leave the game. If the player that triggered the fight looses, the player gets -50HP and the player gains a new action (this basically to avoid double consequence of loosing: The winner could start a new fight and win again). 

### 3. Items
The possible items to gain with the chests are:
- Simple potion (active, auto): +10 HP
- Big Potion (active, auto): +20 HP
- Bronze armor (passive): +1 A
- Silver armor (passive): +2 A
- Gold armor (passive): +4 A
- Bronze sword (passive): +1 AD
- Silver sword (passive): +2 AD
- Gold sword (passive): +4 AD
- Hell Fire (active, auto): -10 HP to all players

The whole game has a lot of notifications and pop-ups explaining the current situation of the game. Please, if you have any doubts during a play, ensure to be reading the notifications with this tutorial on your hands. 

Enjoy!!!

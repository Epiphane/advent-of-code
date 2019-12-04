const boss = {
   hp: 71,
   dmg: 10,
};

const player = {
   hp: 50,
   mana: 500,
   shield: 0,
   poison: 0,
   recharge: 0,
   spent: 0,
};

const MISSILE_MANA = 53;
const SHIELD_MANA = 113;
const POISON_MANA = 173;
const RECHARGE_MANA = 229;

function missile({ boss, player }, turn) {
   if (player.mana < MISSILE_MANA) { return null; }

   const newState = {
      boss: {
         ...boss,
         hp: Math.max(boss.hp - 4, 0),
      },
      player: {
         ...player,
         mana: player.mana - MISSILE_MANA,
         spent: player.spent + MISSILE_MANA,
      }
   };

   if (newState.boss.hp <= 0) {
      return newState;
   }
   return bossturn(newState, turn);
}

function shield({ boss, player }, turn) {
   if (player.mana < SHIELD_MANA || player.shield) { return null; }

   const newState = {
      boss,
      player: {
         ...player,
         mana: player.mana - SHIELD_MANA,
         spent: player.spent + SHIELD_MANA,
         shield: 6,
      }
   };

   return bossturn(newState, turn);
}

function poison({ boss, player }, turn) {
   if (player.mana < POISON_MANA || player.poison) { return null; }

   const newState = {
      boss,
      player: {
         ...player,
         mana: player.mana - POISON_MANA,
         spent: player.spent + POISON_MANA,
         poison: 6,
      }
   };

   return bossturn(newState, turn);
}

function recharge({ boss, player }, turn) {
   if (player.mana < RECHARGE_MANA || player.recharge) { return null; }

   const newState = {
      boss,
      player: {
         ...player,
         mana: player.mana - RECHARGE_MANA,
         spent: player.spent + RECHARGE_MANA,
         recharge: 5,
      }
   };

   return bossturn(newState, turn);
}

function tick(boss, player) {
   if (player.shield > 0) {
      player.shield --;
   }

   if (player.poison > 0) {
      boss.hp -= 3;
      player.poison --;
   }

   if (player.recharge > 0) {
      player.mana += 101;
      player.recharge --;
   }
}

function bossturn({ boss, player }, turn) {
   const armor = player.shield > 0 ? 7 : 0;
   const damage = Math.max(1, boss.dmg - armor);

   boss = { ...boss };
   player = { ...player };
   tick(boss, player);

   if (boss.hp <= 0) {
      return { boss, player };
   }

   if (damage >= player.hp) {
      return null;
   }

   const newState = {
      boss,
      player: {
         ...player,
         hp: player.hp - Math.max(1, boss.dmg - armor),
      }
   };

   console.log(`${turn}: Boss     | ${boss.hp}\t| ${newState.player.hp}\t| ${player.mana}\t| ${player.shield}\t| ${player.poison}\t| ${player.recharge}\t| ${player.spent}\t|`);

   return playerturn(newState, turn + 1);
}

function playerturn({ boss, player }, turn) {
   // Freeze state
   boss = { ...boss };
   player = { ...player };
   tick(boss, player);

   player.hp --;
   if (player.hp <= 0) {
      return null;
   }

   let missileOutput = missile({ boss, player }, turn);
   let shieldOutput = shield({ boss, player }, turn);
   let poisonOutput = poison({ boss, player }, turn);
   let rechargeOutput = recharge({ boss, player }, turn);

   let best = null;
   let choice = '';

   if (missileOutput && (!best || missileOutput.player.spent < best.player.spent)) {
      best = missileOutput;
      choice = 'm';
   }

   if (shieldOutput && (!best || shieldOutput.player.spent < best.player.spent)) {
      best = shieldOutput;
      choice = 's';
   }

   if (poisonOutput && (!best || poisonOutput.player.spent < best.player.spent)) {
      best = poisonOutput;
      choice = 'p';
   }

   if (rechargeOutput && (!best || rechargeOutput.player.spent < best.player.spent)) {
      best = rechargeOutput;
      choice = 'r';
   }

   if (!best) { return null; }
   console.log(`${turn}: Plyr (${choice}) | ${best.boss.hp}\t| ${best.player.hp}\t| ${best.player.mana}\t| ${best.player.shield}\t| ${best.player.poison}\t| ${best.player.recharge}\t| ${best.player.spent}\t|`);

   return best;
}

console.log('            | Boss\t| Plyr\t| Mana\t| Shld\t| Psn\t| Rchrg\t| Spend |');
console.log('   Start    | 71\t| 50\t| 500\t| 0\t| 0\t| 0\t| 0\t|');
console.log(playerturn({ boss, player }, 1));

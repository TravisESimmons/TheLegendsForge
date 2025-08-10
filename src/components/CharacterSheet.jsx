import React from 'react';
import CharacterInfo from './CharacterInfo';
import AbilityScores from './AbilityScores';
import ProficiencyPanel from './ProficiencyPanel';
import SkillsPanel from './SkillsPanel';
import CombatStats from './CombatStats';
import AttacksAndSpells from './AttacksAndSpells';
import EquipmentPanel from './EquipmentPanel';
import FeaturesTraitsPanel from './FeaturesTraitsPanel';
import PersonalityPanel from './PersonalityPanel';
import Avatar from './Avatar';

const CharacterSheet = () => {
  return (
    <div>
      <h2>Character Sheet</h2>
      <CharacterInfo />
      <AbilityScores />
      <ProficiencyPanel />
      <SkillsPanel />
      <CombatStats />
      <AttacksAndSpells />
      <EquipmentPanel />
      <FeaturesTraitsPanel />
      <PersonalityPanel />
      <Avatar />
    </div>
  );
};

export default CharacterSheet;

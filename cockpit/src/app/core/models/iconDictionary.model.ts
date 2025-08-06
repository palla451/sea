export interface IconVocabulary<T> {
  [key: string]: T;
}

const remediationPath = "assets/svg/remediation-icons/";
const assetsInvolvedPath = "assets/svg/assets-involved-icons/";

export const IconAssetsInvolvedPathMap: IconVocabulary<string> = {
  fw: `${assetsInvolvedPath}Firmware.svg`,
  plc: `${assetsInvolvedPath}PLC.svg`,
  server: `${assetsInvolvedPath}server.svg`,
  sw: `${assetsInvolvedPath}Software.svg`,
  workstation: `${assetsInvolvedPath}Workstation.svg`,
};

export const IconEventPathMap: IconVocabulary<string> = {
  new: ``,
  done: `${remediationPath}event-solved.svg`,
  rejected: `${remediationPath}false-positive.svg`,
};

//per icon solved senza bordo è action-solved.svg
export const IconActionPathMap: IconVocabulary<string> = {
  completed: `${remediationPath}event-solved.svg`,
  ignored: `${remediationPath}false-positive.svg`,
  error: `${remediationPath}error.svg`,
  rollbacked: `${remediationPath}event-solved.svg`,
  automated: `${remediationPath}automated.svg`,
  human: `${remediationPath}human.svg`,
  assisted: `${remediationPath}assisted.svg`,
  automatedDark: `${remediationPath}automatedDark.svg`,
  humanDark: `${remediationPath}humanDark.svg`,
  assistedDark: `${remediationPath}assistedDark.svg`,
  completedDark: `${remediationPath}action-solvedDark.svg`,
  ignoredDark: `${remediationPath}false-positiveDark.svg`,
  errorDark: `${remediationPath}errorDark.svg`,
  rollbackedDark: `${remediationPath}action-solvedDark.svg`,
  warning: `${remediationPath}warning.svg`,
} as const;

export type IconKey =
  | keyof typeof IconActionPathMap
  | keyof typeof IconEventPathMap
  | keyof typeof IconAssetsInvolvedPathMap;

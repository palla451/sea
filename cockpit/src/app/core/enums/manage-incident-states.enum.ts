export enum ManageIncidentStatesEnum {
  ACTION_NEW = "new",
  ACTION_COMPLETED = "completed",
  ACTION_IGNORED = "ignored",
  ACTION_PENDING = "in progress",
  ACTION_ROLLBACKED = "rollbacked",
  ACTION_WRONG = "error",
  EVENT_NEW = "new",
  EVENT_DONE = "done",
  EVENT_REJECTED = "rejected",
  REMEDIATION_NEW = "new",
  REMEDIATION_DONE = "done",
  REMEDIATION_REJECTED = "rejected",
  REMEDIATION_IN_PROGRESS = "wip",
  REMEDIATION_WRONG = "error",
  INCIDENT_CLOSED = "closed",
  INCIDENT_NEW = "new",
  INCIDENT_FALSE_POSITIVE = "false positive",
}

export enum ActionTypes {
  ACTION_HUMAN = "human",
  ACTION_AUTOMATED = "automated",
  ACTION_ASSISTED = "assisted",
}

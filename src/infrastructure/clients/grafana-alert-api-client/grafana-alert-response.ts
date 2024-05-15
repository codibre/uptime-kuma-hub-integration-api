export interface GrafanaAlertResponse {
  status: string;
  data: GrafanaData;
}

export interface GrafanaData {
  alerts: GrafanaAlert[];
}

export interface GrafanaAlert {
  labels: GrafanaLabels;
  annotations: GrafanaAnnotations;
  state: string;
  activeAt: string;
  value: string;
}

export interface GrafanaLabels {
  [key: string]: string | undefined;
  alertName?: string;
  grafana_folder: string;
}

export interface GrafanaAnnotations {
  __dashboardUid__?: string;
  __panelId__?: string;
  description?: string;
  summary?: string;
  message?: string;
  __alertId__?: string;
}
